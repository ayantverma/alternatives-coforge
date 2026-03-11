import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity,
} from "lucide-react";
import {
  mockPortfolioHoldings,
  mockComplianceAlerts,
  strategyAllocation,
  vintageDistribution,
} from "@/data/mockData";

const PMDashboard = () => {
  const totalCommitment = mockPortfolioHoldings.reduce((s, h) => s + h.commitment, 0);
  const totalNAV = mockPortfolioHoldings.reduce((s, h) => s + h.nav, 0);
  const totalUnfunded = mockPortfolioHoldings.reduce((s, h) => s + h.unfunded, 0);
  const illiquidPct = ((totalNAV / (totalNAV + 15000000)) * 100).toFixed(1); // assume total portfolio includes liquid

  const modelAllocations = [
    { name: "Conservative Alt Sleeve", target: 15, actual: 13.8, drift: -1.2, status: "Within Band" },
    { name: "Moderate Alt Sleeve", target: 25, actual: 27.1, drift: 2.1, status: "Near Limit" },
    { name: "Aggressive Alt Sleeve", target: 35, actual: 33.5, drift: -1.5, status: "Within Band" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Commitments</span>
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-display">${(totalCommitment / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground mt-1">Across 5 funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unfunded Ratio</span>
              <Target className="h-4 w-4 text-warning" />
            </div>
            <p className="text-2xl font-display">{((totalUnfunded / totalCommitment) * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground mt-1">${(totalUnfunded / 1000000).toFixed(1)}M remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Illiquid Allocation</span>
              <PieChart className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-display">{illiquidPct}%</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-warning">
              <AlertTriangle className="h-3 w-3" />
              <span>Threshold: 40%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Risk Alerts</span>
              <Activity className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-display">{mockComplianceAlerts.filter(a => a.type === "Concentration").length}</p>
            <p className="text-xs text-destructive mt-1">Concentration breaches</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Portfolio Drift */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display">Model Portfolio Alt Sleeves — Drift Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modelAllocations.map((model) => (
                <div key={model.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{model.name}</span>
                    <Badge
                      variant={model.status === "Near Limit" ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {model.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">Target: {model.target}%</span>
                    <span className="text-muted-foreground">Actual: {model.actual}%</span>
                    <span className={model.drift > 0 ? "text-warning font-medium" : "text-success font-medium"}>
                      {model.drift > 0 ? "+" : ""}{model.drift}%
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="absolute h-full rounded-full bg-primary/30"
                      style={{ width: `${model.target}%` }}
                    />
                    <div
                      className="absolute h-full rounded-full bg-primary"
                      style={{ width: `${model.actual}%` }}
                    />
                    <div
                      className="absolute h-full w-0.5 bg-foreground/50"
                      style={{ left: `${model.target}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vintage Diversification */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display">Vintage Diversification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vintageDistribution.map((v) => (
                <div key={v.vintage} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-12">{v.vintage}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Committed: ${(v.committed / 1000000).toFixed(1)}M</span>
                      <span>NAV: ${(v.nav / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(v.committed / 15000000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exposure Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display">Exposure by Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {strategyAllocation.map((s) => (
              <div key={s.name} className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                <div className="h-2 w-2 rounded-full mx-auto mb-2" style={{ backgroundColor: s.color }} />
                <p className="text-lg font-display">{s.value}%</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PMDashboard;
