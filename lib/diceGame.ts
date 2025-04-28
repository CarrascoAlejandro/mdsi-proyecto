import { PrefabRow } from '#/ui/tabletable';

export interface diceGameRow extends PrefabRow {
  key: string;
  dice1: number;
  dice2: number;
  sumDice: number;
  win: string;
  profits: number;
}

export function simulateGame(
  throws: number,
  cost: number,
  reward: number,
  randSeed1: number,
  randSeed2: number,
): {
  simulationDetails: diceGameRow[];
  totalEarnings: number;
  gamesWon: number;
  winPercentage: number;
} {
  // Helper function to create a seeded random number generator
  function seededRandom(seed: number): () => number {
    let x = Math.sin(seed++) * 10000;
    return () => (x = Math.sin(x) * 10000) - Math.floor(x);
  }

  // Create two random number generators
  const randy1 = seededRandom(randSeed1);
  const randy2 = seededRandom(randSeed2);

  // Simulation process
  const games: diceGameRow[] = [];
  let earnings = 0;

  for (let i = 0; i < throws; i++) {
    // Simulate dice rolls
    const dice1 = Math.floor(1 + randy1() * 6);
    const dice2 = Math.floor(1 + randy2() * 6);
    const sum = dice1 + dice2;
    const gana = sum !== 7;

    // Update earnings
    earnings += gana ? cost : cost - reward;

    // Record game result
    games.push({
      key: (i + 1).toString(),
      dice1: dice1,
      dice2: dice2,
      sumDice: sum,
      win: gana ? 'Yes' : 'No',
      profits: earnings,
    });
  }

  // Calculate summary statistics
  const gamesWon = games.filter((game) => game.gana).length;
  const winPercentage = (gamesWon / throws) * 100;

  return {
    simulationDetails: games,
    totalEarnings: earnings,
    gamesWon: gamesWon,
    winPercentage: winPercentage,
  };
}

// Example usage:
//const result = simulateGame(10, 2, 5, 423, 321);
//console.log(result);
