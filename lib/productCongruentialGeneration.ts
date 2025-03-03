import { nextPowerOfTwo } from '#/utils/numberUtils';

export interface productCongruentialRow {
  key: string;
  x_i: string;
  r_i: string;
}

export interface productCongruentialRun {
  x_0: number;
  p: number;
  k: number;
  g: number;
  m: number;
  a: number;
  values: productCongruentialRow[];
}

export function productCongruentialRNG(
  x_0: number,
  n: number,
  k: number,
  A: (x: number) => number,
  nDecimals: number,
) {
  const p = nextPowerOfTwo(n);
  console.log(`p = ${p}`);
  const g = Math.log2(p) + 2;
  const a = A(k);
  const m = Math.pow(2, g);

  let run_values = [] as productCongruentialRow[];

  console.log(`g = ${g}`);
  console.log(`m = ${m}`);
  console.log(`a = ${a}`);
  console.log(`x_0 = ${x_0}`);

  let x1: number;
  let x0 = x_0;
  for (let i = 0; i < p + 1; i++) {
    x1 = (a * x0) % m;
    let r_i = x1 / (m - 1);
    x0 = x1;
    run_values.push({
      key: (i + 1).toString(),
      x_i: x1.toString(),
      r_i: r_i.toFixed(nDecimals),
    });
  }

  return {
    x_0,
    p,
    k,
    g,
    m,
    a,
    values: run_values,
  } as productCongruentialRun;
}
