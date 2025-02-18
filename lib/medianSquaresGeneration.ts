import { extractCenterDigits } from '#/utils/numberUtils';

export interface medianSquaresRow {
  key: string;
  x_i: string;
  y_i: string;
  operation: string;
  r_i: string;
}

export function medianSquaresRNG(
  seed: number,
  D: number,
  n: number,
): medianSquaresRow[] {
  let results: medianSquaresRow[] = [];
  let x = seed;

  console.log(`median squares params:\nseed: ${seed}\nD: ${D}\nn: ${n}`);

  for (let i = 0; i < n; i++) {
    let x_0 = x;
    let y = x * x; // Square the number
    let op = extractCenterDigits(y, D);
    x = parseInt(op, 10); // Extract center digits
    results.push({
      key: i.toString(),
      x_i: x_0.toString(),
      y_i: y.toString(),
      operation: op,
      r_i: (x / Math.pow(10, D)).toString(), // Normalize to [0,1]
    });
  }

  console.log('generation results\n', results);
  return results;
}
