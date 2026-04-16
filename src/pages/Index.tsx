import { useState } from "react";
import AppSidebar, { type Persona } from "@/components/layout/AppSidebar";
import AppTopBar from "@/components/layout/AppTopBar";
import PlaceholderView from "@/components/modules/PlaceholderView";
import AdvisorPlatformSelect from "@/components/dashboard/AdvisorPlatformSelect";
import FiduciarySidebar from "@/components/dashboard/FiduciarySidebar";
import FiduciaryDashboard from "@/components/dashboard/FiduciaryDashboard";
import InvestorRelationsDashboard from "@/components/dashboard/InvestorRelationsDashboard";
import PortfolioManagerDashboard from "@/components/dashboard/PortfolioManagerDashboard";
import ControllerDashboard from "@/components/dashboard/ControllerDashboard";
import MeetingIntelligence from "@/components/modules/MeetingIntelligence";
import ICapitalPlatform from "@/components/modules/ICapitalPlatform";
import ProductCatalog from "@/components/modules/ProductCatalog";
import PortfolioExposure from "@/components/modules/PortfolioExposure";
import DueDiligence from "@/components/modules/DueDiligence";
import ComplianceSurveillance from "@/components/modules/ComplianceSurveillance";
import LifecycleEvents from "@/components/modules/LifecycleEvents";
import FinancialModeling from "@/components/modules/FinancialModeling";
import DocumentsView from "@/components/modules/DocumentsView";
import SuitabilityProspecting from "@/components/modules/SuitabilityProspecting";
import { ArrowLeft } from "lucide-react";

type ActivePlatform = "select" | "altshub" | "fiduciary" | "icapital" | string;

const Index = () => {
  const [persona, setPersona] = useState<Persona>("advisor");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [activePlatform, setActivePlatform] = useState<ActivePlatform>("select");
  const [fiduciaryPage, setFiduciaryPage] = useState("dashboard");
  const [altsHubPage, setAltsHubPage] = useState("dashboard");

  const handlePersonaChange = (p: Persona) => {
    setPersona(p);
    setCurrentPage("dashboard");
    setActivePlatform("select");
  };

  const handlePlatformSelect = (platform: string) => {
    setActivePlatform(platform);
    setCurrentPage("dashboard");
    if (platform === "fiduciary") setFiduciaryPage("dashboard");
    if (platform === "altshub") setAltsHubPage("dashboard");
  };

  const handleBackToHome = () => {
    setActivePlatform("select");
    setCurrentPage("dashboard");
  };

  const showPlatformSelect = activePlatform === "select";
  const showAltsHub = activePlatform === "altshub";
  const showFiduciary = activePlatform === "fiduciary";
  const showIcapital = activePlatform === "icapital";

  const getPersonaDashboard = () => {
    switch (persona) {
      case "advisor": return <FiduciaryDashboard />;
      case "investor-relations": return <InvestorRelationsDashboard />;
      case "pm": return <PortfolioManagerDashboard />;
      case "controller": return <ControllerDashboard />;
      default: return <FiduciaryDashboard />;
    }
  };

  const renderAltsHubContent = () => {
    switch (altsHubPage) {
      case "dashboard": return getPersonaDashboard();
      case "catalog": return <ProductCatalog />;
      case "portfolio": return <PortfolioExposure />;
      case "duediligence": return <DueDiligence />;
      case "compliance": return <ComplianceSurveillance />;
      case "lifecycle": return <LifecycleEvents />;
      case "financialmodeling": return <FinancialModeling />;
      case "documents": return <DocumentsView />;
      case "suitability": return <SuitabilityProspecting />;
      default:
        return <PlaceholderView title={altsHubPage} description={`${altsHubPage} module — coming soon.`} />;
    }
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
      {/* ALT's Hub uses the Alternatives sidebar */}
      {showAltsHub && (
        <AppSidebar
          currentPage={altsHubPage}
          onNavigate={setAltsHubPage}
          persona={persona}
          onPersonaChange={handlePersonaChange}
        />
      )}
      {/* Fiduciary sidebar */}
      {showFiduciary && (
        <FiduciarySidebar currentPage={fiduciaryPage} onNavigate={setFiduciaryPage} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
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
