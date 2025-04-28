import { PrefabRow } from '#/ui/tabletable';

export interface integerProgrammingRow extends PrefabRow {
  key: string;
  x1: number;
  x2: number;
  z: number;
}

// Define the interface for the result rows
export interface IntegerProgrammingRow {
  key: string;
  x1: number;
  x2: number;
  z: number;
}

export function integerProgrammingSimulation(
  N: number,
  randSeed1: number,
  randSeed2: number,
  c11: number,
  c12: number,
  c1b: number,
  c21: number,
  c22: number,
  c2b: number,
): {
  results: IntegerProgrammingRow[];
  optimalResult: { x1: number; x2: number; z: number };
} {
  // Helper function to create a seeded random number generator
  function seededRandom(seed: number): () => number {
    let x = Math.sin(seed++) * 10000;
    return () => (x = Math.sin(x) * 10000) - Math.floor(x);
  }

  // Create random number generators
  const randy1 = seededRandom(randSeed1);
  const randy2 = seededRandom(randSeed2);

  // Constraint functions
  const c1 = (x1: number, x2: number) => c11 * x1 + c12 * x2 >= c1b;
  const c2 = (x1: number, x2: number) => c21 * x1 + c22 * x2 >= c2b;

  // Initialize variables
  let Z = Infinity;
  let x1 = 0;
  let x2 = 0;
  const iterations: IntegerProgrammingRow[] = [];

  // Simulation process
  for (let i = 1; i <= N; i++) {
    const x1_rand = Math.round(randy1() * 100);
    const x2_rand = Math.round(randy2() * 100);

    if (!c1(x1_rand, x2_rand) || !c2(x1_rand, x2_rand)) {
      continue;
    }

    const Z_aux = 2.5 * x1_rand + 2 * x2_rand;
    if (Z_aux < Z) {
      Z = Z_aux;
      x1 = x1_rand;
      x2 = x2_rand;

      iterations.push({
        key: `iteration_${i}`,
        x1: x1,
        x2: x2,
        z: Z,
      });
    }
  }

  // Return results
  return {
    results: iterations,
    optimalResult: { x1, x2, z: Z },
  };
}

// Example usage
const simulationResult = integerProgrammingSimulation(
  1000000,
  123456789,
  987654321,
  6,
  3,
  200,
  3,
  5,
  180,
);
console.log(simulationResult);
