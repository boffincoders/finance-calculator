import { CompanySnapshotInput } from "./types";
import {
  analyzeValuation,
  analyzeProfitability,
  analyzeLiquidity,
  analyzeEfficiency,
  analyzeRisk,
} from "./categorical";

/**
 * Compiles a comprehensive snapshot analysis of a company.
 * Automatically bundles valuation, profitability, liquidity, efficiency, and risk metrics.
 *
 * @param data Flat object with raw fundamental financial data.
 * @param withInsights Set to true to receive { value, status, insight } object per metric.
 */
export function analyzeCompany(data: CompanySnapshotInput, withInsights = false) {
  return {
    valuation: analyzeValuation(data, withInsights),
    profitability: analyzeProfitability(data, withInsights),
    liquidity: analyzeLiquidity(data, withInsights),
    efficiency: analyzeEfficiency(data, withInsights),
    risk: analyzeRisk(data, withInsights),
  };
}

/**
 * Runs analyzeCompany concurrently across an array of companies.
 */
export function analyzeBatch(companies: CompanySnapshotInput[], withInsights = false) {
  return companies.map((company) => analyzeCompany(company, withInsights));
}
