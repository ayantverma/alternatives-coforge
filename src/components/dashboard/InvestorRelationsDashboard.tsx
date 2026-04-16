import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Users, DollarSign, FileText, Mail, Phone, ArrowRight, AlertTriangle, BarChart3, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const statusBadges = [
  { label: "42 Active LPs", color: "bg-primary/10 text-primary border-primary/20" },
  { label: "6 Capital Calls Pending", color: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20" },
  { label: "12 Reports Due", color: "bg-destructive/10 text-destructive border-destructive/20" },
  { label: "3 Investor Meetings Today", color: "bg-accent text-accent-foreground border-border" },
  { label: "$2.1B Total Commitments", color: "bg-primary/10 text-primary border-primary/20" },
];

const kpis = [
  { label: "Total AUM", value: "$3.8B", change: "+8.2%", up: true },
  { label: "Active LPs", value: "42", change: "+3", up: true },
  { label: "Capital Deployed", value: "74%", change: "+6.1pp", up: true },
  { label: "Avg Response Time", value: "2.4 hrs", change: "-1.1h", up: false },
  { label: "Redemption Queue", value: "$18.4M", change: "+$4.2M", up: true },
  { label: "Satisfaction Score", value: "4.7/5", change: "+0.2", up: true },
];

interface InvestorRow {
  name: string;
  type: string;
  commitment: string;
  funded: string;
  pctFunded: number;
  lastComm: string;
  status: "Active" | "Onboarding" | "Redemption";
  nextAction: string;
}

const topInvestors: InvestorRow[] = [
  { name: "CalPERS", type: "Public Pension", commitment: "$250M", funded: "$187.5M", pctFunded: 75, lastComm: "2025-04-10", status: "Active", nextAction: "Q1 Report Due" },
  { name: "Ontario Teachers' Pension", type: "Public Pension", commitment: "$200M", funded: "$160M", pctFunded: 80, lastComm: "2025-04-08", status: "Active", nextAction: "Capital Call Notice" },
  { name: "Wellcome Trust", type: "Endowment", commitment: "$150M", funded: "$112.5M", pctFunded: 75, lastComm: "2025-04-12", status: "Active", nextAction: "Annual Meeting Invite" },
  { name: "Abu Dhabi Investment Authority", type: "Sovereign Wealth", commitment: "$300M", funded: "$210M", pctFunded: 70, lastComm: "2025-03-28", status: "Active", nextAction: "Performance Update" },
  { name: "Harvard Management Co.", type: "Endowment", commitment: "$125M", funded: "$0", pctFunded: 0, lastComm: "2025-04-14", status: "Onboarding", nextAction: "Side Letter Review" },
  { name: "Swiss Re", type: "Insurance", commitment: "$100M", funded: "$92M", pctFunded: 92, lastComm: "2025-04-01", status: "Redemption", nextAction: "Redemption Processing" },
];

interface CapitalActivity {
  type: "call" | "distribution" | "transfer";
  fund: string;
  amount: string;
  date: string;
  status: "Pending" | "Completed" | "Scheduled";
  investors: number;
}

const capitalActivities: CapitalActivity[] = [
  { type: "call", fund: "Growth Equity Fund IV", amount: "$45M", date: "2025-04-18", status: "Pending", investors: 28 },
  { type: "distribution", fund: "Real Estate Fund II", amount: "$32M", date: "2025-04-15", status: "Completed", investors: 18 },
  { type: "call", fund: "Infrastructure Fund III", amount: "$60M", date: "2025-04-22", status: "Scheduled", investors: 35 },
  { type: "distribution", fund: "Buyout Fund VI", amount: "$28M", date: "2025-04-20", status: "Scheduled", investors: 22 },
  { type: "transfer", fund: "Credit Fund I", amount: "$15M", date: "2025-04-16", status: "Pending", investors: 3 },
];

interface CommItem {
  type: "email" | "call" | "meeting";
  investor: string;
  subject: string;
  timeAgo: string;
  priority: "high" | "medium" | "low";
}

const recentComms: CommItem[] = [
  { type: "email", investor: "CalPERS", subject: "Q1 2025 Performance Report — Draft Review", timeAgo: "2h ago", priority: "high" },
  { type: "call", investor: "Ontario Teachers'", subject: "Capital call timing discussion", timeAgo: "4h ago", priority: "high" },
  { type: "meeting", investor: "Harvard Mgmt Co.", subject: "Onboarding kickoff — side letter negotiation", timeAgo: "Yesterday", priority: "medium" },
  { type: "email", investor: "Swiss Re", subject: "Redemption schedule confirmation", timeAgo: "Yesterday", priority: "high" },
  { type: "call", investor: "Wellcome Trust", subject: "Annual meeting logistics", timeAgo: "2 days ago", priority: "low" },
];

const statusColors: Record<string, string> = {
  Active: "bg-primary/10 text-primary",
  Onboarding: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))]",
  Redemption: "bg-destructive/10 text-destructive",
  Pending: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))]",
  Completed: "bg-primary/10 text-primary",
  Scheduled: "bg-muted text-muted-foreground",
};

const typeIcons = {
  call: DollarSign,
  distribution: TrendingUp,
  transfer: ArrowRight,
};

const commIcons = {
  email: Mail,
  call: Phone,
  meeting: Calendar,
};

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20",
  low: "bg-muted text-muted-foreground border-border",
};

const InvestorRelationsDashboard = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Investor Management Platform
        </p>
        <h1 className="text-2xl font-display text-foreground">Investor Relations Dashboard</h1>
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

      {/* Top Investors Table */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Top Investors
        </p>
        <Card className="border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Investor</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Commitment</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Funded</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Last Comm</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Next Action</th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {topInvestors.map((inv) => (
                  <tr key={inv.name} className="border-b border-border last:border-b-0">
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-foreground">{inv.name}</p>
                      <p className="text-muted-foreground">{inv.type}</p>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{inv.commitment}</td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-foreground">{inv.funded}</p>
                      <div className="w-16 h-1.5 bg-muted rounded-full mt-1">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${inv.pctFunded}%` }} />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={cn("text-[10px]", statusColors[inv.status])}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{inv.lastComm}</td>
                    <td className="py-3 px-4 text-muted-foreground">{inv.nextAction}</td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm" className="text-xs text-primary border-primary/30 hover:bg-primary/5 h-7 px-3">
                        View <ArrowRight className="h-3 w-3 ml-1" />
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
        {/* Capital Activity */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Capital Activity Pipeline
          </p>
          <Card className="border border-border">
            <CardContent className="p-4 space-y-3">
              {capitalActivities.map((act, idx) => {
                const Icon = typeIcons[act.type];
                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg",
                        act.type === "call" ? "bg-[hsl(var(--chart-4))]/10" : act.type === "distribution" ? "bg-primary/10" : "bg-muted"
                      )}>
                        <Icon className={cn("h-4 w-4",
                          act.type === "call" ? "text-[hsl(var(--chart-4))]" : act.type === "distribution" ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground capitalize">{act.type === "call" ? "Capital Call" : act.type === "distribution" ? "Distribution" : "Transfer"}</p>
                        <p className="text-xs text-muted-foreground">{act.fund} · {act.investors} investors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{act.amount}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono">{act.date}</span>
                        <Badge variant="outline" className={cn("text-[10px]", statusColors[act.status])}>
                          {act.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Recent Communications */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Recent Communications
          </p>
          <Card className="border border-border">
            <CardContent className="p-4 space-y-3">
              {recentComms.map((comm, idx) => {
                const Icon = commIcons[comm.type];
                return (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-foreground truncate">{comm.subject}</p>
                        <Badge variant="outline" className={cn("text-[10px] flex-shrink-0", priorityColors[comm.priority])}>
                          {comm.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{comm.investor} · {comm.timeAgo}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestorRelationsDashboard;
