import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Landmark, BarChart3, Building2, Wallet, Database, ShieldCheck, TrendingUp, Briefcase, Receipt, DollarSign, Layers } from "lucide-react";
import type { Persona } from "@/components/layout/AppSidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AdvisorPlatform = "fiduciary" | "altshub" | "icapital" | string;

interface PlatformDef {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  buttonLabel: string;
}

interface AdvisorPlatformSelectProps {
  onSelect: (platform: AdvisorPlatform) => void;
  onPersonaChange: (persona: Persona) => void;
  currentPersona: Persona;
}

const personaOptions = [
  { id: "advisor" as Persona, label: "Distribution & Sales - Wealth Advisor" },
  { id: "investor-relations" as Persona, label: "Investor Management - Investor Relations" },
  { id: "pm" as Persona, label: "Investment Management - Portfolio Manager" },
  { id: "controller" as Persona, label: "Finance & Operations - Controller" },
];

const altsHubLauncher: PlatformDef = {
  id: "altshub",
  title: "ALT's Hub",
  subtitle: "Centralized alternatives investment platform",
  description: "Product catalog, portfolio exposure, due diligence, compliance, lifecycle events, and more",
  icon: Layers,
  gradient: "from-ntgreen to-ntgreen-light",
  buttonLabel: "Enter ALT's Hub →",
};

const platformsByPersona: Record<Persona, PlatformDef[]> = {
  advisor: [
    altsHubLauncher,
    {
      id: "icapital",
      title: "iCapital",
      subtitle: "Alternative investment marketplace and technology",
      description: "Access iCapital's platform for alternative investment solutions and fund management",
      icon: Globe,
      gradient: "from-[hsl(250,60%,40%)] to-[hsl(250,80%,55%)]",
      buttonLabel: "Enter iCapital →",
    },
    {
      id: "subscribe",
      title: "Subscribe",
      subtitle: "Subscription management and workflows",
      description: "Digital subscription packets, e-sign workflows, document checklists, and status tracking",
      icon: Receipt,
      gradient: "from-[hsl(200,60%,35%)] to-[hsl(200,80%,50%)]",
      buttonLabel: "Enter Subscribe →",
    },
    {
      id: "subscribe-plus",
      title: "Subscribe++",
      subtitle: "Enhanced subscription and distribution tools",
      description: "Advanced subscription management with analytics, automation, and distribution insights",
      icon: TrendingUp,
      gradient: "from-[hsl(170,50%,35%)] to-[hsl(170,70%,45%)]",
      buttonLabel: "Enter Subscribe++ →",
    },
  ],
  "investor-relations": [
    altsHubLauncher,
    {
      id: "backstop-ir",
      title: "Backstop",
      subtitle: "Investor relations and CRM platform",
      description: "Manage investor communications, reporting, capital activity, and relationship tracking",
      icon: Briefcase,
      gradient: "from-[hsl(220,60%,35%)] to-[hsl(220,80%,50%)]",
      buttonLabel: "Enter Backstop →",
    },
  ],
  pm: [
    altsHubLauncher,
    {
      id: "backstop-pm",
      title: "Backstop",
      subtitle: "Portfolio research and deal management",
      description: "Research management, deal pipeline tracking, and portfolio analytics",
      icon: Briefcase,
      gradient: "from-[hsl(220,60%,35%)] to-[hsl(220,80%,50%)]",
      buttonLabel: "Enter Backstop →",
    },
    {
      id: "chronograph",
      title: "Chronograph",
      subtitle: "Portfolio monitoring and analytics",
      description: "Real-time portfolio monitoring, performance analytics, and LP reporting",
      icon: BarChart3,
      gradient: "from-[hsl(260,50%,40%)] to-[hsl(260,70%,55%)]",
      buttonLabel: "Enter Chronograph →",
    },
    {
      id: "dealcloud",
      title: "DealCloud",
      subtitle: "Deal and relationship management",
      description: "Pipeline management, relationship intelligence, and deal execution workflows",
      icon: Database,
      gradient: "from-[hsl(190,60%,30%)] to-[hsl(190,80%,45%)]",
      buttonLabel: "Enter DealCloud →",
    },
    {
      id: "canoe",
      title: "Canoe",
      subtitle: "Document and data intelligence",
      description: "AI-powered document processing, data extraction, and alternative investment data management",
      icon: ShieldCheck,
      gradient: "from-[hsl(150,50%,30%)] to-[hsl(150,70%,42%)]",
      buttonLabel: "Enter Canoe →",
    },
  ],
  controller: [
    altsHubLauncher,
    {
      id: "alter-domus",
      title: "Alter Domus",
      subtitle: "Fund administration and corporate services",
      description: "End-to-end fund administration, accounting, transfer agency, and depositary services",
      icon: Building2,
      gradient: "from-[hsl(210,60%,35%)] to-[hsl(210,80%,48%)]",
      buttonLabel: "Enter Alter Domus →",
    },
    {
      id: "bny",
      title: "BNY",
      subtitle: "Custody and asset servicing",
      description: "Global custody, fund accounting, transfer agency, and middle-office solutions",
      icon: Landmark,
      gradient: "from-[hsl(230,50%,35%)] to-[hsl(230,70%,50%)]",
      buttonLabel: "Enter BNY →",
    },
    {
      id: "nt-pca",
      title: "NT PCA",
      subtitle: "Northern Trust private capital administration",
      description: "Private capital fund accounting, investor services, and regulatory reporting",
      icon: Wallet,
      gradient: "from-[hsl(280,40%,35%)] to-[hsl(280,60%,50%)]",
      buttonLabel: "Enter NT PCA →",
    },
    {
      id: "custodians",
      title: "Custodians",
      subtitle: "Multi-custodian connectivity and reconciliation",
      description: "Custodian integration, trade settlement, cash management, and position reconciliation",
      icon: DollarSign,
      gradient: "from-[hsl(30,60%,40%)] to-[hsl(30,80%,50%)]",
      buttonLabel: "Enter Custodians →",
    },
    {
      id: "hazeltree",
      title: "Hazeltree",
      subtitle: "Treasury and liquidity management",
      description: "Cash management, financing optimization, collateral management, and counterparty exposure",
      icon: TrendingUp,
      gradient: "from-[hsl(340,50%,35%)] to-[hsl(340,70%,48%)]",
      buttonLabel: "Enter Hazeltree →",
    },
  ],
};

const AdvisorPlatformSelect = ({ onSelect, onPersonaChange, currentPersona }: AdvisorPlatformSelectProps) => {
  const platforms = platformsByPersona[currentPersona] || [];

  return (
    <div className="flex flex-col items-center justify-start min-h-[70vh] animate-fade-in px-6 py-8">
      <div className="flex items-center gap-4 mb-8 w-full max-w-5xl">
        <h1 className="text-2xl font-display text-foreground">Fiduciary Intelligence Platform</h1>
        <Select value={currentPersona} onValueChange={(v) => onPersonaChange(v as Persona)}>
          <SelectTrigger className="w-[320px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {personaOptions.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl w-full">
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
    </div>
  );
};

export default AdvisorPlatformSelect;
