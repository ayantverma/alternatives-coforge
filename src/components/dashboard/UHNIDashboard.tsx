import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  FileText,
  PieChart,
  Eye,
} from "lucide-react";
import {
  mockPortfolioHoldings,
  mockLifecycleEvents,
  mockProducts,
  strategyAllocation,
} from "@/data/mockData";

const UHNIDashboard = () => {
  const totalNAV = mockPortfolioHoldings.reduce((s, h) => s + h.nav, 0);
  const totalCommitment = mockPortfolioHoldings.reduce((s, h) => s + h.commitment, 0);
  const totalUnfunded = mockPortfolioHoldings.reduce((s, h) => s + h.unfunded, 0);
  const weightedIRR = mockPortfolioHoldings.filter(h => h.irr > 0).reduce((s, h) => s + h.irr * h.nav, 0) / mockPortfolioHoldings.filter(h => h.irr > 0).reduce((s, h) => s + h.nav, 0);
  const pendingEvents = mockLifecycleEvents.filter((e) => e.status === "Pending");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total NAV</span>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-display">${(totalNAV / 1000000).toFixed(1)}M</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-success">
              <ArrowUpRight className="h-3 w-3" />
              <span>+3.2% QoQ</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Commitments</span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-display">${(totalCommitment / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground mt-1">Unfunded: ${(totalUnfunded / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Blended IRR</span>
              <PieChart className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-display">{weightedIRR.toFixed(1)}%</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-success">
              <ArrowUpRight className="h-3 w-3" />
              <span>Above benchmark</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pending Actions</span>
              <Clock className="h-4 w-4 text-warning" />
            </div>
            <p className="text-2xl font-display">{pendingEvents.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Capital calls & notices</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Allocation */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display">Strategy Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strategyAllocation.map((s) => (
                <div key={s.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className="font-medium">{s.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${s.value}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Holdings Summary */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-display">Holdings Summary</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                View All <Eye className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Fund</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">NAV</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">IRR</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">MOIC</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Unfunded</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPortfolioHoldings.map((h) => (
                    <tr key={h.fund} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-2.5">
                        <div>
                          <p className="font-medium">{h.fund}</p>
                          <p className="text-muted-foreground">{h.strategy} · {h.vintage}</p>
                        </div>
                      </td>
                      <td className="text-right font-medium">${(h.nav / 1000000).toFixed(2)}M</td>
                      <td className="text-right">
                        {h.irr > 0 ? (
                          <span className="text-success font-medium">{h.irr.toFixed(1)}%</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="text-right font-medium">{h.moic > 1 ? h.moic.toFixed(2) + "x" : "—"}</td>
                      <td className="text-right text-muted-foreground">${(h.unfunded / 1000000).toFixed(1)}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display">Upcoming Lifecycle Events</CardTitle>
            <Badge variant="secondary" className="text-xs">{pendingEvents.length} Pending</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    event.type === "Capital Call" ? "bg-warning/10 text-warning" :
                    event.type === "Distribution" ? "bg-success/10 text-success" :
                    "bg-info/10 text-info"
                  }`}>
                    {event.type === "Capital Call" ? <ArrowDownRight className="h-4 w-4" /> :
                     event.type === "Distribution" ? <ArrowUpRight className="h-4 w-4" /> :
                     <FileText className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.type}</p>
                    <p className="text-xs text-muted-foreground">{event.fund}</p>
                  </div>
                </div>
                <div className="text-right">
                  {event.amount > 0 && <p className="text-sm font-medium">${(event.amount / 1000000).toFixed(2)}M</p>}
                  <p className="text-xs text-muted-foreground">Due {event.dueDate || event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UHNIDashboard;
