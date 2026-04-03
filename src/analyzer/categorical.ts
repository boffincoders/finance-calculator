import { CompanySnapshotInput } from "./types";
import { pe } from "../valuation/pe";
import { pb } from "../valuation/pb";
import { ps } from "../valuation/ps";
import { peg } from "../valuation/peg";
import { evEbitda, calculateEnterpriseValue } from "../valuation/evEbitda";
import { dividendYield } from "../valuation/dividendYield";
import { grahamNumber } from "../intrinsic/graham";
import { priceToCashFlow } from "../valuation/priceToCashFlow";
import { earningsYield } from "../valuation/earningsYield";
import { evRevenue } from "../valuation/evRevenue";
import { evFcf } from "../valuation/evFcf";
import { roa } from "../profitability/roa";
import { roe } from "../profitability/roe";
import { roic } from "../profitability/roic";
import { grossMargin, operatingMargin, netProfitMargin, fcfMargin } from "../profitability/margins";
import { currentRatio } from "../liquidity/currentRatio";
import { quickRatio } from "../liquidity/quickRatio";
import { debtToEquity } from "../liquidity/debtToEquity";
import { interestCoverage } from "../liquidity/interestCoverage";
import { assetTurnover } from "../efficiency/assetTurnover";
import { inventoryTurnover } from "../efficiency/inventoryTurnover";
import { receivablesTurnover, daysSalesOutstanding } from "../efficiency/receivablesTurnover";
import { sharpe } from "../risk/sharpe";
import { altmanZScore } from "../risk/altmanZScore";
import { piotroski } from "../risk/piotroski";
import { netDebt, netDebtToEbitda, debtToAssets } from "../solvency/netDebt";
import { payoutRatio } from "../quality/payoutRatio";
import { cashConversionRatio } from "../quality/cashConversionRatio";
import { targetUpside } from "../insights/targetUpside";
import { evaluate } from "../evaluator/evaluate";

// ── Valuation ─────────────────────────────────────────────────────────────────

export function analyzeValuation(data: CompanySnapshotInput, withInsights = false) {
  const price     = data.price ?? 0;
  const marketCap = data.marketCap ?? 0;
  const ev        = calculateEnterpriseValue(marketCap, data.totalDebt ?? 0, data.cashAndEquivalents ?? 0);

  const raw = {
    pe:              data.eps ? pe(price, data.eps) : null,
    pb:              data.bookValuePerShare ? pb(price, data.bookValuePerShare) : null,
    ps:              data.revenuePerShare ? ps(price, data.revenuePerShare) : null,
    peg:             data.eps && data.expectedEarningsGrowthRate ? peg(pe(price, data.eps) ?? 0, data.expectedEarningsGrowthRate) : null,
    evEbitda:        data.ebitda ? evEbitda(ev, data.ebitda) : null,
    dividendYield:   data.annualDividendPerShare ? dividendYield(data.annualDividendPerShare, price) : null,
    grahamNumber:    data.eps && data.bookValuePerShare ? grahamNumber(data.eps, data.bookValuePerShare) : null,
    priceToCashFlow: data.operatingCashFlow && marketCap ? priceToCashFlow(marketCap, data.operatingCashFlow) : null,
    earningsYield:   data.eps && price ? earningsYield(data.eps, price) : null,
    evRevenue:       data.totalRevenue ? evRevenue(ev, data.totalRevenue) : null,
    evFcf:           data.freeCashFlow ? evFcf(ev, data.freeCashFlow) : null,
  };

  if (!withInsights) return raw;

  return {
    pe:              evaluate.pe(raw.pe),
    pb:              evaluate.pb(raw.pb),
    ps:              evaluate.ps(raw.ps),
    peg:             evaluate.peg(raw.peg),
    evEbitda:        evaluate.evEbitda(raw.evEbitda),
    dividendYield:   evaluate.dividendYield(raw.dividendYield),
    grahamNumber:    evaluate.grahamNumber(raw.grahamNumber, price),
    priceToCashFlow: evaluate.priceToCashFlow(raw.priceToCashFlow),
    earningsYield:   evaluate.earningsYield(raw.earningsYield),
    evRevenue:       evaluate.evRevenue(raw.evRevenue),
    evFcf:           evaluate.evFcf(raw.evFcf),
  };
}

// ── Profitability ─────────────────────────────────────────────────────────────

export function analyzeProfitability(data: CompanySnapshotInput, withInsights = false) {
  const raw = {
    roa:            data.netIncome && data.totalAssets ? roa(data.netIncome, data.totalAssets) : null,
    roe:            data.netIncome && data.totalEquity ? roe(data.netIncome, data.totalEquity) : null,
    roic:           data.operatingIncome && data.taxRate !== undefined && data.totalEquity ? roic(data.operatingIncome, data.taxRate, data.totalDebt ?? 0, data.totalEquity, data.cashAndEquivalents ?? 0) : null,
    grossMargin:    data.totalRevenue && data.costOfRevenue ? grossMargin(data.totalRevenue, data.costOfRevenue) : null,
    operatingMargin: data.operatingIncome && data.totalRevenue ? operatingMargin(data.operatingIncome, data.totalRevenue) : null,
    netProfitMargin: data.netIncome && data.totalRevenue ? netProfitMargin(data.netIncome, data.totalRevenue) : null,
    fcfMargin:      data.freeCashFlow && data.totalRevenue ? fcfMargin(data.freeCashFlow, data.totalRevenue) : null,
  };

  if (!withInsights) return raw;

  return {
    roa:             evaluate.roa(raw.roa),
    roe:             evaluate.roe(raw.roe),
    roic:            evaluate.roic(raw.roic),
    grossMargin:     evaluate.margin(raw.grossMargin, "Gross"),
    operatingMargin: evaluate.margin(raw.operatingMargin, "Operating"),
    netProfitMargin: evaluate.margin(raw.netProfitMargin, "Net Profit"),
    fcfMargin:       evaluate.margin(raw.fcfMargin, "Free Cash Flow"),
  };
}

// ── Liquidity ─────────────────────────────────────────────────────────────────

export function analyzeLiquidity(data: CompanySnapshotInput, withInsights = false) {
  const raw = {
    currentRatio:    data.totalAssets && data.totalLiabilities ? currentRatio(data.totalAssets, data.totalLiabilities) : null,
    quickRatio:      data.totalAssets && data.inventory !== undefined && data.totalLiabilities ? quickRatio(data.totalAssets, data.inventory, data.totalLiabilities) : null,
    debtToEquity:    data.totalEquity ? debtToEquity(data.totalDebt ?? 0, data.totalEquity) : null,
    interestCoverage: data.ebit && data.interestExpense ? interestCoverage(data.ebit, data.interestExpense) : null,
  };

  if (!withInsights) return raw;

  return {
    currentRatio:    evaluate.currentRatio(raw.currentRatio),
    quickRatio:      evaluate.quickRatio(raw.quickRatio),
    debtToEquity:    evaluate.debtToEquity(raw.debtToEquity),
    interestCoverage: evaluate.interestCoverage(raw.interestCoverage),
  };
}

// ── Solvency ──────────────────────────────────────────────────────────────────

export function analyzeSolvency(data: CompanySnapshotInput, withInsights = false) {
  const td   = data.totalDebt ?? 0;
  const cash = data.cashAndEquivalents ?? 0;

  const raw = {
    netDebt:          netDebt(td, cash),
    netDebtToEbitda:  data.ebitda ? netDebtToEbitda(td, cash, data.ebitda) : null,
    debtToAssets:     data.totalAssets ? debtToAssets(td, data.totalAssets) : null,
    debtToEquity:     data.totalEquity ? debtToEquity(td, data.totalEquity) : null,
    interestCoverage: data.ebit && data.interestExpense ? interestCoverage(data.ebit, data.interestExpense) : null,
  };

  if (!withInsights) return raw;

  return {
    netDebt:          { value: raw.netDebt, status: raw.netDebt < 0 ? "Good" : "N/A", insight: raw.netDebt < 0 ? `Net cash position of ${Math.abs(raw.netDebt).toLocaleString()}.` : `Net debt of ${raw.netDebt.toLocaleString()}.` } as const,
    netDebtToEbitda:  evaluate.netDebtToEbitda(raw.netDebtToEbitda),
    debtToAssets:     evaluate.debtToAssets(raw.debtToAssets),
    debtToEquity:     evaluate.debtToEquity(raw.debtToEquity),
    interestCoverage: evaluate.interestCoverage(raw.interestCoverage),
  };
}

// ── Efficiency ────────────────────────────────────────────────────────────────

export function analyzeEfficiency(data: CompanySnapshotInput, withInsights = false) {
  const raw = {
    assetTurnover:       data.totalRevenue && data.totalAssets ? assetTurnover(data.totalRevenue, data.totalAssets) : null,
    inventoryTurnover:   data.costOfRevenue && data.inventory ? inventoryTurnover(data.costOfRevenue, data.inventory) : null,
    receivablesTurnover: data.totalRevenue && data.tradeReceivables ? receivablesTurnover(data.totalRevenue, data.tradeReceivables) : null,
    daysSalesOutstanding: data.totalRevenue && data.tradeReceivables ? daysSalesOutstanding(data.totalRevenue, data.tradeReceivables) : null,
  };

  if (!withInsights) return raw;

  return {
    assetTurnover:       evaluate.assetTurnover(raw.assetTurnover),
    inventoryTurnover:   evaluate.inventoryTurnover(raw.inventoryTurnover),
    receivablesTurnover: evaluate.receivablesTurnover(raw.receivablesTurnover),
    daysSalesOutstanding: evaluate.daysSalesOutstanding(raw.daysSalesOutstanding),
  };
}

// ── Risk ──────────────────────────────────────────────────────────────────────

export function analyzeRisk(data: CompanySnapshotInput, withInsights = false) {
  const marketCap = data.marketCap ?? 0;

  const altman = (
    data.workingCapital !== undefined &&
    data.retainedEarnings !== undefined &&
    data.ebit !== undefined &&
    data.totalAssets &&
    data.totalLiabilities
  )
    ? altmanZScore(data.workingCapital, data.retainedEarnings, data.ebit, marketCap, data.totalRevenue ?? 0, data.totalAssets, data.totalLiabilities)
    : null;

  const sharpeVal = (data.returns !== undefined && data.riskFree !== undefined && data.stdDev !== undefined)
    ? sharpe(data.returns, data.riskFree, data.stdDev)
    : null;

  // Piotroski — compute only if minimum required fields are present
  const piotroskiResult = (data.netIncome !== undefined && data.totalAssets && data.operatingCashFlow !== undefined)
    ? piotroski({
        netIncome:            data.netIncome,
        totalAssets:          data.totalAssets,
        operatingCashFlow:    data.operatingCashFlow,
        longTermDebt:         data.longTermDebt,
        sharesOutstanding:    data.sharesOutstanding,
        grossMarginValue:     data.totalRevenue && data.costOfRevenue ? grossMargin(data.totalRevenue, data.costOfRevenue) ?? undefined : undefined,
        assetTurnoverValue:   data.totalRevenue && data.totalAssets ? assetTurnover(data.totalRevenue, data.totalAssets) ?? undefined : undefined,
      })
    : null;

  const raw = {
    altmanZScore:  altman,
    sharpe:        sharpeVal,
    piotroski:     piotroskiResult,
  };

  if (!withInsights) return raw;

  return {
    altmanZScore: evaluate.altmanZScore(raw.altmanZScore),
    sharpe:       evaluate.sharpe(raw.sharpe),
    piotroski:    raw.piotroski
      ? evaluate.piotroski(raw.piotroski.score, raw.piotroski.maxScore)
      : evaluate.piotroski(0, 0),
  };
}

// ── Quality ───────────────────────────────────────────────────────────────────

export function analyzeQuality(data: CompanySnapshotInput, withInsights = false) {
  const raw = {
    payoutRatio:          data.annualDividendPerShare && data.eps ? payoutRatio(data.annualDividendPerShare, data.eps) : null,
    cashConversionRatio:  data.operatingCashFlow !== undefined && data.netIncome ? cashConversionRatio(data.operatingCashFlow, data.netIncome) : null,
    targetUpside:         data.price && data.analystTargetPrice ? targetUpside(data.price, data.analystTargetPrice) : null,
  };

  if (!withInsights) return raw;

  return {
    payoutRatio:          evaluate.payoutRatio(raw.payoutRatio),
    cashConversionRatio:  evaluate.cashConversionRatio(raw.cashConversionRatio),
    targetUpside:         evaluate.targetUpside(raw.targetUpside),
  };
}
