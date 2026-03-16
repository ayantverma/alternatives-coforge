import { useState } from "react";
import AppSidebar, { type Persona } from "@/components/layout/AppSidebar";
import AppTopBar from "@/components/layout/AppTopBar";
import UHNIDashboard from "@/components/dashboard/UHNIDashboard";
import AdvisorDashboard from "@/components/dashboard/AdvisorDashboard";
import PMDashboard from "@/components/dashboard/PMDashboard";
import ResearchDashboard from "@/components/dashboard/ResearchDashboard";
import ProductCatalog from "@/components/modules/ProductCatalog";
import PortfolioExposure from "@/components/modules/PortfolioExposure";
import LifecycleEvents from "@/components/modules/LifecycleEvents";
import ComplianceSurveillance from "@/components/modules/ComplianceSurveillance";
import DueDiligence from "@/components/modules/DueDiligence";
import FinancialModeling from "@/components/modules/FinancialModeling";
import DocumentsView from "@/components/modules/DocumentsView";
import PlaceholderView from "@/components/modules/PlaceholderView";
import AdvisorPlatformSelect from "@/components/dashboard/AdvisorPlatformSelect";
import { cn } from "@/lib/utils";
import { Landmark, BarChart3, Globe, ArrowLeft } from "lucide-react";

type AdvisorPlatform = "select" | "fiduciary" | "alternatives" | "icapital";

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
  const [advisorPlatform, setAdvisorPlatform] = useState<AdvisorPlatform>("select");

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handlePersonaChange = (p: Persona) => {
    setPersona(p);
    setCurrentPage("dashboard");
    if (p === "advisor") {
      setAdvisorPlatform("select");
    }
  };

  const handlePlatformSelect = (platform: "fiduciary" | "alternatives" | "icapital") => {
    setAdvisorPlatform(platform);
    setCurrentPage("dashboard");
  };

  const handleBackToHome = () => {
    setAdvisorPlatform("select");
    setCurrentPage("dashboard");
  };

  const renderContent = () => {
    switch (currentPage) {
      case "catalog":
        return <ProductCatalog />;
      case "portfolio":
        return <PortfolioExposure />;
      case "lifecycle":
        return <LifecycleEvents />;
      case "compliance":
        return <ComplianceSurveillance />;
      case "duediligence":
        return <DueDiligence />;
      case "financialmodeling":
        return <FinancialModeling />;
      case "documents":
        return <DocumentsView />;
      case "suitability":
        return <PlaceholderView title="Suitability & Prospecting" description="Run suitability checks, concentration analysis, and client-product matching with fit scores." />;
      case "subscriptions":
        return <PlaceholderView title="Subscription Management" description="Digital subscription packets, e-sign workflows, document checklists, and status tracking." />;
      case "clients":
        return <PlaceholderView title="Client Management" description="View client profiles, KYC status, accreditation, and alternative investment allocations." />;
      case "models":
        return <PlaceholderView title="Model Portfolios" description="Create and manage alt sleeves, set guardrails, monitor drift, and approve product lists." />;
      case "watchlist":
        return <PlaceholderView title="Watchlist & Ratings" description="Internal fund ratings, peer comparisons, and approved/watch/restricted list management." />;
      case "regulatory":
        return <PlaceholderView title="Regulatory & Tax" description="K-1 distribution tracking, SEC filings, ERISA compliance, UBTI analysis, and tax optimization views." />;
      case "settings":
        return <PlaceholderView title="Settings" description="Role-based access control, entitlements, workflow configuration, and integration management." />;
      case "dashboard":
      default:
        switch (persona) {
          case "uhni":
            return <UHNIDashboard />;
          case "advisor":
            return <AdvisorDashboard />;
          case "pm":
            return <PMDashboard />;
          case "research":
            return <ResearchDashboard />;
        }
    }
  };

  const isAdvisor = persona === "advisor";
  const showPlatformSelect = isAdvisor && advisorPlatform === "select";
  const showFiduciary = isAdvisor && advisorPlatform === "fiduciary";
  const showIcapital = isAdvisor && advisorPlatform === "icapital";
  const showAlternatives = isAdvisor && advisorPlatform === "alternatives";

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Show sidebar only for non-advisor or alternatives platform */}
      {(!isAdvisor || showAlternatives) && (
        <AppSidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          persona={persona}
          onPersonaChange={handlePersonaChange}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Advisor platform tab bar (shown when inside a platform, not on select screen) */}
        {isAdvisor && !showPlatformSelect && (
          <div className="flex items-center border-b border-border bg-card px-0 flex-shrink-0">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-1.5 px-4 py-3.5 text-sm text-muted-foreground hover:text-foreground transition-colors border-r border-border"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
            <button
              onClick={() => handlePlatformSelect("fiduciary")}
              className={cn(
                "flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition-colors",
                showFiduciary
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              )}
            >
              <Landmark className="h-4 w-4" />
              Fiduciary Platform
            </button>
            <button
              onClick={() => handlePlatformSelect("alternatives")}
              className={cn(
                "flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition-colors",
                showAlternatives
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              Alternatives Hub
            </button>
            <button
              onClick={() => handlePlatformSelect("icapital")}
              className={cn(
                "flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition-colors",
                showIcapital
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              )}
            >
              <Globe className="h-4 w-4" />
              iCapital
            </button>
          </div>
        )}

        {!showPlatformSelect && (
          <AppTopBar
            title={
              showFiduciary ? "Fiduciary Intelligence Platform" 
              : showIcapital ? "iCapital"
              : (pageTitles[currentPage] || "Dashboard")
            }
            persona={persona}
          />
        )}

        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {showPlatformSelect ? (
            <AdvisorPlatformSelect onSelect={handlePlatformSelect} />
          ) : showFiduciary ? (
            <PlaceholderView
              title="Fiduciary Intelligence Platform"
              description="Comprehensive fiduciary analytics, client suitability scoring, regulatory compliance monitoring, and advisor performance insights — coming soon."
            />
          ) : showIcapital ? (
            <PlaceholderView
              title="iCapital"
              description="Alternative investment marketplace, fund subscription workflows, and technology-driven investment solutions — coming soon."
            />
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
