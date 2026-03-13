  "use client";

  import { useState, useMemo, useCallback } from "react";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

  import {
    MoreHorizontal,
    MapPin,
    ArrowUpDown,
    Search,
    CheckCircle2,
    Clock,
    AlertCircle,
    IndianRupee,
    Calendar,
    FileText,
    ExternalLink,
    Edit,
    Eye,
    Plus,
    Trash,
  } from "lucide-react";

  import { motion } from "framer-motion";
  import Link from "next/link";
  import { formatDistanceToNow } from "date-fns";
  import { useRouter } from "next/navigation";

  import { cn } from "@/lib/utils";
  import { LandWithDetails } from "@/lib/queries/landowner";

  interface LandsTableProps {
    lands: LandWithDetails[];
  }

  type SortField =
    | "title"
    | "size"
    | "status"
    | "createdAt"
    | "applicationsCount";

  type SortDirection = "asc" | "desc";

  type SortValue = string | number | Date | null | undefined;

  const ITEMS_PER_PAGE = 6;

  const statusConfig = {
    AVAILABLE: {
      label: "Available",
      color:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400",
      icon: AlertCircle,
    },
    PENDING: {
      label: "Pending",
      color:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400",
      icon: Clock,
    },
    LEASED: {
      label: "Leased",
      color:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",
      icon: CheckCircle2,
    },
  };

  export function LandsTable({ lands }: LandsTableProps) {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sortField, setSortField] = useState<SortField>("createdAt");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const handleSort = useCallback(
      (field: SortField) => {
        if (field === sortField) {
          setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
          setSortField(field);
          setSortDirection("asc");
        }
      },
      [sortField],
    );

    const formatCurrency = (value: number) =>
      new Intl.NumberFormat("en-IN").format(value);

    const formatRent = (min?: number | null, max?: number | null) => {
      if (!min && !max) return "Negotiable";
      if (min && max) return `₹${formatCurrency(min)} - ₹${formatCurrency(max)}`;
      if (min) return `From ₹${formatCurrency(min)}`;
      if (max) return `Up to ₹${formatCurrency(max)}`;
      return "Negotiable";
    };

    const filtered = useMemo(() => {
      return lands.filter((land) =>
        land.title?.toLowerCase().includes(search.toLowerCase()),
      );
    }, [lands, search]);

    const sorted = useMemo(() => {
      return [...filtered].sort((a, b) => {
        let aVal: SortValue = a[sortField];
        let bVal: SortValue = b[sortField];

        if (sortField === "createdAt") {
          aVal = new Date(aVal as string).getTime();
          bVal = new Date(bVal as string).getTime();
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        const result = aVal > bVal ? 1 : -1;

        return sortDirection === "asc" ? result : -result;
      });
    }, [filtered, sortField, sortDirection]);

    const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);

    const paginated = sorted.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE,
    );

    return (
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        {/* Header */}

        <div className="flex items-center justify-between p-6 border-b bg-white ">
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search lands..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="pl-6">
                <button
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-1 text-xs uppercase"
                >
                  Land
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>

              <TableHead>
                <div className="flex items-center gap-1 text-xs uppercase">
                  <MapPin size={14} />
                  Location
                </div>
              </TableHead>

              <TableHead>
                <button
                  onClick={() => handleSort("size")}
                  className="flex items-center gap-1 text-xs uppercase"
                >
                  Size
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>

              <TableHead>Status</TableHead>

              <TableHead>
                <div className="flex items-center gap-1 text-xs uppercase">
                  <IndianRupee size={14} />
                  Rent
                </div>
              </TableHead>

              <TableHead className="text-center">
                <button
                  onClick={() => handleSort("applicationsCount")}
                  className="flex items-center gap-1 text-xs uppercase"
                >
                  Applications
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>

              <TableHead>
                <button
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center gap-1 text-xs uppercase"
                >
                  <Calendar size={14} />
                  Listed
                  <ArrowUpDown size={14} />
                </button>
              </TableHead>

              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <MapPin className="w-10 h-10 text-muted-foreground" />

                    <h3 className="text-lg font-semibold">No lands found</h3>

                    <p className="text-sm text-muted-foreground">
                      Start by adding your first land listing
                    </p>

                    <Link href="/landowner/lands/new">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Land
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {paginated.map((land, i) => {
              const status =
                statusConfig[land.status as keyof typeof statusConfig];

              const StatusIcon = status.icon;

              return (
                <motion.tr
                  key={land.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="cursor-pointer hover:bg-muted/30"
                  onClick={() => router.push(`/landowner/lands/${land.id}`)}
                >
                  <TableCell className="font-medium pl-6">
                    <div className="flex items-center gap-2">
                      {land.title}
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {land.location}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">
                      {land.size?.toFixed(1)} acres
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("gap-1", status.color)}
                    >
                      <StatusIcon size={14} />
                      {status.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-medium">
                    {formatRent(land.expectedRentMin, land.expectedRentMax)}
                  </TableCell>

                  {/* APPLICATIONS FIXED */}

                  <TableCell className="text-center">
                    {land.applicationsCount > 0 ? (
                      <Badge variant="secondary" className="gap-1">
                        <FileText size={12} />
                        {land.applicationsCount}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(land.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>

                  <TableCell
                    className="text-right pr-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                          <Link href={`/landowner/lands/${land.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link href={`/landowner/lands/${land.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link href={`/landowner/lands/${land.id}/applications`}>
                            <FileText className="w-4 h-4 mr-2" />
                            Applications
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-red-600">
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
