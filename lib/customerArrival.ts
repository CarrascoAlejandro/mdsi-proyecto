import { PrefabRow } from '#/ui/tabletable';

export interface CustomerArrivalRow extends PrefabRow {
  key: string;
  clients: number;
  itemsSold: number;
  income: number;
  totalCosts: number;
  netProfit: number;
}

export interface SimulationResult {
  results: CustomerArrivalRow[];
  totalProfit: number;
  averageProfitPerDay: number;
  averageItemsSoldPerDay: number;
}

export function simulateCustomerArrivals(
  daysToSimulate: number,
  hoursOpenPerDay: number,
  fixedCosts: number,
  itemCost: number,
  itemPrice: number,
  clientsMin: number,
  clientsMax: number,
  prob0: number,
  prob1: number,
  prob2: number,
  prob3: number,
  randSeed1: number,
  randSeed2: number,
): SimulationResult {
  // Helper function to create a seeded random number generator
  function seededRandom(seed: number): () => number {
    let x = Math.sin(seed++) * 10000;
    return () => (x = Math.sin(x) * 10000) - Math.floor(x);
  }

  // Create random number generators
  const randy1 = seededRandom(randSeed1);
  const randy2 = seededRandom(randSeed2);

  // Random distributions
  function nextHourClients(): number {
    return Math.floor(randy1() * (clientsMax - clientsMin + 1)) + clientsMin;
  }

  function itemsSoldPerClient(): number {
    const r = randy2();
    if (r < prob0) return 0;
    if (r < prob0 + prob1) return 1;
    if (r < prob0 + prob1 + prob2) return 2;
    return 3;
  }

  // Validate probabilities
  if (prob0 + prob1 + prob2 + prob3 !== 1) {
    throw new Error(
      `Probabilities ${prob0}, ${prob1}, ${prob2}, and ${prob3} must sum to 1.`,
    );
  }

  console.log(`Input parameters:
    daysToSimulate: ${daysToSimulate}
    hoursOpenPerDay: ${hoursOpenPerDay}
    fixedCosts: ${fixedCosts}
    itemCost: ${itemCost}
    itemPrice: ${itemPrice}
    clientsMin: ${clientsMin}
    clientsMax: ${clientsMax}
    prob0: ${prob0}
    prob1: ${prob1}
    prob2: ${prob2}
    prob3: ${prob3}
    randSeed1: ${randSeed1}
    randSeed2: ${randSeed2}
  `);

  // Simulation process
  const iterationsDay: CustomerArrivalRow[] = [];
  let totalProfit = 0;
  let totalItemsSold = 0;

  for (let day = 1; day <= daysToSimulate; day++) {
    let dailyItemsSold = 0;
    let dailyIncome = 0;
    let dailyCosts = fixedCosts;
    let dailyClients = 0;

    for (let hour = 1; hour <= hoursOpenPerDay; hour++) {
      const clients = nextHourClients();
      dailyClients += clients;
      for (let c = 0; c < clients; c++) {
        const itemsSold = itemsSoldPerClient();
        dailyItemsSold += itemsSold;
        dailyIncome += itemsSold * itemPrice;
        dailyCosts += itemsSold * itemCost;
      }
    }

    const dailyNetProfit = dailyIncome - dailyCosts;
    totalProfit += dailyNetProfit;
    totalItemsSold += dailyItemsSold;

    iterationsDay.push({
      key: day.toString(),
      clients: dailyClients,
      itemsSold: dailyItemsSold,
      income: dailyIncome,
      totalCosts: dailyCosts,
      netProfit: dailyNetProfit,
    });
  }

  const averageProfitPerDay = totalProfit / daysToSimulate;
  const averageItemsSoldPerDay = totalItemsSold / daysToSimulate;

  return {
    results: iterationsDay,
    totalProfit: totalProfit,
    averageProfitPerDay: averageProfitPerDay,
    averageItemsSoldPerDay: averageItemsSoldPerDay,
  };
}

// Example usage
/*const result = simulateCustomerArrivals(
  30, // daysToSimulate
  10, // hoursOpenPerDay
  300, // fixedCosts
  50, // itemCost
  75, // itemPrice
  0, // clientsMin
  4, // clientsMax
  0.2, // prob0
  0.3, // prob1
  0.4, // prob2
  0.1, // prob3
  123457, // randSeed1
  754321, // randSeed2
);

console.log(result);
*/
