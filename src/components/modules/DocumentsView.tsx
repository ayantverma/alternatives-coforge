import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, FileText, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const documents = [
  { id: "d-01", name: "Ares SDL IV — Private Placement Memorandum", type: "PPM", fund: "Ares Senior Direct Lending IV", date: "2024-06-15", size: "4.2 MB" },
  { id: "d-02", name: "Ares SDL IV — Limited Partnership Agreement", type: "LPA", fund: "Ares Senior Direct Lending IV", date: "2024-06-15", size: "8.1 MB" },
  { id: "d-03", name: "Brookfield RE — Audited Financial Statements FY2025", type: "Financial", fund: "Brookfield RE Core Plus", date: "2026-02-20", size: "2.8 MB" },
  { id: "d-04", name: "Blackstone Secondaries IX — DDQ Response", type: "DDQ", fund: "Blackstone Secondaries IX", date: "2025-11-10", size: "1.5 MB" },
  { id: "d-05", name: "EQT Infrastructure VI — Subscription Documents", type: "Subscription", fund: "EQT Infrastructure VI", date: "2026-03-01", size: "3.4 MB" },
  { id: "d-06", name: "Apollo NR III — K-1 Tax Document (2025)", type: "Tax", fund: "Apollo Natural Resources III", date: "2026-03-05", size: "0.8 MB" },
  { id: "d-07", name: "HPS Mezzanine V — Capital Call Notice #2", type: "Notice", fund: "HPS Mezzanine Partners V", date: "2026-02-28", size: "0.3 MB" },
  { id: "d-08", name: "Portfolio Quarterly Report — Q4 2025", type: "Report", fund: "All Funds", date: "2026-01-31", size: "5.6 MB" },
];

const DocumentsView = () => {
  const [search, setSearch] = useState("");
  const filtered = documents.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.fund.toLowerCase().includes(search.toLowerCase())
  );

  const typeColor = (type: string) => {
    switch (type) {
      case "PPM": case "LPA": return "bg-primary/10 text-primary";
      case "Tax": return "bg-warning/10 text-warning";
      case "DDQ": return "bg-info/10 text-info";
      case "Financial": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display">Document Data Room</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search documents..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Document</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Fund</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Size</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge className={`text-[10px] ${typeColor(doc.type)}`} variant="outline">{doc.type}</Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{doc.fund}</td>
                    <td className="py-3 text-muted-foreground">{doc.date}</td>
                    <td className="py-3 text-muted-foreground">{doc.size}</td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Download className="h-3 w-3 mr-1" /> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsView;
