import { PrefabRow } from '#/ui/tabletable';
import { nextPowerOfTwo } from '#/utils/numberUtils';

export interface linearCongruentialRow extends PrefabRow {
  key: string;
  x_i: string;
  r_i: string;
}

export interface linearCongruentialRun {
  x_0: number;
  p: number;
  k: number;
  c: number;
  g: number;
  m: number;
  a: number;
  values: linearCongruentialRow[];
}

export function linearCongruentialRNG(
  x_0: number,
  n: number,
  k: number,
  c: number,
  nDecimals: number,
): linearCongruentialRun {
  const p = nextPowerOfTwo(n);
  console.log(`p = ${p}`);
  const g = Math.log2(p);
  const a = 1 + 4 * k;
  const m = Math.pow(2, g);

  let run_values = [] as linearCongruentialRow[];

  console.log(`g = ${g}`);
  console.log(`m = ${m}`);
  console.log(`a = ${a}`);
  console.log(`c = ${c}`);
  console.log(`x_0 = ${x_0}`);

  let x1: number;
  let x0 = x_0;
  for (let i = 0; i < p + 1; i++) {
    x1 = (a * x0 + c) % m;
    console.log(`x${i + 1} = (${a} * ${x0} + ${c}) mod ${m} = ${x1}`);
    let r_i = x1 / (m - 1);
    x0 = x1;
    run_values.push({
      key: (i + 1).toString(),
      x_i: x1.toString(),
      r_i: r_i.toFixed(nDecimals),
    });
  }

  console.log('results\n', run_values);

  return {
    x_0,
    p,
    k,
    c,
    g,
    m,
    a,
    values: run_values,
  } as linearCongruentialRun;
}
