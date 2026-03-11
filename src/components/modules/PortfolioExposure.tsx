import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  mockPortfolioHoldings,
  strategyAllocation,
  regionAllocation,
  vintageDistribution,
} from "@/data/mockData";
import { PieChart, TrendingUp, Globe, Calendar } from "lucide-react";

const PortfolioExposure = () => {
  const totalNAV = mockPortfolioHoldings.reduce((s, h) => s + h.nav, 0);
  const totalCommitment = mockPortfolioHoldings.reduce((s, h) => s + h.commitment, 0);
  const totalUnfunded = mockPortfolioHoldings.reduce((s, h) => s + h.unfunded, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4 px-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total NAV</p>
            <p className="text-3xl font-display">${(totalNAV / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 px-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Commitments</p>
            <p className="text-3xl font-display">${(totalCommitment / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 px-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Unfunded</p>
            <p className="text-3xl font-display">${(totalUnfunded / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Allocation */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-display">Strategy Allocation</CardTitle>
            </div>
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
                    <div className="h-full rounded-full" style={{ width: `${s.value}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Region */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-display">Geographic Exposure</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {regionAllocation.map((r) => (
                <div key={r.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{r.name}</span>
                    <span className="font-medium">{r.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${r.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vintage */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-display">Vintage Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vintageDistribution.map((v) => (
                <div key={v.vintage} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-10">{v.vintage}</span>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(v.committed / 15000000) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground w-14 text-right">${(v.committed / 1000000).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display">Holdings Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Fund</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Strategy</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Commitment</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">NAV</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">IRR</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">MOIC</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Unfunded</th>
                  <th className="text-center py-2 font-medium text-muted-foreground">Region</th>
                </tr>
              </thead>
              <tbody>
                {mockPortfolioHoldings.map((h) => (
                  <tr key={h.fund} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 font-medium">{h.fund}</td>
                    <td className="py-2.5">
                      <Badge variant="outline" className="text-[10px]">{h.strategy}</Badge>
                    </td>
                    <td className="text-right py-2.5">${(h.commitment / 1000000).toFixed(1)}M</td>
                    <td className="text-right py-2.5 font-medium">${(h.nav / 1000000).toFixed(2)}M</td>
                    <td className="text-right py-2.5">
                      {h.irr > 0 ? <span className="text-success">{h.irr.toFixed(1)}%</span> : "—"}
                    </td>
                    <td className="text-right py-2.5">{h.moic > 1 ? h.moic.toFixed(2) + "x" : "—"}</td>
                    <td className="text-right py-2.5 text-muted-foreground">${(h.unfunded / 1000000).toFixed(1)}M</td>
                    <td className="text-center py-2.5">
                      <Badge variant="outline" className="text-[10px]">{h.region}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioExposure;
