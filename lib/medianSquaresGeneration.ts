import { areBothEvenOdd, extractCenterDigits } from '#/utils/numberUtils';

export interface medianSquaresRow {
  key: string;
  x_i: string;
  y_i: string;
  operation: string;
  r_i: string;
}

export async function medianSquaresRNG(
  seed: number,
  D: number,
  n: number,
): Promise<medianSquaresRow[]> {
  let results: medianSquaresRow[] = [];
  let x = seed;

  console.log(`median squares params:\nseed: ${seed}\nD: ${D}\nn: ${n}`);

  for (let i = 0; i < n; i++) {
    let x_0 = x;
    let y = x * x; // Square the number
    if (y >= Number.MAX_SAFE_INTEGER) {
      const errorMessage = `Value of y exceeded safe boundaries at position ${i}`;
      console.error(errorMessage);
      throw errorMessage;
    }
    let op = extractCenterDigits(y, D);
    x = parseInt(op, 10); // Extract center digits
    results.push({
      key: i.toString(),
      x_i: x_0.toString().padStart(D, '0'),
      y_i: areBothEvenOdd(y, D) ? y.toString() : '0' + y.toString(),
      operation: op,
      r_i: (x / Math.pow(10, D)).toFixed(D).toString(), // Normalize to [0,1]
    });
  }

  console.log('generation results\n', results);
  return results;
}
