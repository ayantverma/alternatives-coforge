import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Landmark, Globe, Briefcase, TrendingUp, Eye } from "lucide-react";
import type { Persona } from "@/components/layout/AppSidebar";

type AdvisorPlatform = "fiduciary" | "alternatives" | "icapital";

interface AdvisorPlatformSelectProps {
  onSelect: (platform: AdvisorPlatform) => void;
  onPersonaChange: (persona: Persona) => void;
}

const platforms = [
  {
    id: "fiduciary" as AdvisorPlatform,
    title: "Fiduciary Platform",
    subtitle: "AI-powered wealth management and client intelligence",
    description: "Access dashboard, meeting intelligence, attrition risk monitoring, and more",
    icon: Landmark,
    gradient: "from-ntgreen to-ntgreen-light",
    buttonLabel: "Enter Fiduciary Platform →",
  },
  {
    id: "alternatives" as AdvisorPlatform,
    title: "Alternatives Hub",
    subtitle: "Alternative investment management and operations",
    description: "Manage products, subscriptions, portfolio analytics, and compliance",
    icon: BarChart3,
    gradient: "from-[hsl(210,60%,35%)] to-[hsl(210,80%,45%)]",
    buttonLabel: "Enter Alternatives Hub →",
  },
  {
    id: "icapital" as AdvisorPlatform,
    title: "iCapital",
    subtitle: "Alternative investment marketplace and technology",
    description: "Access iCapital's platform for alternative investment solutions and fund management",
    icon: Globe,
    gradient: "from-[hsl(250,60%,40%)] to-[hsl(250,80%,55%)]",
    buttonLabel: "Enter iCapital →",
  },
];

const personaTiles = [
  {
    id: "uhni" as Persona,
    title: "UHNI / Investor",
    subtitle: "High-net-worth investor portal",
    description: "Portfolio overview, investment catalog, lifecycle events, and documents",
    icon: Landmark,
    gradient: "from-[hsl(30,70%,45%)] to-[hsl(30,80%,55%)]",
    buttonLabel: "Enter Investor Portal →",
  },
  {
    id: "advisor" as Persona,
    title: "Wealth Advisor",
    subtitle: "Client management and advisory tools",
    description: "Client portfolios, suitability analysis, subscriptions, and compliance",
    icon: Briefcase,
    gradient: "from-ntgreen to-ntgreen-light",
    buttonLabel: "Enter Advisor View →",
  },
  {
    id: "pm" as Persona,
    title: "Portfolio Manager",
    subtitle: "Portfolio construction and risk management",
    description: "Model portfolios, exposure analysis, compliance surveillance, and operations",
    icon: TrendingUp,
    gradient: "from-[hsl(200,60%,35%)] to-[hsl(200,80%,50%)]",
    buttonLabel: "Enter PM View →",
  },
  {
    id: "research" as Persona,
    title: "Alt Research Analyst",
    subtitle: "Research, due diligence, and financial modeling",
    description: "Watchlist management, due diligence, financial modeling, and regulatory analysis",
    icon: Eye,
    gradient: "from-[hsl(280,50%,40%)] to-[hsl(280,70%,55%)]",
    buttonLabel: "Enter Research Desk →",
  },
];

const AdvisorPlatformSelect = ({ onSelect, onPersonaChange }: AdvisorPlatformSelectProps) => {
  return (
    <div className="flex flex-col items-center justify-start min-h-[70vh] animate-fade-in px-6 py-8">
      <h1 className="text-2xl font-display mb-2 text-foreground">Fiduciary Intelligence Platform</h1>
      <p className="text-sm text-muted-foreground mb-10">Select a platform or persona to get started</p>

      {/* Platform Tiles */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-3 self-start max-w-5xl w-full mx-auto">
        Platforms
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-10">
        {platforms.map((p) => (
          <Card
            key={p.id}
            className="flex flex-col overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onSelect(p.id)}
          >
            <div className={`bg-gradient-to-br ${p.gradient} p-5 text-white`}>
              <h3 className="text-lg font-display">{p.title}</h3>
              <p className="text-xs opacity-90 mt-1">{p.subtitle}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 flex-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted mb-4">
                <p.icon className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mb-6">{p.description}</p>
              <Button
                size="sm"
                className={`mt-auto bg-gradient-to-r ${p.gradient} text-white border-0 hover:opacity-90`}
              >
                {p.buttonLabel}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Persona Tiles */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-3 self-start max-w-5xl w-full mx-auto">
        Personas
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 max-w-5xl w-full">
        {personaTiles.map((p) => (
          <Card
            key={p.id}
            className="flex flex-col overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onPersonaChange(p.id)}
          >
            <div className={`bg-gradient-to-br ${p.gradient} p-4 text-white`}>
              <h3 className="text-sm font-display">{p.title}</h3>
              <p className="text-[10px] opacity-90 mt-0.5">{p.subtitle}</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 flex-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted mb-3">
                <p.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-[11px] text-muted-foreground mb-4">{p.description}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-auto text-xs"
              >
                {p.buttonLabel}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdvisorPlatformSelect;
