export interface medianProductsRow {
    key: string,
    x_i: string;
    y_i: string;
    operation: string;
    r_i: string;
}

export function medianProductsRNG(
    seed1: number,
    seed2: number,
    D: number,
    n: number
): medianProductsRow[] {
    let results: medianProductsRow[] = [];
    let x_last = seed1;
    let x_current = seed2;

    for(let i = 0; i<n; i++){
        let y = x_last * x_current;
        let op = extractCenterDigits(y, D);
        x_current = parseInt(op, 10);
        results.push({
            key: i.toString(),
            x_i: x_last.toString(),
            y_i: y.toString(),
            operation: op,
            r_i: (x_current / Math.pow(10, D)).toString(), // Normalize to [0,1]
        });
    }

    console.log('median product rng results:\n', results);
    return results
}