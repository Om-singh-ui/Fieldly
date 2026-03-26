// app/(marketplace)/_components/ListingDetail.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
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
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Ruler,
  Leaf,
  Award,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Navigation,
} from "lucide-react";
import { formatCurrency, formatTimeLeft, getInitials, cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

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

// Land interface with basic fields
interface LandWithGeo {
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
  latitude?: number | null;
  longitude?: number | null;
  village?: string | null;
  pincode?: string | null;
  address?: string | null;
  location?: string | null;
  images?: LandImage[];
  documents?: Document[];
  soilReports?: SoilReport[];
}

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
    land: LandWithGeo;
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
  const [isSharing, setIsSharing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    return Math.max(0, new Date(listing.endDate).getTime() - Date.now());
  });
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const allImages = useMemo(() => {
    return [...(listing.land.images || []), ...(listing.images || [])];
  }, [listing.land.images, listing.images]);

  const currentImage = useMemo(() => {
    return allImages[currentImageIndex]?.url || "/images/placeholder-land.jpg";
  }, [allImages, currentImageIndex]);

  const isLive = listing.auctionStatus === "LIVE" && timeLeft > 0;
  const isEndingSoon = timeLeft > 0 && timeLeft < 24 * 60 * 60 * 1000;
  const bidCount = listing._count?.bids || 0;
  const savedCount = listing._count?.savedBy || 0;
  const currentBid = listing.highestBid || listing.basePrice;
  const bidIncrement = Math.max(1000, Math.floor(currentBid * 0.05));
  const nextMinimumBid = currentBid + bidIncrement;

  // Get formatted location
  const formattedLocation =
    listing.land?.location ||
    `${listing.land?.district || ""}, ${listing.land?.state || ""}`.replace(
      /^,\s|,\s$/,
      "",
    ) ||
    "Location not specified";

  // Get full address for display
  const fullAddress =
    listing.land?.address ||
    [
      listing.land?.village,
      listing.land?.district,
      listing.land?.state,
      listing.land?.pincode,
    ]
      .filter(Boolean)
      .join(", ");

  // Check if location data is available for maps
  const hasLocationData =
    !!(listing.land?.latitude && listing.land?.longitude) ||
    formattedLocation !== "Location not specified";

  // Handle View on Map click
  const handleViewOnMap = () => {
    if (listing.land?.latitude && listing.land?.longitude) {
      // If coordinates available, open Google Maps with coordinates
      const url = `https://www.google.com/maps?q=${listing.land.latitude},${listing.land.longitude}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (formattedLocation !== "Location not specified") {
      // Fallback to search by location name
      const searchQuery = encodeURIComponent(formattedLocation);
      const url = `https://www.google.com/maps/search/${searchQuery}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Location unavailable",
        description: "Map location is not available for this listing",
        variant: "destructive",
      });
    }
  };

  // Handle Get Directions click
  const handleGetDirections = () => {
    if (listing.land?.latitude && listing.land?.longitude) {
      // Open Google Maps directions with coordinates
      const url = `https://www.google.com/maps/dir/?api=1&destination=${listing.land.latitude},${listing.land.longitude}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (formattedLocation !== "Location not specified") {
      // Fallback to search by location name
      const destination = encodeURIComponent(formattedLocation);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Directions unavailable",
        description: "Cannot get directions for this location",
        variant: "destructive",
      });
    }
  };

  const handleSave = (saved: boolean) => {
    setIsSaved(saved);
    toast({
      title: saved ? "Added to saved" : "Removed from saved",
      description: saved
        ? "Listing saved to your collection"
        : "Listing removed from your saved items",
    });
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Listing URL copied to clipboard",
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    setIsImageLoading(true);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
    setIsImageLoading(true);
  };

  const getDemandScoreColor = (score: number | null | undefined) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const getDemandScoreLabel = (score: number | null | undefined) => {
    if (!score) return "Low";
    if (score >= 80) return "Very High";
    if (score >= 60) return "High";
    if (score >= 40) return "Medium";
    return "Low";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-18">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
          <Link
            href="/marketplace"
            className="hover:text-primary transition-colors"
          >
            Marketplace
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground font-medium line-clamp-1">
            {listing.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted/20 shadow-xl">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <Image
                src={currentImage}
                alt={listing.title}
                fill
                className={cn(
                  "object-cover transition-opacity duration-300",
                  isImageLoading ? "opacity-0" : "opacity-100",
                )}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                onLoad={() => setIsImageLoading(false)}
                unoptimized={process.env.NODE_ENV === "development"}
              />

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Image Counter Badge */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}

              {/* Status Badge Overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                {isLive && (
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 animate-pulse shadow-lg px-3 py-1.5">
                    <Zap className="h-3.5 w-3.5 mr-1 fill-current" />
                    LIVE NOW
                  </Badge>
                )}
                {isEndingSoon && !isLive && (
                  <Badge
                    variant="destructive"
                    className="shadow-lg px-3 py-1.5"
                  >
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Ending Soon
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsImageLoading(true);
                    }}
                    className={cn(
                      "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200",
                      index === currentImageIndex
                        ? "ring-2 ring-primary ring-offset-2 scale-105"
                        : "opacity-70 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized={process.env.NODE_ENV === "development"}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Listing Info Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {listing.title}
                </h1>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    disabled={isSharing}
                    className="rounded-full"
                  >
                    {isSharing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                  </Button>
                  <SavedButton
                    listingId={listing.id}
                    initialSaved={isSaved}
                    onToggle={handleSave}
                    size="icon"
                    className="rounded-full"
                  />
                </div>
              </div>

              {/* Location Display with Map Buttons */}
              <div className="flex items-center justify-between gap-2 text-muted-foreground mb-4">
                {hasLocationData && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGetDirections}
                      className="gap-1 text-primary hover:text-primary/80"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Directions
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleViewOnMap}
                      className="gap-1 text-primary hover:text-primary/80"
                    >
                      <MapPin className="h-4 w-4" />
                      View on Map
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Starting Price
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(listing.basePrice)}
                  </p>
                </div>
                {listing.highestBid && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">
                      Current Bid
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(listing.highestBid)}
                    </p>
                  </div>
                )}
              </div>

              {listing.highestBid && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Bid Progress</span>
                    <span className="font-medium">
                      {Math.round(
                        (listing.highestBid / listing.basePrice) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={(listing.highestBid / listing.basePrice) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Next minimum bid: {formatCurrency(nextMinimumBid)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/20">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Time Left
                  </p>
                  <p
                    className={cn(
                      "font-semibold flex items-center gap-1",
                      isLive
                        ? "text-green-600"
                        : isEndingSoon
                          ? "text-orange-600"
                          : "text-foreground",
                    )}
                  >
                    <Clock className="h-4 w-4" />
                    {formatTimeLeft(timeLeft)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Bids
                  </p>
                  <p className="font-semibold flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {bidCount} {bidCount === 1 ? "bid" : "bids"}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Ruler className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Land Size</p>
                  <p className="font-semibold">{listing.land.size} acres</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Leaf className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Land Type</p>
                  <p className="font-semibold capitalize">
                    {listing.land.landType.toLowerCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Lease Duration
                  </p>
                  <p className="font-semibold">
                    {listing.minimumLeaseDuration} -{" "}
                    {listing.maximumLeaseDuration} months
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Saved</p>
                  <p className="font-semibold">{savedCount}</p>
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            {listing.analytics && listing.analytics.demandScore && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium">Market Demand</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-0",
                      getDemandScoreColor(listing.analytics.demandScore),
                    )}
                  >
                    {getDemandScoreLabel(listing.analytics.demandScore)}
                  </Badge>
                </div>
                <Progress
                  value={listing.analytics.demandScore}
                  className="h-1.5"
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{Math.round(listing.analytics.demandScore)}/100</span>
                  <span>{listing.analytics.watchers} watching</span>
                </div>
              </div>
            )}

            {/* Owner Card */}
            <div className="flex items-center justify-between p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage src={listing.owner.imageUrl || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(listing.owner.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold flex items-center gap-1">
                    {listing.owner.name}
                    {listing.owner.landownerProfile?.isVerified && (
                      <VerifiedBadge size="sm" />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verified Landowner
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/profile/${listing.owner.id}`}>
                  View Profile
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>

            {/* Action Button */}
            {isLive ? (
              <Button
                asChild
                size="lg"
                className="w-full h-12 text-base shadow-lg hover:shadow-xl transition-all"
              >
                <Link href={`/marketplace/listings/${listing.id}/auction`}>
                  Join Live Auction
                  <Zap className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            ) : listing.auctionStatus === "UPCOMING" ? (
              <Button size="lg" className="w-full h-12 text-base" disabled>
                <Clock className="h-4 w-4 mr-2" />
                Auction Starting Soon
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full h-12 text-base"
                variant="outline"
                disabled
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Auction Ended
              </Button>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start gap-2 bg-transparent border-b rounded-none h-auto p-0">
              <TabsTrigger
                value="description"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4 py-2"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4 py-2"
              >
                Land Details
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4 py-2"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="bids"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-4 py-2"
              >
                Recent Bids
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-6 mt-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {listing.description || "No description provided."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="details" className="p-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Land Features</h3>
                  <dl className="space-y-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-2 text-muted-foreground">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        Irrigation
                      </dt>
                      <dd className="font-medium">
                        {listing.land.irrigationAvailable ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            Available
                          </span>
                        ) : (
                          "Not available"
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-2 text-muted-foreground">
                        <ZapIcon className="h-4 w-4 text-yellow-500" />
                        Electricity
                      </dt>
                      <dd className="font-medium">
                        {listing.land.electricityAvailable
                          ? "Available"
                          : "Not available"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="h-4 w-4 text-gray-500" />
                        Road Access
                      </dt>
                      <dd className="font-medium">
                        {listing.land.roadAccess ? "Yes" : "No"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-2 text-muted-foreground">
                        <Lock className="h-4 w-4 text-gray-500" />
                        Fencing
                      </dt>
                      <dd className="font-medium">
                        {listing.land.fencingAvailable
                          ? "Available"
                          : "Not available"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Soil & Water</h3>
                  <dl className="space-y-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Soil Type</dt>
                      <dd className="font-medium capitalize">
                        {listing.land.soilType || "Not specified"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Water Source</dt>
                      <dd className="font-medium">
                        {listing.land.waterSource || "Not specified"}
                      </dd>
                    </div>
                    {listing.land.village && (
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Village</dt>
                        <dd className="font-medium">{listing.land.village}</dd>
                      </div>
                    )}
                    {listing.land.pincode && (
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Pincode</dt>
                        <dd className="font-medium">{listing.land.pincode}</dd>
                      </div>
                    )}
                    {fullAddress && fullAddress !== formattedLocation && (
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Full Address</dt>
                        <dd className="font-medium text-right max-w-[60%]">
                          {fullAddress}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="p-6 mt-6">
              {listing.land.documents && listing.land.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {listing.land.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl border hover:shadow-md transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type && `.${doc.type}`} •{" "}
                          {doc.size && `${(doc.size / 1024).toFixed(1)} KB`}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No documents available
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bids" className="p-6 mt-6">
              {listing.bids && listing.bids.length > 0 ? (
                <div className="space-y-3">
                  {listing.bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={bid.farmer?.imageUrl || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary">
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
                        <p className="font-bold text-lg text-primary">
                          {formatCurrency(bid.amount)}
                        </p>
                        {bid.isAutoBid && (
                          <Badge variant="outline" className="text-xs">
                            Auto-bid
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No bids yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Be the first to place a bid!
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
