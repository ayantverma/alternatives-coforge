import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Sparkles, Activity, CalendarDays, AlertTriangle, ArrowRight } from "lucide-react";
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

interface ActivityEntry {
  agent: string;
  icon: typeof Activity;
  mode: string;
  severity: "warning" | "success" | "info";
  title: string;
  client: string;
  reasoning: string;
  timeAgo: string;
  confidence: number;
  confidenceLabel: string;
  triggeredAgent?: string;
}

const liveActivities: ActivityEntry[] = [
  {
    agent: "Risk Drift",
    icon: Activity,
    mode: "AUTONOMOUS",
    severity: "warning",
    title: "Portfolio drift alert — 12 points above IPS target",
    client: "Meridith Langston",
    reasoning: "Equity concentration breach detected. Auto-flagged for advisor review per IPS guidelines.",
    timeAgo: "24m ago",
    confidence: 87,
    confidenceLabel: "HIGH",
  },
  {
    agent: "Life Events",
    icon: CalendarDays,
    mode: "AUTONOMOUS",
    severity: "success",
    title: "Detected IPO filing — generated cross-sell opportunity",
    client: "Constance Whitmore-Bell",
    reasoning: "S-1 filing confirmed via SEC database. Estimated equity value $8-12M. Routing to Cross-Sell Agent.",
    timeAgo: "30m ago",
    confidence: 91,
    confidenceLabel: "VERY HIGH",
    triggeredAgent: "Cross-Sell Agent",
  },
  {
    agent: "Attrition Risk",
    icon: AlertTriangle,
    mode: "AUTONOMOUS",
    severity: "warning",
    title: "Competitor wealth manager contact detected",
    client: "Meridith Langston",
    reasoning: "LinkedIn activity and email metadata indicate outreach from competitor firm. Risk score elevated.",
    timeAgo: "40m ago",
    confidence: 88,
    confidenceLabel: "HIGH",
  },
];

interface ClientRow {
  name: string;
  tier: string;
  advisor: string;
  aum: string;
  riskScore: number;
  riskLevel: string;
  trendUp: boolean;
  primaryFactor: string;
  lastContact: string;
}

const clientsRequiringAttention: ClientRow[] = [
  { name: "Meridith Langston", tier: "Platinum", advisor: "Sarah Chen", aum: "$412M", riskScore: 71, riskLevel: "High", trendUp: true, primaryFactor: "Competitor wealth manager contact detected", lastContact: "2024-12-20" },
  { name: "Dr. Marcus & Elena Voss", tier: "Platinum", advisor: "James Whitfield", aum: "$287M", riskScore: 68, riskLevel: "High", trendUp: true, primaryFactor: "Unresolved estate planning issues beyond SLA", lastContact: "2024-11-18" },
  { name: "Constance Whitmore-Bell", tier: "Gold", advisor: "Sarah Chen", aum: "$156M", riskScore: 54, riskLevel: "Medium", trendUp: false, primaryFactor: "Portfolio underperformance vs benchmark", lastContact: "2025-01-05" },
];

const severityColors: Record<string, string> = {
  warning: "text-[hsl(var(--chart-4))]",
  success: "text-primary",
  info: "text-muted-foreground",
};

const confidenceLabelColors: Record<string, string> = {
  "VERY HIGH": "text-primary",
  HIGH: "text-[hsl(var(--chart-4))]",
  MEDIUM: "text-muted-foreground",
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
          Alternatives Intelligence Platform
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

      {/* Live Agent Activity */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Live Agent Activity
        </p>
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Live Agent Activity</span>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">LIVE</Badge>
              </div>
              <span className="text-xs text-muted-foreground">{liveActivities.length} activities</span>
            </div>

            {/* Top reasoning bar */}
            <div className="border-l-2 border-primary bg-primary/5 px-4 py-2 rounded-r mb-4">
              <p className="text-xs text-foreground">
                <span className="font-semibold">Agent Reasoning:</span> Detected estate planning concern with high confidence. ILIT review request clearly stated.
              </p>
            </div>

            <div className="space-y-6">
              {liveActivities.map((activity, idx) => {
                const Icon = activity.icon;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-5 w-5", severityColors[activity.severity])} />
                        <span className="text-sm font-semibold text-foreground">{activity.agent}</span>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">AUTONOMOUS</Badge>
                        {activity.severity === "warning" && <AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--chart-4))]" />}
                        {activity.severity === "success" && (
                          <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">{activity.timeAgo}</span>
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <span className={cn("text-sm font-semibold", confidenceLabelColors[activity.confidenceLabel])}>{activity.confidence}%</span>
                          <span className={cn("text-[10px] font-semibold", confidenceLabelColors[activity.confidenceLabel])}>{activity.confidenceLabel}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-foreground ml-7">{activity.title}</p>
                    <p className="text-xs text-muted-foreground ml-7">Client: {activity.client}</p>
                    <div className="border-l-2 border-primary bg-primary/5 px-4 py-2 rounded-r ml-7">
                      <p className="text-xs text-foreground">
                        <span className="font-semibold">Agent Reasoning:</span> {activity.reasoning}
                      </p>
                    </div>
                    {activity.triggeredAgent && (
                      <p className="text-xs text-muted-foreground ml-7">→ Triggered {activity.triggeredAgent}</p>
                    )}
                    {idx < liveActivities.length - 1 && <div className="border-b border-border mt-4" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Requiring Attention */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Clients Requiring Attention
        </p>
        <Card className="border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">AUM</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Risk Score</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Trend</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Primary Factor</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Last Contact</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {clientsRequiringAttention.map((client) => (
                  <tr key={client.name} className="border-b border-border last:border-b-0">
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-foreground">{client.name}</p>
                      <p className="text-muted-foreground">{client.tier} · {client.advisor}</p>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{client.aum}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-semibold",
                        client.riskLevel === "High" ? "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20" : "bg-muted text-muted-foreground"
                      )}>
                        {client.riskScore} {client.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {client.trendUp ? (
                        <TrendingUp className="h-4 w-4 text-destructive" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-primary" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground max-w-[250px]">{client.primaryFactor}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{client.lastContact}</td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm" className="text-xs text-primary border-primary/30 hover:bg-primary/5 h-7 px-3">
                        Review <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FiduciaryDashboard;
