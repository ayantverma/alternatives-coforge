// Mock data for Alternatives Hub
export interface AltProduct {
  id: string;
  name: string;
  manager: string;
  strategy: string;
  vehicle: string;
  minInvestment: number;
  targetReturn: string;
  liquidity: string;
  fees: string;
  riskRating: "Low" | "Medium" | "High";
  status: "Open" | "Closing Soon" | "Closed";
  vintage: number;
  aum: number;
  region: string;
  esgScore?: number;
  subscriptionWindow?: string;
}

export interface LifecycleEvent {
  id: string;
  type: "Capital Call" | "Distribution" | "Valuation" | "Notice" | "Redemption";
  fund: string;
  amount: number;
  date: string;
  dueDate?: string;
  status: "Pending" | "Completed" | "Overdue";
  description: string;
}

export interface DDQItem {
  id: string;
  fund: string;
  manager: string;
  status: "In Progress" | "Under Review" | "Approved" | "Watch" | "Restricted";
  score: number;
  lastUpdated: string;
  analyst: string;
  riskFlags: string[];
}

export interface ComplianceAlert {
  id: string;
  type: "Concentration" | "Suitability" | "Regulatory" | "Marketing";
  severity: "High" | "Medium" | "Low";
  description: string;
  fund?: string;
  client?: string;
  date: string;
  status: "Open" | "Resolved" | "Escalated";
}

export interface SubscriptionOrder {
  id: string;
  client: string;
  fund: string;
  amount: number;
  status: "Draft" | "Eligibility Check" | "Suitability Check" | "Packet Generated" | "Client Signed" | "Ops Review" | "Confirmed";
  submittedDate: string;
  missingDocs: string[];
}

export interface PortfolioHolding {
  fund: string;
  strategy: string;
  commitment: number;
  unfunded: number;
  nav: number;
  irr: number;
  moic: number;
  vintage: number;
  sector: string;
  region: string;
}

export const mockProducts: AltProduct[] = [
  {
    id: "pc-01",
    name: "Ares Senior Direct Lending Fund IV",
    manager: "Ares Management",
    strategy: "Private Credit",
    vehicle: "LP",
    minInvestment: 5000000,
    targetReturn: "10-12%",
    liquidity: "Semi-annual",
    fees: "1.0 / 15",
    riskRating: "Medium",
    status: "Open",
    vintage: 2024,
    aum: 12500000000,
    region: "North America",
    esgScore: 72,
    subscriptionWindow: "Q1 2026",
  },
  {
    id: "pc-02",
    name: "Brookfield Real Estate Core Plus",
    manager: "Brookfield Asset Management",
    strategy: "Real Estate",
    vehicle: "REIT",
    minInvestment: 2500000,
    targetReturn: "8-10%",
    liquidity: "Quarterly",
    fees: "0.85 / 12.5",
    riskRating: "Low",
    status: "Open",
    vintage: 2025,
    aum: 8700000000,
    region: "Global",
    esgScore: 85,
    subscriptionWindow: "Rolling",
  },
  {
    id: "pc-03",
    name: "HPS Mezzanine Partners V",
    manager: "HPS Investment Partners",
    strategy: "Private Credit",
    vehicle: "LP",
    minInvestment: 10000000,
    targetReturn: "13-16%",
    liquidity: "Closed-end",
    fees: "1.5 / 20",
    riskRating: "High",
    status: "Closing Soon",
    vintage: 2025,
    aum: 5200000000,
    region: "North America",
    subscriptionWindow: "Mar 2026",
  },
  {
    id: "pc-04",
    name: "Blackstone Secondaries Fund IX",
    manager: "Blackstone",
    strategy: "Secondaries",
    vehicle: "LP",
    minInvestment: 5000000,
    targetReturn: "14-18%",
    liquidity: "Closed-end",
    fees: "1.25 / 17.5",
    riskRating: "Medium",
    status: "Open",
    vintage: 2025,
    aum: 22000000000,
    region: "Global",
    esgScore: 68,
    subscriptionWindow: "Q2 2026",
  },
  {
    id: "pc-05",
    name: "EQT Infrastructure VI",
    manager: "EQT Partners",
    strategy: "Infrastructure",
    vehicle: "LP",
    minInvestment: 10000000,
    targetReturn: "10-14%",
    liquidity: "Closed-end",
    fees: "1.5 / 20",
    riskRating: "Medium",
    status: "Open",
    vintage: 2026,
    aum: 15000000000,
    region: "Europe",
    esgScore: 91,
    subscriptionWindow: "Q3 2026",
  },
  {
    id: "pc-06",
    name: "Apollo Natural Resources III",
    manager: "Apollo Global",
    strategy: "Natural Resources",
    vehicle: "LP",
    minInvestment: 5000000,
    targetReturn: "12-15%",
    liquidity: "Closed-end",
    fees: "1.5 / 20",
    riskRating: "High",
    status: "Closing Soon",
    vintage: 2025,
    aum: 4800000000,
    region: "Global",
    subscriptionWindow: "Feb 2026",
  },
];

export const mockLifecycleEvents: LifecycleEvent[] = [
  { id: "le-01", type: "Capital Call", fund: "Ares Senior Direct Lending IV", amount: 1250000, date: "2026-03-15", dueDate: "2026-03-25", status: "Pending", description: "3rd capital call — 25% of commitment" },
  { id: "le-02", type: "Distribution", fund: "Brookfield Real Estate Core Plus", amount: 340000, date: "2026-03-01", status: "Completed", description: "Q4 2025 quarterly distribution" },
  { id: "le-03", type: "Valuation", fund: "Blackstone Secondaries IX", amount: 5750000, date: "2026-02-28", status: "Completed", description: "Q4 2025 NAV update — +3.2% QoQ" },
  { id: "le-04", type: "Notice", fund: "HPS Mezzanine Partners V", amount: 0, date: "2026-03-10", status: "Pending", description: "Final close extension notice" },
  { id: "le-05", type: "Capital Call", fund: "EQT Infrastructure VI", amount: 2000000, date: "2026-04-01", dueDate: "2026-04-15", status: "Pending", description: "1st capital call — 20% of commitment" },
  { id: "le-06", type: "Redemption", fund: "Brookfield Real Estate Core Plus", amount: 500000, date: "2026-03-20", dueDate: "2026-06-30", status: "Pending", description: "Partial redemption request submitted" },
];

export const mockDDQ: DDQItem[] = [
  { id: "dd-01", fund: "Ares Senior Direct Lending IV", manager: "Ares Management", status: "Approved", score: 92, lastUpdated: "2026-02-15", analyst: "J. Chen", riskFlags: [] },
  { id: "dd-02", fund: "HPS Mezzanine Partners V", manager: "HPS Investment Partners", status: "Under Review", score: 78, lastUpdated: "2026-03-01", analyst: "M. Rivera", riskFlags: ["Valuation independence concern", "Missing SOC2"] },
  { id: "dd-03", fund: "Blackstone Secondaries IX", manager: "Blackstone", status: "Approved", score: 95, lastUpdated: "2026-01-20", analyst: "J. Chen", riskFlags: [] },
  { id: "dd-04", fund: "EQT Infrastructure VI", manager: "EQT Partners", status: "In Progress", score: 0, lastUpdated: "2026-03-05", analyst: "A. Patel", riskFlags: ["Pending ODD review"] },
  { id: "dd-05", fund: "Apollo Natural Resources III", manager: "Apollo Global", status: "Watch", score: 65, lastUpdated: "2026-02-28", analyst: "M. Rivera", riskFlags: ["Key person risk", "ESG concerns", "Leverage above threshold"] },
];

export const mockComplianceAlerts: ComplianceAlert[] = [
  { id: "ca-01", type: "Concentration", severity: "High", description: "Client portfolio illiquid allocation exceeds 35% threshold", client: "Thornton Wealth Partners", date: "2026-03-10", status: "Open" },
  { id: "ca-02", type: "Suitability", severity: "Medium", description: "Product requires Qualified Purchaser status — client accreditation pending verification", fund: "HPS Mezzanine V", client: "Henderson Family Trust", date: "2026-03-08", status: "Open" },
  { id: "ca-03", type: "Regulatory", severity: "High", description: "K-1 tax document deadline approaching — 12 funds pending distribution", date: "2026-03-05", status: "Open" },
  { id: "ca-04", type: "Marketing", severity: "Low", description: "Product page update requires compliance approval before publication", fund: "EQT Infrastructure VI", date: "2026-03-09", status: "Escalated" },
  { id: "ca-05", type: "Concentration", severity: "Medium", description: "Single manager exposure above 15% guideline", client: "Meridian Family Office", fund: "Blackstone Secondaries IX", date: "2026-03-07", status: "Resolved" },
];

export const mockSubscriptions: SubscriptionOrder[] = [
  { id: "SO-2026-001", client: "Henderson Family Trust", fund: "Ares Senior Direct Lending IV", amount: 5000000, status: "Packet Generated", submittedDate: "2026-03-01", missingDocs: ["W-9"] },
  { id: "SO-2026-002", client: "Thornton Wealth Partners", fund: "EQT Infrastructure VI", amount: 10000000, status: "Suitability Check", submittedDate: "2026-03-05", missingDocs: [] },
  { id: "SO-2026-003", client: "Meridian Family Office", fund: "Blackstone Secondaries IX", amount: 7500000, status: "Client Signed", submittedDate: "2026-02-20", missingDocs: [] },
  { id: "SO-2026-004", client: "Waverly Capital", fund: "HPS Mezzanine Partners V", amount: 10000000, status: "Eligibility Check", submittedDate: "2026-03-08", missingDocs: ["Entity docs", "QP attestation"] },
];

export const mockPortfolioHoldings: PortfolioHolding[] = [
  { fund: "Ares Senior Direct Lending IV", strategy: "Private Credit", commitment: 5000000, unfunded: 2500000, nav: 2650000, irr: 11.2, moic: 1.12, vintage: 2024, sector: "Credit", region: "N. America" },
  { fund: "Brookfield RE Core Plus", strategy: "Real Estate", commitment: 2500000, unfunded: 0, nav: 2820000, irr: 9.5, moic: 1.13, vintage: 2023, sector: "Real Estate", region: "Global" },
  { fund: "Blackstone Secondaries IX", strategy: "Secondaries", commitment: 7500000, unfunded: 3750000, nav: 4100000, irr: 16.8, moic: 1.22, vintage: 2025, sector: "Multi-Strategy", region: "Global" },
  { fund: "EQT Infrastructure VI", strategy: "Infrastructure", commitment: 10000000, unfunded: 10000000, nav: 0, irr: 0, moic: 1.0, vintage: 2026, sector: "Infrastructure", region: "Europe" },
  { fund: "Apollo Natural Resources III", strategy: "Natural Resources", commitment: 5000000, unfunded: 1500000, nav: 3800000, irr: 14.2, moic: 1.36, vintage: 2024, sector: "Energy", region: "Global" },
];

export const strategyAllocation = [
  { name: "Private Credit", value: 25, color: "hsl(164, 100%, 18%)" },
  { name: "Real Estate", value: 20, color: "hsl(164, 60%, 35%)" },
  { name: "Secondaries", value: 20, color: "hsl(164, 100%, 25%)" },
  { name: "Infrastructure", value: 20, color: "hsl(210, 100%, 50%)" },
  { name: "Natural Resources", value: 15, color: "hsl(38, 92%, 50%)" },
];

export const regionAllocation = [
  { name: "N. America", value: 45 },
  { name: "Europe", value: 25 },
  { name: "Global", value: 30 },
];

export const vintageDistribution = [
  { vintage: "2022", committed: 3000000, nav: 3400000 },
  { vintage: "2023", committed: 5000000, nav: 5200000 },
  { vintage: "2024", committed: 10000000, nav: 6450000 },
  { vintage: "2025", committed: 15000000, nav: 8000000 },
  { vintage: "2026", committed: 10000000, nav: 0 },
];
