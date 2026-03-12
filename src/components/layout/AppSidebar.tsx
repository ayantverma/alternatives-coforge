import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Shield,
  FileSearch,
  ClipboardList,
  PieChart,
  FolderOpen,
  AlertTriangle,
  Settings,
  Search,
  ChevronLeft,
  Users,
  BarChart3,
  Scale,
  TrendingUp,
  Landmark,
  Briefcase,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type Persona = "uhni" | "advisor" | "pm" | "research";

interface AppSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  persona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

const personaLabels: Record<Persona, string> = {
  uhni: "UHNI / Investor",
  advisor: "Wealth Advisor",
  pm: "Portfolio Manager",
  research: "Alt Research Analyst",
};

const personaIcons: Record<Persona, React.ComponentType<any>> = {
  uhni: Landmark,
  advisor: Briefcase,
  pm: TrendingUp,
  research: BarChart3,
};

interface NavSection {
  label: string;
  items: { id: string; label: string; icon: React.ComponentType<any> }[];
}

const navByPersona: Record<Persona, NavSection[]> = {
  uhni: [
    {
      label: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "portfolio", label: "Portfolio & Exposure", icon: PieChart },
      ],
    },
    {
      label: "Investments",
      items: [
        { id: "catalog", label: "Product Catalog", icon: ShoppingBag },
        { id: "lifecycle", label: "Lifecycle Events", icon: ClipboardList },
        { id: "documents", label: "Documents", icon: FolderOpen },
      ],
    },
    {
      label: "Account",
      items: [
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ],
  advisor: [
    {
      label: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "clients", label: "Clients", icon: Users },
      ],
    },
    {
      label: "Alternatives",
      items: [
        { id: "catalog", label: "Product Catalog", icon: ShoppingBag },
        { id: "suitability", label: "Suitability & Prospecting", icon: Shield },
        { id: "subscriptions", label: "Subscriptions", icon: ClipboardList },
        { id: "portfolio", label: "Portfolio & Exposure", icon: PieChart },
      ],
    },
    {
      label: "Operations",
      items: [
        { id: "lifecycle", label: "Lifecycle Events", icon: ClipboardList },
        { id: "documents", label: "Documents", icon: FolderOpen },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ],
  pm: [
    {
      label: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "models", label: "Model Portfolios", icon: BarChart3 },
      ],
    },
    {
      label: "Alternatives",
      items: [
        { id: "catalog", label: "Product Catalog", icon: ShoppingBag },
        { id: "portfolio", label: "Exposure & Risk", icon: PieChart },
        { id: "compliance", label: "Compliance & Surveillance", icon: AlertTriangle },
      ],
    },
    {
      label: "Operations",
      items: [
        { id: "lifecycle", label: "Lifecycle Events", icon: ClipboardList },
        { id: "documents", label: "Documents", icon: FolderOpen },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ],
  research: [
    {
      label: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "watchlist", label: "Watchlist & Ratings", icon: Eye },
      ],
    },
    {
      label: "Research",
      items: [
        { id: "catalog", label: "Product Catalog", icon: ShoppingBag },
        { id: "duediligence", label: "Due Diligence", icon: FileSearch },
        { id: "financialmodeling", label: "Financial Modeling", icon: TrendingUp },
        { id: "regulatory", label: "Regulatory & Tax", icon: Scale },
      ],
    },
    {
      label: "Operations",
      items: [
        { id: "compliance", label: "Compliance", icon: AlertTriangle },
        { id: "documents", label: "Documents", icon: FolderOpen },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ],
};

const AppSidebar = ({ currentPage, onNavigate, persona, onPersonaChange }: AppSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const sections = navByPersona[persona];
  const PersonaIcon = personaIcons[persona];

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-card transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-border px-3 gap-2">
        {!collapsed ? (
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary flex-shrink-0">
              <Landmark className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-display leading-tight">Alternatives Hub</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Northern Trust</span>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Landmark className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Persona Switcher */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-border">
          <Select value={persona} onValueChange={(v) => onPersonaChange(v as Persona)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(personaLabels) as Persona[]).map((p) => {
                const Icon = personaIcons[p];
                return (
                  <SelectItem key={p} value={p}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      {personaLabels[p]}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 bg-muted/50 border-0 focus-visible:ring-1" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
        {sections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = currentPage === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
