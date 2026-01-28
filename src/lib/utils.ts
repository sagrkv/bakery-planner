import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type HealthStatus = 'green' | 'yellow' | 'red'

export function getRentRatioStatus(rent: number, revenue: number): HealthStatus {
  if (revenue === 0) return 'red'
  const ratio = (rent / revenue) * 100
  if (ratio < 15) return 'green'
  if (ratio <= 20) return 'yellow'
  return 'red'
}

export function getFoodCostRatioStatus(foodCosts: number, revenue: number): HealthStatus {
  if (revenue === 0) return 'red'
  const ratio = (foodCosts / revenue) * 100
  if (ratio < 30) return 'green'
  if (ratio <= 35) return 'yellow'
  return 'red'
}

export function getLaborCostRatioStatus(laborCosts: number, revenue: number): HealthStatus {
  if (revenue === 0) return 'red'
  const ratio = (laborCosts / revenue) * 100
  if (ratio < 30) return 'green'
  if (ratio <= 35) return 'yellow'
  return 'red'
}

export function getUtilitiesRatioStatus(utilities: number, revenue: number): HealthStatus {
  if (revenue === 0) return 'red'
  const ratio = (utilities / revenue) * 100
  if (ratio < 5) return 'green'
  if (ratio <= 8) return 'yellow'
  return 'red'
}

export function getTotalOperatingCostStatus(rent: number, foodCosts: number, laborCosts: number, utilities: number, otherExpenses: number, revenue: number): HealthStatus {
  if (revenue === 0) return 'red'
  const totalCosts = rent + foodCosts + laborCosts + utilities + otherExpenses
  const ratio = (totalCosts / revenue) * 100
  if (ratio < 85) return 'green'
  if (ratio <= 95) return 'yellow'
  return 'red'
}

export function getProfitMarginStatus(rent: number, foodCosts: number, laborCosts: number, utilities: number, otherExpenses: number, revenue: number): HealthStatus {
  if (revenue === 0) return 'red'
  const totalCosts = rent + foodCosts + laborCosts + utilities + otherExpenses
  const profit = revenue - totalCosts
  const margin = (profit / revenue) * 100
  if (margin > 15) return 'green'
  if (margin >= 5) return 'yellow'
  return 'red'
}

export function getOverallHealthScore(rent: number, foodCosts: number, laborCosts: number, utilities: number, otherExpenses: number, revenue: number): { score: number; status: HealthStatus } {
  const statuses = [
    getRentRatioStatus(rent, revenue),
    getFoodCostRatioStatus(foodCosts, revenue),
    getLaborCostRatioStatus(laborCosts, revenue),
    getUtilitiesRatioStatus(utilities, revenue),
    getTotalOperatingCostStatus(rent, foodCosts, laborCosts, utilities, otherExpenses, revenue),
    getProfitMarginStatus(rent, foodCosts, laborCosts, utilities, otherExpenses, revenue),
  ]
  const scores = statuses.map(s => s === 'green' ? 100 : s === 'yellow' ? 60 : 20)
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
  let status: HealthStatus = avgScore >= 80 ? 'green' : avgScore >= 50 ? 'yellow' : 'red'
  return { score: Math.round(avgScore), status }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}
