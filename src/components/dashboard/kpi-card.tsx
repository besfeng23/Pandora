import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

type KpiCardProps = {
  title: string;
  value: string;
  change?: string;
  description: string;
  status: "success" | "warning" | "destructive" | "neutral";
};

const statusClasses = {
  success: "text-green-500",
  warning: "text-yellow-500",
  destructive: "text-red-500",
  neutral: "text-muted-foreground",
};

export default function KpiCard({ title, value, change, description, status }: KpiCardProps) {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("h-2 w-2 rounded-full", {
            "bg-green-500": status === "success",
            "bg-yellow-500": status === "warning",
            "bg-red-500": status === "destructive",
            "bg-gray-400": status === "neutral",
        })} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {change && (
            <div className={cn("flex items-center", isPositive && "text-green-500", isNegative && "text-red-500")}>
              {isPositive && <ArrowUp className="h-3 w-3 mr-1" />}
              {isNegative && <ArrowDown className="h-3 w-3 mr-1" />}
              {change}
            </div>
          )}
          <p className="ml-2">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
