import { PrefabRow } from '#/ui/tabletable';

// Define the interface for the result rows
export interface SugarStoreRow {
  key: string;
  day: number;
  sugarStock: number;
  todayDemand: number;
  dailySales: number;
  lostSales: number;
  holdingCostToday: number;
  orderCostToday: number;
  orderedAmount: number;
  timeToDelivery: number;
  todayIncome: number;
  todayCost: number;
  todayProfit: number;
}

export function simulateSugarStore(
  maximumDays: number,
  maximumStock: number,
  initialStock: number,
  orderPlacementCost: number,
  orderUnitCost: number,
  unitSalePrice: number,
  holdingCost: number,
  minTimeToDelivery: number,
  maxTimeToDelivery: number,
  averageDemand: number,
  randSeed1: number,
  randSeed2: number,
): SugarStoreRow[] {
  // Helper function to create a seeded random number generator
  function seededRandom(seed: number): () => number {
    let x = Math.sin(seed++) * 10000;
    return () => (x = Math.sin(x) * 10000) - Math.floor(x);
  }

  // Create random number generators
  const randy1 = seededRandom(randSeed1);
  const randy2 = seededRandom(randSeed2);

  // Initialize variables
  let sugarStock = initialStock;
  let timeToDelivery = 0;
  let orderedAmount = 0;

  const results: SugarStoreRow[] = [];

  // Simulation loop
  for (let day = 1; day <= maximumDays; day++) {
    const initStock = sugarStock;
    let orderCostToday = 0;
    let dailySales = 0;
    let lostSales = 0;
    let todayDemand = 0;

    // Handle pending orders
    if (timeToDelivery > 0) {
      timeToDelivery -= 1;
      if (timeToDelivery === 0) {
        sugarStock += orderedAmount;
        orderedAmount = 0;
        orderCostToday = orderPlacementCost;
      }
    }

    // Calculate today's demand if it's a workday
    if (day % 7 !== 0) {
      todayDemand = Math.round(-averageDemand * Math.log(1 - randy1()));
      if (sugarStock >= todayDemand) {
        sugarStock -= todayDemand;
        dailySales = todayDemand;
        lostSales = 0;
      } else {
        dailySales = sugarStock;
        lostSales = todayDemand - sugarStock;
        sugarStock = 0;
      }
    }

    // Place an order on Sundays
    if (day % 7 === 0) {
      orderedAmount = maximumStock - sugarStock;
      orderCostToday = orderedAmount * orderUnitCost;
      timeToDelivery =
        Math.floor(randy2() * (maxTimeToDelivery - minTimeToDelivery + 1)) +
        minTimeToDelivery;
      todayDemand = 0;
      dailySales = 0;
      lostSales = 0;
    }

    // Calculate holding cost
    const holdingCostToday = holdingCost * sugarStock;

    // Calculate today's income, cost, and profit
    const todayIncome = dailySales * unitSalePrice;
    const todayCost = holdingCostToday + orderCostToday;
    const todayProfit = todayIncome - todayCost;

    // Save today's results
    results.push({
      key: `day_${day}`,
      day,
      sugarStock,
      todayDemand,
      dailySales,
      lostSales,
      holdingCostToday,
      orderCostToday,
      orderedAmount: day % 7 === 0 ? orderedAmount : 0,
      timeToDelivery,
      todayIncome,
      todayCost,
      todayProfit,
    });
  }

  return results;
}

// Example usage
const simulationResults = simulateSugarStore(
  27, // maximumDays
  700, // maximumStock
  700, // initialStock
  100, // orderPlacementCost
  3.5, // orderUnitCost
  5.0, // unitSalePrice
  0.1, // holdingCost
  1, // minTimeToDelivery
  3, // maxTimeToDelivery
  100, // averageDemand
  100, // randSeed1
  200, // randSeed2
);

console.log(simulationResults);
