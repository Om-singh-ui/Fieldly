// app/(protected)/landowner/land/[id]/_components/SoilReportSection.tsx
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Calendar, User, Beaker, Droplets, Leaf, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

interface SoilReport {
  id: string;
  ph: number | null;
  moisture: number | null;
  nutrients: string | null;
  reportUrl: string | null;
  testedBy: string | null;
  testedAt: Date | string | null;
  createdAt: Date | string;
}

interface SoilReportSectionProps {
  soilReports: SoilReport[];
}

function getPHStatus(ph: number | null): { label: string; color: string; description: string } {
  if (!ph) return { label: "Unknown", color: "bg-gray-500", description: "No data available" };
  
  if (ph < 5.5) return { label: "Acidic", color: "bg-red-500", description: "Very acidic soil" };
  if (ph < 6.5) return { label: "Slightly Acidic", color: "bg-orange-500", description: "Slightly acidic soil" };
  if (ph <= 7.5) return { label: "Neutral", color: "bg-green-500", description: "Optimal pH range" };
  if (ph <= 8.5) return { label: "Alkaline", color: "bg-blue-500", description: "Alkaline soil" };
  return { label: "Very Alkaline", color: "bg-purple-500", description: "Very alkaline soil" };
}

function getMoistureStatus(moisture: number | null): { label: string; color: string; percentage: number } {
  if (!moisture) return { label: "Unknown", color: "bg-gray-500", percentage: 0 };
  
  if (moisture < 20) return { label: "Dry", color: "bg-red-500", percentage: moisture };
  if (moisture < 40) return { label: "Slightly Dry", color: "bg-orange-500", percentage: moisture };
  if (moisture <= 60) return { label: "Ideal", color: "bg-green-500", percentage: moisture };
  if (moisture <= 80) return { label: "Moist", color: "bg-blue-500", percentage: moisture };
  return { label: "Waterlogged", color: "bg-purple-500", percentage: moisture };
}

function SoilReportCard({ report }: { report: SoilReport }) {
  const phStatus = getPHStatus(report.ph);
  const moistureStatus = getMoistureStatus(report.moisture);
  
  return (
    <div className="p-6 rounded-xl border bg-card hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Beaker className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Soil Analysis Report</h3>
        </div>
        {report.testedAt && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(report.testedAt)}
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* pH Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">pH Level</span>
            </div>
            <Badge className={phStatus.color}>
              {phStatus.label}
            </Badge>
          </div>
          <div className="text-2xl font-bold mb-1">
            {report.ph ? report.ph.toFixed(1) : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {phStatus.description}
          </p>
        </div>
        
        {/* Moisture Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Moisture Content</span>
            </div>
            <Badge className={moistureStatus.color}>
              {moistureStatus.label}
            </Badge>
          </div>
          <div className="mb-2">
            <div className="text-2xl font-bold mb-1">
              {report.moisture ? `${report.moisture.toFixed(1)}%` : "N/A"}
            </div>
            <Progress value={moistureStatus.percentage} className="h-2" />
          </div>
        </div>
      </div>
      
      {/* Nutrients */}
      {report.nutrients && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Nutrients</span>
          </div>
          <p className="text-sm text-muted-foreground">{report.nutrients}</p>
        </div>
      )}
      
      {/* Tested By */}
      {report.testedBy && (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>Tested by: {report.testedBy}</span>
        </div>
      )}
      
      {/* Report Link */}
      {report.reportUrl && (
        <div className="mt-4">
          <a
            href={report.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <FileText className="h-4 w-4" />
            View Full Report
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}

export function SoilReportSection({ soilReports }: SoilReportSectionProps) {
  if (soilReports.length === 0) {
    return (
      <EmptyState
        title="No soil report available"
        description="Get your soil tested to understand its quality and nutrients"
        icon={<Beaker className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }
  
  return (
    <div>
      <h2 className="font-semibold text-lg mb-4">Soil Report</h2>
      <div className="space-y-4">
        {soilReports.map((report) => (
          <SoilReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}