// app/(protected)/landowner/land/[id]/_components/DocumentsSection.tsx
import { 
  FileText, 
  ExternalLink, 
  Download, 
  File, 
  Image as ImageIcon,  // Renamed to avoid confusion with HTML img
  FileArchive 
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

interface Document {
  id: string;
  name: string;
  url: string;
  type: string | null;
  size: number | null;
  createdAt: Date | string | null;
}

interface DocumentsSectionProps {
  documents: Document[];
}

function getFileIcon(type: string | null) {
  if (!type) return <File className="h-5 w-5" />;
  
  const ext = type.toLowerCase();
  if (ext.includes("image")) return <ImageIcon className="h-5 w-5 text-blue-500" />;
  if (ext.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />;
  if (ext.includes("zip") || ext.includes("rar")) return <FileArchive className="h-5 w-5 text-yellow-500" />;
  return <File className="h-5 w-5" />;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "Unknown size";
  
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function DocumentCard({ document: doc }: { document: Document }) {
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use window object to create download link
    const link = window.document.createElement("a");
    link.href = doc.url;
    link.download = doc.name;
    link.click();
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(doc.url, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-xl border bg-card hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          {getFileIcon(doc.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate group-hover:text-primary transition-colors">
            {doc.name}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            {doc.type && (
              <span className="uppercase">{doc.type.replace("image/", "").replace("application/", "")}</span>
            )}
            {doc.size && (
              <>
                <span>•</span>
                <span>{formatFileSize(doc.size)}</span>
              </>
            )}
            {doc.createdAt && (
              <>
                <span>•</span>
                <span>{formatDate(doc.createdAt)}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleView}
            className="p-1 rounded hover:bg-muted"
            title="View"
            aria-label="View document"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1 rounded hover:bg-muted"
            title="Download"
            aria-label="Download document"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </a>
  );
}

export function DocumentsSection({ documents }: DocumentsSectionProps) {
  if (documents.length === 0) {
    return (
      <EmptyState
        title="No documents uploaded"
        description="Upload important documents like land title, survey reports, etc."
        icon={<FileText className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }

  return (
    <div>
      <h2 className="font-semibold text-lg mb-4">Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  );
}