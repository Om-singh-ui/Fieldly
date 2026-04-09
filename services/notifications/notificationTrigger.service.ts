// services/notifications/notificationTrigger.service.ts
'use server';

import { prisma } from '@/lib/prisma';
import { createNotification } from '@/actions/notifications/createNotification';
import { pusherServer } from '@/lib/pusher/server';
import type { NotificationType, NotificationPriority } from '@/types/notification.types';
import { Prisma } from '@prisma/client';

interface TriggerParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  priority?: NotificationPriority;
}

// ============================================
// SINGLE NOTIFICATION
// ============================================
export async function triggerNotification(params: TriggerParams) {
  try {
    const result = await createNotification({
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      actionUrl: params.actionUrl || null,
      entityType: params.entityType || null,
      entityId: params.entityId || null,
      priority: params.priority || 'MEDIUM',
    });

    if (result.success && result.notification) {
      await pusherServer.trigger(
        `private-user-${params.userId}`,
        'new-notification',
        result.notification
      );
    }

    return result;
  } catch (error) {
    console.error('Failed to trigger notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}

// ============================================
// BULK NOTIFICATIONS
// ============================================
export async function triggerBulkNotifications(notifications: TriggerParams[]) {
  try {
    const results = await Promise.allSettled(
      notifications.map(params => triggerNotification(params))
    );

    const succeeded = results.filter(r => r.status === 'fulfilled' && r.value?.success).length;
    const failed = results.filter(r => r.status === 'rejected' || !r.value?.success).length;

    return { success: true, sent: succeeded, failed };
  } catch (error) {
    console.error('Failed to trigger bulk notifications:', error);
    return { success: false, error: 'Failed to send bulk notifications' };
  }
}

// ============================================
// LAND LISTING - Notify Matching Farmers (with fallback)
// ============================================
export async function notifyMatchingFarmersAboutListing(landId: string, listingId: string) {
  try {
    const land = await prisma.land.findUnique({
      where: { id: landId },
      include: {
        listings: { where: { id: listingId } },
        landowner: { include: { user: true } },
      },
    });

    if (!land || !land.listings[0]) {
      return { success: false, error: 'Land or listing not found' };
    }

    // Build where conditions for matching
    const sizeCondition = {
      requiredLandSize: {
        lte: land.size * 1.5,
        gte: land.size * 0.5,
      },
    };

    const cropCondition = land.allowedCropTypes.length > 0
      ? { primaryCrops: { hasSome: land.allowedCropTypes } }
      : null;

    const districtCondition = land.district
      ? { user: { district: land.district } }
      : null;

    const stateCondition = land.state
      ? { user: { state: land.state } }
      : null;

    // Build OR conditions array
    const orConditions: Prisma.FarmerProfileWhereInput[] = [sizeCondition];
    if (cropCondition) orConditions.push(cropCondition);
    if (districtCondition) orConditions.push(districtCondition);
    if (stateCondition) orConditions.push(stateCondition);

    // 🔧 FLEXIBLE MATCHING - Find farmers with ANY matching criteria
    const matchingFarmers = await prisma.user.findMany({
      where: {
        role: 'FARMER',
        isOnboarded: true,
        AND: [
          { farmerProfile: { isNot: null } },
          { farmerProfile: { OR: orConditions } },
        ],
      },
      select: { id: true, name: true },
    });

    // 🔧 FALLBACK: If no matching farmers, notify ALL onboarded farmers
    let finalFarmers: { id: string; name: string | null }[] = matchingFarmers;
    
    if (matchingFarmers.length === 0) {
      console.log('⚠️ No matching farmers found, notifying all onboarded farmers as fallback');
      finalFarmers = await prisma.user.findMany({
        where: {
          role: 'FARMER',
          isOnboarded: true,
        },
        select: { id: true, name: true },
      });
    }

    if (finalFarmers.length === 0) {
      return { success: true, notified: 0, message: 'No farmers found to notify' };
    }

    // Create notifications
    const notifications: TriggerParams[] = finalFarmers.map(farmer => ({
      userId: farmer.id,
      type: 'LISTING',
      title: matchingFarmers.length > 0 
        ? '🌾 New Land Listing Matching Your Preferences!'
        : '🌾 New Land Listing Available!',
      message: `${land.size} acres of ${land.landType.toLowerCase()} land available in ${land.village || 'your area'}, ${land.district || land.state || ''}. ${land.irrigationAvailable ? 'Irrigation available.' : ''} Click to view details.`,
      actionUrl: `/marketplace/listings/${listingId}`,
      entityType: 'LISTING',
      entityId: listingId,
      priority: 'HIGH',
    }));

    const result = await triggerBulkNotifications(notifications);
    
    console.log(`✅ Notified ${result.sent} farmers about new listing (matched: ${matchingFarmers.length}, total: ${finalFarmers.length})`);
    
    return { 
      success: true, 
      notified: result.sent, 
      matched: matchingFarmers.length,
      total: finalFarmers.length,
      message: `Notified ${result.sent} farmers` 
    };
  } catch (error) {
    console.error('Failed to notify matching farmers:', error);
    return { success: false, error: 'Failed to notify farmers' };
  }
}

// ============================================
// APPLICATION - Notify Landowner
// ============================================
export async function notifyLandownerAboutApplication(applicationId: string) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        land: { include: { landowner: { include: { user: true } } } },
        farmer: true,
      },
    });

    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    return triggerNotification({
      userId: application.land.landowner.user.id,
      type: 'APPLICATION',
      title: '📋 New Application Received!',
      message: `${application.farmer.name} has applied for "${application.land.title}". Proposed rent: ₹${application.proposedRent?.toLocaleString() || 'N/A'}.`,
      actionUrl: `/landowner/applications/${applicationId}`,
      entityType: 'APPLICATION',
      entityId: applicationId,
      priority: 'HIGH',
    });
  } catch (error) {
    console.error('Failed to notify landowner about application:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}

// ============================================
// BID - Notify Landowner + Outbid Farmers
// ============================================
export async function notifyAboutNewBid(bidId: string) {
  try {
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        listing: { include: { owner: true } },
        farmer: true,
      },
    });

    if (!bid) {
      return { success: false, error: 'Bid not found' };
    }

    const notifications: TriggerParams[] = [];

    // Notify landowner
    notifications.push({
      userId: bid.listing.owner.id,
      type: 'BID',
      title: '🔨 New Bid Placed!',
      message: `${bid.farmer.name} placed a bid of ₹${bid.amount.toLocaleString()} on "${bid.listing.title}".`,
      actionUrl: `/landowner/listings/${bid.listingId}/bids`,
      entityType: 'BID',
      entityId: bidId,
      priority: 'HIGH',
    });

    // Find and notify outbid farmers
    const otherBids = await prisma.bid.findMany({
      where: {
        listingId: bid.listingId,
        farmerId: { not: bid.farmerId },
        status: 'ACTIVE',
      },
      select: { farmerId: true },
    });

    const outbidNotifications = otherBids.map(b => ({
      userId: b.farmerId,
      type: 'BID' as NotificationType,
      title: '⚠️ You\'ve Been Outbid!',
      message: `Someone placed a higher bid of ₹${bid.amount.toLocaleString()} on "${bid.listing.title}".`,
      actionUrl: `/marketplace/listings/${bid.listingId}`,
      entityType: 'BID',
      entityId: bidId,
      priority: 'HIGH' as NotificationPriority,
    }));

    notifications.push(...outbidNotifications);

    const result = await triggerBulkNotifications(notifications);
    return { 
      success: true, 
      sent: result.sent, 
      failed: result.failed,
      message: `Sent ${result.sent} notifications` 
    };
  } catch (error) {
    console.error('Failed to send bid notifications:', error);
    return { success: false, error: 'Failed to send notifications' };
  }
}

// ============================================
// LEASE - Notify Both Parties
// ============================================
export async function notifyLeaseCreated(leaseId: string) {
  try {
    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
      include: {
        land: true,
        farmer: true,
        owner: true,
      },
    });

    if (!lease) {
      return { success: false, error: 'Lease not found' };
    }

    const notifications: TriggerParams[] = [
      {
        userId: lease.farmerId,
        type: 'LEASE',
        title: '🎉 Lease Agreement Created!',
        message: `Lease agreement for "${lease.land.title}" has been created. Please review and sign.`,
        actionUrl: `/farmer/leases/${leaseId}`,
        entityType: 'LEASE',
        entityId: leaseId,
        priority: 'HIGH',
      },
      {
        userId: lease.ownerId,
        type: 'LEASE',
        title: '📄 Lease Agreement Ready',
        message: `Lease agreement for "${lease.land.title}" is ready. Waiting for farmer's signature.`,
        actionUrl: `/landowner/leases/${leaseId}`,
        entityType: 'LEASE',
        entityId: leaseId,
        priority: 'MEDIUM',
      },
    ];

    const result = await triggerBulkNotifications(notifications);
    return { 
      success: true, 
      sent: result.sent, 
      failed: result.failed 
    };
  } catch (error) {
    console.error('Failed to send lease notifications:', error);
    return { success: false, error: 'Failed to send notifications' };
  }
}

// ============================================
// APPLICATION STATUS CHANGE - Notify Farmer
// ============================================
export async function notifyApplicationStatusChange(
  applicationId: string,
  _oldStatus: string,
  newStatus: string
) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { land: true, farmer: true },
    });

    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    const statusMessages: Record<string, { title: string; message: string; priority: NotificationPriority }> = {
      APPROVED: {
        title: '✅ Application Approved!',
        message: `Your application for "${application.land.title}" has been approved! Lease agreement will be sent soon.`,
        priority: 'HIGH',
      },
      REJECTED: {
        title: '❌ Application Not Selected',
        message: `Unfortunately, your application for "${application.land.title}" was not selected this time.`,
        priority: 'MEDIUM',
      },
      UNDER_REVIEW: {
        title: '🔍 Application Under Review',
        message: `Your application for "${application.land.title}" is being reviewed by the landowner.`,
        priority: 'LOW',
      },
    };

    const msg = statusMessages[newStatus];
    if (!msg) {
      return { success: true, message: 'No notification needed for this status' };
    }

    return triggerNotification({
      userId: application.farmerId,
      type: 'APPLICATION',
      title: msg.title,
      message: msg.message,
      actionUrl: `/farmer/applications/${applicationId}`,
      entityType: 'APPLICATION',
      entityId: applicationId,
      priority: msg.priority,
    });
  } catch (error) {
    console.error('Failed to send application status notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}

// ============================================
// PAYMENT - Notify Landowner
// ============================================
export async function notifyPaymentReceived(paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        lease: { include: { land: true, owner: true } },
        user: true,
      },
    });

    if (!payment || !payment.lease) {
      return { success: false, error: 'Payment or lease not found' };
    }

    return triggerNotification({
      userId: payment.lease.ownerId,
      type: 'PAYMENT',
      title: '💰 Payment Received!',
      message: `Payment of ₹${payment.amount.toLocaleString()} received for lease #${payment.leaseId?.slice(-8)}.`,
      actionUrl: `/landowner/payments/${paymentId}`,
      entityType: 'PAYMENT',
      entityId: paymentId,
      priority: 'MEDIUM',
    });
  } catch (error) {
    console.error('Failed to send payment notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}