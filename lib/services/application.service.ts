// lib/services/application.service.ts
import { prisma } from "@/lib/prisma";
import { ApplicationStatus, Prisma } from "@prisma/client";
import { createNotification } from "@/actions/notifications/createNotification";
import { AppError } from "@/lib/errors";

// Define proper types for the application response
interface SanitizedApplicationResponse {
  id: string;
  status: ApplicationStatus;
  proposedRent: number | null;
  duration: number;
  cropPlan: string | null;
  message: string | null;
  createdAt: Date;
  updatedAt: Date;
  reviewNotes: string | null;
  reviewedAt: Date | null;
  landId: string;
  farmerId: string;
  listingId: string | null;
  land: {
    id: string;
    title: string;
    landowner: {
      id: string;
      name: string;
      imageUrl: string | null;
      state: string | null;
      district: string | null;
      email?: string;
      phone?: string | null;
      landownerProfile?: {
        isVerified: boolean;
        verificationLevel: number;
      } | null;
    };
    images?: Array<{
      id: string;
      url: string;
      isPrimary: boolean;
    }>;
  };
  farmer: {
    id: string;
    name: string;
    imageUrl: string | null;
    state: string | null;
    district: string | null;
    email?: string;
    phone?: string | null;
    farmerProfile?: {
      primaryCrops: string[];
      farmingExperience: number;
      farmingType: string | null;
      isVerified: boolean;
    } | null;
  };
  listing?: {
    id: string;
    title: string;
    basePrice: number;
    status: string;
    listingType: string;
  } | null;
}

interface SanitizePermissions {
  isFarmer?: boolean;
  isLandowner?: boolean;
  isAdmin?: boolean;
}

export class ApplicationService {
  /**
   * Create a new application with contact protection
   */
  static async createApplication(
    farmerId: string,
    data: {
      landId: string;
      listingId?: string;
      proposedRent?: number;
      duration: number;
      cropPlan?: string;
      message?: string;
    },
  ) {
    // 1. Verify farmer profile exists and is complete
    const farmer = await prisma.user.findUnique({
      where: { id: farmerId },
      include: { farmerProfile: true },
    });

    if (!farmer?.farmerProfile) {
      throw new AppError("Complete your farmer profile first", 400);
    }

    if (!farmer.isOnboarded) {
      throw new AppError("Complete onboarding before applying", 400);
    }

    // 2. Verify land exists and is active
    const land = await prisma.land.findUnique({
      where: { id: data.landId },
      include: {
        landowner: {
          include: {
            user: true, 
          },
        },
      },
    });

    if (!land) {
      throw new AppError("Land not found", 404);
    }

    if (!land.isActive || land.isArchived) {
      throw new AppError("This land is not available for applications", 400);
    }

    // 3. Check for existing active application
    const existingApplication = await prisma.application.findFirst({
      where: {
        landId: data.landId,
        farmerId,
        status: {
          in: ["PENDING", "UNDER_REVIEW", "APPROVED"],
        },
      },
    });

    if (existingApplication) {
      throw new AppError(
        "You already have an active application for this land",
        400,
      );
    }

    // 4. Sanitize and validate no contact info
    const sanitizedMessage = this.sanitizeContactInfo(data.message);
    const sanitizedCropPlan = this.sanitizeContactInfo(data.cropPlan);

    // 5. Validate lease duration against land limits
    if (
      data.duration < land.minLeaseDuration ||
      data.duration > land.maxLeaseDuration
    ) {
      throw new AppError(
        `Lease duration must be between ${land.minLeaseDuration} and ${land.maxLeaseDuration} months`,
        400,
      );
    }

    // 6. Validate rent against expected range
    if (data.proposedRent) {
      if (land.expectedRentMin && data.proposedRent < land.expectedRentMin) {
        throw new AppError(
          `Rent is below minimum expected (₹${land.expectedRentMin})`,
          400,
        );
      }
      if (land.expectedRentMax && data.proposedRent > land.expectedRentMax) {
        throw new AppError(
          `Rent exceeds maximum expected (₹${land.expectedRentMax})`,
          400,
        );
      }
    }

    // 7. Create application with transaction
    const application = await prisma.$transaction(async (tx) => {
      const app = await tx.application.create({
        data: {
          landId: data.landId,
          farmerId,
          listingId: data.listingId,
          proposedRent: data.proposedRent,
          duration: data.duration,
          cropPlan: sanitizedCropPlan,
          message: sanitizedMessage,
          status: ApplicationStatus.PENDING,
        },
        include: {
          land: {
            include: {
              landowner: {
                include: {
                  user: true,
                },
              },
            },
          },
          farmer: true,
        },
      });

      if (data.listingId) {
        await tx.landListing.update({
          where: { id: data.listingId },
          data: { applicationCount: { increment: 1 } },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: farmerId,
          action: "APPLICATION_CREATED",
          entity: "Application",
          entityId: app.id,
          metadata: {
            landId: data.landId,
            duration: data.duration,
            hasRentProposal: !!data.proposedRent,
          },
        },
      });

      return app;
    });

    // 8. Send notification using server action
    await createNotification({
      userId: land.landowner.user.id, 
      type: "APPLICATION",
      title: "New Lease Application Received",
      message: `${farmer.name} has applied to lease "${land.title}"`,
      entityType: "Application",
      entityId: application.id,
      actionUrl: `/landowner/applications/${application.id}`,
      priority: "MEDIUM",
    });

    return application;
  }

  /**
   * Review application (approve/reject)
   */
  static async reviewApplication(
    applicationId: string,
    reviewerId: string,
    data: { status: "APPROVED" | "REJECTED"; reviewNotes?: string },
  ) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        land: {
          include: {
            landowner: {
              include: {
                user: true, // Include user
              },
            },
          },
        },
        farmer: true,
      },
    });

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    // Check against landowner.user.id
    if (application.land.landowner.user.id !== reviewerId) {
      throw new AppError("Unauthorized to review this application", 403);
    }

    if (!["PENDING", "UNDER_REVIEW"].includes(application.status)) {
      throw new AppError(
        `Application is already ${application.status.toLowerCase()}`,
        400,
      );
    }

    const sanitizedNotes = this.sanitizeContactInfo(data.reviewNotes);

    const updated = await prisma.$transaction(async (tx) => {
      const app = await tx.application.update({
        where: { id: applicationId },
        data: {
          status: data.status,
          reviewNotes: sanitizedNotes,
          reviewedAt: new Date(),
        },
      });

      if (data.status === "APPROVED") {
        const rent =
          application.proposedRent || application.land.expectedRentMin || 0;

        await tx.lease.create({
          data: {
            landId: application.landId,
            farmerId: application.farmerId,
            ownerId: reviewerId,
            listingId: application.listingId,
            rent,
            startDate: new Date(),
            endDate: new Date(
              Date.now() + application.duration * 30 * 24 * 60 * 60 * 1000,
            ),
            status: "PENDING_SIGNATURE",
            leaseSource: application.listingId ? "AUCTION" : "DIRECT",
            securityDeposit: rent * 2,
            grossContractValue: rent * application.duration,
            platformFee: rent * application.duration * 0.05,
            netOwnerReceivable: rent * application.duration * 0.95,
          },
        });
      }

      if (application.listingId && data.status === "APPROVED") {
        await tx.landListing.update({
          where: { id: application.listingId },
          data: { status: "CLOSED" },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: reviewerId,
          action: `APPLICATION_${data.status}`,
          entity: "Application",
          entityId: applicationId,
          metadata: { notes: sanitizedNotes },
        },
      });

      return app;
    });

    // Send notifications using server action
    await createNotification({
      userId: application.farmerId,
      type: "APPLICATION",
      title: `Application ${data.status.toLowerCase()}`,
      message:
        data.status === "APPROVED"
          ? `Great news! Your application for "${application.land.title}" has been approved. Please review and sign the lease agreement.`
          : `Your application for "${application.land.title}" was not accepted at this time.`,
      entityType: "Application",
      entityId: applicationId,
      actionUrl: `/applications/${applicationId}`,
      priority: "MEDIUM",
    });

    await createNotification({
      userId: reviewerId,
      type: "APPLICATION",
      title: `Application ${data.status.toLowerCase()}`,
      message: `You have ${data.status.toLowerCase()} the application for "${application.land.title}".`,
      entityType: "Application",
      entityId: applicationId,
      priority: "MEDIUM",
    });

    return updated;
  }

  /**
   * Withdraw application (farmer only)
   */
  static async withdrawApplication(applicationId: string, farmerId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        land: {
          include: {
            landowner: {
              include: {
                user: true, // Include user
              },
            },
          },
        },
        farmer: true,
      },
    });

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    if (application.farmerId !== farmerId) {
      throw new AppError("Unauthorized to withdraw this application", 403);
    }

    if (!["PENDING", "UNDER_REVIEW"].includes(application.status)) {
      throw new AppError("Application cannot be withdrawn", 400);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const app = await tx.application.update({
        where: { id: applicationId },
        data: { status: "WITHDRAWN" },
      });

      if (application.listingId) {
        await tx.landListing.update({
          where: { id: application.listingId },
          data: { applicationCount: { decrement: 1 } },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: farmerId,
          action: "APPLICATION_WITHDRAWN",
          entity: "Application",
          entityId: applicationId,
        },
      });

      return app;
    });

    // Send notification to landowner.user.id
    await createNotification({
      userId: application.land.landowner.user.id,
      type: "APPLICATION",
      title: "Application Withdrawn",
      message: `${application.farmer.name} has withdrawn their application for "${application.land.title}".`,
      entityType: "Application",
      entityId: applicationId,
      priority: "MEDIUM",
    });

    return updated;
  }

  /**
   * Get applications with filters
   */
  static async getApplications(
    userId: string,
    role: "FARMER" | "LANDOWNER",
    filters?: {
      status?: ApplicationStatus[];
      search?: string;
      limit?: number;
      offset?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    },
  ) {
    const where: Prisma.ApplicationWhereInput = {};

    if (role === "FARMER") {
      where.farmerId = userId;
    } else {
      where.land = { landowner: { userId } }; 
    }

    if (filters?.status?.length) {
      where.status = { in: filters.status };
    }

    if (filters?.search) {
      where.OR = [
        { land: { title: { contains: filters.search, mode: "insensitive" } } },
        { farmer: { name: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    const orderBy: Prisma.ApplicationOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      orderBy[
        filters.sortBy as keyof Prisma.ApplicationOrderByWithRelationInput
      ] = filters.sortOrder || "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          land: {
            include: {
              landowner: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      imageUrl: true,
                      state: true,
                      district: true,
                    },
                  },
                },
              },
            },
          },
          farmer: {
            select: {
              id: true,
              name: true,
              email: true,
              imageUrl: true,
              farmerProfile: {
                select: {
                  primaryCrops: true,
                  farmingExperience: true,
                  isVerified: true,
                },
              },
            },
          },
          listing: true,
        },
        orderBy,
        take: filters?.limit || 20,
        skip: filters?.offset || 0,
      }),
      prisma.application.count({ where }),
    ]);

    return {
      applications: applications.map((app) =>
        this.sanitizeApplicationResponse(app),
      ),
      total,
      hasMore: total > (filters?.offset || 0) + (filters?.limit || 20),
    };
  }

  /**
   * Get single application by ID
   */
  static async getApplicationById(
    applicationId: string,
    userId: string,
    userRole: string,
  ): Promise<SanitizedApplicationResponse> {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        land: {
          include: {
            landowner: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    imageUrl: true,
                    phone: true,
                    state: true,
                    district: true,
                  },
                },
              },
            },
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            phone: true,
            state: true,
            district: true,
            farmerProfile: {
              select: {
                primaryCrops: true,
                farmingExperience: true,
                farmingType: true,
                isVerified: true,
              },
            },
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            basePrice: true,
            status: true,
            listingType: true,
          },
        },
      },
    });

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    const isFarmer = application.farmerId === userId;
    const isLandowner = application.land.landowner.user.id === userId; 
    const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

    if (!isFarmer && !isLandowner && !isAdmin) {
      throw new AppError("Unauthorized", 403);
    }

    return this.sanitizeApplicationResponse(application, {
      isFarmer,
      isLandowner,
      isAdmin,
    });
  }

  /**
   * Sanitize contact information from text
   */
  private static sanitizeContactInfo(text?: string): string | undefined {
    if (!text) return text;

    let sanitized = text;
    sanitized = sanitized.replace(/[\w.-]+@[\w.-]+\.\w+/g, "[EMAIL REMOVED]");
    sanitized = sanitized.replace(
      /(\+91[-\s]?)?[6-9]\d{9}/g,
      "[PHONE REMOVED]",
    );
    sanitized = sanitized.replace(/@[\w.]+/g, "[HANDLE REMOVED]");

    return sanitized;
  }

  /**
   * Remove sensitive fields from application response
   */
  private static sanitizeApplicationResponse<T extends Record<string, unknown>>(
    app: T,
    permissions?: SanitizePermissions,
  ): SanitizedApplicationResponse {
    const sanitized = { ...app } as unknown as SanitizedApplicationResponse;

    if (sanitized.farmer) {
      if (!permissions?.isLandowner && !permissions?.isAdmin) {
        delete sanitized.farmer.email;
        delete sanitized.farmer.phone;
      }
    }

    if (sanitized.land?.landowner) {
      if (!permissions?.isFarmer && !permissions?.isAdmin) {
        delete sanitized.land.landowner.email;
        delete sanitized.land.landowner.phone;
      }
    }

    return sanitized;
  }
}
