import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertTriangle, XCircle, Users, Target, TrendingUp, Filter } from "lucide-react";

const suitabilityChecks = [
  { client: "Harrison Family Trust", product: "PE Growth Fund VII", fitScore: 94, status: "pass", risk: "Moderate", concentration: "12%", accredited: true },
  { client: "Waverly Foundation", product: "Infrastructure Credit II", fitScore: 87, status: "pass", risk: "Conservative", concentration: "8%", accredited: true },
  { client: "Chen Holdings LLC", product: "Venture Capital Fund IX", fitScore: 72, status: "review", risk: "Aggressive", concentration: "22%", accredited: true },
  { client: "Morrison IRA", product: "Real Estate Opp. Fund", fitScore: 45, status: "fail", risk: "Moderate", concentration: "35%", accredited: false },
  { client: "Blackwell Endowment", product: "Hedge Fund Multi-Strat", fitScore: 91, status: "pass", risk: "Moderate-Agg", concentration: "15%", accredited: true },
  { client: "Delgado Family Office", product: "Private Credit Fund III", fitScore: 68, status: "review", risk: "Conservative", concentration: "28%", accredited: true },
];

const prospectingLeads = [
  { name: "Thornton Capital Group", aum: "$285M", interest: "Private Equity", likelihood: 85, stage: "Qualified", lastContact: "2 days ago" },
  { name: "Pacific Ridge Advisors", aum: "$142M", interest: "Real Assets", likelihood: 72, stage: "Proposal", lastContact: "1 week ago" },
  { name: "Summit Wealth Partners", aum: "$98M", interest: "Hedge Funds", likelihood: 64, stage: "Discovery", lastContact: "3 days ago" },
  { name: "Meridian Trust Co.", aum: "$410M", interest: "Infrastructure", likelihood: 91, stage: "Negotiation", lastContact: "Today" },
  { name: "Lakewood Family Office", aum: "$67M", interest: "Venture Capital", likelihood: 55, stage: "Outreach", lastContact: "2 weeks ago" },
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "pass") return <CheckCircle className="h-4 w-4 text-emerald-600" />;
  if (status === "review") return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  return <XCircle className="h-4 w-4 text-red-500" />;
};

const SuitabilityProspecting = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Checks Run (MTD)</p>
                <p className="text-xl font-semibold text-foreground">148</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pass Rate</p>
                <p className="text-xl font-semibold text-foreground">82%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Concentration Alerts</p>
                <p className="text-xl font-semibold text-foreground">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Prospects</p>
                <p className="text-xl font-semibold text-foreground">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="suitability" className="w-full">
        <TabsList>
          <TabsTrigger value="suitability">Suitability Checks</TabsTrigger>
          <TabsTrigger value="prospecting">Prospecting Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="suitability" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Client-Product Fit Analysis</CardTitle>
                <Badge variant="outline" className="gap-1 text-xs">
                  <Filter className="h-3 w-3" /> All Statuses
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Fit Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Profile</TableHead>
                    <TableHead>Concentration</TableHead>
                    <TableHead>Accredited</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suitabilityChecks.map((check, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-foreground">{check.client}</TableCell>
                      <TableCell className="text-muted-foreground">{check.product}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={check.fitScore} className="w-16 h-2" />
                          <span className="text-xs font-medium text-foreground">{check.fitScore}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <StatusIcon status={check.status} />
                          <span className="text-xs capitalize">{check.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{check.risk}</TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${parseInt(check.concentration) > 25 ? "text-red-500" : "text-foreground"}`}>
                          {check.concentration}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={check.accredited ? "default" : "destructive"} className="text-xs">
                          {check.accredited ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prospecting" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Prospect Pipeline</CardTitle>
                <Badge variant="outline" className="gap-1 text-xs">
                  <TrendingUp className="h-3 w-3" /> 5 Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prospect</TableHead>
                    <TableHead>AUM</TableHead>
                    <TableHead>Interest Area</TableHead>
                    <TableHead>Likelihood</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Last Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prospectingLeads.map((lead, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-foreground">{lead.name}</TableCell>
                      <TableCell className="text-muted-foreground">{lead.aum}</TableCell>
                      <TableCell className="text-muted-foreground">{lead.interest}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={lead.likelihood} className="w-16 h-2" />
                          <span className="text-xs font-medium text-foreground">{lead.likelihood}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          lead.stage === "Negotiation" ? "default" :
                          lead.stage === "Proposal" ? "secondary" : "outline"
                        } className="text-xs">
                          {lead.stage}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{lead.lastContact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuitabilityProspecting;
