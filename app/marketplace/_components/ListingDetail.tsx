// app/(marketplace)/_components/ListingDetail.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SavedButton } from "./SavedButton";
import { VerifiedBadge } from "./VerifiedBadge";
import {
  MapPin,
  Share2,
  ChevronLeft,
  ChevronRight,
  Zap,
  FileText,
  Droplets,
  Zap as ZapIcon,
  Truck,
  Lock,
} from "lucide-react";
import { formatCurrency, formatTimeLeft, getInitials } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Types
interface SoilReport {
  id: string;
  ph: number | null;
  moisture: number | null;
  nutrients: string | null;
  reportUrl: string | null;
  testedBy: string | null;
  testedAt: string | null;
  createdAt: string;
}

interface Document {
  id: string;
  name: string;
  url: string;
  type: string | null;
  size: number | null;
  createdAt: string | null;
}

interface LandImage {
  id: string;
  url: string;
  caption: string | null;
  isPrimary: boolean;
}

interface ListingImage {
  id: string;
  url: string;
  caption: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

interface Bid {
  id: string;
  amount: number;
  farmerId: string;
  createdAt: string;
  isAutoBid: boolean;
  farmer?: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
}

interface Terms {
  id: string;
  securityDepositRequired: boolean;
  depositAmount: number | null;
  paymentFrequency: string;
  additionalTerms: string | null;
  inspectionRequired: boolean;
  insuranceRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Analytics {
  listingId: string;
  demandScore: number | null;
  bidVelocity: number | null;
  conversionScore: number | null;
  avgBidGap: number | null;
  watchers: number;
  lastActivityAt: string | null;
}

// EXPORT this interface
export interface ListingDetailProps {
  listing: {
    id: string;
    title: string;
    description: string | null;
    basePrice: number;
    highestBid: number | null;
    endDate: string;
    startDate: string;
    auctionStatus: string;
    minimumLeaseDuration: number;
    maximumLeaseDuration: number;
    land: {
      id: string;
      size: number;
      landType: string;
      district: string | null;
      state: string | null;
      soilType: string | null;
      irrigationAvailable: boolean;
      electricityAvailable: boolean | null;
      roadAccess: boolean | null;
      fencingAvailable: boolean | null;
      waterSource: string | null;
      images?: LandImage[];
      documents?: Document[];
      soilReports?: SoilReport[];
    };
    owner: {
      id: string;
      name: string;
      imageUrl: string | null;
      createdAt: string;
      updatedAt: string;
      landownerProfile?: {
        isVerified: boolean;
        verificationLevel: number;
      } | null;
    };
    images?: ListingImage[];
    bids?: Bid[];
    terms?: Terms | null;
    analytics?: Analytics | null;
    _count?: {
      bids: number;
      savedBy: number;
      applications: number;
    };
  };
}

export function ListingDetail({ listing }: ListingDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    return new Date(listing.endDate).getTime() - Date.now();
  });
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const allImages = [...(listing.land.images || []), ...(listing.images || [])];

  const currentImage =
    allImages[currentImageIndex]?.url || "/images/placeholder-land.jpg";
  const isLive = listing.auctionStatus === "LIVE" && timeLeft > 0;
  const bidCount = listing._count?.bids || 0;
  const savedCount = listing._count?.savedBy || 0;

  const handleSave = (saved: boolean) => {
    setIsSaved(saved);
    toast({
      title: saved ? "Added to saved" : "Removed from saved",
      description: saved
        ? "Listing saved to your collection"
        : "Listing removed from your saved items",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Listing URL copied to clipboard",
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex text-sm text-muted-foreground">
          <Link href="/marketplace" className="hover:text-primary">
            Marketplace
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{listing.title}</span>
        </nav>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="relative">
          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
            <Image
              src={currentImage}
              alt={listing.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            />

            {allImages.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden ${
                    index === currentImageIndex ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Listing Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{listing.title}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <SavedButton
                  listingId={listing.id}
                  initialSaved={isSaved}
                  onToggle={handleSave}
                  size="icon"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>
                {listing.land.district}, {listing.land.state}
              </span>
            </div>

            {/* Price and Status */}
            <div className="flex items-center gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Starting Price</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(listing.basePrice)}
                </p>
              </div>
              {listing.highestBid && (
                <div className="pl-4 border-l">
                  <p className="text-sm text-muted-foreground">Current Bid</p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(listing.highestBid)}
                  </p>
                </div>
              )}
              <div className="ml-auto">
                {isLive ? (
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    <Zap className="h-4 w-4 mr-1 inline" />
                    LIVE NOW
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="px-3 py-1">
                    {listing.auctionStatus}
                  </Badge>
                )}
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Land Size</p>
                <p className="font-semibold">{listing.land.size} acres</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Land Type</p>
                <p className="font-semibold capitalize">
                  {listing.land.landType.toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lease Duration</p>
                <p className="font-semibold">
                  {listing.minimumLeaseDuration} -{" "}
                  {listing.maximumLeaseDuration} months
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Left</p>
                <p className="font-semibold">{formatTimeLeft(timeLeft)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bids</p>
                <p className="font-semibold">{bidCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saved</p>
                <p className="font-semibold">{savedCount}</p>
              </div>
            </div>

            {/* Owner Info */}
            <div className="flex items-center justify-between p-4 border rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={listing.owner.imageUrl || ""} />
                  <AvatarFallback>
                    {getInitials(listing.owner.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{listing.owner.name}</p>
                  <p className="text-sm text-muted-foreground">Landowner</p>
                </div>
              </div>
              {listing.owner.landownerProfile?.isVerified && (
                <VerifiedBadge
                  size="md"
                  showTooltip
                  tooltipText="Identity verified by Fieldly"
                />
              )}
            </div>

            {/* Action Button */}
            {isLive ? (
              <Button asChild size="lg" className="w-full">
                <Link href={`/marketplace/listings/${listing.id}/auction`}>
                  Join Live Auction
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="w-full" disabled>
                Auction {listing.auctionStatus.toLowerCase()}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs for additional info */}
      <Tabs defaultValue="description" className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Land Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="bids">Recent Bids</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="p-4">
          <p className="text-muted-foreground whitespace-pre-line">
            {listing.description || "No description provided."}
          </p>
        </TabsContent>

        <TabsContent value="details" className="p-4">
          <dl className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div>
                <dt className="text-sm text-muted-foreground">Irrigation</dt>
                <dd>
                  {listing.land.irrigationAvailable
                    ? "Available"
                    : "Not available"}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ZapIcon className="h-4 w-4 text-yellow-500" />
              <div>
                <dt className="text-sm text-muted-foreground">Electricity</dt>
                <dd>
                  {listing.land.electricityAvailable
                    ? "Available"
                    : "Not available"}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gray-500" />
              <div>
                <dt className="text-sm text-muted-foreground">Road Access</dt>
                <dd>{listing.land.roadAccess ? "Yes" : "No"}</dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-500" />
              <div>
                <dt className="text-sm text-muted-foreground">Fencing</dt>
                <dd>
                  {listing.land.fencingAvailable
                    ? "Available"
                    : "Not available"}
                </dd>
              </div>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Soil Type</dt>
              <dd>{listing.land.soilType || "Not specified"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Water Source</dt>
              <dd>{listing.land.waterSource || "Not specified"}</dd>
            </div>
          </dl>
        </TabsContent>

        <TabsContent value="documents" className="p-4">
          {listing.land.documents && listing.land.documents.length > 0 ? (
            <ul className="space-y-2">
              {listing.land.documents.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="flex-1">{doc.name}</span>
                    {doc.type && (
                      <span className="text-xs text-muted-foreground">
                        .{doc.type}
                      </span>
                    )}
                    {doc.size && (
                      <span className="text-xs text-muted-foreground">
                        ({(doc.size / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No documents available</p>
          )}
        </TabsContent>

        <TabsContent value="bids" className="p-4">
          {listing.bids && listing.bids.length > 0 ? (
            <div className="space-y-3">
              {listing.bids.map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={bid.farmer?.imageUrl || ""} />
                      <AvatarFallback>
                        {getInitials(bid.farmer?.name || "Bidder")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {bid.farmer?.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(bid.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {formatCurrency(bid.amount)}
                    </p>
                    {bid.isAutoBid && (
                      <Badge variant="outline" className="text-xs">
                        Auto
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No bids yet</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
