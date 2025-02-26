import { nextPowerOfTwo } from '#/utils/numberUtils';

export interface linearCongruentialRow {
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
    values: linearCongruentialRow[]
}

export function linearCongruentialRNG(x_0:number, n: number, k: number, c: number, nDecimals: number): linearCongruentialRun {
    const p = nextPowerOfTwo(n);
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
    for (let i = 0; i < n + 1; i++) {
        x1 = (a * x_0 + c) % m;
        let r_i = x1 / (m - 1)
        run_values.push({
            key: i.toString(),
            x_i: x1.toString(),
            r_i: r_i.toFixed(nDecimals)
        })
    }

    return {
        x_0,
        p,
        k,
        c,
        g,
        m,
        a,
        values: run_values
    } as linearCongruentialRun;
}
