import { medianProductsRow } from '#/lib/medianProductsGeneration';
import { medianSquaresRow } from '#/lib/medianSquaresGeneration';

export function findDegeneration(
  rows: medianProductsRow[] | medianSquaresRow[],
): number {
  let pastNumbers = [] as number[];
  for (let i = 0; i < rows.length; i++) {
    pastNumbers.push(parseFloat(rows[i].r_i));
    for (let j = 0; j < i; j++) {
      //console.log(pastNumbers[j], "----", rows[i].r_i)
      if (pastNumbers[j] === parseFloat(rows[i].r_i)) return i;
    }
    //console.log('pN:', pastNumbers);
  }

  return -1;
}
