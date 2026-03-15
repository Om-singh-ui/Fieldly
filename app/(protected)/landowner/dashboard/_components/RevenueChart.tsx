"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState, useMemo } from "react";

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
  }>;
  label?: string;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-background shadow-xl p-3 backdrop-blur">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-primary">
        {currencyFormatter.format(payload[0].value)}
      </p>
    </div>
  );
};

export function RevenueChart({ data }: RevenueChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const safeData = useMemo(() => data ?? [], [data]);

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] animate-pulse rounded-lg bg-muted/40" />
        </CardContent>
      </Card>
    );
  }

  if (!safeData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] flex items-center justify-center text-sm text-muted-foreground">
            No revenue data yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="w-full min-h-[320px] h-[320px]">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={safeData}
              margin={{ top: 10, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted))"
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />

              <YAxis
                tickFormatter={(v) => currencyFormatter.format(v)}
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
                width={80}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                wrapperStyle={{
                  fontSize: 12,
                  color: "hsl(var(--muted-foreground))",
                }}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                animationDuration={600}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}