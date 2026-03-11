import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { mockLifecycleEvents } from "@/data/mockData";

const LifecycleEvents = () => {
  const pending = mockLifecycleEvents.filter((e) => e.status === "Pending");
  const completed = mockLifecycleEvents.filter((e) => e.status === "Completed");

  const typeIcon = (type: string) => {
    switch (type) {
      case "Capital Call": return <ArrowDownRight className="h-4 w-4" />;
      case "Distribution": return <ArrowUpRight className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "Capital Call": return "bg-warning/10 text-warning";
      case "Distribution": return "bg-success/10 text-success";
      case "Valuation": return "bg-info/10 text-info";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4 px-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-display">{pending.length}</p>
              <p className="text-xs text-muted-foreground">Pending Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 px-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-display">{completed.length}</p>
              <p className="text-xs text-muted-foreground">Completed This Quarter</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4 px-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-display">0</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display">All Lifecycle Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockLifecycleEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeColor(event.type)}`}>
                    {typeIcon(event.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{event.type}</p>
                      <Badge
                        variant={event.status === "Completed" ? "default" : event.status === "Overdue" ? "destructive" : "secondary"}
                        className="text-[10px]"
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{event.fund}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  {event.amount > 0 && (
                    <p className="text-sm font-medium">${(event.amount / 1000000).toFixed(2)}M</p>
                  )}
                  <p className="text-xs text-muted-foreground">{event.dueDate ? `Due ${event.dueDate}` : event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LifecycleEvents;
