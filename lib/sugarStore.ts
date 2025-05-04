import { PrefabRow } from '#/ui/tabletable';

// Define the interface for the result rows
export interface SugarStoreRow extends PrefabRow {
  key: string;
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

export interface SugarStoreSimulationSummary {
  totalProfit: number;
  totalKgSold: number;
  totalSalesLost: number;
  averageIncomeDaily: number;
  averageCostDaily: number;
  averageKgSoldDaily: number;
  averageDailyDemand: number;
  averageTimeToDelivery: number;
}

export interface SugarStoreSimulationRow extends PrefabRow {
  key: string;
  totalProfit: number;
  totalKgSold: number;
  totalSalesLost: number;
  averageIncomeDaily: number;
  averageCostDaily: number;
  averageKgSoldDaily: number;
  averageDailyDemand: number;
  averageTimeToDelivery: number;
}

export function simulateSugarStore(
  maximumDays: number,
  maximumStock: number,
  orderPlacementCost: number,
  orderUnitCost: number,
  unitSalePrice: number,
  holdingCost: number,
  minTimeToDelivery: number,
  maxTimeToDelivery: number,
  averageDemand: number,
  randSeed1: number,
  randSeed2: number,
): {
  simulationResults: SugarStoreRow[];
  simulationSummary: SugarStoreSimulationSummary;
} {
  // Helper function to create a seeded random number generator
  function seededRandom(seed: number): () => number {
    let x = Math.sin(seed++) * 10000;
    return () => (x = Math.sin(x) * 10000) - Math.floor(x);
  }

  // Create random number generators
  const randy1 = seededRandom(randSeed1);
  const randy2 = seededRandom(randSeed2);

  // Initialize variables
  let sugarStock = maximumStock;
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
      key: day.toString(),
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

  return {
    simulationResults: results,
    simulationSummary: {
      totalProfit: results.reduce((acc, row) => acc + row.todayProfit, 0),
      totalKgSold: results.reduce((acc, row) => acc + row.dailySales, 0),
      totalSalesLost: results.reduce((acc, row) => acc + row.lostSales, 0),
      averageIncomeDaily:
        results.reduce((acc, row) => acc + row.todayIncome, 0) / maximumDays,
      averageCostDaily:
        results.reduce((acc, row) => acc + row.todayCost, 0) / maximumDays,
      averageKgSoldDaily:
        results.reduce((acc, row) => acc + row.dailySales, 0) / maximumDays,
      averageDailyDemand:
        results.reduce((acc, row) => acc + row.todayDemand, 0) / maximumDays,
      averageTimeToDelivery:
        results.reduce((acc, row) => acc + (row.timeToDelivery || 0), 0) /
        maximumDays,
    },
  };
}

export function multipleSimulations(
  maxSimulations: number,
  maximumDays: number,
  maximumStock: number,
  orderPlacementCost: number,
  orderUnitCost: number,
  unitSalePrice: number,
  holdingCost: number,
  minTimeToDelivery: number,
  maxTimeToDelivery: number,
  averageDemand: number,
  randSeed1: number,
  randSeed2: number,
): {
  simulationsResults: SugarStoreSimulationRow[];
  simulationSummary: SugarStoreSimulationSummary;
} {
  const simulationResults: SugarStoreSimulationRow[] = [];
  const simulationSummary: SugarStoreSimulationSummary = {
    totalProfit: 0,
    totalKgSold: 0,
    totalSalesLost: 0,
    averageIncomeDaily: 0,
    averageCostDaily: 0,
    averageKgSoldDaily: 0,
    averageDailyDemand: 0,
    averageTimeToDelivery: 0,
  };

  for (let i = 1; i <= maxSimulations; i++) {
    const { simulationResults: results, simulationSummary: summary } =
      simulateSugarStore(
        maximumDays,
        maximumStock,
        orderPlacementCost,
        orderUnitCost,
        unitSalePrice,
        holdingCost,
        minTimeToDelivery,
        maxTimeToDelivery,
        averageDemand,
        randSeed1 + i * 10000, // Different seed for each simulation
        randSeed2 + i * 10000, // Different seed for each simulation
      );

    simulationResults.push({
      key: i.toString(),
      totalProfit: summary.totalProfit,
      totalKgSold: summary.totalKgSold,
      totalSalesLost: summary.totalSalesLost,
      averageIncomeDaily: summary.averageIncomeDaily,
      averageCostDaily: summary.averageCostDaily,
      averageKgSoldDaily: summary.averageKgSoldDaily,
      averageDailyDemand: summary.averageDailyDemand,
      averageTimeToDelivery: summary.averageTimeToDelivery,
    });
    simulationSummary.totalProfit += summary.totalProfit;
    simulationSummary.totalKgSold += summary.totalKgSold;
    simulationSummary.totalSalesLost += summary.totalSalesLost;
    simulationSummary.averageIncomeDaily += summary.averageIncomeDaily;
    simulationSummary.averageCostDaily += summary.averageCostDaily;
    simulationSummary.averageKgSoldDaily += summary.averageKgSoldDaily;
    simulationSummary.averageDailyDemand += summary.averageDailyDemand;
    simulationSummary.averageTimeToDelivery += summary.averageTimeToDelivery;
  }
  // Calculate averages
  simulationSummary.totalProfit /= maxSimulations;
  simulationSummary.totalKgSold /= maxSimulations;
  simulationSummary.totalSalesLost /= maxSimulations;
  simulationSummary.averageIncomeDaily /= maxSimulations;
  simulationSummary.averageCostDaily /= maxSimulations;
  simulationSummary.averageKgSoldDaily /= maxSimulations;
  simulationSummary.averageDailyDemand /= maxSimulations;
  simulationSummary.averageTimeToDelivery /= maxSimulations;
  return {
    simulationsResults: simulationResults,
    simulationSummary: simulationSummary,
  };
}
