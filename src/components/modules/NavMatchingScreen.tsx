import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2, AlertTriangle, XCircle, Sparkles, ArrowLeftRight, Search, Filter,
  Brain, Activity, Link2, Send, Eye, RotateCcw, Download, PlayCircle, Layers,
  TrendingUp, Zap, GitBranch, ChevronRight, Clock, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ======================== Types ======================== */

type TxnCategory = "Deal" | "Fee" | "Tax" | "Refund" | "Distribution" | "Capital Call" | "FX" | "Interest" | "Expense";
type Source = "NT" | "DTCC" | "Custodian" | "Payment Network";
type MatchState = "auto" | "fuzzy" | "unmatched" | "approved" | "review" | "rejected";
type ReasonTag = "Timing" | "FX" | "Reference Mismatch" | "Amount Variance" | "Counterparty Alias" | "Split Payment" | "Missing on NT" | "Missing on Custodian" | "Duplicate Suspect" | "Learned Pattern";

interface Txn {
  id: string;
  source: Source;
  category: TxnCategory;
  date: string;
  ref: string;
  counterparty: string;
  fund: string;
  amount: number;
  currency: string;
  description: string;
}

interface Pair {
  id: string;
  state: MatchState;
  category: TxnCategory;
  nt?: Txn;        // left – NT internal
  ext?: Txn;       // right – Custodian / DTCC / Payment network
  confidence: number;        // 0-100
  neuralScore: number;       // 0-100 (embedding similarity)
  heuristicScore: number;    // 0-100 (rule based)
  reasonTags: ReasonTag[];
  learned: boolean;          // pattern learned from past human dispositions
  learnedFrom?: string;      // e.g. "187 prior approvals"
  delta?: number;            // amount delta NT - EXT
  dateDelta?: number;        // days
}

/* ======================== Mock Data ======================== */

const MOCK: Pair[] = [
  {
    id: "P-9001", state: "auto", category: "Deal", confidence: 99, neuralScore: 99, heuristicScore: 100,
    reasonTags: ["Learned Pattern"], learned: true, learnedFrom: "412 prior approvals", delta: 0, dateDelta: 0,
    nt: { id: "NT-DL-44021", source: "NT", category: "Deal", date: "2025-04-15", ref: "DL-CALL-2025-Q2-014", counterparty: "GE Industrial IV GP", fund: "GE Industrial Fund IV", amount: 12000000, currency: "USD", description: "Capital call settlement" },
    ext: { id: "DTCC-88142", source: "DTCC", category: "Deal", date: "2025-04-15", ref: "CALL-2025-Q2-014", counterparty: "GE INDUSTRIAL IV", fund: "GE Industrial Fund IV", amount: 12000000, currency: "USD", description: "USD wire credit" },
  },
  {
    id: "P-9002", state: "auto", category: "Distribution", confidence: 97, neuralScore: 96, heuristicScore: 99,
    reasonTags: ["Learned Pattern"], learned: true, learnedFrom: "188 prior approvals", delta: 0, dateDelta: 0,
    nt: { id: "NT-DI-30118", source: "NT", category: "Distribution", date: "2025-04-12", ref: "DIST-Q1-APO-CR", counterparty: "Apollo Credit II", fund: "Apollo Credit Fund II", amount: 4500000, currency: "USD", description: "Recallable distribution" },
    ext: { id: "CUST-BNY-77104", source: "Custodian", category: "Distribution", date: "2025-04-12", ref: "APO/DIST/Q1", counterparty: "APOLLO CREDIT II LP", fund: "Apollo Credit Fund II", amount: 4500000, currency: "USD", description: "Distribution credit" },
  },
  {
    id: "P-9003", state: "fuzzy", category: "Fee", confidence: 81, neuralScore: 88, heuristicScore: 74,
    reasonTags: ["Amount Variance", "Reference Mismatch"], learned: false, delta: -124000, dateDelta: 0,
    nt: { id: "NT-FE-50220", source: "NT", category: "Fee", date: "2025-04-30", ref: "MGMT-FEE-APR", counterparty: "BX RE V Manager", fund: "Blackstone RE Fund V", amount: 1374000, currency: "USD", description: "Mgmt fee + catch-up" },
    ext: { id: "CUST-SSC-91204", source: "Custodian", category: "Fee", date: "2025-04-30", ref: "MGMT-APR-2025", counterparty: "BLACKSTONE RE V", fund: "Blackstone RE Fund V", amount: 1250000, currency: "USD", description: "Monthly mgmt fee debit" },
  },
  {
    id: "P-9004", state: "fuzzy", category: "FX", confidence: 76, neuralScore: 79, heuristicScore: 73,
    reasonTags: ["FX", "Timing"], learned: true, learnedFrom: "63 prior approvals (FX gap ≤2bp)", delta: 18420, dateDelta: 1,
    nt: { id: "NT-FX-22910", source: "NT", category: "FX", date: "2025-04-16", ref: "FX-EURUSD-0416", counterparty: "Deutsche Bank", fund: "EU Infra Fund III", amount: 8420000, currency: "USD", description: "EUR→USD conversion" },
    ext: { id: "PAY-SWIFT-66012", source: "Payment Network", category: "FX", date: "2025-04-17", ref: "FX/EURUSD/SETTLE", counterparty: "DEUTSCHE BANK AG", fund: "EU Infra Fund III", amount: 8401580, currency: "USD", description: "Settlement T+1" },
  },
  {
    id: "P-9005", state: "fuzzy", category: "Tax", confidence: 84, neuralScore: 82, heuristicScore: 86,
    reasonTags: ["Counterparty Alias"], learned: true, learnedFrom: "29 prior approvals", delta: 0, dateDelta: 0,
    nt: { id: "NT-TX-11502", source: "NT", category: "Tax", date: "2025-04-10", ref: "WHT-Q1-LUX", counterparty: "LU Tax Authority", fund: "Carlyle PE Fund VII", amount: 87500, currency: "EUR", description: "Withholding tax — LU" },
    ext: { id: "CUST-CITI-44012", source: "Custodian", category: "Tax", date: "2025-04-10", ref: "TAX/WHT/LU/Q1", counterparty: "ACD LUXEMBOURG", fund: "Carlyle PE Fund VII", amount: 87500, currency: "EUR", description: "WHT debit" },
  },
  {
    id: "P-9006", state: "unmatched", category: "Refund", confidence: 0, neuralScore: 41, heuristicScore: 0,
    reasonTags: ["Missing on NT", "Duplicate Suspect"], learned: false,
    ext: { id: "PAY-ACH-30022", source: "Payment Network", category: "Refund", date: "2025-04-14", ref: "REFUND-LEG-002", counterparty: "Skadden Arps LLP", fund: "Apollo Credit Fund II", amount: 22500, currency: "USD", description: "Legal fee refund (overcharge)" },
  },
  {
    id: "P-9007", state: "unmatched", category: "Deal", confidence: 0, neuralScore: 38, heuristicScore: 0,
    reasonTags: ["Missing on Custodian"], learned: false,
    nt: { id: "NT-DL-44188", source: "NT", category: "Deal", date: "2025-04-17", ref: "DL-COINV-VTR-014", counterparty: "Vista Equity Co-Invest", fund: "Vista Co-Invest XII", amount: 6750000, currency: "USD", description: "Co-investment funding" },
  },
  {
    id: "P-9008", state: "review", category: "Distribution", confidence: 68, neuralScore: 71, heuristicScore: 64,
    reasonTags: ["Split Payment", "Amount Variance"], learned: false, delta: 0, dateDelta: 0,
    nt: { id: "NT-DI-30255", source: "NT", category: "Distribution", date: "2025-04-18", ref: "DIST-KKR-SLEEVE-A+B", counterparty: "KKR Asia Fund III", fund: "KKR Asia III", amount: 9100000, currency: "USD", description: "Distribution (sleeves A+B combined)" },
    ext: { id: "DTCC-88301", source: "DTCC", category: "Distribution", date: "2025-04-18", ref: "KKR/DIST/A", counterparty: "KKR ASIA III", fund: "KKR Asia III", amount: 5400000, currency: "USD", description: "Sleeve A only — sleeve B pending" },
  },
  {
    id: "P-9009", state: "auto", category: "Interest", confidence: 96, neuralScore: 95, heuristicScore: 97,
    reasonTags: ["Learned Pattern"], learned: true, learnedFrom: "204 prior approvals", delta: 0, dateDelta: 0,
    nt: { id: "NT-IN-77004", source: "NT", category: "Interest", date: "2025-04-15", ref: "INT-CR-LINE-Q1", counterparty: "JPMC Credit Line", fund: "Cross-fund Bridge", amount: 184320, currency: "USD", description: "Subscription line interest" },
    ext: { id: "CUST-JPM-22018", source: "Custodian", category: "Interest", date: "2025-04-15", ref: "JPM/SUB/INT/Q1", counterparty: "JPMORGAN CHASE", fund: "Cross-fund Bridge", amount: 184320, currency: "USD", description: "Q1 sub-line interest debit" },
  },
  {
    id: "P-9010", state: "fuzzy", category: "Expense", confidence: 72, neuralScore: 80, heuristicScore: 64,
    reasonTags: ["Counterparty Alias", "Reference Mismatch"], learned: false, delta: 0, dateDelta: 2,
    nt: { id: "NT-EX-44502", source: "NT", category: "Expense", date: "2025-04-09", ref: "EXP-AUDIT-PWC-Q1", counterparty: "PwC LLP", fund: "Carlyle PE Fund VII", amount: 145000, currency: "USD", description: "Audit fee Q1" },
    ext: { id: "PAY-WIRE-99820", source: "Payment Network", category: "Expense", date: "2025-04-11", ref: "AUDIT/CARLYLE/Q1", counterparty: "PRICEWATERHOUSECOOPERS", fund: "Carlyle PE Fund VII", amount: 145000, currency: "USD", description: "Wire — audit services" },
  },
  {
    id: "P-9011", state: "auto", category: "Tax", confidence: 98, neuralScore: 98, heuristicScore: 99,
    reasonTags: ["Learned Pattern"], learned: true, learnedFrom: "91 prior approvals", delta: 0, dateDelta: 0,
    nt: { id: "NT-TX-11620", source: "NT", category: "Tax", date: "2025-04-22", ref: "K1-EST-Q1", counterparty: "IRS — Federal", fund: "Carlyle PE Fund VII", amount: 312000, currency: "USD", description: "Estimated tax Q1" },
    ext: { id: "CUST-CITI-44120", source: "Custodian", category: "Tax", date: "2025-04-22", ref: "EFTPS/Q1/EST", counterparty: "US TREASURY", fund: "Carlyle PE Fund VII", amount: 312000, currency: "USD", description: "EFTPS payment" },
  },
  {
    id: "P-9012", state: "review", category: "Capital Call", confidence: 62, neuralScore: 67, heuristicScore: 58,
    reasonTags: ["Timing", "Amount Variance"], learned: false, delta: 50000, dateDelta: 3,
    nt: { id: "NT-CC-50118", source: "NT", category: "Capital Call", date: "2025-04-08", ref: "CALL-Q2-VTR-001", counterparty: "Vista Equity GP", fund: "Vista Co-Invest XII", amount: 5050000, currency: "USD", description: "Capital call Q2 (incl. true-up)" },
    ext: { id: "DTCC-88420", source: "DTCC", category: "Capital Call", date: "2025-04-11", ref: "VTR/CALL/Q2", counterparty: "VISTA EQUITY", fund: "Vista Co-Invest XII", amount: 5000000, currency: "USD", description: "Capital call Q2" },
  },
];

/* ======================== Visual helpers ======================== */

const stateMeta: Record<MatchState, { label: string; chip: string; bar: string; Icon: typeof CheckCircle2 }> = {
  auto:      { label: "Auto-matched", chip: "bg-primary/10 text-primary border-primary/30", bar: "bg-primary", Icon: CheckCircle2 },
  fuzzy:     { label: "Fuzzy match",  chip: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/30", bar: "bg-[hsl(var(--chart-4))]", Icon: Sparkles },
  review:    { label: "Sent for review", chip: "bg-[hsl(var(--chart-2))]/10 text-[hsl(var(--chart-2))] border-[hsl(var(--chart-2))]/30", bar: "bg-[hsl(var(--chart-2))]", Icon: Eye },
  unmatched: { label: "Unmatched", chip: "bg-destructive/10 text-destructive border-destructive/30", bar: "bg-destructive", Icon: XCircle },
  approved:  { label: "Approved",  chip: "bg-primary/15 text-primary border-primary/40", bar: "bg-primary", Icon: CheckCircle2 },
  rejected:  { label: "Rejected",  chip: "bg-muted text-muted-foreground border-border", bar: "bg-muted-foreground", Icon: XCircle },
};

const sourceMeta: Record<Source, { chip: string; label: string }> = {
  NT:                { chip: "bg-primary/10 text-primary border-primary/30", label: "NT" },
  DTCC:              { chip: "bg-[hsl(var(--chart-2))]/10 text-[hsl(var(--chart-2))] border-[hsl(var(--chart-2))]/30", label: "DTCC" },
  Custodian:         { chip: "bg-[hsl(var(--chart-3))]/10 text-[hsl(var(--chart-3))] border-[hsl(var(--chart-3))]/30", label: "Custodian" },
  "Payment Network": { chip: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/30", label: "Pay Net" },
};

const catMeta: Record<TxnCategory, string> = {
  Deal: "bg-muted/60 text-foreground border-border",
  Fee: "bg-muted/60 text-foreground border-border",
  Tax: "bg-muted/60 text-foreground border-border",
  Refund: "bg-muted/60 text-foreground border-border",
  Distribution: "bg-muted/60 text-foreground border-border",
  "Capital Call": "bg-muted/60 text-foreground border-border",
  FX: "bg-muted/60 text-foreground border-border",
  Interest: "bg-muted/60 text-foreground border-border",
  Expense: "bg-muted/60 text-foreground border-border",
};

const fmtMoney = (n: number, c = "USD") => {
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(n);
  const s = v >= 1_000_000 ? `${(v / 1_000_000).toFixed(2)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(1)}k` : v.toString();
  return `${sign}${c === "USD" ? "$" : c === "EUR" ? "€" : ""}${s}`;
};

/* ======================== Side cell ======================== */

const TxnCell = ({ t, side }: { t?: Txn; side: "left" | "right" }) => {
  if (!t) {
    return (
      <div className={cn(
        "h-full min-h-[88px] rounded-md border-2 border-dashed border-border/60 bg-muted/20 flex items-center justify-center text-[11px] text-muted-foreground",
      )}>
        <span className="flex items-center gap-1.5">
          <XCircle className="h-3 w-3" /> No matching record
        </span>
      </div>
    );
  }
  return (
    <div className={cn(
      "h-full rounded-md border bg-card p-2.5 flex flex-col gap-1.5 transition-colors hover:border-primary/40",
      side === "left" ? "border-border" : "border-border",
    )}>
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline" className={cn("text-[9px] font-semibold uppercase tracking-wider", sourceMeta[t.source].chip)}>
          {sourceMeta[t.source].label}
        </Badge>
        <span className="text-[10px] text-muted-foreground font-mono">{t.id}</span>
      </div>
      <p className="text-sm font-semibold text-foreground leading-tight">{t.description}</p>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]">
        <span className="text-muted-foreground">Counterparty</span>
        <span className="text-foreground text-right truncate" title={t.counterparty}>{t.counterparty}</span>
        <span className="text-muted-foreground">Ref</span>
        <span className="text-foreground text-right font-mono truncate" title={t.ref}>{t.ref}</span>
        <span className="text-muted-foreground">Date</span>
        <span className="text-foreground text-right font-mono">{t.date}</span>
        <span className="text-muted-foreground">Amount</span>
        <span className="text-foreground text-right font-mono font-semibold">{fmtMoney(t.amount, t.currency)}</span>
      </div>
    </div>
  );
};

/* ======================== Main ======================== */

const NavMatchingScreen = () => {
  const [pairs, setPairs] = useState<Pair[]>(MOCK);
  const [stateFilter, setStateFilter] = useState<"all" | MatchState>("all");
  const [catFilter, setCatFilter] = useState<"all" | TxnCategory>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | Source>("all");
  const [search, setSearch] = useState("");
  const [showLearnedOnly, setShowLearnedOnly] = useState(false);

  const filtered = useMemo(() => pairs.filter((p) => {
    if (stateFilter !== "all" && p.state !== stateFilter) return false;
    if (catFilter !== "all" && p.category !== catFilter) return false;
    if (sourceFilter !== "all" && p.nt?.source !== sourceFilter && p.ext?.source !== sourceFilter) return false;
    if (showLearnedOnly && !p.learned) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = `${p.id} ${p.nt?.ref ?? ""} ${p.ext?.ref ?? ""} ${p.nt?.counterparty ?? ""} ${p.ext?.counterparty ?? ""} ${p.nt?.fund ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }), [pairs, stateFilter, catFilter, sourceFilter, search, showLearnedOnly]);

  const counts = {
    total: pairs.length,
    auto: pairs.filter((p) => p.state === "auto" || p.state === "approved").length,
    fuzzy: pairs.filter((p) => p.state === "fuzzy").length,
    review: pairs.filter((p) => p.state === "review").length,
    unmatched: pairs.filter((p) => p.state === "unmatched").length,
    learned: pairs.filter((p) => p.learned).length,
  };
  const autoPct = Math.round((counts.auto / counts.total) * 100);

  const setState = (id: string, state: MatchState, msg: string) => {
    setPairs((prev) => prev.map((p) => (p.id === id ? { ...p, state } : p)));
    toast.success(msg);
  };
  const handleApprove = (p: Pair) => setState(p.id, "approved", `${p.id} approved · AI will reinforce this pattern`);
  const handleReview  = (p: Pair) => setState(p.id, "review",   `${p.id} sent for review`);
  const handleReject  = (p: Pair) => setState(p.id, "rejected", `${p.id} rejected · AI will down-weight this rule`);
  const handleSuggestMatch = (p: Pair) => toast.info(`AI proposed 3 candidates for ${p.id}`, { description: "Open candidate panel to confirm" });

  return (
    <div className="space-y-4">
      {/* ============= HEADER ============= */}
      <Card className="border border-border bg-gradient-to-r from-primary/5 via-card to-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Recon Canvas · Multi-dimensional NAV Matching
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <h2 className="text-base font-semibold text-foreground">NT Books ↔ Custodian / DTCC / Payment Network</h2>
                  <Badge variant="outline" className="text-[10px]">Run RUN-2025-04-18-093412</Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 09:34 UTC · {counts.total} txns
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs"><RotateCcw className="h-3 w-3 mr-1" /> Re-run</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs"><Download className="h-3 w-3 mr-1" /> Export</Button>
              <Button size="sm" className="h-8 text-xs"><PlayCircle className="h-3 w-3 mr-1" /> New run</Button>
            </div>
          </div>

          {/* KPI strip with neural / heuristic breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-px mt-4 bg-border rounded-md overflow-hidden">
            <div className="bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Auto-matched</p>
              <p className="text-lg font-semibold text-primary mt-1">{autoPct}%</p>
              <Progress value={autoPct} className="h-1 mt-1.5" />
            </div>
            <div className="bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Fuzzy (AI)</p>
              <p className="text-lg font-semibold text-[hsl(var(--chart-4))] mt-1">{counts.fuzzy}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">need disposition</p>
            </div>
            <div className="bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">In review</p>
              <p className="text-lg font-semibold text-[hsl(var(--chart-2))] mt-1">{counts.review}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">queued to maker</p>
            </div>
            <div className="bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Unmatched</p>
              <p className="text-lg font-semibold text-destructive mt-1">{counts.unmatched}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">manual match</p>
            </div>
            <div className="bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Brain className="h-3 w-3" /> Neural</p>
              <p className="text-lg font-semibold text-foreground mt-1">embed-v4</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">ref+counterparty sim</p>
            </div>
            <div className="bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3" /> Heuristics</p>
              <p className="text-lg font-semibold text-foreground mt-1">{counts.learned} learned</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">from human dispositions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============= FILTER BAR ============= */}
      <Card className="border border-border">
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, ref, counterparty, fund…"
                className="w-full text-xs pl-7 pr-2 py-1.5 rounded-md bg-muted/40 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <Select value={stateFilter} onValueChange={(v) => setStateFilter(v as never)}>
              <SelectTrigger className="h-8 text-xs w-[150px]"><SelectValue placeholder="State" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All states</SelectItem>
                <SelectItem value="auto">Auto-matched</SelectItem>
                <SelectItem value="fuzzy">Fuzzy match</SelectItem>
                <SelectItem value="review">In review</SelectItem>
                <SelectItem value="unmatched">Unmatched</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={catFilter} onValueChange={(v) => setCatFilter(v as never)}>
              <SelectTrigger className="h-8 text-xs w-[140px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {(["Deal","Capital Call","Distribution","Fee","Tax","Refund","FX","Interest","Expense"] as TxnCategory[]).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as never)}>
              <SelectTrigger className="h-8 text-xs w-[150px]"><SelectValue placeholder="External source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="DTCC">DTCC</SelectItem>
                <SelectItem value="Custodian">Custodian</SelectItem>
                <SelectItem value="Payment Network">Payment Network</SelectItem>
                <SelectItem value="NT">NT only</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showLearnedOnly ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowLearnedOnly((v) => !v)}
            >
              <Brain className="h-3 w-3 mr-1" /> Learned only
            </Button>
            <span className="ml-auto text-[11px] text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {counts.total}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ============= CANVAS HEADER ROW ============= */}
      <div className="grid grid-cols-12 gap-3 px-1">
        <div className="col-span-12 lg:col-span-5">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-[10px] font-semibold", sourceMeta.NT.chip)}>NT — Internal Books</Badge>
            <span className="text-[11px] text-muted-foreground">Source of record (PA / GL)</span>
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-2 text-center">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">AI match · disposition</span>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="flex items-center gap-2 lg:justify-end">
            <span className="text-[11px] text-muted-foreground">External truth</span>
            <Badge variant="outline" className={cn("text-[10px] font-semibold", sourceMeta.DTCC.chip)}>DTCC</Badge>
            <Badge variant="outline" className={cn("text-[10px] font-semibold", sourceMeta.Custodian.chip)}>Custodian</Badge>
            <Badge variant="outline" className={cn("text-[10px] font-semibold", sourceMeta["Payment Network"].chip)}>Payment Net</Badge>
          </div>
        </div>
      </div>

      {/* ============= CANVAS ROWS ============= */}
      <div className="space-y-2.5">
        {filtered.map((p) => {
          const StateIcon = stateMeta[p.state].Icon;
          return (
            <Card key={p.id} className="border border-border overflow-hidden">
              {/* color rail */}
              <div className={cn("h-0.5 w-full", stateMeta[p.state].bar)} />
              <CardContent className="p-3">
                <div className="grid grid-cols-12 gap-3 items-stretch">
                  {/* LEFT — NT */}
                  <div className="col-span-12 lg:col-span-5">
                    <TxnCell t={p.nt} side="left" />
                  </div>

                  {/* CENTER — AI matching + disposition */}
                  <div className="col-span-12 lg:col-span-2 flex flex-col items-center justify-between gap-2 py-1">
                    <div className="w-full text-center">
                      <Badge variant="outline" className={cn("text-[10px]", stateMeta[p.state].chip)}>
                        <StateIcon className="h-3 w-3 mr-1" /> {stateMeta[p.state].label}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] mt-1 ml-1">{p.category}</Badge>
                    </div>

                    {/* confidence dial (compact) */}
                    <div className="w-full">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
                        <span>Confidence</span>
                        <span className={cn("font-semibold", p.confidence >= 95 ? "text-primary" : p.confidence >= 70 ? "text-[hsl(var(--chart-4))]" : "text-destructive")}>
                          {p.confidence}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className={cn("h-full transition-all", stateMeta[p.state].bar)} style={{ width: `${p.confidence}%` }} />
                      </div>

                      {/* neural / heuristic split */}
                      <div className="grid grid-cols-2 gap-1 mt-1.5">
                        <div className="rounded bg-muted/40 px-1.5 py-1">
                          <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                            <span className="flex items-center gap-0.5"><Brain className="h-2.5 w-2.5" /> Neural</span>
                            <span className="font-semibold text-foreground">{p.neuralScore}</span>
                          </div>
                        </div>
                        <div className="rounded bg-muted/40 px-1.5 py-1">
                          <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                            <span className="flex items-center gap-0.5"><Activity className="h-2.5 w-2.5" /> Heur</span>
                            <span className="font-semibold text-foreground">{p.heuristicScore}</span>
                          </div>
                        </div>
                      </div>

                      {/* learned chip */}
                      {p.learned && (
                        <div className="mt-1.5 flex items-center gap-1 rounded bg-primary/5 border border-primary/20 px-1.5 py-1">
                          <Zap className="h-2.5 w-2.5 text-primary" />
                          <span className="text-[9px] text-primary font-medium leading-tight">
                            Learned · {p.learnedFrom}
                          </span>
                        </div>
                      )}

                      {/* delta indicators */}
                      {(p.delta || p.dateDelta) ? (
                        <div className="mt-1.5 grid grid-cols-2 gap-1 text-[9px]">
                          {p.delta !== undefined && p.delta !== 0 && (
                            <div className="rounded bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] px-1.5 py-0.5 text-center font-mono">
                              Δ{fmtMoney(p.delta)}
                            </div>
                          )}
                          {p.dateDelta !== undefined && p.dateDelta !== 0 && (
                            <div className="rounded bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] px-1.5 py-0.5 text-center font-mono">
                              {p.dateDelta > 0 ? `+${p.dateDelta}d` : `${p.dateDelta}d`}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>

                    {/* arrow visual */}
                    <div className="hidden lg:flex items-center text-muted-foreground">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>

                  {/* RIGHT — External */}
                  <div className="col-span-12 lg:col-span-5">
                    <TxnCell t={p.ext} side="right" />
                  </div>
                </div>

                {/* AI reasoning + actions row */}
                <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> AI reasoning
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {p.reasonTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                    ))}
                    {p.reasonTags.length === 0 && (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">All dimensions exact</Badge>
                    )}
                  </div>

                  <span className="text-[10px] text-muted-foreground ml-2 hidden md:inline">·</span>
                  <span className="text-[10px] text-muted-foreground hidden md:inline font-mono">{p.id}</span>

                  <div className="ml-auto flex items-center gap-1.5">
                    {p.state === "unmatched" ? (
                      <>
                        <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => handleSuggestMatch(p)}>
                          <Link2 className="h-3 w-3 mr-1" /> Find match
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => handleReview(p)}>
                          <Send className="h-3 w-3 mr-1" /> Send for review
                        </Button>
                      </>
                    ) : p.state === "approved" || p.state === "rejected" ? (
                      <Badge variant="outline" className={cn("text-[10px]", stateMeta[p.state].chip)}>
                        <StateIcon className="h-3 w-3 mr-1" /> {stateMeta[p.state].label}
                      </Badge>
                    ) : (
                      <>
                        <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => handleReject(p)}>
                          <XCircle className="h-3 w-3 mr-1" /> Reject
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => handleReview(p)}>
                          <Eye className="h-3 w-3 mr-1" /> Send for review
                        </Button>
                        <Button size="sm" className="h-7 text-[11px]" onClick={() => handleApprove(p)}>
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <Card className="border-dashed border-border">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No transactions match the current filters.
            </CardContent>
          </Card>
        )}
      </div>

      {/* ============= LEARNING FOOTER ============= */}
      <Card className="border border-border bg-gradient-to-r from-primary/5 to-card">
        <CardContent className="p-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <Brain className="h-3.5 w-3.5 text-primary" />
          <span className="text-foreground font-medium">Continuous learning loop active.</span>
          <span>Every approval reinforces neural similarity weights; every reject down-weights matching heuristics.</span>
          <span className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" /> model: recon-v4.2.1</span>
            <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-primary" /> auto-rate +6.2% MoM</span>
            <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> 14,820 dispositions ingested</span>
          </span>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavMatchingScreen;
