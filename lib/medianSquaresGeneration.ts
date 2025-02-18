export interface medianSquaresRow {
  i: number;
  x_i: number;
  y_i: number;
  operation: string;
  r_i: number;
}

export function medianSquaresRNG(
  seed: number,
  D: number,
  n: number,
): medianSquaresRow[] {
  let results: medianSquaresRow[] = [];
  let x = seed;

  for (let i = 0; i < n; i++) {
    let x_0 = x;
    let y = x * x; // Square the number
    let op = extractCenterDigits(y, D);
    x = parseInt(op, 10); // Extract center digits
    results.push({
      i,
      x_i: x_0,
      y_i: y,
      operation: op,
      r_i: x / Math.pow(10, D), // Normalize to [0,1]
    });
  }

  return results;
}
