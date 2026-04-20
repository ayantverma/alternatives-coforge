import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, Play, Pause, Settings, Download, RefreshCw, CheckCircle, AlertTriangle, Clock,
  Activity, Brain, Database, Shield, GitBranch, Zap, FileText, Bell, TrendingUp, Eye, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface AgentRun {
  id: string;
  startedAt: string;
  duration: string;
  status: "Success" | "Flagged" | "Failed" | "Running";
  itemsProcessed: number;
  exceptions: number;
  confidence: string;
  summary: string;
}

export interface ReasoningStep {
  step: number;
  title: string;
  detail: string;
  status: "complete" | "in-progress" | "pending";
  evidence?: string[];
}

export interface ExceptionItem {
  id: string;
  title: string;
  context: string;
  amount?: string;
  severity: "high" | "medium" | "low";
  recommendation: string;
  age: string;
  assignedTo?: string;
}

export interface DataSource {
  name: string;
  type: string;
  lastSync: string;
  status: "Connected" | "Degraded" | "Offline";
  recordsToday: string;
}

export interface AuditEvent {
  timestamp: string;
  actor: string;
  action: string;
  target: string;
}

export interface AgentDetailConfig {
  name: string;
  category: string;
  description: string;
  status: "Active" | "Processing" | "Idle" | "Paused";
  owner: string;
  version: string;
  lastTrained: string;
  // KPIs
  kpis: { label: string; value: string; sub?: string; trend?: "up" | "down" | "flat" }[];
  // Performance
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    avgLatencyMs: number;
    autoResolveRate: number;
    escalationRate: number;
  };
  // Operations
  schedule: string;
  triggers: string[];
  dataSources: DataSource[];
  // Behavior
  reasoningChain: ReasoningStep[];
  guardrails: string[];
  hitlPolicy: string;
  // History
  recentRuns: AgentRun[];
  openExceptions: ExceptionItem[];
  auditLog: AuditEvent[];
}

interface Props {
  config: AgentDetailConfig;
  onBack: () => void;
  extraTabs?: { id: string; label: string; icon?: ReactNode; content: ReactNode }[];
}

const sevColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20",
  low: "bg-muted text-muted-foreground border-border",
};

const runStatusColors: Record<string, string> = {
  Success: "bg-primary/10 text-primary",
  Flagged: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))]",
  Failed: "bg-destructive/10 text-destructive",
  Running: "bg-muted text-muted-foreground",
};

const sourceStatusColors: Record<string, string> = {
  Connected: "bg-primary/10 text-primary",
  Degraded: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))]",
  Offline: "bg-destructive/10 text-destructive",
};

const AgentDetailView = ({ config, onBack, extraTabs = [] }: Props) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
          </button>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              {config.category} · Agent Control Center
            </p>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display text-foreground">{config.name}</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
                {config.status}
              </Badge>
              <Badge variant="outline" className="text-[10px]">v{config.version}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl">{config.description}</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Owner: <strong className="text-foreground">{config.owner}</strong> · Last trained: <strong className="text-foreground">{config.lastTrained}</strong>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs"><RefreshCw className="h-3 w-3 mr-1.5" /> Run now</Button>
          <Button size="sm" variant="outline" className="h-8 text-xs"><Pause className="h-3 w-3 mr-1.5" /> Pause</Button>
          <Button size="sm" variant="outline" className="h-8 text-xs"><Settings className="h-3 w-3 mr-1.5" /> Configure</Button>
          <Button size="sm" variant="outline" className="h-8 text-xs"><Download className="h-3 w-3 mr-1.5" /> Export</Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {config.kpis.map((k) => (
          <Card key={k.label} className="border border-border">
            <CardContent className="p-4">
              <p className="text-[10px] text-muted-foreground mb-1">{k.label}</p>
              <p className="text-xl font-display text-foreground">{k.value}</p>
              {k.sub && <p className="text-[11px] text-muted-foreground mt-1">{k.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted/50 h-auto p-1 flex-wrap">
          <TabsTrigger value="overview" className="text-xs"><Activity className="h-3 w-3 mr-1.5" /> Overview</TabsTrigger>
          <TabsTrigger value="reasoning" className="text-xs"><Brain className="h-3 w-3 mr-1.5" /> Reasoning Chain</TabsTrigger>
          <TabsTrigger value="exceptions" className="text-xs"><AlertTriangle className="h-3 w-3 mr-1.5" /> Exceptions ({config.openExceptions.length})</TabsTrigger>
          <TabsTrigger value="runs" className="text-xs"><Clock className="h-3 w-3 mr-1.5" /> Run History</TabsTrigger>
          <TabsTrigger value="data" className="text-xs"><Database className="h-3 w-3 mr-1.5" /> Data & Triggers</TabsTrigger>
          <TabsTrigger value="governance" className="text-xs"><Shield className="h-3 w-3 mr-1.5" /> Governance</TabsTrigger>
          {extraTabs.map((t) => (
            <TabsTrigger key={t.id} value={t.id} className="text-xs">{t.icon}{t.label}</TabsTrigger>
          ))}
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border border-border lg:col-span-2">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Performance Metrics</h3>
                  <Badge variant="outline" className="text-[10px]">Trailing 30 days</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Model accuracy", value: config.performance.accuracy },
                    { label: "Precision", value: config.performance.precision },
                    { label: "Recall", value: config.performance.recall },
                    { label: "Auto-resolve rate", value: config.performance.autoResolveRate },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{m.label}</span>
                        <span className="font-semibold text-foreground">{m.value}%</span>
                      </div>
                      <Progress value={m.value} className="h-1.5" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Avg latency</p>
                    <p className="text-lg font-display text-foreground">{config.performance.avgLatencyMs}ms</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Escalation rate</p>
                    <p className="text-lg font-display text-foreground">{config.performance.escalationRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Schedule & Triggers
                </h3>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Schedule</p>
                  <p className="text-sm text-foreground font-mono">{config.schedule}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Event Triggers</p>
                  <ul className="space-y-1.5">
                    {config.triggers.map((t) => (
                      <li key={t} className="text-xs text-foreground flex items-start gap-1.5">
                        <GitBranch className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {config.recentRuns.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className={cn("h-4 w-4", r.status === "Success" ? "text-primary" : r.status === "Flagged" ? "text-[hsl(var(--chart-4))]" : "text-destructive")} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.summary}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{r.startedAt} · {r.duration} · {r.itemsProcessed} items · {r.exceptions} exceptions</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", runStatusColors[r.status])}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REASONING */}
        <TabsContent value="reasoning" className="mt-4">
          <Card className="border border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Agent Reasoning Chain</h3>
                  <p className="text-xs text-muted-foreground">Step-by-step trace of the latest run · Used for audit & HITL review</p>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                  <CheckCircle className="h-3 w-3 mr-1" /> Run #{config.recentRuns[0]?.id}
                </Badge>
              </div>
              <div className="space-y-0">
                {config.reasoningChain.map((s, idx) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold flex-shrink-0",
                        s.status === "complete" ? "bg-primary/10 text-primary" :
                        s.status === "in-progress" ? "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))]" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {s.status === "complete" ? <CheckCircle className="h-4 w-4" /> : s.step}
                      </div>
                      {idx < config.reasoningChain.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                    </div>
                    <div className="flex-1 pb-5">
                      <p className="text-sm font-semibold text-foreground">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.detail}</p>
                      {s.evidence && s.evidence.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {s.evidence.map((e) => (
                            <Badge key={e} variant="outline" className="text-[10px] bg-muted/50">
                              <FileText className="h-2.5 w-2.5 mr-1" /> {e}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXCEPTIONS */}
        <TabsContent value="exceptions" className="mt-4 space-y-3">
          {config.openExceptions.map((ex) => (
            <Card key={ex.id} className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={cn(
                    "h-5 w-5 mt-0.5 flex-shrink-0",
                    ex.severity === "high" ? "text-destructive" : ex.severity === "medium" ? "text-[hsl(var(--chart-4))]" : "text-muted-foreground"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{ex.title}</p>
                      <Badge variant="outline" className={cn("text-[10px]", sevColors[ex.severity])}>{ex.severity}</Badge>
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">Age: {ex.age}</Badge>
                      {ex.amount && <Badge variant="outline" className="text-[10px] font-mono">{ex.amount}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{ex.context}</p>
                    <div className="flex items-start gap-2 p-2.5 rounded-md bg-primary/5 border border-primary/20">
                      <Brain className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-foreground"><strong>Agent recommendation:</strong> {ex.recommendation}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <p className="text-[11px] text-muted-foreground">
                        Assigned to: <strong className="text-foreground">{ex.assignedTo || "Unassigned"}</strong>
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs">Reassign</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs">Reject</Button>
                        <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                          <CheckCircle className="h-3 w-3 mr-1" /> Approve action
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* RUN HISTORY */}
        <TabsContent value="runs" className="mt-4">
          <Card className="border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {["Run ID", "Started", "Duration", "Items", "Exceptions", "Confidence", "Status", ""].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {config.recentRuns.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-b-0">
                      <td className="py-3 px-4 font-mono text-foreground">#{r.id}</td>
                      <td className="py-3 px-4 text-muted-foreground font-mono">{r.startedAt}</td>
                      <td className="py-3 px-4 text-muted-foreground">{r.duration}</td>
                      <td className="py-3 px-4 text-foreground">{r.itemsProcessed}</td>
                      <td className="py-3 px-4 text-foreground">{r.exceptions}</td>
                      <td className="py-3 px-4 text-foreground">{r.confidence}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={cn("text-[10px]", runStatusColors[r.status])}>{r.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" className="h-7 text-xs"><Eye className="h-3 w-3 mr-1" /> Trace</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* DATA & TRIGGERS */}
        <TabsContent value="data" className="mt-4">
          <Card className="border border-border">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Connected Data Sources</h3>
              <div className="space-y-2">
                {config.dataSources.map((d) => (
                  <div key={d.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{d.name}</p>
                        <p className="text-[11px] text-muted-foreground">{d.type} · Last sync {d.lastSync} · {d.recordsToday} records today</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", sourceStatusColors[d.status])}>
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
                      {d.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GOVERNANCE */}
        <TabsContent value="governance" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border border-border">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Guardrails & Policies
                </h3>
                <ul className="space-y-2">
                  {config.guardrails.map((g) => (
                    <li key={g} className="text-xs text-foreground flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-border">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Human-in-the-Loop Policy</p>
                  <p className="text-xs text-foreground leading-relaxed">{config.hitlPolicy}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Audit Log</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {config.auditLog.map((a, i) => (
                    <div key={i} className="text-xs flex items-start gap-2 pb-2 border-b border-border last:border-b-0">
                      <Bell className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-foreground"><strong>{a.actor}</strong> {a.action} <span className="text-muted-foreground">— {a.target}</span></p>
                        <p className="text-[10px] text-muted-foreground font-mono">{a.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {extraTabs.map((t) => (
          <TabsContent key={t.id} value={t.id} className="mt-4">{t.content}</TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AgentDetailView;
