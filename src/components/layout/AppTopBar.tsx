import { Bell, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Persona } from "./AppSidebar";

interface AppTopBarProps {
  title: string;
  persona: Persona;
}

const personaTitles: Record<Persona, string> = {
  uhni: "Investor Portal",
  advisor: "Wealth Advisor",
  pm: "Portfolio Manager",
  research: "Alt Research Desk",
};

const AppTopBar = ({ title, persona }: AppTopBarProps) => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6 flex-shrink-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Alternatives Hub</span>
        <span>/</span>
        <span>{personaTitles[persona]}</span>
        <span>/</span>
        <span className="font-medium text-foreground">{title}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Sarah Mitchell</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};

export default AppTopBar;
