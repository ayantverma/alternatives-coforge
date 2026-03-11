import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockComplianceAlerts } from "@/data/mockData";
import { AlertTriangle, Shield, Scale, FileText } from "lucide-react";

const ComplianceSurveillance = () => {
  const alertsByType = {
    Concentration: mockComplianceAlerts.filter((a) => a.type === "Concentration"),
    Suitability: mockComplianceAlerts.filter((a) => a.type === "Suitability"),
    Regulatory: mockComplianceAlerts.filter((a) => a.type === "Regulatory"),
    Marketing: mockComplianceAlerts.filter((a) => a.type === "Marketing"),
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "Concentration": return <AlertTriangle className="h-4 w-4" />;
      case "Suitability": return <Shield className="h-4 w-4" />;
      case "Regulatory": return <Scale className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(alertsByType).map(([type, alerts]) => {
          const openCount = alerts.filter((a) => a.status !== "Resolved").length;
          return (
            <Card key={type}>
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    openCount > 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                  }`}>
                    {typeIcon(type)}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{type}</span>
                </div>
                <p className="text-2xl font-display">{openCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{alerts.length} total this month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* All Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display">All Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Severity</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Description</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Client / Fund</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockComplianceAlerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5">
                      <Badge variant="outline" className="text-[10px]">{alert.type}</Badge>
                    </td>
                    <td className="py-2.5">
                      <Badge
                        variant={alert.severity === "High" ? "destructive" : alert.severity === "Medium" ? "secondary" : "outline"}
                        className="text-[10px]"
                      >
                        {alert.severity}
                      </Badge>
                    </td>
                    <td className="py-2.5 max-w-xs truncate">{alert.description}</td>
                    <td className="py-2.5 text-muted-foreground">
                      {alert.client && <span>{alert.client}</span>}
                      {alert.fund && <span className="block">{alert.fund}</span>}
                    </td>
                    <td className="py-2.5 text-muted-foreground">{alert.date}</td>
                    <td className="py-2.5">
                      <Badge
                        variant={alert.status === "Resolved" ? "default" : alert.status === "Escalated" ? "destructive" : "secondary"}
                        className="text-[10px]"
                      >
                        {alert.status}
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

export default ComplianceSurveillance;
