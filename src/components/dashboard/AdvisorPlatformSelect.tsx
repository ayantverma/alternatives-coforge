import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Landmark, Globe } from "lucide-react";

type AdvisorPlatform = "fiduciary" | "alternatives" | "icapital";

interface AdvisorPlatformSelectProps {
  onSelect: (platform: AdvisorPlatform) => void;
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

const AdvisorPlatformSelect = ({ onSelect }: AdvisorPlatformSelectProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in px-6">
      <h1 className="text-2xl font-display mb-2 text-foreground">Fiduciary Intelligence Platform</h1>
      <p className="text-sm text-muted-foreground mb-10">Select a platform to get started</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {platforms.map((p) => (
          <Card
            key={p.id}
            className="flex flex-col overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => onSelect(p.id)}
          >
            {/* Colored header */}
            <div className={`bg-gradient-to-br ${p.gradient} p-5 text-white`}>
              <h3 className="text-lg font-display">{p.title}</h3>
              <p className="text-xs opacity-90 mt-1">{p.subtitle}</p>
            </div>

            {/* Body */}
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
