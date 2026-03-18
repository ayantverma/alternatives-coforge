// @ts-nocheck
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Target,
  Shield,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";
import {
  mockFundCashflow,
  mockDealLevel,
  mockPortfolioImpact,
  mockSecondaryPricing,
  mockAssumptions,
  mockRiskScores,
  mockICRecommendation,
} from "@/data/financialModelingData";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formatCurrency = (val: number, compact = false) => {
  if (compact) {
    if (Math.abs(val) >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
    if (Math.abs(val) >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    if (Math.abs(val) >= 1e3) return `$${(val / 1e3).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(val);
};

const riskColorMap: Record<string, string> = {
  "Low": "bg-success/20 text-success border-success/30",
  "Medium": "bg-warning/20 text-warning border-warning/30",
  "Medium-High": "bg-orange-100 text-orange-700 border-orange-300",
  "High": "bg-destructive/20 text-destructive border-destructive/30",
};

const riskBarColor = (score: number) => {
  if (score <= 25) return "hsl(142, 71%, 45%)";
  if (score <= 45) return "hsl(38, 92%, 50%)";
  if (score <= 60) return "hsl(25, 95%, 53%)";
  return "hsl(0, 72%, 51%)";
};

const FinancialModeling = () => {
  const [activeTab, setActiveTab] = useState("fund-cashflow");
  const cf = mockFundCashflow;
  const dl = mockDealLevel;
  const pi = mockPortfolioImpact;
  const sp = mockSecondaryPricing;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-display">Financial Modeling & Risk Profiling</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Prospective candidate analysis — {cf.fundName} · {cf.manager}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="text-xs" variant={mockICRecommendation.recommendation === "Invest" ? "default" : "destructive"}>
            IC: {mockICRecommendation.recommendation}
          </Badge>
          <Badge variant="outline" className="text-xs">{cf.strategy}</Badge>
          <Badge variant="outline" className="text-xs">Vintage {cf.vintage}</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7 h-9">
          <TabsTrigger value="fund-cashflow" className="text-xs">Fund Cashflow</TabsTrigger>
          <TabsTrigger value="deal-level" className="text-xs">Deal / Asset</TabsTrigger>
          <TabsTrigger value="portfolio" className="text-xs">Portfolio Impact</TabsTrigger>
          <TabsTrigger value="secondary" className="text-xs">Secondary Pricing</TabsTrigger>
          <TabsTrigger value="assumptions" className="text-xs">Assumptions</TabsTrigger>
          <TabsTrigger value="risk" className="text-xs">Risk Profile</TabsTrigger>
          <TabsTrigger value="ic-output" className="text-xs">IC Output</TabsTrigger>
        </TabsList>

        {/* ===== FUND CASHFLOW MODEL ===== */}
        <TabsContent value="fund-cashflow" className="space-y-4 mt-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Net IRR", value: `${cf.projectedOutputs.netIRR}%`, icon: TrendingUp },
              { label: "TVPI", value: `${cf.projectedOutputs.tvpi}x`, icon: BarChart3 },
              { label: "DPI", value: `${cf.projectedOutputs.dpi}x`, icon: DollarSign },
              { label: "J-Curve Depth", value: `${cf.projectedOutputs.jCurveDepthPct}%`, icon: TrendingDown },
              { label: "Payback", value: `${cf.projectedOutputs.paybackYears} yrs`, icon: Target },
              { label: "Commitment", value: formatCurrency(cf.commitment, true), icon: PieChart },
            ].map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</span>
                    <kpi.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-display">{kpi.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Net Cashflow Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Net LP Cashflows & J-Curve</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={cf.netCashflows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                    <YAxis tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} labelFormatter={(l) => `Year ${l}`} />
                    <Area type="monotone" dataKey="cumCF" name="Cumulative CF" stroke="hsl(164, 100%, 18%)" fill="hsl(164, 100%, 18%)" fillOpacity={0.15} strokeWidth={2} />
                    <Line type="monotone" dataKey="netCF" name="Net Cashflow" stroke="hsl(210, 100%, 50%)" strokeWidth={1.5} dot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Capital Call Schedule */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Capital Call Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={cf.capitalCallSchedule}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                    <YAxis tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="amount" name="Capital Called" fill="hsl(164, 100%, 18%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Fee Structure & Scenarios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Fee Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Management Fee", value: `${cf.feeStructure.mgmtFee}%` },
                    { label: "Stepdown", value: cf.feeStructure.mgmtFeeStepdown },
                    { label: "Carried Interest", value: `${cf.feeStructure.carry}%` },
                    { label: "Preferred Return", value: `${cf.feeStructure.hurdle}%` },
                    { label: "Recycling", value: cf.feeStructure.recycling ? "Yes" : "No" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Scenario Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-medium text-muted-foreground">Scenario</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Net IRR</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">TVPI</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">DPI</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Loss Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cf.scenarios.map((s) => (
                        <tr key={s.scenario} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-2.5 font-medium">{s.scenario}</td>
                          <td className="py-2.5 text-right">{s.netIRR}%</td>
                          <td className="py-2.5 text-right">{s.tvpi}x</td>
                          <td className="py-2.5 text-right">{s.dpi}x</td>
                          <td className="py-2.5 text-right">
                            <Badge variant={s.lossRate > 5 ? "destructive" : "outline"} className="text-[10px]">{s.lossRate}%</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== DEAL / ASSET LEVEL ===== */}
        <TabsContent value="deal-level" className="space-y-4 mt-4">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-sm font-display">{dl.dealName}</h3>
            <Badge variant="outline" className="text-xs">{dl.sector}</Badge>
            <Badge variant="outline" className="text-xs">Entry {dl.entryMultiple}x EBITDA</Badge>
            <Badge variant="outline" className="text-xs">D/E {dl.debtToEquity}x</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Operating Projections */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Operating Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={dl.projections}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                    <YAxis tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="revenue" name="Revenue" fill="hsl(164, 100%, 18%)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="ebitda" name="EBITDA" fill="hsl(210, 100%, 50%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Exit Scenarios */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Exit Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dl.exitScenarios.map((es) => (
                    <div key={es.scenario} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{es.scenario}</span>
                        <Badge variant={es.grossMOIC >= 2.0 ? "default" : es.grossMOIC >= 1.5 ? "secondary" : "destructive"} className="text-xs">
                          {es.grossMOIC}x MOIC
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Gross IRR</span>
                          <p className="font-medium">{es.grossIRR}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Exit Year</span>
                          <p className="font-medium">{es.exitYear}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Equity CF</span>
                          <p className="font-medium">{formatCurrency(es.equityCF, true)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Covenants */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Debt Covenants & Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dl.covenants.map((c) => (
                    <div key={c.metric} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/50">
                      <div>
                        <p className="text-sm font-medium">{c.metric}</p>
                        <p className="text-xs text-muted-foreground">Threshold: {c.threshold} · Current: {c.current}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Headroom: {c.headroom}</span>
                        <Badge variant={c.status === "OK" ? "default" : c.status === "Watch" ? "secondary" : "destructive"} className="text-[10px]">
                          {c.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Breakeven */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Breakeven Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dl.breakeven.map((b) => (
                    <div key={b.metric} className="flex justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                      <span className="text-sm text-muted-foreground">{b.metric}</span>
                      <span className="text-sm font-display">{b.value}</span>
                    </div>
                  ))}
                </div>

                {/* Margin Trajectory */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">EBITDA Margin Trajectory</p>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={dl.projections}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                      <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                      <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" domain={[25, 40]} />
                      <Line type="monotone" dataKey="margin" stroke="hsl(164, 100%, 18%)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== PORTFOLIO IMPACT ===== */}
        <TabsContent value="portfolio" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Current Portfolio IRR</span>
                <p className="text-xl font-display mt-1">{pi.currentPortfolioIRR}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Pro-Forma IRR</span>
                <p className="text-xl font-display mt-1">{pi.proFormaIRR}%</p>
                <p className="text-[10px] text-warning mt-0.5">-0.2% dilution from unfunded</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3 px-4">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Proposed Commitment</span>
                <p className="text-xl font-display mt-1">{formatCurrency(pi.proposedCommitment, true)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Concentration Impact */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Concentration Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pi.concentrationImpact.map((c) => {
                    const nearLimit = c.proForma >= c.limit * 0.85;
                    return (
                      <div key={c.dimension}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">{c.dimension}</span>
                          <span className={nearLimit ? "text-warning font-medium" : "text-muted-foreground"}>
                            {c.current}% → {c.proForma}% (limit: {c.limit}%)
                          </span>
                        </div>
                        <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="absolute h-full rounded-full bg-muted-foreground/30 transition-all"
                            style={{ width: `${(c.current / c.limit) * 100}%` }}
                          />
                          <div
                            className={`absolute h-full rounded-full transition-all ${nearLimit ? "bg-warning" : "bg-primary"}`}
                            style={{ width: `${(c.proForma / c.limit) * 100}%`, opacity: 0.7 }}
                          />
                          <div className="absolute h-full w-px bg-destructive right-0" style={{ left: `${100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Liquidity Drawdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Liquidity Drawdown Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={pi.liquidityImpact}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                    <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                    <Tooltip formatter={(v: number) => `${v}%`} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="currentDrawdown" name="Current" fill="hsl(164, 60%, 35%)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="proFormaDrawdown" name="Pro-Forma" fill="hsl(210, 100%, 50%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Vintage Exposure */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display">Vintage Year Exposure Shift</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={pi.vintageExposure} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                  <YAxis dataKey="vintage" type="category" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" width={50} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="currentPct" name="Current" fill="hsl(164, 60%, 35%)" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="proFormaPct" name="Pro-Forma" fill="hsl(210, 100%, 50%)" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== SECONDARY PRICING ===== */}
        <TabsContent value="secondary" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Current NAV", value: formatCurrency(sp.currentNAV, true) },
              { label: "Ask Price", value: formatCurrency(sp.askPrice, true) },
              { label: "Discount", value: `${sp.discount}%` },
              { label: "Implied IRR", value: `${sp.impliedIRR}%` },
            ].map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="pt-4 pb-3 px-4">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</span>
                  <p className="text-lg font-display mt-1">{kpi.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Expected Cashflows</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={sp.expectedCashflows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                    <YAxis tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="amount" name="Distribution" fill="hsl(164, 100%, 18%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">IRR Sensitivity to Exit Delay</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={sp.sensitivityToTiming}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                    <XAxis dataKey="delayMonths" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" label={{ value: "Delay (months)", position: "insideBottom", offset: -5, fontSize: 10 }} />
                    <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                    <Tooltip formatter={(v: number) => `${v}%`} />
                    <Line type="monotone" dataKey="irr" name="Implied IRR" stroke="hsl(164, 100%, 18%)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Discount Rate Sensitivity Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display">Fair Value Sensitivity to Discount Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground">Discount Rate</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Fair Value</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">vs Ask Price</th>
                      <th className="text-right py-2 font-medium text-muted-foreground">Signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sp.sensitivityToDiscount.map((row) => {
                      const premium = ((row.fairValue - sp.askPrice) / sp.askPrice * 100);
                      return (
                        <tr key={row.discountRate} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-2.5">{row.discountRate}%</td>
                          <td className="py-2.5 text-right font-medium">{formatCurrency(row.fairValue, true)}</td>
                          <td className="py-2.5 text-right">
                            <span className={premium > 0 ? "text-success" : "text-destructive"}>
                              {premium > 0 ? "+" : ""}{premium.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-2.5 text-right">
                            <Badge variant={premium > 0 ? "default" : "destructive"} className="text-[10px]">
                              {premium > 0 ? "Attractive" : "Expensive"}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== ASSUMPTIONS ===== */}
        <TabsContent value="assumptions" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-display">Structured Assumption Register</CardTitle>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary inline-block" /> GP-Provided</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-info inline-block" /> Analyst-Derived</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground inline-block" /> Market Consensus</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground">Category</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Assumption</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Value</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Source</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Confidence</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Commentary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAssumptions.map((a, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-2.5">
                          <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
                        </td>
                        <td className="py-2.5 font-medium">{a.assumption}</td>
                        <td className="py-2.5">{a.value}</td>
                        <td className="py-2.5">
                          <Badge
                            className="text-[10px]"
                            variant={a.source === "GP-Provided" ? "default" : a.source === "Analyst-Derived" ? "secondary" : "outline"}
                          >
                            {a.source}
                          </Badge>
                        </td>
                        <td className="py-2.5">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              a.confidence === "High" ? "text-success border-success/30" :
                              a.confidence === "Medium" ? "text-warning border-warning/30" :
                              "text-destructive border-destructive/30"
                            }`}
                          >
                            {a.confidence}
                          </Badge>
                        </td>
                        <td className="py-2.5 text-muted-foreground max-w-[200px] truncate">{a.commentary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== RISK PROFILE ===== */}
        <TabsContent value="risk" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Risk Radar */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Multi-Dimensional Risk Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={mockRiskScores.map((r) => ({ dimension: r.dimension.replace(" Risk", ""), score: r.numericScore }))}>
                    <PolarGrid stroke="hsl(214, 32%, 91%)" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} stroke="hsl(215, 16%, 47%)" />
                    <Radar name="Risk Score" dataKey="score" stroke="hsl(164, 100%, 18%)" fill="hsl(164, 100%, 18%)" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Heatmap */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Risk Heat Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {mockRiskScores.map((r) => (
                    <div key={r.dimension} className="flex items-center gap-3">
                      <span className="text-xs font-medium w-28 flex-shrink-0">{r.dimension}</span>
                      <div className="flex-1 h-6 rounded bg-muted relative overflow-hidden">
                        <div
                          className="h-full rounded transition-all"
                          style={{
                            width: `${r.numericScore}%`,
                            backgroundColor: riskBarColor(r.numericScore),
                          }}
                        />
                      </div>
                      <Badge variant="outline" className={`text-[10px] w-20 justify-center ${riskColorMap[r.score]}`}>
                        {r.score}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Details Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display">Risk → Return Linkage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground">Risk Dimension</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Score</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Commentary</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Model Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRiskScores.map((r) => (
                      <tr key={r.dimension} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-2.5 font-medium">{r.dimension}</td>
                        <td className="py-2.5">
                          <Badge variant="outline" className={`text-[10px] ${riskColorMap[r.score]}`}>{r.score}</Badge>
                        </td>
                        <td className="py-2.5 text-muted-foreground max-w-[250px]">{r.commentary}</td>
                        <td className="py-2.5 text-muted-foreground max-w-[200px]">{r.modelImpact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== IC OUTPUT ===== */}
        <TabsContent value="ic-output" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* IC Recommendation */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-display">Investment Committee Recommendation</CardTitle>
                  <Badge className="text-sm px-3 py-1" variant={mockICRecommendation.recommendation === "Invest" ? "default" : "destructive"}>
                    {mockICRecommendation.recommendation}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Fund</p>
                  <p className="text-sm font-medium">{mockICRecommendation.fund}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Sizing Guidance</p>
                  <p className="text-sm">{mockICRecommendation.sizingGuidance}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Conditions & Caveats</p>
                  <div className="space-y-2">
                    {mockICRecommendation.conditions.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-3.5 w-3.5 text-warning flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alignment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display">Objective Alignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Theme Purity", value: mockICRecommendation.themePurity },
                  { label: "Risk Alignment", value: mockICRecommendation.riskAlignment },
                  { label: "Portfolio Fit", value: mockICRecommendation.portfolioFit },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-sm font-medium">{item.label}</span>
                    <Badge
                      variant={item.value === "Strong" || item.value === "Aligned" ? "default" : item.value === "Moderate" || item.value === "Marginal" ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {item.value === "Strong" || item.value === "Aligned" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : item.value === "Weak" || item.value === "Misaligned" ? (
                        <XCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Minus className="h-3 w-3 mr-1" />
                      )}
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Deliverables Checklist */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display">Standard Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Investment Model Pack", items: ["Cashflow model", "Sensitivity tables", "Scenario outcomes"], icon: BarChart3, status: "Complete" },
                  { title: "Risk Profile Summary", items: ["Heat map", "Key risk drivers", "Mitigants"], icon: Shield, status: "Complete" },
                  { title: "IC Recommendation", items: ["Invest / Watch / Reject", "Sizing guidance", "Conditions"], icon: Target, status: "Complete" },
                  { title: "Objective Alignment", items: ["Theme purity", "Risk alignment", "Portfolio fit"], icon: FileText, status: "Complete" },
                ].map((d) => (
                  <div key={d.title} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <d.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{d.title}</span>
                    </div>
                    <div className="space-y-1.5">
                      {d.items.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-success" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <Badge variant="default" className="text-[10px] mt-3">{d.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialModeling;
