import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const statusBadges = [
  { label: "8 Agents Active", color: "bg-primary/10 text-primary border-primary/20" },
  { label: "3 Clients At Risk", color: "bg-destructive/10 text-destructive border-destructive/20" },
  { label: "14 Docs in Queue", color: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20" },
  { label: "6 Actions Pending", color: "bg-accent text-accent-foreground border-border" },
  { label: "74 Entities in Knowledge Graph", color: "bg-primary/10 text-primary border-primary/20" },
];

const kpis = [
  { label: "AUM per Advisor", value: "$184.2M", change: "+6.3%", up: true },
  { label: "Client Retention", value: "97.8%", change: "+0.4pp", up: true },
  { label: "Cross-Sell Ratio", value: "2.41", change: "+0.18", up: true },
  { label: "Onboarding Days", value: "4.2 days", change: "-1.8d", up: false },
  { label: "Cost-to-Serve", value: "$12,840", change: "-8.2%", up: false },
  { label: "Exception Rate", value: "3.1%", change: "-0.9pp", up: false },
];

interface AgentCard {
  name: string;
  description: string;
  status: "Active" | "Processing" | "Idle";
  todayCount: number;
  confidence: string;
  lastRun: string;
}

const agents: AgentCard[] = [
  { name: "Meeting Intelligence Agent", description: "Auto-summarizes advisor meetings, extracts action items, drafts follow-up emails and compliance notes.", status: "Active", todayCount: 7, confidence: "91%", lastRun: "12 min ago" },
  { name: "Client Attrition Risk Agent", description: "Scores all clients daily across 6 risk dimensions and surfaces early-warning signals before attrition occurs.", status: "Active", todayCount: 3, confidence: "88%", lastRun: "1 hr ago" },
  { name: "Document Validator", description: "Reads submitted documents, extracts key fields, flags anomalies, and routes exceptions with confidence scores.", status: "Processing", todayCount: 14, confidence: "94%", lastRun: "Now" },
  { name: "Life Event Detection Engine", description: "Monitors public filings, news feeds, and CRM signals to detect UHNW life events requiring advisor action.", status: "Active", todayCount: 2, confidence: "89%", lastRun: "2 hr ago" },
  { name: "Cross-Sell Intelligence Agent", description: "Surfaces internal cross-sell opportunities using behavioral signals and institutional relationship data.", status: "Active", todayCount: 1, confidence: "92%", lastRun: "4 hr ago" },
  { name: "Risk Drift Monitor", description: "Continuously monitors portfolio risk against IPS targets and triggers advisor action before breaches occur.", status: "Active", todayCount: 5, confidence: "87%", lastRun: "30 min ago" },
  { name: "Orchestration Platform", description: "Coordinates agent network and manages signal flows across all intelligence agents.", status: "Active", todayCount: 12, confidence: "95%", lastRun: "5 min ago" },
  { name: "Signal Bridge", description: "Matches institutional signals with wealth management opportunities while maintaining privacy compliance.", status: "Idle", todayCount: 0, confidence: "0%", lastRun: "—" },
  { name: "Fiduciary Dashboard", description: "Unified executive dashboard providing real-time platform metrics and KPI tracking.", status: "Active", todayCount: 8, confidence: "96%", lastRun: "2 min ago" },
];

const statusColors: Record<string, string> = {
  Active: "bg-primary/10 text-primary",
  Processing: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))]",
  Idle: "bg-muted text-muted-foreground",
};

const FiduciaryDashboard = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Fiduciary Intelligence Platform
        </p>
        <h1 className="text-2xl font-display text-foreground">Advisor Dashboard</h1>
        <p className="text-xs text-muted-foreground">{today}</p>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        {statusBadges.map((b) => (
          <Badge key={b.label} variant="outline" className={cn("text-xs font-medium px-3 py-1", b.color)}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
            {b.label}
          </Badge>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border border-border">
            <CardContent className="p-4">
              <p className="text-[10px] text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-xl font-display text-foreground">{kpi.value}</p>
              <div className={cn("flex items-center gap-1 text-xs mt-1", kpi.up ? "text-primary" : "text-destructive")}>
                {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {kpi.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agent Status */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Agent Status
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.map((agent) => (
            <Card key={agent.name} className="border border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-foreground leading-tight">{agent.name}</h3>
                  <Badge variant="outline" className={cn("text-[10px] ml-2 flex-shrink-0", statusColors[agent.status])}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current mr-1" />
                    {agent.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border">
                  <div className="flex gap-4">
                    <span><strong className="text-foreground">{agent.todayCount}</strong> today</span>
                    <span><strong className="text-foreground">{agent.confidence}</strong> confidence</span>
                  </div>
                  <span>Last run: <strong className="text-foreground">{agent.lastRun}</strong></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiduciaryDashboard;
