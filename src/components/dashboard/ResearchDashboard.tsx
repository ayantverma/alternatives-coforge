import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileSearch,
  BookOpen,
  Scale,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  ArrowRight,
  Star,
  TrendingUp,
} from "lucide-react";
import { mockDDQ, mockComplianceAlerts, mockProducts } from "@/data/mockData";

const ResearchDashboard = () => {
  const approved = mockDDQ.filter((d) => d.status === "Approved").length;
  const underReview = mockDDQ.filter((d) => d.status === "Under Review" || d.status === "In Progress").length;
  const watchList = mockDDQ.filter((d) => d.status === "Watch" || d.status === "Restricted").length;

  const regulatoryItems = [
    { id: "r-01", title: "K-1 Tax Document Distribution", deadline: "2026-04-15", status: "In Progress", type: "Tax", impact: "12 funds affected" },
    { id: "r-02", title: "SEC Form PF Filing — Q4 2025", deadline: "2026-03-31", status: "Pending", type: "Regulatory", impact: "All alt funds" },
    { id: "r-03", title: "ERISA Plan Asset Test", deadline: "2026-04-01", status: "Completed", type: "Regulatory", impact: "3 funds reviewed" },
    { id: "r-04", title: "State Blue Sky Exemption Renewals", deadline: "2026-06-30", status: "Pending", type: "Regulatory", impact: "Multi-state compliance" },
    { id: "r-05", title: "UBTI Analysis — Q4 2025", deadline: "2026-03-20", status: "In Progress", type: "Tax", impact: "Tax-exempt investors" },
  ];

  const deviationAlerts = [
    { fund: "HPS Mezzanine V", deviation: "Leverage ratio 4.2x vs stated max 3.5x", severity: "High" as const, thematic: "Private Credit" },
    { fund: "Apollo Natural Resources III", deviation: "ESG score below minimum threshold (65 vs 70)", severity: "Medium" as const, thematic: "Natural Resources" },
    { fund: "Ares Senior DL IV", deviation: "Sector concentration — 40% healthcare vs 25% guideline", severity: "Medium" as const, thematic: "Private Credit" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Approved Funds</span>
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
            <p className="text-2xl font-display">{approved}</p>
            <p className="text-xs text-success mt-1">On approved list</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Under Review</span>
              <Clock className="h-4 w-4 text-info" />
            </div>
            <p className="text-2xl font-display">{underReview}</p>
            <p className="text-xs text-muted-foreground mt-1">DD in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Watch / Restricted</span>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <p className="text-2xl font-display">{watchList}</p>
            <p className="text-xs text-warning mt-1">Requires monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Deviations</span>
              <Scale className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-display">{deviationAlerts.length}</p>
            <p className="text-xs text-destructive mt-1">From stated objectives</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Due Diligence Pipeline */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-display">Due Diligence Pipeline</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                Full Workspace <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDDQ.map((ddq) => (
                <div key={ddq.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{ddq.fund}</p>
                    <p className="text-xs text-muted-foreground">{ddq.manager} · Analyst: {ddq.analyst}</p>
                    {ddq.riskFlags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {ddq.riskFlags.map((flag, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] text-destructive border-destructive/30">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end ml-3 flex-shrink-0 gap-1">
                    <Badge
                      className="text-[10px]"
                      variant={
                        ddq.status === "Approved" ? "default" :
                        ddq.status === "Watch" || ddq.status === "Restricted" ? "destructive" :
                        "secondary"
                      }
                    >
                      {ddq.status}
                    </Badge>
                    {ddq.score > 0 && (
                      <span className="text-xs text-muted-foreground">Score: {ddq.score}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Deviations from Stated Objectives */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display">Deviations from Stated Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deviationAlerts.map((alert, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${
                        alert.severity === "High" ? "text-destructive" : "text-warning"
                      }`} />
                      <p className="text-sm font-medium">{alert.fund}</p>
                    </div>
                    <Badge variant={alert.severity === "High" ? "destructive" : "outline"} className="text-[10px]">
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">{alert.deviation}</p>
                  <p className="text-[10px] text-muted-foreground/70 ml-6 mt-1">Thematic: {alert.thematic}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory & Tax Calendar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display">Regulatory & Tax Calendar</CardTitle>
            <Badge variant="secondary" className="text-xs">{regulatoryItems.filter(r => r.status !== "Completed").length} Upcoming</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Item</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Deadline</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Impact</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {regulatoryItems.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 font-medium">{item.title}</td>
                    <td className="py-2.5">
                      <Badge variant="outline" className="text-[10px]">{item.type}</Badge>
                    </td>
                    <td className="py-2.5 text-muted-foreground">{item.deadline}</td>
                    <td className="py-2.5 text-muted-foreground">{item.impact}</td>
                    <td className="py-2.5">
                      <Badge
                        variant={item.status === "Completed" ? "default" : item.status === "In Progress" ? "secondary" : "outline"}
                        className="text-[10px]"
                      >
                        {item.status}
                      </Badge>
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

export default ResearchDashboard;
