import { useState } from "react";
import { type Persona } from "@/components/layout/AppSidebar";
import AppTopBar from "@/components/layout/AppTopBar";
import PlaceholderView from "@/components/modules/PlaceholderView";
import AdvisorPlatformSelect from "@/components/dashboard/AdvisorPlatformSelect";
import FiduciarySidebar from "@/components/dashboard/FiduciarySidebar";
import FiduciaryDashboard from "@/components/dashboard/FiduciaryDashboard";
import MeetingIntelligence from "@/components/modules/MeetingIntelligence";
import ICapitalPlatform from "@/components/modules/ICapitalPlatform";
import { ArrowLeft } from "lucide-react";

type ActivePlatform = "select" | "altshub" | "fiduciary" | "icapital" | string;

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  catalog: "Product Catalog",
  portfolio: "Portfolio & Exposure",
  lifecycle: "Lifecycle Events",
  compliance: "Compliance & Surveillance",
  duediligence: "Due Diligence",
  financialmodeling: "Financial Modeling & Risk Profiling",
  documents: "Documents & Data Room",
  suitability: "Suitability & Prospecting",
  subscriptions: "Subscription Management",
  clients: "Clients",
  models: "Model Portfolios",
  watchlist: "Watchlist & Ratings",
  regulatory: "Regulatory & Tax",
  settings: "Settings",
};

const Index = () => {
  const [persona, setPersona] = useState<Persona>("advisor");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [activePlatform, setActivePlatform] = useState<ActivePlatform>("select");
  const [fiduciaryPage, setFiduciaryPage] = useState("dashboard");

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handlePersonaChange = (p: Persona) => {
    setPersona(p);
    setCurrentPage("dashboard");
    setActivePlatform("select");
  };

  const handlePlatformSelect = (platform: string) => {
    setActivePlatform(platform);
    setCurrentPage("dashboard");
    if (platform === "fiduciary") setFiduciaryPage("dashboard");
  };

  const handleBackToHome = () => {
    setActivePlatform("select");
    setCurrentPage("dashboard");
  };

  const showPlatformSelect = activePlatform === "select";
  const showAltsHub = activePlatform === "altshub";
  const showFiduciary = activePlatform === "fiduciary";
  const showIcapital = activePlatform === "icapital";

  const [altsHubPage, setAltsHubPage] = useState("dashboard");

  const renderAltsHubContent = () => {
    if (altsHubPage === "dashboard") return <FiduciaryDashboard />;
    if (altsHubPage === "meeting-intelligence") return <MeetingIntelligence onBack={() => setAltsHubPage("dashboard")} />;
    const titles: Record<string, string> = {
      "attrition-risk": "Attrition Risk",
      "document-validator": "Document Validator",
      "life-events": "Life Events",
      "cross-sell-signals": "Cross-Sell Signals",
      "risk-drift-monitor": "Risk Drift Monitor",
      "orchestration": "Orchestration",
      "signal-bridge": "Signal Bridge",
      "fiduciary-dashboard": "Fiduciary Dashboard",
      "settings": "Settings",
    };
    return <PlaceholderView title={titles[altsHubPage] || altsHubPage} description={`${titles[altsHubPage] || altsHubPage} module — coming soon.`} />;
  };

  const renderFiduciaryContent = () => {
    if (fiduciaryPage === "dashboard") return <FiduciaryDashboard />;
    if (fiduciaryPage === "meeting-intelligence") return <MeetingIntelligence onBack={() => setFiduciaryPage("dashboard")} />;
    const titles: Record<string, string> = {
      "attrition-risk": "Attrition Risk",
      "document-validator": "Document Validator",
      "life-events": "Life Events",
      "cross-sell-signals": "Cross-Sell Signals",
      "risk-drift-monitor": "Risk Drift Monitor",
      "orchestration": "Orchestration",
      "signal-bridge": "Signal Bridge",
      "fiduciary-dashboard": "Fiduciary Dashboard",
      "settings": "Settings",
    };
    return <PlaceholderView title={titles[fiduciaryPage] || fiduciaryPage} description={`${titles[fiduciaryPage] || fiduciaryPage} module — coming soon.`} />;
  };

  const getPlatformTitle = () => {
    if (showAltsHub) return "ALT's Hub";
    if (showFiduciary) return "Fiduciary Intelligence Platform";
    if (showIcapital) return "iCapital";
    return activePlatform;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* ALT's Hub sidebar — mirrors fiduciary */}
      {showAltsHub && (
        <FiduciarySidebar currentPage={altsHubPage} onNavigate={setAltsHubPage} />
      )}
      {/* Fiduciary sidebar */}
      {showFiduciary && (
        <FiduciarySidebar currentPage={fiduciaryPage} onNavigate={setFiduciaryPage} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Back bar when inside any platform */}
        {!showPlatformSelect && (
          <div className="flex items-center border-b border-border bg-card px-0 flex-shrink-0">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-1.5 px-4 py-3.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        )}

        {!showPlatformSelect && (
          <AppTopBar
            title={getPlatformTitle()}
            persona={persona}
          />
        )}

        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {showPlatformSelect ? (
            <AdvisorPlatformSelect onSelect={handlePlatformSelect} onPersonaChange={handlePersonaChange} currentPersona={persona} />
          ) : showAltsHub ? (
            renderAltsHubContent()
          ) : showFiduciary ? (
            renderFiduciaryContent()
          ) : showIcapital ? (
            <ICapitalPlatform />
          ) : (
            <PlaceholderView title={activePlatform} description={`${activePlatform} platform — coming soon.`} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
