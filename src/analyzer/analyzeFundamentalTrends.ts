import { yoyGrowth, qoqGrowth, cagr } from "../growth/trendGrowth";
import { grossMargin, operatingMargin, netProfitMargin, fcfMargin } from "../profitability/margins";

export interface FundamentalTimeseriesInput {
  revenue: number[];
  netIncome: number[];
  costOfRevenue?: number[];
  operatingIncome?: number[];
  freeCashFlow?: number[];
  eps?: number[];
}

/**
 * Analyzes chronologically ordered arrays of fundamental data
 * Expects oldest data first, newest data last (e.g., [2021, 2022, 2023])
 */
export function analyzeFundamentalTrends(
  data: FundamentalTimeseriesInput,
  periodType: "annual" | "quarterly" = "annual"
) {
  const growthFn = periodType === "annual" ? yoyGrowth : qoqGrowth;

  const revenueGrowth = growthFn(data.revenue);
  const netIncomeGrowth = growthFn(data.netIncome);
  const epsGrowth = data.eps ? growthFn(data.eps) : null;
  const fcfGrowth = data.freeCashFlow ? growthFn(data.freeCashFlow) : null;

  // Compile margin arrays
  let grossMargins: (number | null)[] | null = null;
  if (data.costOfRevenue) {
    grossMargins = data.revenue.map((rev, i) =>
      data.costOfRevenue ? grossMargin(rev, data.costOfRevenue[i]) : null
    );
  }

  let operatingMargins: (number | null)[] | null = null;
  if (data.operatingIncome) {
    operatingMargins = data.revenue.map((rev, i) =>
      data.operatingIncome ? operatingMargin(data.operatingIncome[i], rev) : null
    );
  }

  let netMargins: (number | null)[] = data.revenue.map((rev, i) =>
    netProfitMargin(data.netIncome[i], rev)
  );

  let fcfMargins: (number | null)[] | null = null;
  if (data.freeCashFlow) {
    fcfMargins = data.revenue.map((rev, i) =>
      data.freeCashFlow ? fcfMargin(data.freeCashFlow[i], rev) : null
    );
  }

  // Calculate CAGR if annual
  const periods = data.revenue.length - 1;
  const revenueCagr =
    periodType === "annual" && periods > 0
      ? cagr(data.revenue[0], data.revenue[data.revenue.length - 1], periods)
      : null;

  const netIncomeCagr =
    periodType === "annual" && periods > 0
      ? cagr(data.netIncome[0], data.netIncome[data.netIncome.length - 1], periods)
      : null;

  return {
    periodType,
    growth: {
      revenueGrowth,
      netIncomeGrowth,
      epsGrowth,
      fcfGrowth,
      revenueCagr,
      netIncomeCagr,
    },
    margins: {
      grossMargins,
      operatingMargins,
      netMargins,
      fcfMargins,
    },
  };
}
