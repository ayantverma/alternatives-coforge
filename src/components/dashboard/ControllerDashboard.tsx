import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowRight, AlertTriangle, CheckCircle, Clock, FileText, DollarSign, Receipt, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AgentDetailView from "@/components/modules/AgentDetailView";
import { navReconAgent } from "@/data/agentDetails";

interface AgentCard {
  name: string;
  description: string;
  status: "Active" | "Processing" | "Idle";
  todayCount: number;
  confidence: string;
  lastRun: string;
}

const agents: AgentCard[] = [
  { name: "NAV Reconciliation Agent", description: "Auto-reconciles NAVs across administrators and custodians, flags variances above threshold.", status: "Active", todayCount: 4, confidence: "96%", lastRun: "14 min ago" },
  { name: "Cash Flow Forecaster", description: "Projects fund-level cash positions, anticipates capital call funding gaps and liquidity needs.", status: "Active", todayCount: 2, confidence: "89%", lastRun: "55 min ago" },
];

const agentStatusColors: Record<string, string> = {
  Active: "bg-primary/10 text-primary",
  Processing: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))]",
  Idle: "bg-muted text-muted-foreground",
};

const statusBadges = [
  { label: "2 Agents Active", color: "bg-primary/10 text-primary border-primary/20" },
  { label: "7 Funds in Accounting", color: "bg-primary/10 text-primary border-primary/20" },
  { label: "12 NAVs Pending", color: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20" },
  { label: "4 Reconciliation Breaks", color: "bg-destructive/10 text-destructive border-destructive/20" },
  { label: "98.2% Straight-Through Rate", color: "bg-accent text-accent-foreground border-border" },
  { label: "$4.6B Assets Under Admin", color: "bg-primary/10 text-primary border-primary/20" },
];

const kpis = [
  { label: "Assets Under Admin", value: "$4.6B", change: "+3.8%", up: true },
  { label: "NAVs Completed", value: "38/50", change: "76%", up: true },
  { label: "Recon Breaks", value: "4", change: "-2", up: false },
  { label: "Cash Balance", value: "$312M", change: "+$18M", up: true },
  { label: "STP Rate", value: "98.2%", change: "+0.4pp", up: true },
  { label: "Pending Wires", value: "$24.8M", change: "6 items", up: true },
];

interface FundAccounting {
  fund: string;
  type: string;
  nav: string;
  navDate: string;
  status: "Final" | "Preliminary" | "Pending" | "Under Review";
  variance: string;
  administrator: string;
}

const fundAccounting: FundAccounting[] = [
  { fund: "Growth Equity Fund IV", type: "PE", nav: "$1,024M", navDate: "2025-03-31", status: "Final", variance: "0.02%", administrator: "NT PCA" },
  { fund: "Real Estate Fund II", type: "RE", nav: "$687M", navDate: "2025-03-31", status: "Final", variance: "0.01%", administrator: "Alter Domus" },
  { fund: "Infrastructure Fund III", type: "Infra", nav: "$892M", navDate: "2025-03-31", status: "Preliminary", variance: "0.18%", administrator: "BNY" },
  { fund: "Credit Fund I", type: "Credit", nav: "$456M", navDate: "2025-03-31", status: "Under Review", variance: "0.42%", administrator: "NT PCA" },
  { fund: "Buyout Fund VI", type: "PE", nav: "$1,241M", navDate: "2025-03-31", status: "Pending", variance: "—", administrator: "Alter Domus" },
  { fund: "Venture Fund II", type: "VC", nav: "$298M", navDate: "2025-03-31", status: "Pending", variance: "—", administrator: "BNY" },
];

interface ReconBreak {
  account: string;
  fund: string;
  custodian: string;
  type: string;
  amount: string;
  age: string;
  severity: "high" | "medium" | "low";
}

const reconBreaks: ReconBreak[] = [
  { account: "Cash - USD", fund: "Credit Fund I", custodian: "BNY", type: "Cash", amount: "$1.2M", age: "3 days", severity: "high" },
  { account: "Position - Bond Holdings", fund: "Credit Fund I", custodian: "BNY", type: "Position", amount: "$4.8M", age: "2 days", severity: "high" },
  { account: "Cash - EUR", fund: "Infra Fund III", custodian: "NT", type: "FX", amount: "€340K", age: "1 day", severity: "medium" },
  { account: "Accrued Interest", fund: "Credit Fund I", custodian: "BNY", type: "Interest", amount: "$89K", age: "5 days", severity: "low" },
];

interface CashFlow {
  type: "inflow" | "outflow";
  description: string;
  fund: string;
  amount: string;
  date: string;
  status: "Approved" | "Pending Approval" | "Scheduled" | "Completed";
}

const cashFlows: CashFlow[] = [
  { type: "inflow", description: "Capital Call - Growth Equity IV", fund: "Growth Equity IV", amount: "$45M", date: "2025-04-18", status: "Approved" },
  { type: "outflow", description: "Distribution - Real Estate II", fund: "Real Estate II", amount: "$32M", date: "2025-04-20", status: "Pending Approval" },
  { type: "outflow", description: "Management Fee Payment", fund: "All Funds", amount: "$8.4M", date: "2025-04-15", status: "Completed" },
  { type: "inflow", description: "Capital Call - Infra Fund III", fund: "Infra Fund III", amount: "$60M", date: "2025-04-22", status: "Scheduled" },
  { type: "outflow", description: "Wire - Margin Call", fund: "Credit Fund I", amount: "$12M", date: "2025-04-16", status: "Pending Approval" },
];

const statusColors: Record<string, string> = {
  Final: "bg-primary/10 text-primary",
  Preliminary: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))]",
  Pending: "bg-muted text-muted-foreground",
  "Under Review": "bg-destructive/10 text-destructive",
  Approved: "bg-primary/10 text-primary",
  "Pending Approval": "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))]",
  Scheduled: "bg-muted text-muted-foreground",
  Completed: "bg-primary/10 text-primary",
};

const severityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20",
  low: "bg-muted text-muted-foreground border-border",
};

const ControllerDashboard = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  if (selectedAgent === "NAV Reconciliation Agent") {
    return <AgentDetailView config={navReconAgent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Finance & Operations Platform
        </p>
        <h1 className="text-2xl font-display text-foreground">Controller Dashboard</h1>
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

      {/* Active Agents */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Active Agents
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {agents.map((agent) => (
            <Card
              key={agent.name}
              className={cn(
                "border border-border transition-all",
                agent.name === "NAV Reconciliation Agent" && "cursor-pointer hover:border-primary/50 hover:shadow-md"
              )}
              onClick={() => agent.name === "NAV Reconciliation Agent" && setSelectedAgent(agent.name)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-foreground leading-tight">{agent.name}</h3>
                  <Badge variant="outline" className={cn("text-[10px] ml-2 flex-shrink-0", agentStatusColors[agent.status])}>
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

      {/* Fund Accounting / NAV Status */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Fund Accounting — NAV Status
        </p>
        <Card className="border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Fund</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">NAV</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">As Of</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Variance</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Administrator</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {fundAccounting.map((f) => (
                  <tr key={f.fund} className="border-b border-border last:border-b-0">
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-foreground">{f.fund}</p>
                      <p className="text-muted-foreground">{f.type}</p>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{f.nav}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{f.navDate}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={cn("text-[10px]", statusColors[f.status])}>
                        {f.status === "Final" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {f.status === "Pending" && <Clock className="h-3 w-3 mr-1" />}
                        {f.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn("text-sm",
                        f.variance === "—" ? "text-muted-foreground" :
                          parseFloat(f.variance) > 0.1 ? "text-destructive font-semibold" : "text-primary"
                      )}>{f.variance}</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{f.administrator}</td>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reconciliation Breaks */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Reconciliation Breaks
          </p>
          <Card className="border border-border">
            <CardContent className="p-4 space-y-3">
              {reconBreaks.map((brk, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <AlertTriangle className={cn("h-4 w-4 mt-0.5 flex-shrink-0",
                    brk.severity === "high" ? "text-destructive" : brk.severity === "medium" ? "text-[hsl(var(--chart-4))]" : "text-muted-foreground"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-foreground">{brk.account}</p>
                      <Badge variant="outline" className={cn("text-[10px]", severityColors[brk.severity])}>
                        {brk.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{brk.fund} · {brk.custodian} · {brk.type}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-semibold text-foreground">{brk.amount}</span>
                      <span className="text-xs text-muted-foreground">Age: {brk.age}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Cash Flow Activity */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Cash Flow Activity
          </p>
          <Card className="border border-border">
            <CardContent className="p-4 space-y-3">
              {cashFlows.map((cf, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg",
                      cf.type === "inflow" ? "bg-primary/10" : "bg-destructive/10"
                    )}>
                      {cf.type === "inflow" ? (
                        <TrendingUp className="h-4 w-4 text-primary" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{cf.description}</p>
                      <p className="text-xs text-muted-foreground">{cf.fund} · {cf.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-semibold", cf.type === "inflow" ? "text-primary" : "text-destructive")}>
                      {cf.type === "inflow" ? "+" : "-"}{cf.amount}
                    </p>
                    <Badge variant="outline" className={cn("text-[10px]", statusColors[cf.status])}>
                      {cf.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ControllerDashboard;
