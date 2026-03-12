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

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handlePersonaChange = (p: Persona) => {
    setPersona(p);
    setCurrentPage("dashboard");
  };

  const renderContent = () => {
    // Shared modules
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

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        persona={persona}
        onPersonaChange={handlePersonaChange}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppTopBar title={pageTitles[currentPage] || "Dashboard"} persona={persona} />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
