import { CompanySnapshotInput } from "./types";
import { pe } from "../valuation/pe";
import { pb } from "../valuation/pb";
import { ps } from "../valuation/ps";
import { peg } from "../valuation/peg";
import { evEbitda, calculateEnterpriseValue } from "../valuation/evEbitda";
import { dividendYield } from "../valuation/dividendYield";
import { roa } from "../profitability/roa";
import { roe } from "../profitability/roe";
import { roic } from "../profitability/roic";
import { grossMargin, operatingMargin, netProfitMargin, fcfMargin } from "../profitability/margins";
import { currentRatio } from "../liquidity/currentRatio";
import { quickRatio } from "../liquidity/quickRatio";
import { debtToEquity } from "../liquidity/debtToEquity";
import { interestCoverage } from "../liquidity/interestCoverage";
import { evaluate } from "../evaluator/evaluate";

/**
 * Runs individual categorical analysis with insights perfectly layered in.
 */

export function analyzeValuation(data: CompanySnapshotInput, withInsights = false) {
  const price = data.price ?? 0;
  const marketCap = data.marketCap ?? 0;
  const ev = calculateEnterpriseValue(marketCap, data.totalDebt ?? 0, data.cashAndEquivalents ?? 0);

  const raw = {
    pe: data.eps ? pe(price, data.eps) : null,
    pb: data.bookValuePerShare ? pb(price, data.bookValuePerShare) : null,
    ps: data.revenuePerShare ? ps(price, data.revenuePerShare) : null,
    peg: data.eps && data.expectedEarningsGrowthRate ? peg(pe(price, data.eps) ?? 0, data.expectedEarningsGrowthRate) : null,
    evEbitda: data.ebitda ? evEbitda(ev, data.ebitda) : null,
    dividendYield: data.annualDividendPerShare ? dividendYield(data.annualDividendPerShare, price) : null,
  };

  if (!withInsights) return raw;

  return {
    pe: evaluate.pe(raw.pe),
    pb: evaluate.pb(raw.pb),
    ps: evaluate.ps(raw.ps),
    peg: evaluate.peg(raw.peg),
    evEbitda: evaluate.evEbitda(raw.evEbitda),
    dividendYield: evaluate.dividendYield(raw.dividendYield),
  };
}

export function analyzeProfitability(data: CompanySnapshotInput, withInsights = false) {
  const raw = {
    roa: data.netIncome && data.totalAssets ? roa(data.netIncome, data.totalAssets) : null,
    roe: data.netIncome && data.totalEquity ? roe(data.netIncome, data.totalEquity) : null,
    roic: data.operatingIncome && data.taxRate !== undefined && data.totalEquity ? roic(data.operatingIncome, data.taxRate, data.totalDebt ?? 0, data.totalEquity, data.cashAndEquivalents ?? 0) : null,
    grossMargin: data.totalRevenue && data.costOfRevenue ? grossMargin(data.totalRevenue, data.costOfRevenue) : null,
    operatingMargin: data.operatingIncome && data.totalRevenue ? operatingMargin(data.operatingIncome, data.totalRevenue) : null,
    netProfitMargin: data.netIncome && data.totalRevenue ? netProfitMargin(data.netIncome, data.totalRevenue) : null,
    fcfMargin: data.freeCashFlow && data.totalRevenue ? fcfMargin(data.freeCashFlow, data.totalRevenue) : null,
  };

  if (!withInsights) return raw;

  return {
    roa: evaluate.roa(raw.roa),
    roe: evaluate.roe(raw.roe),
    roic: evaluate.roic(raw.roic),
    grossMargin: evaluate.margin(raw.grossMargin, "Gross"),
    operatingMargin: evaluate.margin(raw.operatingMargin, "Operating"),
    netProfitMargin: evaluate.margin(raw.netProfitMargin, "Net Profit"),
    fcfMargin: evaluate.margin(raw.fcfMargin, "Free Cash Flow"),
  };
}

export function analyzeLiquidity(data: CompanySnapshotInput, withInsights = false) {
  const raw = {
    currentRatio: data.totalAssets && data.totalLiabilities ? currentRatio(data.totalAssets, data.totalLiabilities) : null,
    quickRatio: data.totalAssets && data.inventory !== undefined && data.totalLiabilities ? quickRatio(data.totalAssets, data.inventory, data.totalLiabilities) : null,
    debtToEquity: data.totalEquity ? debtToEquity(data.totalDebt ?? 0, data.totalEquity) : null,
    interestCoverage: data.ebit && data.interestExpense ? interestCoverage(data.ebit, data.interestExpense) : null,
  };

  if (!withInsights) return raw;

  return {
    currentRatio: evaluate.currentRatio(raw.currentRatio),
    quickRatio: evaluate.quickRatio(raw.quickRatio),
    debtToEquity: evaluate.debtToEquity(raw.debtToEquity),
    interestCoverage: evaluate.interestCoverage(raw.interestCoverage),
  };
}

export function analyzeEfficiency(data: CompanySnapshotInput, withInsights = false) {
  const raw = {
    assetTurnover: data.totalRevenue && data.totalAssets ? data.totalRevenue / data.totalAssets : null,
    inventoryTurnover: data.costOfRevenue && data.inventory ? data.costOfRevenue / data.inventory : null,
  };

  if (!withInsights) return raw;

  return {
    ...raw, // Currently no insight logic for efficiency, keep as is
  };
}

export function analyzeRisk(data: CompanySnapshotInput, withInsights = false) {
  const marketCap = data.marketCap ?? 0;
  const raw = {
    altmanZScore:
      data.workingCapital !== undefined && data.retainedEarnings !== undefined && data.ebit !== undefined && data.totalAssets && data.totalLiabilities
        ? (1.2 * (data.workingCapital / data.totalAssets) +
            1.4 * (data.retainedEarnings / data.totalAssets) +
            3.3 * (data.ebit / data.totalAssets) +
            0.6 * (marketCap / data.totalLiabilities) +
            1.0 * ((data.totalRevenue ?? 0) / data.totalAssets))
        : null,
  };

  if (!withInsights) return raw;

  return {
    altmanZScore: evaluate.altmanZScore(raw.altmanZScore),
  };
}
