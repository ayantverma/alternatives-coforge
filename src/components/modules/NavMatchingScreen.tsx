import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2, AlertTriangle, XCircle, FileText, Sparkles, ArrowLeftRight,
  Clock, Shield, History, MessageSquare, DollarSign, Filter, Search,
  PlayCircle, RotateCcw, Download, ChevronRight, Layers, Edit3, Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ======================== Types & Mock Data ======================== */

type MatchStatus = "auto" | "review" | "unmatched" | "approved" | "edited";
type Materiality = "material" | "timing" | "non-material";
type ReconType = "Cash" | "Transactions" | "Valuation" | "Accruals";
type RootCause = "Timing" | "Valuation Variance" | "Missing Document" | "Mapping" | "FX Difference" | "Fee Calc";

interface MatchItem {
  id: string;
  status: MatchStatus;
  materiality: Materiality;
  confidence: number;
  reconType: ReconType;
  rootCause: RootCause;
  navImpactValue: number;
  fund: string;
  ageHrs: number;
  source: {
    system: string;
    docType: string;
    txnType: string;
    amount: string;
    currency: string;
    effectiveDate: string;
    investmentId: string;
    evidence: string;
    reliability: "GP Final" | "GP Estimate" | "Bank Confirmed" | "Broker";
  };
  target: {
    txnId: string;
    account: string;
    amount: string;
    currency: string;
    postingDate: string;
  };
  matchLogic: { rule: string; pass: "exact" | "tolerance" | "variance" | "fail" }[];
  recommendation: string;
  candidates?: { id: string; description: string; amount: string; date: string; similarity: number }[];
}

const MOCK_ITEMS: MatchItem[] = [
  {
    id: "M-1042",
    status: "review",
    materiality: "material",
    confidence: 78,
    reconType: "Valuation",
    rootCause: "Valuation Variance",
    navImpactValue: 1820000,
    fund: "Carlyle PE Fund VII",
    ageHrs: 4,
    source: {
      system: "GP Capital Statement — Q1 2025",
      docType: "PDF · Carlyle PE Fund VII",
      txnType: "Quarterly Valuation Mark",
      amount: "$48,420,000",
      currency: "USD",
      effectiveDate: "2025-03-31",
      investmentId: "INV-CAR-VII-0042",
      evidence: "Page 4, Schedule of Investments — NAV as of 31-Mar-2025",
      reliability: "GP Estimate",
    },
    target: {
      txnId: "GL-2025-04-018",
      account: "1450 · L3 Investments at Fair Value",
      amount: "$46,600,000",
      currency: "USD",
      postingDate: "2025-03-31",
    },
    matchLogic: [
      { rule: "Entity & investment mapping", pass: "exact" },
      { rule: "Currency match (USD)", pass: "exact" },
      { rule: "Effective date (Q1 close)", pass: "exact" },
      { rule: "Amount (4.0% variance)", pass: "variance" },
      { rule: "Historical pattern (last 4 qtrs)", pass: "tolerance" },
    ],
    recommendation:
      "Confidence below 95% auto-clear threshold. Variance of $1.82M (3.9%) consistent with Level-3 mark timing. GP final reporting expected 2025-04-22. Recommend hold for final mark or post as estimate.",
  },
  {
    id: "M-1043",
    status: "auto",
    materiality: "non-material",
    confidence: 98,
    reconType: "Cash",
    rootCause: "Timing",
    navImpactValue: 0,
    fund: "GE Industrial Fund IV",
    ageHrs: 1,
    source: {
      system: "BNY Cash Movement Feed",
      docType: "SWIFT MT940",
      txnType: "Capital Call Receipt",
      amount: "$12,000,000",
      currency: "USD",
      effectiveDate: "2025-04-15",
      investmentId: "FUND-GE-IV",
      evidence: "MT940 line 61 · credit USD 12,000,000.00 ref CALL-2025-Q2-014",
      reliability: "Bank Confirmed",
    },
    target: {
      txnId: "PA-2025-04-115",
      account: "1010 · Cash — Operating USD",
      amount: "$12,000,000",
      currency: "USD",
      postingDate: "2025-04-15",
    },
    matchLogic: [
      { rule: "Amount + currency exact", pass: "exact" },
      { rule: "Date within tolerance (0d)", pass: "exact" },
      { rule: "Reference (CALL-2025-Q2-014)", pass: "exact" },
      { rule: "Counterparty mapping", pass: "exact" },
    ],
    recommendation: "All dimensions exact. Within auto-clear policy (>95%). Pending controller approval to post.",
  },
  {
    id: "M-1044",
    status: "unmatched",
    materiality: "material",
    confidence: 0,
    reconType: "Transactions",
    rootCause: "Missing Document",
    navImpactValue: 4500000,
    fund: "Apollo Credit Fund II",
    ageHrs: 26,
    source: {
      system: "Apollo Credit — GP Notice",
      docType: "Email + PDF",
      txnType: "Distribution — Recallable",
      amount: "$4,500,000",
      currency: "USD",
      effectiveDate: "2025-04-12",
      investmentId: "INV-APO-CR-II-0017",
      evidence: "Distribution notice §2 — Recallable per LPA §8.4(b)",
      reliability: "GP Final",
    },
    target: {
      txnId: "—",
      account: "—",
      amount: "—",
      currency: "—",
      postingDate: "—",
    },
    matchLogic: [
      { rule: "No matching internal txn found", pass: "fail" },
      { rule: "Closest candidate 92% similarity", pass: "tolerance" },
    ],
    recommendation:
      "No internal booking found. 3 candidates available based on amount, date proximity & counterparty. Likely missing booking due to recallable distribution treatment.",
    candidates: [
      { id: "PA-2025-04-098", description: "Distribution — Apollo Credit II", amount: "$4,500,000", date: "2025-04-12", similarity: 92 },
      { id: "PA-2025-04-101", description: "Capital Return — Apollo CR", amount: "$4,495,000", date: "2025-04-13", similarity: 84 },
      { id: "PA-2025-04-088", description: "Apollo Distribution Q1", amount: "$4,500,000", date: "2025-04-09", similarity: 71 },
    ],
  },
  {
    id: "M-1045",
    status: "review",
    materiality: "timing",
    confidence: 88,
    reconType: "Accruals",
    rootCause: "Fee Calc",
    navImpactValue: 124000,
    fund: "Blackstone RE Fund V",
    ageHrs: 8,
    source: {
      system: "Admin Accrual Schedule",
      docType: "CSV · SS&C",
      txnType: "Mgmt Fee Accrual — April",
      amount: "$1,250,000",
      currency: "USD",
      effectiveDate: "2025-04-30",
      investmentId: "FUND-BX-RE-V",
      evidence: "Fee schedule row 14 · 1.5% on $1.0B NAV / 12",
      reliability: "GP Final",
    },
    target: {
      txnId: "GL-2025-04-201",
      account: "5210 · Mgmt Fee Expense",
      amount: "$1,374,000",
      currency: "USD",
      postingDate: "2025-04-30",
    },
    matchLogic: [
      { rule: "Investment mapping", pass: "exact" },
      { rule: "Period (April 2025)", pass: "exact" },
      { rule: "Amount variance ($124k / 9.0%)", pass: "variance" },
      { rule: "Rate vs LPA schedule", pass: "tolerance" },
    ],
    recommendation:
      "Internal accrual exceeds GP schedule by $124k. Likely catch-up accrual from prior period adjustment. Suggest split into base + catch-up entries.",
  },
];

/* ======================== UI helpers ======================== */

const statusMeta: Record<MatchStatus, { label: string; chip: string; dot: string; Icon: typeof CheckCircle2 }> = {
  auto: { label: "Auto-matched", chip: "bg-primary/10 text-primary border-primary/20", dot: "bg-primary", Icon: CheckCircle2 },
  review: { label: "Needs review", chip: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20", dot: "bg-[hsl(var(--chart-4))]", Icon: AlertTriangle },
  unmatched: { label: "Unmatched", chip: "bg-destructive/10 text-destructive border-destructive/20", dot: "bg-destructive", Icon: XCircle },
  approved: { label: "Approved", chip: "bg-primary/10 text-primary border-primary/20", dot: "bg-primary", Icon: CheckCircle2 },
  edited: { label: "Edited & approved", chip: "bg-primary/10 text-primary border-primary/20", dot: "bg-primary", Icon: Edit3 },
};

const matMeta: Record<Materiality, { label: string; chip: string }> = {
  material: { label: "Material", chip: "bg-destructive/10 text-destructive border-destructive/20" },
  timing: { label: "Timing", chip: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20" },
  "non-material": { label: "Non-material", chip: "bg-muted text-muted-foreground border-border" },
};

const ruleColor = (p: string) =>
  p === "exact" ? "text-primary" :
  p === "tolerance" || p === "variance" ? "text-[hsl(var(--chart-4))]" : "text-destructive";
const ruleDot = (p: string) =>
  p === "exact" ? "bg-primary" :
  p === "tolerance" || p === "variance" ? "bg-[hsl(var(--chart-4))]" : "bg-destructive";

const fmtMoney = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` :
  n >= 1_000 ? `$${(n / 1_000).toFixed(0)}k` : `$${n}`;

/* ======================== Comparison row (clean) ======================== */

const CompareRow = ({
  label, source, target, match,
}: { label: string; source: string; target: string; match: "exact" | "tolerance" | "variance" | "fail" | "neutral" }) => {
  const same = source === target;
  return (
    <div className="grid grid-cols-12 items-center gap-3 px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
      <p className="col-span-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("col-span-4 text-sm font-mono", same ? "text-foreground" : "text-foreground")}>{source}</p>
      <div className="col-span-1 flex justify-center">
        {match === "exact" || same ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
        ) : match === "fail" ? (
          <XCircle className="h-3.5 w-3.5 text-destructive" />
        ) : match === "neutral" ? (
          <span className="h-1 w-3 bg-border rounded-full" />
        ) : (
          <AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--chart-4))]" />
        )}
      </div>
      <p className={cn("col-span-4 text-sm font-mono text-right", same ? "text-foreground" : "text-foreground")}>{target}</p>
    </div>
  );
};

/* ======================== Main ======================== */

const NavMatchingScreen = () => {
  const [items, setItems] = useState<MatchItem[]>(MOCK_ITEMS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_ITEMS[0].id);
  const [statusFilter, setStatusFilter] = useState<"all" | MatchStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | ReconType>("all");
  const [search, setSearch] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [comment, setComment] = useState("");
  const [tab, setTab] = useState("compare");

  const selected = items.find((i) => i.id === selectedId)!;

  const filtered = items.filter((i) =>
    (statusFilter === "all" || i.status === statusFilter) &&
    (typeFilter === "all" || i.reconType === typeFilter) &&
    (!search || i.id.toLowerCase().includes(search.toLowerCase()) || i.fund.toLowerCase().includes(search.toLowerCase()))
  );

  const counts = {
    auto: items.filter((i) => i.status === "auto").length,
    review: items.filter((i) => i.status === "review").length,
    unmatched: items.filter((i) => i.status === "unmatched").length,
    approved: items.filter((i) => i.status === "approved" || i.status === "edited").length,
  };
  const total = items.length;
  const autoPct = Math.round((counts.auto / total) * 100);
  const openImpact = items
    .filter((i) => i.status !== "approved" && i.status !== "edited")
    .reduce((s, i) => s + Math.abs(i.navImpactValue), 0);

  const handleApprove = () => {
    setItems((prev) => prev.map((i) => (i.id === selectedId ? { ...i, status: "approved" } : i)));
    toast.success(`Match ${selectedId} approved`, { description: "Posted to audit trail." });
    setComment("");
  };
  const handleOverride = () => {
    if (!overrideReason) return toast.error("Override reason code is required");
    setItems((prev) => prev.map((i) => (i.id === selectedId ? { ...i, status: "edited" } : i)));
    toast.success(`Match ${selectedId} overridden`, { description: `Reason: ${overrideReason}` });
    setOverrideReason(""); setComment("");
  };
  const handleConfirmCandidate = (cid: string) => {
    setItems((prev) => prev.map((i) => (i.id === selectedId ? { ...i, status: "edited" } : i)));
    toast.success(`Matched to ${cid}`, { description: "AI will learn from this manual match." });
  };

  const StatusIcon = statusMeta[selected.status].Icon;

  return (
    <div className="space-y-4">
      {/* ============= ZONE 1 — Run Header (compact, single row) ============= */}
      <Card className="border border-border bg-gradient-to-r from-primary/5 via-card to-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  NAV Reconciliation · Matching Cockpit
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <h2 className="text-base font-semibold text-foreground">All Funds · NAV Cycle Apr-2025</h2>
                  <Badge variant="outline" className="text-[10px]">Run RUN-2025-04-18-093412</Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Started 09:34 UTC
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <RotateCcw className="h-3 w-3 mr-1" /> Re-run
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Download className="h-3 w-3 mr-1" /> Export
              </Button>
              <Button size="sm" className="h-8 text-xs">
                <PlayCircle className="h-3 w-3 mr-1" /> New run
              </Button>
            </div>
          </div>

          {/* KPI strip — compact, single row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px mt-4 bg-border rounded-md overflow-hidden">
            <div className="bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Auto-matched</p>
              <p className="text-lg font-semibold text-primary mt-1">{autoPct}%</p>
              <Progress value={autoPct} className="h-1 mt-1.5" />
            </div>
            <div className="bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Needs review</p>
              <p className="text-lg font-semibold text-[hsl(var(--chart-4))] mt-1">{counts.review}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">items flagged</p>
            </div>
            <div className="bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Unmatched</p>
              <p className="text-lg font-semibold text-destructive mt-1">{counts.unmatched}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">manual match</p>
            </div>
            <div className="bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Approved</p>
              <p className="text-lg font-semibold text-foreground mt-1">{counts.approved}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">of {total}</p>
            </div>
            <div className="bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Open NAV impact</p>
              <p className="text-lg font-semibold text-foreground mt-1">±{fmtMoney(openImpact)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">across {counts.review + counts.unmatched} items</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============= ZONE 2 — Queue (left) + Workspace (right) ============= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ---- LEFT: Exception Queue ---- */}
        <Card className="border border-border lg:col-span-4 xl:col-span-3">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Exceptions Queue · {filtered.length}
              </p>
              <Filter className="h-3 w-3 text-muted-foreground" />
            </div>

            {/* search */}
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID or fund..."
                className="w-full text-xs pl-7 pr-2 py-1.5 rounded-md bg-muted/40 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* filters */}
            <div className="space-y-1.5 mb-2">
              <div className="flex flex-wrap gap-1">
                {(["all", "review", "unmatched", "auto", "approved"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-md border transition-colors capitalize",
                      statusFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <Select value={typeFilter} onValueChange={(v: "all" | ReconType) => setTypeFilter(v)}>
                <SelectTrigger className="h-7 text-[11px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All recon types</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Transactions">Transactions</SelectItem>
                  <SelectItem value="Valuation">Valuation</SelectItem>
                  <SelectItem value="Accruals">Accruals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* list */}
            <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
              {filtered.map((it) => {
                const isSel = it.id === selectedId;
                return (
                  <button
                    key={it.id}
                    onClick={() => { setSelectedId(it.id); setTab("compare"); }}
                    className={cn(
                      "w-full text-left p-2.5 rounded-md border transition-all",
                      isSel ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("inline-block h-1.5 w-1.5 rounded-full", statusMeta[it.status].dot)} />
                        <span className="text-[11px] font-mono font-semibold text-foreground">{it.id}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">{it.reconType}</Badge>
                    </div>
                    <p className="text-xs text-foreground truncate">{it.fund}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-muted-foreground">
                        {it.navImpactValue > 0 ? fmtMoney(it.navImpactValue) : "no impact"}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />{it.ageHrs}h
                      </span>
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">No items match filters.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ---- RIGHT: Workspace ---- */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Selected item header */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-semibold text-foreground">{selected.id}</span>
                    <Badge variant="outline" className={cn("text-[10px]", statusMeta[selected.status].chip)}>
                      <StatusIcon className="h-3 w-3 mr-1" />{statusMeta[selected.status].label}
                    </Badge>
                    <Badge variant="outline" className={cn("text-[10px]", matMeta[selected.materiality].chip)}>
                      {matMeta[selected.materiality].label}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">{selected.reconType}</Badge>
                    <Badge variant="outline" className="text-[10px]">Root: {selected.rootCause}</Badge>
                  </div>
                  <p className="text-sm text-foreground">{selected.fund} · <span className="text-muted-foreground">{selected.source.txnType}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Confidence</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={selected.confidence} className="h-1.5 w-24" />
                    <span className="text-sm font-semibold text-foreground">{selected.confidence}%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Auto-clear ≥95%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit history */}
          <Card className="border border-border">
            <CardContent className="p-0">
              <Tabs value={tab} onValueChange={setTab}>
                <div className="border-b border-border px-4 pt-3">
                  <TabsList className="bg-transparent h-auto p-0 gap-1">
                    <TabsTrigger value="compare" className="data-[state=active]:bg-muted text-xs">Compare</TabsTrigger>
                    <TabsTrigger value="why" className="data-[state=active]:bg-muted text-xs">Why (AI)</TabsTrigger>
                    {selected.candidates && (
                      <TabsTrigger value="candidates" className="data-[state=active]:bg-muted text-xs">
                        Candidates · {selected.candidates.length}
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="resolve" className="data-[state=active]:bg-muted text-xs">Resolve</TabsTrigger>
                    <TabsTrigger value="audit" className="data-[state=active]:bg-muted text-xs">Audit</TabsTrigger>
                  </TabsList>
                </div>

                {/* ===== COMPARE — clean side-by-side ===== */}
                <TabsContent value="compare" className="m-0 p-4 space-y-4">
                  {/* Source/Target column headers */}
                  <div className="grid grid-cols-12 gap-3 text-[10px] font-semibold uppercase tracking-widest">
                    <div className="col-span-3 text-muted-foreground">Field</div>
                    <div className="col-span-4 text-primary flex items-center gap-1.5">
                      <FileText className="h-3 w-3" /> Source · External truth
                    </div>
                    <div className="col-span-1" />
                    <div className="col-span-4 text-foreground text-right flex items-center justify-end gap-1.5">
                      Target · Internal books <Layers className="h-3 w-3" />
                    </div>
                  </div>

                  <div className="rounded-md border border-border overflow-hidden">
                    <CompareRow label="System / Doc" source={selected.source.system} target={selected.target.txnId} match="neutral" />
                    <CompareRow label="Type" source={selected.source.txnType} target={selected.target.account} match="neutral" />
                    <CompareRow label="Investment" source={selected.source.investmentId} target={selected.target.txnId === "—" ? "—" : selected.source.investmentId} match={selected.target.txnId === "—" ? "fail" : "exact"} />
                    <CompareRow label="Amount" source={selected.source.amount} target={selected.target.amount} match={selected.source.amount === selected.target.amount ? "exact" : selected.target.amount === "—" ? "fail" : "variance"} />
                    <CompareRow label="Currency" source={selected.source.currency} target={selected.target.currency === "—" ? "—" : selected.target.currency} match={selected.source.currency === selected.target.currency ? "exact" : "fail"} />
                    <CompareRow label="Effective date" source={selected.source.effectiveDate} target={selected.target.postingDate} match={selected.source.effectiveDate === selected.target.postingDate ? "exact" : "tolerance"} />
                  </div>

                  {/* Reliability + evidence inline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md border border-border p-3 bg-muted/20">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Shield className="h-3 w-3 text-primary" />
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Source reliability</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] mb-2">{selected.source.reliability}</Badge>
                      <p className="text-[11px] text-foreground leading-relaxed">{selected.source.evidence}</p>
                    </div>
                    <div className="rounded-md border border-border p-3 bg-muted/20">
                      <div className="flex items-center gap-2 mb-1.5">
                        <DollarSign className="h-3 w-3 text-[hsl(var(--chart-4))]" />
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">NAV impact if accepted</p>
                      </div>
                      <p className="text-lg font-semibold text-foreground">
                        {selected.navImpactValue > 0 ? `±${fmtMoney(selected.navImpactValue)}` : "$0 — no NAV change"}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Materiality threshold: $500k or 5 bps NAV
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* ===== WHY — root cause + match logic ===== */}
                <TabsContent value="why" className="m-0 p-4 space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-md bg-primary/5 border border-primary/20">
                    <div className="h-7 w-7 rounded-md bg-background flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                        AI explanation · Root cause: {selected.rootCause}
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">{selected.recommendation}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                      Matching rules evaluated
                    </p>
                    <div className="rounded-md border border-border overflow-hidden">
                      {selected.matchLogic.map((r, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-3 py-2 border-b border-border last:border-b-0">
                          <span className={cn("inline-block h-2 w-2 rounded-full", ruleDot(r.pass))} />
                          <span className="text-sm text-foreground flex-1">{r.rule}</span>
                          <span className={cn("font-medium uppercase text-[10px] tracking-wider", ruleColor(r.pass))}>{r.pass}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* ===== CANDIDATES ===== */}
                {selected.candidates && (
                  <TabsContent value="candidates" className="m-0 p-4 space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                      Ranked match candidates · select one or split
                    </p>
                    {selected.candidates.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-12 rounded bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">{c.similarity}%</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{c.description}</p>
                            <p className="text-[11px] text-muted-foreground font-mono">{c.id} · {c.amount} · {c.date}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleConfirmCandidate(c.id)}>
                          Confirm match <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </TabsContent>
                )}

                {/* ===== RESOLVE — actions ===== */}
                <TabsContent value="resolve" className="m-0 p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Override reason code
                      </label>
                      <Select value={overrideReason} onValueChange={setOverrideReason}>
                        <SelectTrigger className="mt-1.5 h-9"><SelectValue placeholder="Select reason..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="timing">Timing — GP final pending</SelectItem>
                          <SelectItem value="valuation">Valuation variance accepted</SelectItem>
                          <SelectItem value="fx">FX rate difference</SelectItem>
                          <SelectItem value="mapping">Mapping correction</SelectItem>
                          <SelectItem value="fee">Fee schedule update</SelectItem>
                          <SelectItem value="estimate">Posted as estimate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Reviewer comment (audit)
                      </label>
                      <Textarea
                        value={comment} onChange={(e) => setComment(e.target.value)}
                        placeholder="Add context..." rows={2}
                        className="mt-1.5 text-xs resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                    <Button onClick={handleApprove} size="sm" className="h-8 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Approve & post
                    </Button>
                    <Button onClick={handleOverride} variant="outline" size="sm" className="h-8 text-xs">
                      <Edit3 className="h-3 w-3 mr-1" /> Override with reason
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Send className="h-3 w-3 mr-1" /> Request GP confirmation
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3 mr-1" /> Escalate to VCG
                    </Button>
                  </div>
                </TabsContent>

                {/* ===== AUDIT ===== */}
                <TabsContent value="audit" className="m-0 p-4">
                  <div className="space-y-2">
                    {[
                      { t: "09:34 UTC", who: "AI Agent v2.4", a: `Matched ${selected.id} with confidence ${selected.confidence}%` },
                      { t: "09:35 UTC", who: "Policy Engine", a: `Materiality classified: ${matMeta[selected.materiality].label}` },
                      { t: "09:36 UTC", who: "Routing", a: `Assigned to NAV Controls queue` },
                      { t: "10:12 UTC", who: "L. Chen (Controller)", a: `Opened item for review` },
                    ].map((e, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs p-2 rounded-md hover:bg-muted/30">
                        <History className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-muted-foreground">{e.t}</span>
                            <span className="text-foreground font-medium">{e.who}</span>
                          </div>
                          <p className="text-muted-foreground mt-0.5">{e.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NavMatchingScreen;
