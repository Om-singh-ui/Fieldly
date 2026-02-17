// components/dashboard/StatsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Landmark, Users, DollarSign, FileText, 
  TrendingUp, TrendingDown, Minus 
} from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalLands: number;
    activeLeases: number;
    pendingApplications: number;
    monthlyRevenue: number;
    leasedArea: number;
    availableArea: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Lands",
      value: stats.totalLands,
      icon: Landmark,
      trend: "+12.5%",
      trendIcon: TrendingUp,
      trendColor: "text-green-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Active Leases",
      value: stats.activeLeases,
      icon: Users,
      trend: stats.activeLeases > 0 ? "+2 this month" : "No active leases",
      trendIcon: stats.activeLeases > 0 ? TrendingUp : Minus,
      trendColor: stats.activeLeases > 0 ? "text-green-600" : "text-gray-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "+8.1% from last month",
      trendIcon: TrendingUp,
      trendColor: "text-green-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications,
      icon: FileText,
      trend: stats.pendingApplications > 0 ? "Requires attention" : "No pending",
      trendIcon: stats.pendingApplications > 0 ? TrendingDown : Minus,
      trendColor: stats.pendingApplications > 0 ? "text-orange-600" : "text-gray-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  const totalArea = stats.leasedArea + stats.availableArea;
  const leasedPercentage = totalArea > 0 ? (stats.leasedArea / totalArea) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.trendIcon;
          
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendIcon className={`h-3 w-3 ${card.trendColor}`} />
                  <span className={card.trendColor}>{card.trend}</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Land Utilization Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Land Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Leased Area</span>
              <span className="font-medium">{stats.leasedArea.toFixed(1)} acres</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Available Area</span>
              <span className="font-medium">{stats.availableArea.toFixed(1)} acres</span>
            </div>
            <Progress value={leasedPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {leasedPercentage.toFixed(1)}% of your land is currently leased
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}