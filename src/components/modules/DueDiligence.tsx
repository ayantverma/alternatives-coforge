import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDDQ } from "@/data/mockData";
import { FileSearch, Plus, CheckCircle, Clock, AlertTriangle, Eye } from "lucide-react";

const DueDiligence = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Approved", "Under Review", "In Progress", "Watch"].map((status) => {
          const count = mockDDQ.filter((d) => d.status === status).length;
          const icon = status === "Approved" ? <CheckCircle className="h-5 w-5 text-success" /> :
                       status === "Watch" ? <AlertTriangle className="h-5 w-5 text-warning" /> :
                       <Clock className="h-5 w-5 text-info" />;
          return (
            <Card key={status}>
              <CardContent className="pt-5 pb-4 px-5 flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  status === "Approved" ? "bg-success/10" :
                  status === "Watch" ? "bg-warning/10" : "bg-info/10"
                }`}>
                  {icon}
                </div>
                <div>
                  <p className="text-2xl font-display">{count}</p>
                  <p className="text-xs text-muted-foreground">{status}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* DDQ Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display">Due Diligence Workspace</CardTitle>
            <Button size="sm" className="text-xs">
              <Plus className="h-3 w-3 mr-1" /> New DDQ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockDDQ.map((ddq) => (
              <div key={ddq.id} className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{ddq.fund}</p>
                    <p className="text-xs text-muted-foreground">{ddq.manager}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {ddq.score > 0 && (
                      <div className={`text-sm font-display px-2 py-0.5 rounded ${
                        ddq.score >= 90 ? "bg-success/10 text-success" :
                        ddq.score >= 70 ? "bg-warning/10 text-warning" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {ddq.score}
                      </div>
                    )}
                    <Badge
                      variant={
                        ddq.status === "Approved" ? "default" :
                        ddq.status === "Watch" || ddq.status === "Restricted" ? "destructive" :
                        "secondary"
                      }
                      className="text-[10px]"
                    >
                      {ddq.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Analyst: {ddq.analyst}</span>
                  <span>Updated: {ddq.lastUpdated}</span>
                </div>

                {ddq.riskFlags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {ddq.riskFlags.map((flag, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] text-destructive border-destructive/30">
                        <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                        {flag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DueDiligence;
