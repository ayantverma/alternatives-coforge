// Financial Modeling & Risk Profiling Mock Data

export interface FundCashflowModel {
  id: string;
  fundName: string;
  manager: string;
  strategy: string;
  vintage: number;
  commitment: number;
  capitalCallSchedule: { year: number; pct: number; amount: number }[];
  feeStructure: {
    mgmtFee: number;
    mgmtFeeStepdown: string;
    carry: number;
    hurdle: number;
    recycling: boolean;
  };
  projectedOutputs: {
    netIRR: number;
    tvpi: number;
    dpi: number;
    jCurveDepthPct: number;
    jCurveDurationYrs: number;
    paybackYears: number;
  };
  scenarios: ScenarioOutput[];
  netCashflows: { year: number; calls: number; distributions: number; netCF: number; cumCF: number }[];
}

export interface DealLevelModel {
  id: string;
  dealName: string;
  fund: string;
  sector: string;
  entryValuation: number;
  entryMultiple: number;
  debtToEquity: number;
  projections: { year: number; revenue: number; ebitda: number; margin: number; fcf: number }[];
  exitScenarios: { scenario: string; exitMultiple: number; exitYear: number; grossMOIC: number; grossIRR: number; equityCF: number }[];
  covenants: { metric: string; threshold: string; current: string; headroom: string; status: "OK" | "Watch" | "Breach" }[];
  breakeven: { metric: string; value: string }[];
}

export interface PortfolioImpactModel {
  candidateFund: string;
  proposedCommitment: number;
  currentPortfolioIRR: number;
  proFormaIRR: number;
  liquidityImpact: { quarter: string; currentDrawdown: number; proFormaDrawdown: number }[];
  concentrationImpact: { dimension: string; current: number; proForma: number; limit: number }[];
  vintageExposure: { vintage: string; currentPct: number; proFormaPct: number }[];
}

export interface SecondaryPricingModel {
  id: string;
  fundName: string;
  manager: string;
  currentNAV: number;
  askPrice: number;
  discount: number;
  expectedCashflows: { year: number; amount: number }[];
  impliedIRR: number;
  sensitivityToTiming: { delayMonths: number; irr: number }[];
  sensitivityToDiscount: { discountRate: number; fairValue: number }[];
}

export interface AssumptionRegister {
  category: "Market" | "Operational" | "Capital Structure" | "Fees" | "Behavior" | "Macro";
  assumption: string;
  value: string;
  source: "GP-Provided" | "Analyst-Derived" | "Market Consensus";
  confidence: "High" | "Medium" | "Low";
  lastUpdated: string;
  commentary: string;
}

export interface ScenarioOutput {
  scenario: string;
  netIRR: number;
  tvpi: number;
  dpi: number;
  lossRate: number;
}

export interface RiskScore {
  dimension: string;
  score: "Low" | "Medium" | "Medium-High" | "High";
  numericScore: number;
  commentary: string;
  modelImpact: string;
}

export interface ICRecommendation {
  fund: string;
  recommendation: "Invest" | "Watch" | "Reject";
  sizingGuidance: string;
  conditions: string[];
  themePurity: "Strong" | "Moderate" | "Weak";
  riskAlignment: "Aligned" | "Marginal" | "Misaligned";
  portfolioFit: "Strong" | "Moderate" | "Weak";
}

// Mock Data

export const mockFundCashflow: FundCashflowModel = {
  id: "fcm-01",
  fundName: "EQT Infrastructure VI",
  manager: "EQT Partners",
  strategy: "Infrastructure",
  vintage: 2026,
  commitment: 10000000,
  capitalCallSchedule: [
    { year: 2026, pct: 20, amount: 2000000 },
    { year: 2027, pct: 25, amount: 2500000 },
    { year: 2028, pct: 25, amount: 2500000 },
    { year: 2029, pct: 20, amount: 2000000 },
    { year: 2030, pct: 10, amount: 1000000 },
  ],
  feeStructure: {
    mgmtFee: 1.5,
    mgmtFeeStepdown: "Steps down to 1.0% after investment period (Year 5)",
    carry: 20,
    hurdle: 8,
    recycling: true,
  },
  projectedOutputs: {
    netIRR: 12.4,
    tvpi: 1.85,
    dpi: 0.0,
    jCurveDepthPct: -8.2,
    jCurveDurationYrs: 3.5,
    paybackYears: 5.2,
  },
  scenarios: [
    { scenario: "Base Case", netIRR: 12.4, tvpi: 1.85, dpi: 1.45, lossRate: 2 },
    { scenario: "Downside", netIRR: 6.8, tvpi: 1.35, dpi: 0.95, lossRate: 12 },
    { scenario: "Upside", netIRR: 18.2, tvpi: 2.40, dpi: 2.10, lossRate: 0 },
  ],
  netCashflows: [
    { year: 2026, calls: -2000000, distributions: 0, netCF: -2000000, cumCF: -2000000 },
    { year: 2027, calls: -2500000, distributions: 0, netCF: -2500000, cumCF: -4500000 },
    { year: 2028, calls: -2500000, distributions: 200000, netCF: -2300000, cumCF: -6800000 },
    { year: 2029, calls: -2000000, distributions: 800000, netCF: -1200000, cumCF: -8000000 },
    { year: 2030, calls: -1000000, distributions: 2500000, netCF: 1500000, cumCF: -6500000 },
    { year: 2031, calls: 0, distributions: 3500000, netCF: 3500000, cumCF: -3000000 },
    { year: 2032, calls: 0, distributions: 4200000, netCF: 4200000, cumCF: 1200000 },
    { year: 2033, calls: 0, distributions: 3800000, netCF: 3800000, cumCF: 5000000 },
    { year: 2034, calls: 0, distributions: 3500000, netCF: 3500000, cumCF: 8500000 },
  ],
};

export const mockDealLevel: DealLevelModel = {
  id: "dl-01",
  dealName: "NordWind Energy Holdco",
  fund: "EQT Infrastructure VI",
  sector: "Renewable Energy",
  entryValuation: 450000000,
  entryMultiple: 12.5,
  debtToEquity: 1.8,
  projections: [
    { year: 2026, revenue: 120000000, ebitda: 36000000, margin: 30.0, fcf: 22000000 },
    { year: 2027, revenue: 138000000, ebitda: 44160000, margin: 32.0, fcf: 28000000 },
    { year: 2028, revenue: 158700000, ebitda: 52370000, margin: 33.0, fcf: 35000000 },
    { year: 2029, revenue: 178800000, ebitda: 60790000, margin: 34.0, fcf: 42000000 },
    { year: 2030, revenue: 196680000, ebitda: 68838000, margin: 35.0, fcf: 50000000 },
  ],
  exitScenarios: [
    { scenario: "Base (12x)", exitMultiple: 12.0, exitYear: 2031, grossMOIC: 2.4, grossIRR: 19.2, equityCF: 384000000 },
    { scenario: "Downside (9x)", exitMultiple: 9.0, exitYear: 2032, grossMOIC: 1.5, grossIRR: 8.4, equityCF: 240000000 },
    { scenario: "Upside (14x)", exitMultiple: 14.0, exitYear: 2030, grossMOIC: 3.1, grossIRR: 28.5, equityCF: 496000000 },
  ],
  covenants: [
    { metric: "Net Debt / EBITDA", threshold: "< 5.0x", current: "4.2x", headroom: "16%", status: "OK" },
    { metric: "DSCR", threshold: "> 1.3x", current: "1.45x", headroom: "12%", status: "OK" },
    { metric: "Interest Coverage", threshold: "> 2.0x", current: "2.1x", headroom: "5%", status: "Watch" },
    { metric: "Capex / Revenue", threshold: "< 15%", current: "12%", headroom: "20%", status: "OK" },
  ],
  breakeven: [
    { metric: "Exit multiple for 1.0x MOIC", value: "7.2x" },
    { metric: "Min EBITDA for debt service", value: "€28M" },
    { metric: "Revenue decline tolerance", value: "-18%" },
  ],
};

export const mockPortfolioImpact: PortfolioImpactModel = {
  candidateFund: "EQT Infrastructure VI",
  proposedCommitment: 10000000,
  currentPortfolioIRR: 12.8,
  proFormaIRR: 12.6,
  liquidityImpact: [
    { quarter: "Q2 2026", currentDrawdown: 2.1, proFormaDrawdown: 4.2 },
    { quarter: "Q3 2026", currentDrawdown: 1.8, proFormaDrawdown: 3.6 },
    { quarter: "Q4 2026", currentDrawdown: 1.5, proFormaDrawdown: 2.8 },
    { quarter: "Q1 2027", currentDrawdown: 1.2, proFormaDrawdown: 3.5 },
    { quarter: "Q2 2027", currentDrawdown: 0.8, proFormaDrawdown: 2.9 },
    { quarter: "Q3 2027", currentDrawdown: 0.5, proFormaDrawdown: 2.2 },
  ],
  concentrationImpact: [
    { dimension: "Infrastructure", current: 12, proForma: 22, limit: 25 },
    { dimension: "Europe", current: 25, proForma: 32, limit: 35 },
    { dimension: "Single Manager (EQT)", current: 0, proForma: 10, limit: 15 },
    { dimension: "2026 Vintage", current: 5, proForma: 15, limit: 20 },
    { dimension: "Illiquid Allocation", current: 28, proForma: 33, limit: 35 },
  ],
  vintageExposure: [
    { vintage: "2022", currentPct: 10, proFormaPct: 8 },
    { vintage: "2023", currentPct: 18, proFormaPct: 15 },
    { vintage: "2024", currentPct: 32, proFormaPct: 27 },
    { vintage: "2025", currentPct: 35, proFormaPct: 30 },
    { vintage: "2026", currentPct: 5, proFormaPct: 20 },
  ],
};

export const mockSecondaryPricing: SecondaryPricingModel = {
  id: "sp-01",
  fundName: "Blackstone Secondaries IX",
  manager: "Blackstone",
  currentNAV: 4100000,
  askPrice: 3690000,
  discount: 10,
  expectedCashflows: [
    { year: 2026, amount: 400000 },
    { year: 2027, amount: 1200000 },
    { year: 2028, amount: 1800000 },
    { year: 2029, amount: 1500000 },
    { year: 2030, amount: 800000 },
  ],
  impliedIRR: 22.5,
  sensitivityToTiming: [
    { delayMonths: 0, irr: 22.5 },
    { delayMonths: 6, irr: 18.8 },
    { delayMonths: 12, irr: 15.2 },
    { delayMonths: 18, irr: 12.1 },
    { delayMonths: 24, irr: 9.4 },
  ],
  sensitivityToDiscount: [
    { discountRate: 10, fairValue: 4150000 },
    { discountRate: 12, fairValue: 3880000 },
    { discountRate: 14, fairValue: 3620000 },
    { discountRate: 16, fairValue: 3380000 },
    { discountRate: 18, fairValue: 3160000 },
  ],
};

export const mockAssumptions: AssumptionRegister[] = [
  { category: "Market", assumption: "Exit multiples (Infrastructure)", value: "10-14x EBITDA", source: "Market Consensus", confidence: "Medium", lastUpdated: "2026-03-01", commentary: "Based on comparable transactions 2023-2025" },
  { category: "Market", assumption: "Risk-free rate", value: "4.25%", source: "Market Consensus", confidence: "High", lastUpdated: "2026-03-10", commentary: "US 10Y Treasury" },
  { category: "Operational", assumption: "Revenue CAGR", value: "12-15%", source: "GP-Provided", confidence: "Medium", lastUpdated: "2026-02-15", commentary: "Analyst view: 10-13% more realistic given regulatory headwinds" },
  { category: "Operational", assumption: "EBITDA margin expansion", value: "+200bps/yr", source: "GP-Provided", confidence: "Low", lastUpdated: "2026-02-15", commentary: "Historic precedent supports +100-150bps" },
  { category: "Capital Structure", assumption: "Entry leverage", value: "1.8x D/E", source: "GP-Provided", confidence: "High", lastUpdated: "2026-03-05", commentary: "Consistent with infrastructure peers" },
  { category: "Capital Structure", assumption: "Refinancing rate", value: "SOFR + 275bps", source: "Analyst-Derived", confidence: "Medium", lastUpdated: "2026-03-08", commentary: "Based on current credit spread environment" },
  { category: "Fees", assumption: "Management fee stepdown", value: "1.5% → 1.0% at Year 5", source: "GP-Provided", confidence: "High", lastUpdated: "2026-01-20", commentary: "Per LPA terms" },
  { category: "Fees", assumption: "Carry crystallization", value: "Deal-by-deal with clawback", source: "GP-Provided", confidence: "High", lastUpdated: "2026-01-20", commentary: "Standard for EQT funds" },
  { category: "Behavior", assumption: "Capital call pacing", value: "80% in first 4 years", source: "Analyst-Derived", confidence: "Medium", lastUpdated: "2026-02-28", commentary: "Based on EQT Infra IV-V historical pattern" },
  { category: "Behavior", assumption: "Recycling rate", value: "15% of commitments", source: "GP-Provided", confidence: "Low", lastUpdated: "2026-02-15", commentary: "Dependent on early exits — uncertain" },
  { category: "Macro", assumption: "EUR/USD forecast", value: "1.08-1.12", source: "Market Consensus", confidence: "Low", lastUpdated: "2026-03-10", commentary: "High uncertainty — hedging recommended" },
  { category: "Macro", assumption: "EU energy regulation", value: "Stable policy environment", source: "Analyst-Derived", confidence: "Medium", lastUpdated: "2026-03-01", commentary: "Election risk in 2027 could shift subsidies" },
];

export const mockRiskScores: RiskScore[] = [
  { dimension: "Strategy Risk", score: "Low", numericScore: 25, commentary: "Clear, repeatable infra strategy with proven playbook", modelImpact: "N/A — strategy well-defined" },
  { dimension: "Market Risk", score: "Medium", numericScore: 50, commentary: "Cyclical regulatory exposure in renewables", modelImpact: "Multiple compression scenarios modeled" },
  { dimension: "Execution Risk", score: "Low", numericScore: 20, commentary: "Strong operating team, 15+ years track record", modelImpact: "Operational projections validated vs history" },
  { dimension: "Leverage Risk", score: "Medium-High", numericScore: 65, commentary: "Entry D/E 1.8x with tight interest coverage", modelImpact: "Equity wipeout at 9x exit multiple" },
  { dimension: "Liquidity Risk", score: "Medium", numericScore: 45, commentary: "12-year fund life, possible 2-year extension", modelImpact: "Extension delays payback by ~18 months" },
  { dimension: "Manager Risk", score: "Low", numericScore: 15, commentary: "Deep bench, strong GP commit (3%), no key-person concentration", modelImpact: "Minimal — well-diversified team" },
  { dimension: "Regulatory Risk", score: "Medium", numericScore: 55, commentary: "EU energy policy dependency, subsidy exposure", modelImpact: "Revenue decline of -18% if subsidies reduced" },
  { dimension: "ESG Risk", score: "Low", numericScore: 20, commentary: "ESG score 91, strong environmental credentials", modelImpact: "Positive — potential premium at exit" },
];

export const mockICRecommendation: ICRecommendation = {
  fund: "EQT Infrastructure VI",
  recommendation: "Invest",
  sizingGuidance: "$10M commitment (3.3% of alternatives allocation)",
  conditions: [
    "FX hedging required for EUR-denominated capital calls",
    "Monitor interest coverage ratio quarterly — flag if < 2.0x",
    "Revalidate regulatory risk post-2027 EU elections",
    "Cap single-manager exposure to EQT at 15% of alt portfolio",
  ],
  themePurity: "Strong",
  riskAlignment: "Aligned",
  portfolioFit: "Strong",
};
