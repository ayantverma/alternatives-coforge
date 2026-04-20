import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2, AlertTriangle, XCircle, FileText, Sparkles, ArrowRight, ArrowLeftRight,
  Edit3, Split, Layers, Clock, Shield, History, Eye, MessageSquare, ChevronRight,
  TrendingUp, DollarSign, Calendar, Building2, Hash, Filter, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ======================== Mock Data ======================== */

type MatchStatus = "auto" | "review" | "unmatched" | "approved" | "edited";
type Materiality = "material" | "timing" | "non-material";

interface MatchItem {
  id: string;
  status: MatchStatus;
  materiality: Materiality;
  confidence: number;
  reconType: "Cash" | "Transactions" | "Valuation" | "Accruals";
  navImpact: string;
  navImpactValue: number;
  source: {
    system: string;
    docType: string;
    txnType: string;
    amount: string;
    currency: string;
    effectiveDate: string;
    noticeDate: string;
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
    navImpact: string;
    linkedPriorMatches: number;
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
    navImpact: "+$1.82M",
    navImpactValue: 1820000,
    source: {
      system: "GP Capital Statement — Q1 2025",
      docType: "PDF · Carlyle PE Fund VII",
      txnType: "Quarterly Valuation Mark",
      amount: "$48,420,000",
      currency: "USD",
      effectiveDate: "2025-03-31",
      noticeDate: "2025-04-14",
      investmentId: "INV-CAR-VII-0042",
      evidence: "Page 4, Schedule of Investments — Net Asset Value as of 31-Mar-2025",
      reliability: "GP Estimate",
    },
    target: {
      txnId: "GL-2025-04-018",
      account: "1450 · L3 Investments at Fair Value",
      amount: "$46,600,000",
      currency: "USD",
      postingDate: "2025-03-31",
      navImpact: "$46.6M",
      linkedPriorMatches: 3,
    },
    matchLogic: [
      { rule: "Entity & investment mapping", pass: "exact" },
      { rule: "Currency match (USD)", pass: "exact" },
      { rule: "Effective date (Q1 close)", pass: "exact" },
      { rule: "Amount (4.0% variance)", pass: "variance" },
      { rule: "Historical pattern (last 4 quarters)", pass: "tolerance" },
    ],
    recommendation:
      "AI confidence below 95% threshold due to valuation source variance ($1.82M / 3.9%). Likely Level 3 mark-to-market timing — GP final reporting expected 2025-04-22. Human review required before NAV strike.",
  },
  {
    id: "M-1043",
    status: "auto",
    materiality: "non-material",
    confidence: 98,
    reconType: "Cash",
    navImpact: "$0",
    navImpactValue: 0,
    source: {
      system: "BNY Cash Movement Feed",
      docType: "SWIFT MT940",
      txnType: "Capital Call Receipt",
      amount: "$12,000,000",
      currency: "USD",
      effectiveDate: "2025-04-15",
      noticeDate: "2025-04-15",
      investmentId: "FUND-GE-IV",
      evidence: "MT940 line 61 — credit USD 12,000,000.00 ref CALL-2025-Q2-014",
      reliability: "Bank Confirmed",
    },
    target: {
      txnId: "PA-2025-04-115",
      account: "1010 · Cash — Operating USD",
      amount: "$12,000,000",
      currency: "USD",
      postingDate: "2025-04-15",
      navImpact: "+$12.0M",
      linkedPriorMatches: 1,
    },
    matchLogic: [
      { rule: "Amount + currency exact", pass: "exact" },
      { rule: "Date within tolerance (0d)", pass: "exact" },
      { rule: "Reference number (CALL-2025-Q2-014)", pass: "exact" },
      { rule: "Counterparty mapping", pass: "exact" },
    ],
    recommendation: "AI recommends approving this match. All matching dimensions exact — within auto-clear policy (>95%).",
  },
  {
    id: "M-1044",
    status: "unmatched",
    materiality: "material",
    confidence: 0,
    reconType: "Transactions",
    navImpact: "+$4.50M",
    navImpactValue: 4500000,
    source: {
      system: "Apollo Credit Fund — GP Notice",
      docType: "Email + Attached PDF",
      txnType: "Distribution — Recallable",
      amount: "$4,500,000",
      currency: "USD",
      effectiveDate: "2025-04-12",
      noticeDate: "2025-04-16",
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
      navImpact: "—",
      linkedPriorMatches: 0,
    },
    matchLogic: [
      { rule: "No matching internal transaction found", pass: "fail" },
      { rule: "Closest candidate: 92% similarity", pass: "tolerance" },
    ],
    recommendation:
      "No internal booking found. AI suggests 3 candidate matches based on amount, date proximity, and counterparty. Manual review required — likely missing booking due to recallable distribution treatment.",
    candidates: [
      { id: "PA-2025-04-098", description: "Distribution — Apollo Credit II", amount: "$4,500,000", date: "2025-04-12", similarity: 92 },
      { id: "PA-2025-04-101", description: "Capital Return — Apollo CR", amount: "$4,495,000", date: "2025-04-13", similarity: 84 },
      { id: "PA-2025-04-088", description: "Apollo Distribution Q1", amount: "$4,500,000", date: "2025-04-09", similarity: 71 },
    ],
  },
];

/* ======================== Sub-components ======================== */

const statusMeta: Record<MatchStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  auto: { label: "AI Matched · Pending Approval", color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  review: { label: "Needs Human Review", color: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20", icon: AlertTriangle },
  unmatched: { label: "Unmatched", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
  approved: { label: "Approved", color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  edited: { label: "Edited & Approved", color: "bg-primary/10 text-primary border-primary/20", icon: Edit3 },
};

const matMeta: Record<Materiality, { label: string; color: string }> = {
  material: { label: "Material", color: "bg-destructive/10 text-destructive border-destructive/20" },
  timing: { label: "Timing", color: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20" },
  "non-material": { label: "Non-material", color: "bg-muted text-muted-foreground border-border" },
};

const ruleColor = (p: string) =>
  p === "exact" ? "text-primary" :
  p === "tolerance" ? "text-[hsl(var(--chart-4))]" :
  p === "variance" ? "text-[hsl(var(--chart-4))]" : "text-destructive";

const ruleDot = (p: string) =>
  p === "exact" ? "bg-primary" :
  p === "tolerance" || p === "variance" ? "bg-[hsl(var(--chart-4))]" : "bg-destructive";

/* ======================== Main Component ======================== */

const NavMatchingScreen = () => {
  const [items, setItems] = useState<MatchItem[]>(MOCK_ITEMS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_ITEMS[0].id);
  const [filter, setFilter] = useState<"all" | MatchStatus>("all");
  const [overrideReason, setOverrideReason] = useState("");
  const [comment, setComment] = useState("");

  const selected = items.find((i) => i.id === selectedId)!;
  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);

  const counts = {
    auto: items.filter((i) => i.status === "auto").length,
    review: items.filter((i) => i.status === "review").length,
    unmatched: items.filter((i) => i.status === "unmatched").length,
    approved: items.filter((i) => i.status === "approved" || i.status === "edited").length,
  };
  const total = items.length;
  const autoPct = Math.round((counts.auto / total) * 100);
  const reviewPct = Math.round((counts.review / total) * 100);
  const unmatchedPct = Math.round((counts.unmatched / total) * 100);
  const openImpact = items
    .filter((i) => i.status !== "approved" && i.status !== "edited")
    .reduce((s, i) => s + Math.abs(i.navImpactValue), 0);

  const handleApprove = () => {
    setItems((prev) => prev.map((i) => (i.id === selectedId ? { ...i, status: "approved" } : i)));
    toast.success(`Match ${selectedId} approved`, { description: "Logged to audit trail." });
    setComment("");
  };
  const handleOverride = () => {
    if (!overrideReason) {
      toast.error("Override reason code is required");
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === selectedId ? { ...i, status: "edited" } : i)));
    toast.success(`Match ${selectedId} edited`, { description: `Reason: ${overrideReason}` });
    setOverrideReason("");
    setComment("");
  };
  const handleConfirmCandidate = (cid: string) => {
    setItems((prev) => prev.map((i) => (i.id === selectedId ? { ...i, status: "edited" } : i)));
    toast.success(`Matched to ${cid}`, { description: "AI will learn from this manual match." });
  };

  const StatusIcon = statusMeta[selected.status].icon;

  return (
    <div className="space-y-4">
      {/* ============= ZONE A — Context Header ============= */}
      <Card className="border border-border bg-gradient-to-br from-primary/5 via-card to-card">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  NAV Reconciliation · Matching Cockpit
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <h2 className="text-lg font-display text-foreground">Carlyle PE Fund VII</h2>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">NAV Date 2025-03-31</span>
                  <Badge variant="outline" className="text-[10px] ml-1">Q1 2025</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                  Run RUN-2025-04-18-093412 · Started 09:34 UTC · {total} items
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={cn("text-[10px]", statusMeta[selected.status].color)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusMeta[selected.status].label}
              </Badge>
              <Badge variant="outline" className={cn("text-[10px]", matMeta[selected.materiality].color)}>
                {matMeta[selected.materiality].label}
              </Badge>
              <Badge variant="outline" className="text-[10px]">{selected.reconType}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============= ZONE B — Match Summary Panel ============= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-primary mb-2">
              <CheckCircle2 className="h-3 w-3" /> Auto-matched
            </div>
            <p className="text-2xl font-display text-foreground">{autoPct}%</p>
            <p className="text-[11px] text-muted-foreground mt-1">{counts.auto} of {total} items</p>
            <Progress value={autoPct} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--chart-4))] mb-2">
              <AlertTriangle className="h-3 w-3" /> Needs Review
            </div>
            <p className="text-2xl font-display text-foreground">{reviewPct}%</p>
            <p className="text-[11px] text-muted-foreground mt-1">{counts.review} items flagged</p>
            <Progress value={reviewPct} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-destructive mb-2">
              <XCircle className="h-3 w-3" /> Unmatched
            </div>
            <p className="text-2xl font-display text-foreground">{unmatchedPct}%</p>
            <p className="text-[11px] text-muted-foreground mt-1">{counts.unmatched} require manual match</p>
            <Progress value={unmatchedPct} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card className="border border-border bg-gradient-to-br from-[hsl(var(--chart-4))]/5 to-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-foreground mb-2">
              <DollarSign className="h-3 w-3" /> NAV Impact Open
            </div>
            <p className="text-2xl font-display text-foreground">±${(openImpact / 1_000_000).toFixed(2)}M</p>
            <p className="text-[11px] text-muted-foreground mt-1">Across {counts.review + counts.unmatched} open items</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendation Banner */}
      <Card className={cn(
        "border-l-4",
        selected.status === "auto" ? "border-l-primary bg-primary/5" :
        selected.status === "review" ? "border-l-[hsl(var(--chart-4))] bg-[hsl(var(--chart-4))]/5" :
        "border-l-destructive bg-destructive/5"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">AI Recommendation</p>
                <Badge variant="outline" className="text-[10px]">Confidence {selected.confidence}%</Badge>
                <span className="text-[11px] text-muted-foreground">Policy threshold: ≥95% for auto-clear</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{selected.recommendation}</p>
              <div className="mt-3 space-y-1.5">
                {selected.matchLogic.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className={cn("inline-block h-1.5 w-1.5 rounded-full", ruleDot(r.pass))} />
                    <span className="text-muted-foreground flex-1">{r.rule}</span>
                    <span className={cn("font-medium uppercase text-[10px] tracking-wider", ruleColor(r.pass))}>{r.pass}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============= Items Queue + Side-by-Side ============= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Queue */}
        <Card className="border border-border lg:col-span-3">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Match Queue</p>
              <Filter className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {(["all", "review", "unmatched", "auto", "approved"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-md border transition-colors",
                    filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="space-y-2 max-h-[480px] overflow-y-auto">
              {filtered.map((it) => {
                const Icon = statusMeta[it.status].icon;
                return (
                  <button
                    key={it.id}
                    onClick={() => setSelectedId(it.id)}
                    className={cn(
                      "w-full text-left p-2.5 rounded-md border transition-all",
                      it.id === selectedId ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-muted-foreground">{it.id}</span>
                      <Icon className={cn("h-3 w-3",
                        it.status === "auto" || it.status === "approved" || it.status === "edited" ? "text-primary" :
                        it.status === "review" ? "text-[hsl(var(--chart-4))]" : "text-destructive"
                      )} />
                    </div>
                    <p className="text-xs font-medium text-foreground line-clamp-1">{it.source.txnType}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">{it.reconType}</span>
                      <span className="text-[10px] font-semibold text-foreground">{it.source.amount}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Source / Target Side-by-Side */}
        <div className="lg:col-span-9 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* SOURCE */}
            <Card className="border border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Source · External Truth</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{selected.source.system}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                    {selected.source.reliability}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <Field icon={FileText} label="Document" value={selected.source.docType} />
                  <Field icon={ArrowLeftRight} label="Transaction Type" value={selected.source.txnType} highlight />
                  <Field icon={DollarSign} label="Amount" value={`${selected.source.amount} ${selected.source.currency}`} highlight />
                  <Field icon={Calendar} label="Effective Date" value={selected.source.effectiveDate} />
                  <Field icon={Calendar} label="Notice Date" value={selected.source.noticeDate}
                    flag={selected.source.effectiveDate !== selected.source.noticeDate ? "Timing diff" : undefined} />
                  <Field icon={Hash} label="Investment ID" value={selected.source.investmentId} />
                </div>
                <div className="rounded-md bg-muted/50 border border-border p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Extracted Evidence</p>
                  <p className="text-[11px] text-foreground italic leading-relaxed">"{selected.source.evidence}"</p>
                </div>
              </CardContent>
            </Card>

            {/* TARGET */}
            <Card className="border border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Target · Internal Books</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">NAV Engine — Portfolio Accounting</p>
                  </div>
                  {selected.target.linkedPriorMatches > 0 && (
                    <Badge variant="outline" className="text-[10px]">
                      <History className="h-3 w-3 mr-1" />
                      {selected.target.linkedPriorMatches} prior
                    </Badge>
                  )}
                </div>
                {selected.status === "unmatched" ? (
                  <div className="rounded-md border border-dashed border-destructive/30 bg-destructive/5 p-4 text-center">
                    <XCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">No internal booking found</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Review AI candidates below or create new entry</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <Field icon={Hash} label="Transaction ID" value={selected.target.txnId} />
                    <Field icon={Building2} label="GL Account" value={selected.target.account} />
                    <Field icon={DollarSign} label="Amount"
                      value={`${selected.target.amount} ${selected.target.currency}`}
                      highlight
                      flag={selected.target.amount !== selected.source.amount ? "Variance" : undefined} />
                    <Field icon={Calendar} label="Posting Date" value={selected.target.postingDate} />
                    <Field icon={TrendingUp} label="NAV Impact" value={selected.target.navImpact} />
                  </div>
                )}
                {selected.source.currency !== selected.target.currency && selected.status !== "unmatched" && (
                  <div className="rounded-md bg-[hsl(var(--chart-4))]/10 border border-[hsl(var(--chart-4))]/20 p-2 text-[11px] text-foreground">
                    <strong>FX Translation:</strong> {selected.source.currency}→{selected.target.currency} @ rate applied
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Candidate Matches (only when unmatched) */}
          {selected.status === "unmatched" && selected.candidates && (
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Candidate Matches</p>
                    <p className="text-xs text-foreground mt-0.5">Ranked by AI similarity · Why these? Amount + date proximity + counterparty</p>
                  </div>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  {selected.candidates.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-md border border-border hover:border-primary/30 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                          <span className="text-sm text-foreground font-medium">{c.description}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{c.amount} · {c.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-sm font-semibold",
                          c.similarity >= 90 ? "text-primary" : c.similarity >= 75 ? "text-[hsl(var(--chart-4))]" : "text-muted-foreground"
                        )}>{c.similarity}%</p>
                        <p className="text-[10px] text-muted-foreground">similarity</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleConfirmCandidate(c.id)}>
                        Confirm <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <Button size="sm" variant="outline" className="text-xs h-8"><Split className="h-3 w-3 mr-1.5" /> Partial / Split</Button>
                  <Button size="sm" variant="outline" className="text-xs h-8"><FileText className="h-3 w-3 mr-1.5" /> Create New Booking</Button>
                  <Button size="sm" variant="outline" className="text-xs h-8"><Clock className="h-3 w-3 mr-1.5" /> Defer · Await GP Final</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ============= ZONE E — Action & Override Panel ============= */}
          <Card className="border border-border bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {selected.status === "auto" ? "Approval Mode" :
                   selected.status === "review" ? "Override Mode" :
                   selected.status === "unmatched" ? "Manual Match Mode" : "Approved"}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>All actions audited · user, time, rationale logged</span>
                </div>
              </div>

              {(selected.status === "auto" || selected.status === "review") && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selected.status === "review" && (
                      <Select value={overrideReason} onValueChange={setOverrideReason}>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Override reason code (required)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="timing">Timing — GP final pending</SelectItem>
                          <SelectItem value="valuation">Valuation source variance accepted</SelectItem>
                          <SelectItem value="reclass">Reclassify break type</SelectItem>
                          <SelectItem value="fx">FX rate adjustment</SelectItem>
                          <SelectItem value="policy">Policy exception approved</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <Textarea
                      placeholder={selected.materiality === "material" ? "Rationale (mandatory for material items)" : "Optional comment"}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="text-xs min-h-[36px] h-9 resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button size="sm" className="h-8 text-xs" onClick={handleApprove}>
                      <CheckCircle2 className="h-3 w-3 mr-1.5" /> Approve Match
                    </Button>
                    {selected.status === "review" && (
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleOverride}>
                        <Edit3 className="h-3 w-3 mr-1.5" /> Save Override
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-8 text-xs"><Split className="h-3 w-3 mr-1.5" /> Split / Merge</Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs"><Layers className="h-3 w-3 mr-1.5" /> Reclassify</Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs"><Eye className="h-3 w-3 mr-1.5" /> View Evidence</Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs"><MessageSquare className="h-3 w-3 mr-1.5" /> Request 2nd Approval</Button>
                  </div>
                  {selected.materiality === "material" && (
                    <p className="text-[11px] text-[hsl(var(--chart-4))] flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3" />
                      Material item — secondary approval required if NAV impact exceeds $1M policy threshold.
                    </p>
                  )}
                </>
              )}

              {(selected.status === "approved" || selected.status === "edited") && (
                <div className="flex items-center gap-3 p-3 rounded-md bg-primary/5 border border-primary/20">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Match {selected.id} {selected.status === "edited" ? "edited and approved" : "approved"}</p>
                    <p className="text-[11px] text-muted-foreground">Logged to audit trail · feeds back into agent learning loop</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit history */}
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Match History · {selected.id}</p>
                <Badge variant="outline" className="text-[10px]"><Shield className="h-3 w-3 mr-1" /> Immutable</Badge>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { t: "09:34:12 UTC", a: "AI Agent v2.4", e: "Initial match attempt — confidence " + selected.confidence + "%" },
                  { t: "09:34:13 UTC", a: "AI Agent v2.4", e: selected.status === "unmatched" ? "Generated 3 candidate matches" : "Applied policy ALT-NAV-022 · " + selected.matchLogic.length + " rules evaluated" },
                  { t: "09:34:14 UTC", a: "System", e: "Routed to " + (selected.status === "auto" ? "approval queue" : "human review queue") },
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-3 py-1.5 border-b border-border/50 last:border-b-0">
                    <span className="text-muted-foreground font-mono text-[11px] w-24 flex-shrink-0">{row.t}</span>
                    <span className="text-foreground font-medium w-32 flex-shrink-0">{row.a}</span>
                    <span className="text-muted-foreground flex-1">{row.e}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  icon: Icon, label, value, highlight, flag,
}: { icon: typeof FileText; label: string; value: string; highlight?: boolean; flag?: string }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
    <span className="text-muted-foreground w-28 flex-shrink-0">{label}</span>
    <span className={cn("flex-1 truncate", highlight ? "font-semibold text-foreground" : "text-foreground")}>{value}</span>
    {flag && (
      <Badge variant="outline" className="text-[9px] bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20 h-4">
        {flag}
      </Badge>
    )}
  </div>
);

export default NavMatchingScreen;
