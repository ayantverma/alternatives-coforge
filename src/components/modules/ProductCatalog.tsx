import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ArrowUpDown, Eye, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { mockProducts, type AltProduct } from "@/data/mockData";

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const strategies = [...new Set(mockProducts.map((p) => p.strategy))];

  const filtered = mockProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStrategy = strategyFilter === "all" || p.strategy === strategyFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStrategy && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search funds, managers..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={strategyFilter} onValueChange={setStrategyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strategies</SelectItem>
                {strategies.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closing Soon">Closing Soon</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-display leading-snug">{product.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.manager}</p>
                </div>
                <Badge
                  variant={product.status === "Closing Soon" ? "destructive" : product.status === "Open" ? "default" : "secondary"}
                  className="text-[10px] flex-shrink-0 ml-2"
                >
                  {product.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mt-2">
                <div>
                  <span className="text-muted-foreground">Strategy</span>
                  <p className="font-medium">{product.strategy}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Target Return</span>
                  <p className="font-medium">{product.targetReturn}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Min Investment</span>
                  <p className="font-medium">${(product.minInvestment / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fees</span>
                  <p className="font-medium">{product.fees}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Liquidity</span>
                  <p className="font-medium">{product.liquidity}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Risk</span>
                  <p className={`font-medium ${
                    product.riskRating === "High" ? "text-destructive" :
                    product.riskRating === "Medium" ? "text-warning" : "text-success"
                  }`}>{product.riskRating}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <Badge variant="outline" className="text-[10px]">{product.vehicle}</Badge>
                <Badge variant="outline" className="text-[10px]">{product.region}</Badge>
                <Badge variant="outline" className="text-[10px]">{product.vintage}</Badge>
                {product.esgScore && (
                  <Badge variant="outline" className="text-[10px]">ESG: {product.esgScore}</Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" variant="default" className="text-xs flex-1">
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Star className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
