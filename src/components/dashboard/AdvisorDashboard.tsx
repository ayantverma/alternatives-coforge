import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  DollarSign,
  ClipboardList,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  mockSubscriptions,
  mockComplianceAlerts,
  mockProducts,
  mockPortfolioHoldings,
} from "@/data/mockData";

const AdvisorDashboard = () => {
  const totalAUM = mockPortfolioHoldings.reduce((s, h) => s + h.nav, 0);
  const openAlerts = mockComplianceAlerts.filter((a) => a.status === "Open").length;
  const activeSubscriptions = mockSubscriptions.length;
  const openProducts = mockProducts.filter((p) => p.status === "Open").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Client Alt AUM</span>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-display">${(totalAUM / 1000000).toFixed(1)}M</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-success">
              <ArrowUpRight className="h-3 w-3" />
              <span>+5.1% YTD</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Subscriptions</span>
              <ClipboardList className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-display">{activeSubscriptions}</p>
            <p className="text-xs text-muted-foreground mt-1">2 pending client action</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Open Products</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-display">{openProducts}</p>
            <p className="text-xs text-warning mt-1">1 closing soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Compliance Alerts</span>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-display">{openAlerts}</p>
            <p className="text-xs text-destructive mt-1">1 high severity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Pipeline */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-display">Subscription Pipeline</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSubscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{sub.client}</p>
                      {sub.missingDocs.length > 0 && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                          {sub.missingDocs.length} missing
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{sub.fund}</p>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <p className="text-sm font-medium">${(sub.amount / 1000000).toFixed(1)}M</p>
                    <Badge
                      variant="outline"
                      className="text-[10px] mt-0.5"
                    >
                      {sub.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Recommendations */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-display">Recommended Products</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                Browse Catalog <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockProducts.filter(p => p.status !== "Closed").slice(0, 4).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{product.strategy}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{product.targetReturn}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Badge
                      variant={product.status === "Closing Soon" ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display">Compliance & Suitability Alerts</CardTitle>
            <Badge variant="destructive" className="text-xs">{openAlerts} Open</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockComplianceAlerts.filter(a => a.status !== "Resolved").map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  alert.severity === "High" ? "text-destructive" :
                  alert.severity === "Medium" ? "text-warning" : "text-muted-foreground"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{alert.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {alert.client && <span className="text-xs text-muted-foreground">{alert.client}</span>}
                    {alert.fund && <span className="text-xs text-muted-foreground">· {alert.fund}</span>}
                  </div>
                </div>
                <Badge
                  variant={alert.severity === "High" ? "destructive" : "outline"}
                  className="text-[10px] flex-shrink-0"
                >
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisorDashboard;
