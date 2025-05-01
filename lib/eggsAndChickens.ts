import { PrefabRow } from '#/ui/tabletable';

export interface EggsAndChickensDayRow extends PrefabRow {
  key: string;
  day: number;
  totalEggs: number;
  brokenEggs: number;
  deadChickens: number;
  aliveChickens: number;
  totalSoldEggs: number;
  totalMoney: number;
}

export interface EggsAndChickensRunRow extends PrefabRow {
  key: string;
  run: number;
  runTotalEggs: number;
  runBrokenEggs: number;
  runDeadChickens: number;
  runAliveChickens: number;
  runTotalSoldEggs: number;
  runTotalMoney: number;
}

export function simulateEggsAndChickens(
  maxDays: number,
  maxSimulations: number,
  chickPrice: number,
  eggPrice: number,
  probBrokenEgg: number,
  probChick: number,
  probGoodEgg: number,
  probDeadChick: number,
  poissonLambda: number,
  randSeed1: number,
  randSeed2: number,
  randSeed3: number,
): {
  globalResults: EggsAndChickensRunRow[];
  dayGroupedResults: { [key: number]: EggsAndChickensDayRow[] };
  averageEggsProduced: number;
  averageEggsSold: number;
  averageChicksSold: number;
  averageIncome: number;
} {
  // Helper function to create a seeded random number generator
  function seededRandom(seed: number): () => number {
    let x = Math.sin(seed++) * 10000;
    return () => (x = Math.sin(x) * 10000) - Math.floor(x);
  }

  // Create random number generators
  const randy1 = seededRandom(randSeed1);
  const randy2 = seededRandom(randSeed2);
  const randy3 = seededRandom(randSeed3);

  // Generate Poisson probabilities
  function poissonProbabilities(lambda: number): number[] {
    const probabilities: number[] = [];
    for (let k = 0; k < 4; k++) {
      const p = (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
      probabilities.push(p);
    }
    probabilities.push(1 - probabilities.reduce((a, b) => a + b, 0));
    return probabilities;
  }

  function factorial(n: number): number {
    return n <= 1 ? 1 : n * factorial(n - 1);
  }

  // Simulate the number of eggs using Poisson distribution
  function runEggsPoissonDist(probabilities: number[]): number {
    const r = randy3();
    if (r < probabilities[0]) return 0;
    if (r < probabilities[0] + probabilities[1]) return 1;
    if (r < probabilities[0] + probabilities[1] + probabilities[2]) return 2;
    if (
      r <
      probabilities[0] + probabilities[1] + probabilities[2] + probabilities[3]
    )
      return 3;
    return 4;
  }

  // Determine the status of an egg
  function nextEgg(): string {
    const r = randy1();
    if (r < probBrokenEgg) return 'broken';
    if (r < probBrokenEgg + probChick) {
      const r2 = randy2();
      return r2 < probDeadChick ? 'dead' : 'alive';
    }
    return 'egg';
  }

  // Simulate a single day
  function runSimulationDay(): EggsAndChickensDayRow[] {
    const dailySimulation: EggsAndChickensDayRow[] = [];
    const probabilities = poissonProbabilities(poissonLambda);

    for (let day = 1; day <= maxDays; day++) {
      let totalEggs = 0;
      let brokenEggs = 0;
      let deadChickens = 0;
      let aliveChickens = 0;
      let totalSoldEggs = 0;
      let totalMoney = 0;

      totalEggs = runEggsPoissonDist(probabilities);
      for (let egg = 0; egg < totalEggs; egg++) {
        const eggStatus = nextEgg();
        if (eggStatus === 'broken') brokenEggs++;
        else if (eggStatus === 'dead') deadChickens++;
        else if (eggStatus === 'alive') aliveChickens++;
        else totalSoldEggs++;
      }

      totalMoney = totalSoldEggs * eggPrice + aliveChickens * chickPrice;

      dailySimulation.push({
        key: `day_${day}`,
        day,
        totalEggs,
        brokenEggs,
        deadChickens,
        aliveChickens,
        totalSoldEggs,
        totalMoney,
      });
    }

    return dailySimulation;
  }

  // Simulate multiple runs
  const runResults: EggsAndChickensRunRow[] = [];
  const dayGroupedResults: { [key: number]: EggsAndChickensDayRow[] } = {};
  for (let run = 1; run <= maxSimulations; run++) {
    const dayResults = runSimulationDay();
    const runTotalEggs = dayResults.reduce(
      (sum, day) => sum + day.totalEggs,
      0,
    );
    const runBrokenEggs = dayResults.reduce(
      (sum, day) => sum + day.brokenEggs,
      0,
    );
    const runDeadChickens = dayResults.reduce(
      (sum, day) => sum + day.deadChickens,
      0,
    );
    const runAliveChickens = dayResults.reduce(
      (sum, day) => sum + day.aliveChickens,
      0,
    );
    const runTotalSoldEggs = dayResults.reduce(
      (sum, day) => sum + day.totalSoldEggs,
      0,
    );
    const runTotalMoney = dayResults.reduce(
      (sum, day) => sum + day.totalMoney,
      0,
    );

    dayResults.forEach((dayResult) => {
      if (!dayGroupedResults[dayResult.day]) {
        dayGroupedResults[dayResult.day] = [];
      }
      dayGroupedResults[dayResult.day].push(dayResult);
    });

    runResults.push({
      key: `run_${run}`,
      run,
      runTotalEggs,
      runBrokenEggs,
      runDeadChickens,
      runAliveChickens,
      runTotalSoldEggs,
      runTotalMoney,
    });
  }

  return {
    globalResults: [],
    dayGroupedResults, // FIXME: Return the correct results
    averageEggsProduced: 0, // FIXME: Calculate the correct average
    averageEggsSold: 0, // FIXME: Calculate the correct average
    averageChicksSold: 0, // FIXME: Calculate the correct average
    averageIncome: 0, // FIXME: Calculate the correct average
  };
}
/*
// Example usage
const result = simulateEggsAndChickens(
  30, // maxDays
  100, // maxSimulations
  6.0, // chickPrice
  1.1, // eggPrice
  0.2, // probBrokenEgg
  0.3, // probChick
  0.5, // probGoodEgg
  0.2, // probDeadChick
  3, // poissonLambda
  123, // randSeed1
  456, // randSeed2
  789, // randSeed3
);

console.log(result);*/
