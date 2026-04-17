import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowRight, AlertTriangle, BarChart3, Target, Activity, Layers, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentCard {
  name: string;
  description: string;
  status: "Active" | "Processing" | "Idle";
  todayCount: number;
  confidence: string;
  lastRun: string;
}

const agents: AgentCard[] = [
  { name: "Deal Screening Agent", description: "Auto-screens deal flow against IC criteria, prioritizes opportunities, and drafts initial memos.", status: "Active", todayCount: 6, confidence: "90%", lastRun: "22 min ago" },
  { name: "Portfolio Risk Monitor", description: "Continuously monitors concentration, leverage, and covenant breaches across all positions.", status: "Active", todayCount: 4, confidence: "93%", lastRun: "8 min ago" },
  { name: "Valuation Analyst", description: "Cross-checks portfolio mark-to-market estimates with comparable transactions and market data.", status: "Processing", todayCount: 2, confidence: "86%", lastRun: "Now" },
  { name: "Financial Model Validator", description: "Validates financial modeling assumptions and stress-tests projections against historical data.", status: "Active", todayCount: 3, confidence: "91%", lastRun: "1 hr ago" },
];

const agentStatusColors: Record<string, string> = {
  Active: "bg-primary/10 text-primary",
  Processing: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))]",
  Idle: "bg-muted text-muted-foreground",
};

const statusBadges = [
  { label: "4 Agents Active", color: "bg-primary/10 text-primary border-primary/20" },
  { label: "14 Active Positions", color: "bg-primary/10 text-primary border-primary/20" },
  { label: "3 Deals in Pipeline", color: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20" },
  { label: "2 Concentration Alerts", color: "bg-destructive/10 text-destructive border-destructive/20" },
  { label: "$1.2B Deployed Capital", color: "bg-accent text-accent-foreground border-border" },
  { label: "18.4% Net IRR", color: "bg-primary/10 text-primary border-primary/20" },
];

const kpis = [
  { label: "Fund NAV", value: "$2.4B", change: "+12.3%", up: true },
  { label: "Net IRR", value: "18.4%", change: "+2.1pp", up: true },
  { label: "TVPI", value: "1.62x", change: "+0.08x", up: true },
  { label: "DPI", value: "0.41x", change: "+0.05x", up: true },
  { label: "Dry Powder", value: "$680M", change: "-$120M", up: false },
  { label: "Unrealized Gain", value: "$412M", change: "+$68M", up: true },
];

interface PortfolioHolding {
  company: string;
  sector: string;
  invested: string;
  currentValue: string;
  moic: string;
  irr: string;
  status: "Performing" | "Watch" | "Underperforming";
  holdPeriod: string;
}

const holdings: PortfolioHolding[] = [
  { company: "Meridian Health Systems", sector: "Healthcare", invested: "$85M", currentValue: "$156M", moic: "1.84x", irr: "22.1%", status: "Performing", holdPeriod: "3.2 yrs" },
  { company: "NovaTech Solutions", sector: "Enterprise SaaS", invested: "$120M", currentValue: "$204M", moic: "1.70x", irr: "19.8%", status: "Performing", holdPeriod: "2.8 yrs" },
  { company: "Atlas Logistics", sector: "Supply Chain", invested: "$65M", currentValue: "$91M", moic: "1.40x", irr: "14.2%", status: "Performing", holdPeriod: "2.1 yrs" },
  { company: "GreenGrid Energy", sector: "Renewables", invested: "$95M", currentValue: "$108M", moic: "1.14x", irr: "8.6%", status: "Watch", holdPeriod: "1.5 yrs" },
  { company: "Pinnacle Retail Group", sector: "Consumer", invested: "$70M", currentValue: "$58M", moic: "0.83x", irr: "-6.4%", status: "Underperforming", holdPeriod: "2.9 yrs" },
  { company: "CloudBridge AI", sector: "AI/ML", invested: "$50M", currentValue: "$112M", moic: "2.24x", irr: "34.5%", status: "Performing", holdPeriod: "1.8 yrs" },
];

interface DealPipeline {
  company: string;
  sector: string;
  stage: "Screening" | "Due Diligence" | "IC Review" | "Term Sheet";
  dealSize: string;
  expectedClose: string;
  lead: string;
}

const dealPipeline: DealPipeline[] = [
  { company: "QuantumLeap Biotech", sector: "Life Sciences", stage: "IC Review", dealSize: "$110M", expectedClose: "Q2 2025", lead: "David Park" },
  { company: "Urban Mobility Corp", sector: "Transportation", stage: "Due Diligence", dealSize: "$75M", expectedClose: "Q3 2025", lead: "Maria Santos" },
  { company: "CyberVault Security", sector: "Cybersecurity", stage: "Screening", dealSize: "$60M", expectedClose: "Q3 2025", lead: "James Liu" },
];

interface RiskAlert {
  type: string;
  description: string;
  severity: "high" | "medium" | "low";
  portfolio: string;
  metric: string;
}

const riskAlerts: RiskAlert[] = [
  { type: "Concentration", description: "Healthcare sector exceeds 28% of portfolio (limit: 25%)", severity: "high", portfolio: "Growth Equity IV", metric: "28.3% vs 25% limit" },
  { type: "Leverage", description: "Atlas Logistics debt/EBITDA approaching covenant threshold", severity: "high", portfolio: "Growth Equity IV", metric: "5.8x vs 6.0x covenant" },
  { type: "Valuation", description: "GreenGrid Energy quarterly mark-down expected", severity: "medium", portfolio: "Growth Equity IV", metric: "-12% projected" },
  { type: "Liquidity", description: "Dry powder below 25% threshold for follow-on reserves", severity: "medium", portfolio: "Growth Equity IV", metric: "22.4% remaining" },
];

const statusColors: Record<string, string> = {
  Performing: "bg-primary/10 text-primary",
  Watch: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))]",
  Underperforming: "bg-destructive/10 text-destructive",
  Screening: "bg-muted text-muted-foreground",
  "Due Diligence": "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))]",
  "IC Review": "bg-primary/10 text-primary",
  "Term Sheet": "bg-primary/10 text-primary",
};

const severityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20",
  low: "bg-muted text-muted-foreground border-border",
};

const PortfolioManagerDashboard = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Investment Management Platform
        </p>
        <h1 className="text-2xl font-display text-foreground">Portfolio Manager Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {agents.map((agent) => (
            <Card key={agent.name} className="border border-border">
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
                  <div className="flex gap-3">
                    <span><strong className="text-foreground">{agent.todayCount}</strong> today</span>
                    <span><strong className="text-foreground">{agent.confidence}</strong></span>
                  </div>
                  <span><strong className="text-foreground">{agent.lastRun}</strong></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Portfolio Holdings */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Portfolio Holdings
        </p>
        <Card className="border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Company</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Invested</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Current Value</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">MOIC</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">IRR</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Hold Period</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.company} className="border-b border-border last:border-b-0">
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-foreground">{h.company}</p>
                      <p className="text-muted-foreground">{h.sector}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">{h.invested}</td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{h.currentValue}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-foreground">{h.moic}</td>
                    <td className="py-3 px-4">
                      <span className={cn("text-sm font-semibold", parseFloat(h.irr) >= 0 ? "text-primary" : "text-destructive")}>{h.irr}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={cn("text-[10px]", statusColors[h.status])}>
                        {h.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{h.holdPeriod}</td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm" className="text-xs text-primary border-primary/30 hover:bg-primary/5 h-7 px-3">
                        Detail <ArrowRight className="h-3 w-3 ml-1" />
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
        {/* Deal Pipeline */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Deal Pipeline
          </p>
          <Card className="border border-border">
            <CardContent className="p-4 space-y-3">
              {dealPipeline.map((deal, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{deal.company}</p>
                      <p className="text-xs text-muted-foreground">{deal.sector} · {deal.lead}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{deal.dealSize}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-[10px]", statusColors[deal.stage])}>
                        {deal.stage}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{deal.expectedClose}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Risk Alerts */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Risk & Compliance Alerts
          </p>
          <Card className="border border-border">
            <CardContent className="p-4 space-y-3">
              {riskAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <AlertTriangle className={cn("h-4 w-4 mt-0.5 flex-shrink-0",
                    alert.severity === "high" ? "text-destructive" : "text-[hsl(var(--chart-4))]"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-foreground">{alert.type}</p>
                      <Badge variant="outline" className={cn("text-[10px]", severityColors[alert.severity])}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                    <p className="text-xs text-foreground mt-1 font-mono">{alert.metric}</p>
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

export default PortfolioManagerDashboard;
