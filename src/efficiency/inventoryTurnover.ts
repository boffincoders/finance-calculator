import { safeDivide } from "../core/safeDivide";

/**
 * Inventory Turnover Ratio
 * Formula: Cost of Revenue (or Cost of Goods Sold) / Average Inventory
 * Interpretation:
 * - Shows how many times a company has sold and replaced inventory during a given period.
 * - Higher numbers suggest strong sales / effective inventory management.
 */
export const inventoryTurnover = (costOfRevenue: number, averageInventory: number): number | null =>
  safeDivide(costOfRevenue, averageInventory);
