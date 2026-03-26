import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, ArrowLeft } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, Legend, ResponsiveContainer } from "recharts";

type ICapitalView = "reporting" | "detail";

const categoryData = [
  { name: "Private Equity", value: 303750, twr: "↑ 38.7%" },
  { name: "Private Credit", value: 201000, twr: "↑ 26.0%" },
  { name: "Hedge Fund", value: 200500, twr: "↑ 12.8%" },
  { name: "Real Estate", value: 196875, twr: "↑ 8.4%" },
];

const reportingStyleData = [
  { name: "Drawdown", value: 303750, twr: "↑ 36.7%" },
  { name: "Evergreen", value: 261000, twr: "↑ 29.8%" },
  { name: "Hybrid", value: 200500, twr: "↑ 12.8%" },
];

const strategyData = [
  { name: "Buyout", value: 303750, twr: "↑ 1.8%" },
  { name: "Real assets", value: 261000, twr: "↑ 11.4%" },
  { name: "Distressed", value: 200500, twr: "↑ 7.2%" },
  { name: "Venture gro...", value: 196875, twr: "↑ 3.0%" },
  { name: "Special situ...", value: 163875, twr: "↑ 6.4%" },
];

const COLORS = ["hsl(210, 60%, 45%)", "hsl(210, 40%, 60%)", "hsl(210, 30%, 75%)", "hsl(30, 70%, 55%)", "hsl(150, 40%, 50%)"];

const holdingsData = [
  { name: "Global Macro Access Fund, Ltd.", style: "Evergreen", value: "$325,765", pct: "2.29%", twrYtd: "↑ 11.49%", twrSi: "↑ 13.46%" },
  { name: "Real Estate Investment Trust", style: "Evergreen", value: "$628,406", pct: "4.42%", twrYtd: "↑ 9.68%", twrSi: "↑ 5.24%" },
  { name: "Private Credit Fund LLC", style: "Drawdown", value: "$576,975", pct: "4.06%", twrYtd: "↑ 4.27%", twrSi: "↑ 8.07%" },
  { name: "iCapital Equity Buyout Access Fund III L.P.", style: "Drawdown", value: "$320,809", pct: "2.26%", twrYtd: "↑ 7.42%", twrSi: "↑ 7.38%" },
  { name: "iCapital Multi-Manager Private Equity Fu...", style: "Drawdown", value: "$515,000", pct: "3.62%", twrYtd: "↓ 0.63%", twrSi: "↓ 1.33%" },
  { name: "iCapital Private Equity Venture Fund", style: "Drawdown", value: "$489,748", pct: "3.45%", twrYtd: "↑ 11.24%", twrSi: "↑ 10.08%" },
  { name: "iCapital Strategic Private Credit Fund", style: "Hybrid", value: "$535,521", pct: "3.86%", twrYtd: "↑ 9.41%", twrSi: "↑ 6.45%" },
];

const investmentOverviewData = [
  { period: "2011", contributions: 0, distributions: 0, nav: 0, totalValue: 0, moic: 0 },
  { period: "2013", contributions: 50, distributions: 0, nav: 45, totalValue: 45, moic: 0.7 },
  { period: "2015", contributions: 100, distributions: 10, nav: 80, totalValue: 90, moic: 0.8 },
  { period: "2017", contributions: 150, distributions: 30, nav: 120, totalValue: 150, moic: 0.9 },
  { period: "2019", contributions: 200, distributions: 80, nav: 180, totalValue: 260, moic: 1.05 },
  { period: "2021", contributions: 225, distributions: 150, nav: 220, totalValue: 370, moic: 1.4 },
  { period: "2023", contributions: 225, distributions: 225, nav: 263, totalValue: 488, moic: 2.0 },
];

const navBridgeData = [
  { name: "Beginning NAV", value: 30 },
  { name: "Contributions", value: 50 },
  { name: "Distributions", value: 95 },
  { name: "Valuation Change", value: 200 },
  { name: "Ending NAV", value: 105 },
];

const BRIDGE_COLORS = ["hsl(210, 60%, 50%)", "hsl(210, 60%, 50%)", "hsl(25, 80%, 55%)", "hsl(25, 80%, 55%)", "hsl(210, 60%, 50%)"];

const ICapitalPlatform = () => {
  const [view, setView] = useState<ICapitalView>("reporting");
  const [reportTab, setReportTab] = useState<"performance" | "holdings" | "documents">("performance");
  const [detailTab, setDetailTab] = useState<"overview" | "cashflow" | "documents">("overview");

  if (view === "detail") {
    return (
      <div className="space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setView("reporting")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h2 className="text-lg font-semibold text-foreground">Investment Reporting: Alternative Investments</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Quarterly Performance Update</Button>
            <Button size="sm" className="bg-primary text-primary-foreground">
              <Download className="h-3 w-3 mr-1" /> Download PDF
            </Button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "Advisor", value: "Peter Volkov" },
            { label: "Investor", value: "Benjamin Harrington" },
            { label: "Account", value: "Benjamin Harrington" },
            { label: "Fund", value: "RRP Direct Fund" },
            { label: "Currency", value: "USD" },
          ].map((f) => (
            <div key={f.label} className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">{f.label}</span>
              <Select defaultValue={f.value}>
                <SelectTrigger className="h-8 text-xs w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={f.value}>{f.value}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <h3 className="text-base font-semibold text-foreground">Benjamin Harrington - RRP Direct Fund</h3>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border">
          {(["overview", "cashflow", "documents"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setDetailTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                detailTab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "cashflow" ? "Cash Flow" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Commitment Stats */}
        <Card className="p-4">
          <div className="flex gap-6 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground">Total Commitment</p>
              <p className="text-lg font-bold text-foreground">USD <span className="text-xl">500K</span></p>
              <div className="text-[10px] text-muted-foreground mt-1 space-y-0.5">
                <p>• 250K Contributions</p>
                <p>• 0 Recallable Distributions</p>
                <p>• 0 (0%) Unfunded Commitment</p>
              </div>
            </div>
            {[
              { label: "Contributions", value: "500K", date: "30-Sep-2023" },
              { label: "Distributions", value: "600K", date: "30-Sep-2023" },
              { label: "NAV", value: "71K", date: "30-Sep-2023" },
              { label: "Total Value", value: "671K", date: "30-Sep-2023" },
              { label: "Net MOIC", value: "1.34x", date: "30-Sep-2023" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.date}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Investment Overview <span className="text-[10px] text-muted-foreground">(as of 30-Sep-2023)</span></h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={investmentOverviewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="period" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Area type="monotone" dataKey="contributions" stackId="1" fill="hsl(210, 60%, 50%)" stroke="hsl(210, 60%, 50%)" fillOpacity={0.3} />
                <Area type="monotone" dataKey="distributions" stackId="2" fill="hsl(150, 50%, 50%)" stroke="hsl(150, 50%, 50%)" fillOpacity={0.3} />
                <Area type="monotone" dataKey="nav" stackId="3" fill="hsl(30, 70%, 55%)" stroke="hsl(30, 70%, 55%)" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">12-Month Net Asset Value Bridge <span className="text-[10px] text-muted-foreground">(as of 30-Sep-2023)</span></h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={navBridgeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="value">
                  {navBridgeData.map((_, index) => (
                    <Cell key={index} fill={BRIDGE_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    );
  }

  // Reporting view
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Investment Reporting: Alternative Investments</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="avery">
            <SelectTrigger className="h-8 text-xs w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="avery">Advisor: Avery Daniels</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="bg-primary text-primary-foreground">
            <Download className="h-3 w-3 mr-1" /> Create report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border">
        {(["performance", "holdings", "documents"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setReportTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              reportTab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {reportTab === "performance" && (
        <>
          {/* Filter Row */}
          <div className="flex gap-2 flex-wrap">
            {["Client: All", "Accounts", "Fund"].map((f) => (
              <Select key={f} defaultValue={f}>
                <SelectTrigger className="h-8 text-xs w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={f}>{f}</SelectItem>
                </SelectContent>
              </Select>
            ))}
          </div>

          {/* Filter Badges */}
          <div className="flex gap-2 flex-wrap">
            {["Summary", "Drawdown", "Evergreen", "Hybrid"].map((b, i) => (
              <Badge key={b} variant={i === 0 ? "default" : "outline"} className="text-xs cursor-pointer">{b}</Badge>
            ))}
            <span className="mx-2 text-muted-foreground">|</span>
            {["All", "Private equity", "Hedge funds", "Real assets", "Private credit"].map((b, i) => (
              <Badge key={b} variant={i === 0 ? "default" : "outline"} className="text-xs cursor-pointer">{b}</Badge>
            ))}
          </div>

          {/* Summary Stats */}
          <Card className="p-4">
            <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
              {[
                { label: "Total holdings", value: "136" },
                { label: "Total accounts", value: "42" },
                { label: "Total clients", value: "30" },
                { label: "Total value", value: "$14.2M" },
                { label: "Change in value (YTD)", value: "↑ 26.2%", highlight: true },
                { label: "TWR (YTD)", value: "↑ 26.2%", highlight: true },
                { label: "IRR (YTD)", value: "↑ 26.2%", highlight: true },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  <p className={`text-lg font-bold ${s.highlight ? "text-green-600" : "text-foreground"}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Sub-tabs */}
          <div className="flex gap-4 text-sm">
            {["Diversification", "Change in NAV", "Client summary"].map((t, i) => (
              <button key={t} className={`pb-1 ${i === 0 ? "text-primary border-b-2 border-primary font-medium" : "text-muted-foreground"}`}>{t}</button>
            ))}
          </div>

          {/* Diversification Charts */}
          <h4 className="text-sm font-semibold text-foreground">Diversification</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Category", data: categoryData, count: 4 },
              { title: "Reporting style", data: reportingStyleData, count: 3 },
              { title: "Strategy", data: strategyData, count: 6 },
            ].map((chart) => (
              <Card key={chart.title} className="p-4">
                <h5 className="text-sm font-medium text-foreground text-center mb-3">{chart.title}</h5>
                <div className="flex justify-center">
                  <PieChart width={140} height={140}>
                    <Pie data={chart.data} cx={70} cy={70} innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                      {chart.data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
                <p className="text-center text-xs text-muted-foreground mb-2">{chart.count} {chart.title.toLowerCase()}s</p>
                <div className="space-y-1 mt-2">
                  {chart.data.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-foreground">{d.name}</span>
                      </div>
                      <span className="text-green-600 font-medium">{d.twr}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {reportTab === "holdings" && (
        <>
          {/* Holdings Stats */}
          <Card className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total holdings", value: "136" },
                { label: "Total accounts", value: "$12K" },
                { label: "Total clients", value: "$16K" },
                { label: "Total value", value: "$14.2M" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* View toggles */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge className="text-xs">Funds</Badge>
              <Badge variant="outline" className="text-xs cursor-pointer">Clients</Badge>
              <button className="text-xs text-muted-foreground hover:text-foreground">+ Add view</button>
            </div>
            <Button variant="outline" size="sm" className="text-xs">Manage views</Button>
          </div>

          {/* Holdings Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Fund name</TableHead>
                  <TableHead className="text-xs">Reporting style</TableHead>
                  <TableHead className="text-xs text-right">Value</TableHead>
                  <TableHead className="text-xs text-right">% of portfolio</TableHead>
                  <TableHead className="text-xs text-right">TWR (YTD)</TableHead>
                  <TableHead className="text-xs text-right">TWR (SI)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingsData.map((h) => (
                  <TableRow
                    key={h.name}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setView("detail")}
                  >
                    <TableCell className="text-xs font-medium text-foreground">{h.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{h.style}</TableCell>
                    <TableCell className="text-xs text-right text-foreground">{h.value}</TableCell>
                    <TableCell className="text-xs text-right text-muted-foreground">{h.pct}</TableCell>
                    <TableCell className="text-xs text-right text-green-600">{h.twrYtd}</TableCell>
                    <TableCell className="text-xs text-right text-green-600">{h.twrSi}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      {reportTab === "documents" && (
        <Card className="p-8 text-center">
          <p className="text-sm text-muted-foreground">Documents view — coming soon.</p>
        </Card>
      )}
    </div>
  );
};

export default ICapitalPlatform;
