import { useState } from "react";
import {
  LayoutDashboard,
  BrainCircuit,
  AlertTriangle,
  FileCheck,
  CalendarDays,
  TrendingUp,
  Activity,
  Network,
  GitBranch,
  BarChart3,
  Settings,
  ChevronLeft,
  Search,
  Landmark,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FiduciarySidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "meeting-intelligence", label: "Meeting Intelligence", icon: BrainCircuit },
  { id: "attrition-risk", label: "Attrition Risk", icon: AlertTriangle },
  { id: "document-validator", label: "Document Validator", icon: FileCheck },
  { id: "life-events", label: "Life Events", icon: CalendarDays },
  { id: "cross-sell-signals", label: "Cross-Sell Signals", icon: TrendingUp },
  { id: "risk-drift-monitor", label: "Risk Drift Monitor", icon: Activity },
  { id: "orchestration", label: "Orchestration", icon: Network },
  { id: "signal-bridge", label: "Signal Bridge", icon: GitBranch },
  { id: "fiduciary-dashboard", label: "Fiduciary Dashboard", icon: BarChart3 },
];

const FiduciarySidebar = ({ currentPage, onNavigate }: FiduciarySidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-border px-3 gap-2">
        {!collapsed ? (
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary flex-shrink-0">
              <Landmark className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-display leading-tight">Fiduciary Intelligence</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Platform</span>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary mx-auto">
            <Landmark className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients, products, orders…"
              className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 text-xs h-8"
            />
          </div>
        </div>
      )}

      {/* Nav label */}
      {!collapsed && (
        <p className="px-5 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Platform
        </p>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-1">
        {navItems.map((item) => {
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
              {!collapsed && <span className="text-xs">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Settings + Collapse */}
      <div className="border-t border-border p-3 space-y-1">
        <button
          onClick={() => onNavigate("settings")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            currentPage === "settings"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span className="text-xs">Settings</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span className="text-xs ml-2">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default FiduciarySidebar;
