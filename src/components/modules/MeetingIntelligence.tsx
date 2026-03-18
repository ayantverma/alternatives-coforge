import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Download,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Meeting {
  id: string;
  client: string;
  type: string;
  date: string;
  duration: string;
  confidence: number;
  confidenceLabel: string;
  sentiment: "Positive" | "Neutral" | "Concern";
  sentimentIcon: "success" | "warning";
  summary: string[];
  actionItems: ActionItem[];
  emailDraft: string;
  complianceNote: string;
  reasoningChain: string;
  humanReview: {
    title: string;
    description: string;
    confidence: number;
    confidenceLabel: string;
  };
  auditTrail: string[];
}

interface ActionItem {
  text: string;
  confidence: number;
  confidenceLabel: string;
  owner: string;
  due: string;
  priority: "High" | "Medium" | "Low";
}

const meetings: Meeting[] = [
  {
    id: "1",
    client: "Robert & Catherine Hargrove",
    type: "Annual Review",
    date: "January 13, 2025",
    duration: "90 minutes",
    confidence: 91,
    confidenceLabel: "VERY HIGH",
    sentiment: "Positive",
    sentimentIcon: "success",
    summary: [
      "Clients expressed satisfaction with 2024 portfolio performance (+11.2% vs 9.4% benchmark).",
      "Robert raised concerns about estate plan currency given recent tax law changes — ILIT review requested.",
      "Catherine mentioned interest in impact investing allocation (5–10% of portfolio).",
      "Succession planning for Hargrove Industries stake discussed — legal referral appropriate.",
    ],
    actionItems: [
      { text: "Schedule ILIT review with estate attorney — confirm beneficiary designations current", confidence: 94, confidenceLabel: "VERY HIGH", owner: "Advisor", due: "Feb 14, 2025", priority: "High" },
      { text: "Prepare impact investing options memo — ESG allocation proposal for 7.5% of portfolio", confidence: 89, confidenceLabel: "HIGH", owner: "Advisor", due: "Jan 31, 2025", priority: "Medium" },
      { text: "Refer to NT Private Business Advisory for Hargrove Industries succession planning", confidence: 97, confidenceLabel: "VERY HIGH", owner: "Advisor", due: "Jan 30, 2025", priority: "High" },
      { text: "Client to confirm whether annual charitable distribution target has changed", confidence: 82, confidenceLabel: "HIGH", owner: "Client", due: "Jan 24, 2025", priority: "Low" },
    ],
    emailDraft: `Dear Robert and Catherine,

Thank you for a productive annual review meeting. I wanted to summarize our key discussions and next steps.

As discussed, your portfolio delivered strong results in 2024, and I am pleased that the allocation strategy continues to align with your long-term objectives. I will follow up shortly with an impact investing proposal incorporating Catherine's interest in a 7–8% ESG-oriented allocation.

Regarding the estate plan review, I will coordinate with your estate attorney to ensure the ILIT structure and beneficiary designations reflect current tax law. I will also connect you with our Private Business Advisory team regarding the Hargrove Industries succession planning.

Please do not hesitate to reach out with any questions in the meantime.

Warm regards,
James Whitfield
Northern Trust Wealth Management`,
    complianceNote: `Meeting Date: 14 January 2025 | Duration: 90 minutes | Advisor: J. Whitfield
Clients Present: Robert Hargrove, Catherine Hargrove
Topics Discussed: Annual portfolio review; estate planning update request; impact investing inquiry;
business succession.
Suitability: Current IPS reviewed and confirmed appropriate. No material changes to risk tolerance or
objectives.
Action Required: ILIT review (estate); ESG memo (investment); business succession referral (NT PBAS).
No complaints, disputes, or regulatory concerns noted.`,
    reasoningChain: "Processed meeting and generated summary",
    humanReview: {
      title: "Approve AI-generated summary and action items",
      description: "Clients expressed satisfaction with returns, engaged constructively on planning topics, no negative signals detected.",
      confidence: 91,
      confidenceLabel: "VERY HIGH",
    },
    auditTrail: ["AI agent processed meeting recording and generated summary — Jan 13, 2025 4:32 PM"],
  },
  {
    id: "2",
    client: "Dr. Marcus & Elena Voss",
    type: "Investment Review",
    date: "January 9, 2025",
    duration: "60 minutes",
    confidence: 94,
    confidenceLabel: "VERY HIGH",
    sentiment: "Concern",
    sentimentIcon: "warning",
    summary: [
      "Clients expressed concern about underperformance in fixed income allocation relative to benchmark.",
      "Dr. Voss requested review of alternative investment options for diversification.",
      "Estate planning documents remain unsigned — follow-up required urgently.",
      "Elena mentioned potential real estate acquisition requiring liquidity planning.",
    ],
    actionItems: [
      { text: "Review and rebalance fixed income allocation with updated duration targets", confidence: 92, confidenceLabel: "VERY HIGH", owner: "Advisor", due: "Jan 20, 2025", priority: "High" },
      { text: "Prepare alternative investment memo for portfolio diversification", confidence: 88, confidenceLabel: "HIGH", owner: "Advisor", due: "Jan 25, 2025", priority: "Medium" },
      { text: "Follow up on unsigned estate planning documents — escalate to compliance", confidence: 96, confidenceLabel: "VERY HIGH", owner: "Advisor", due: "Jan 15, 2025", priority: "High" },
      { text: "Model liquidity scenarios for potential real estate acquisition", confidence: 85, confidenceLabel: "HIGH", owner: "Advisor", due: "Jan 31, 2025", priority: "Medium" },
    ],
    emailDraft: `Dear Dr. Voss and Elena,

Thank you for meeting with us to discuss your investment portfolio. I appreciate your candid feedback regarding the fixed income performance.

I will be conducting a thorough review of the fixed income allocation and will present updated recommendations by January 20th. Additionally, I will prepare a memo on alternative investment options that may provide better diversification.

Regarding the estate planning documents, I want to ensure these are finalized promptly. I will coordinate with our legal team to schedule a signing session at your convenience.

For the potential real estate acquisition Elena mentioned, I will model several liquidity scenarios to ensure we can accommodate this without impacting your long-term objectives.

Best regards,
James Whitfield
Northern Trust Wealth Management`,
    complianceNote: `Meeting Date: 9 January 2025 | Duration: 60 minutes | Advisor: J. Whitfield
Clients Present: Dr. Marcus Voss, Elena Voss
Topics Discussed: Fixed income performance review; alternative investments; estate planning follow-up;
real estate liquidity planning.
Suitability: Concerns raised about fixed income underperformance. Review scheduled.
Action Required: FI rebalance; alt investment memo; estate doc signing; liquidity modeling.
Client expressed dissatisfaction with FI returns — noted for supervisory review.`,
    reasoningChain: "Processed meeting and generated summary with concern flags",
    humanReview: {
      title: "Approve AI-generated summary and action items",
      description: "Client dissatisfaction noted with fixed income performance. Estate planning documents overdue — compliance flag raised.",
      confidence: 94,
      confidenceLabel: "VERY HIGH",
    },
    auditTrail: ["AI agent processed meeting recording and generated summary — Jan 9, 2025 3:15 PM"],
  },
];

const priorityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20",
  Low: "bg-primary/10 text-primary border-primary/20",
};

const confidenceLabelColors: Record<string, string> = {
  "VERY HIGH": "text-primary",
  HIGH: "text-[hsl(var(--chart-4))]",
  MEDIUM: "text-muted-foreground",
};

const MeetingIntelligence = ({ onBack }: { onBack: () => void }) => {
  const [selectedMeetingId, setSelectedMeetingId] = useState(meetings[0].id);
  const [filter, setFilter] = useState("");
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [showReasoningChain, setShowReasoningChain] = useState(false);

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId)!;

  const filteredMeetings = meetings.filter((m) =>
    m.client.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex h-full animate-fade-in">
      {/* Left sidebar - Recent Meetings */}
      <div className="w-72 border-r border-border bg-card flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-border">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md px-3 py-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </button>
        </div>
        <div className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Recent Meetings
          </p>
          <Input
            placeholder="Filter by client..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs h-8 bg-muted/50 border-0 mb-3"
          />
          <div className="space-y-1">
            {filteredMeetings.map((meeting) => (
              <button
                key={meeting.id}
                onClick={() => setSelectedMeetingId(meeting.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  selectedMeetingId === meeting.id
                    ? "bg-primary/5 border-l-2 border-primary"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">{meeting.client}</p>
                    <p className="text-xs text-muted-foreground">{meeting.type}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-muted-foreground">{meeting.date.split(",")[0]}, {meeting.date.split(",")[1]?.trim()?.split(" ")[0]}</span>
                      <span className="text-[11px] text-muted-foreground">· {meeting.duration.split(" ")[0]} min</span>
                      <span className={cn("text-[11px] font-semibold", confidenceLabelColors[meeting.confidenceLabel])}>{meeting.confidence}%</span>
                      <Badge className={cn("text-[9px] px-1.5 py-0", confidenceLabelColors[meeting.confidenceLabel], "bg-transparent border-0")}>
                        {meeting.confidenceLabel}
                      </Badge>
                    </div>
                  </div>
                  {meeting.sentimentIcon === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-[hsl(var(--chart-4))] flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right content - Meeting Detail */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Meeting header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-0.5 bg-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">Meeting Intelligence</span>
          </div>
          <h1 className="text-3xl font-display text-foreground mb-1">{selectedMeeting.client}</h1>
          <p className="text-sm text-muted-foreground">{selectedMeeting.type} · {selectedMeeting.date} · {selectedMeeting.duration}</p>
          <div className="mt-3">
            <Badge variant="outline" className={cn(
              "text-xs px-3 py-1",
              selectedMeeting.sentiment === "Positive" ? "text-primary border-primary/20 bg-primary/5" : "text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20 bg-[hsl(var(--chart-4))]/5"
            )}>
              {selectedMeeting.sentiment === "Positive" ? (
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
              )}
              {selectedMeeting.sentiment} Sentiment
            </Badge>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="border border-border">
          <CardContent className="p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Executive Summary
            </p>
            <ul className="space-y-3">
              {selectedMeeting.summary.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card className="border border-border">
          <CardContent className="p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Action Items
            </p>
            <div className="space-y-5">
              {selectedMeeting.actionItems.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-start gap-2 flex-wrap">
                    <p className="text-sm text-foreground">{item.text}</p>
                    <span className={cn("text-sm font-semibold", confidenceLabelColors[item.confidenceLabel])}>{item.confidence}%</span>
                    <Badge className={cn("text-[9px] px-1.5 py-0 bg-transparent border-0", confidenceLabelColors[item.confidenceLabel])}>
                      {item.confidenceLabel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Owner: {item.owner}</span>
                    <span>·</span>
                    <span>Due: {item.due}</span>
                    <Badge variant="outline" className={cn("text-[10px]", priorityColors[item.priority])}>
                      {item.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Follow-Up Email Draft */}
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Follow-Up Email Draft
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs h-7 px-3">
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-7 px-3">
                  <Download className="h-3 w-3 mr-1" /> Download
                </Button>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-5 border border-border">
              <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{selectedMeeting.emailDraft}</p>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Note */}
        <Card className="border border-border">
          <CardContent className="p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Compliance Note
            </p>
            <div className="bg-muted/30 rounded-lg p-5 border border-border">
              <pre className="text-xs text-foreground font-mono whitespace-pre-wrap leading-relaxed">{selectedMeeting.complianceNote}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Agent Reasoning Chain */}
        <div className="space-y-3">
          <button
            onClick={() => setShowReasoningChain(!showReasoningChain)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Agent Reasoning Chain</span>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">AUTONOMOUS</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-semibold", confidenceLabelColors[selectedMeeting.confidenceLabel])}>{selectedMeeting.confidence}%</span>
              <span className={cn("text-[10px] font-semibold", confidenceLabelColors[selectedMeeting.confidenceLabel])}>{selectedMeeting.confidenceLabel}</span>
              {showReasoningChain ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </div>
          </button>
          {showReasoningChain && (
            <div className="border-l-2 border-primary bg-primary/5 px-4 py-2 rounded-r">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">AUTONOMOUS:</span>
                <span className="text-xs text-foreground">{selectedMeeting.reasoningChain}</span>
                <span className={cn("text-xs font-semibold", confidenceLabelColors[selectedMeeting.confidenceLabel])}>{selectedMeeting.confidence}%</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
          )}
        </div>

        {/* Human Review Required */}
        <Card className="border border-border">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Human Review Required
                </p>
                <p className="text-sm font-semibold text-foreground">{selectedMeeting.humanReview.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedMeeting.humanReview.description}</p>
              </div>
              <div className="text-right">
                <span className={cn("text-lg font-semibold", confidenceLabelColors[selectedMeeting.humanReview.confidenceLabel])}>{selectedMeeting.humanReview.confidence}%</span>
                <p className={cn("text-[10px] font-semibold", confidenceLabelColors[selectedMeeting.humanReview.confidenceLabel])}>{selectedMeeting.humanReview.confidenceLabel}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                <CheckCircle2 className="h-4 w-4 mr-1.5" /> Approve
              </Button>
              <Button className="bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] hover:bg-[hsl(var(--chart-4))]/20 border border-[hsl(var(--chart-4))]/20">
                <AlertTriangle className="h-4 w-4 mr-1.5" /> Escalate
              </Button>
              <Button className="bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20">
                <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Trail */}
        <button
          onClick={() => setShowAuditTrail(!showAuditTrail)}
          className="flex items-center justify-between w-full text-left py-2"
        >
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Audit Trail · {selectedMeeting.auditTrail.length} Entry
            </span>
          </div>
          {showAuditTrail ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {showAuditTrail && (
          <div className="pl-6 space-y-2">
            {selectedMeeting.auditTrail.map((entry, idx) => (
              <p key={idx} className="text-xs text-muted-foreground">{entry}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingIntelligence;