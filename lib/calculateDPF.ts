import { PrefabRow } from '#/ui/tabletable';

export interface dpfRow extends PrefabRow {
  key: string;
  year: number;
  interest: number;
  capital: number;
}

export function calculateDPF(
  years: number,
  interest: number,
  initCapital: number,
): dpfRow[] {
  const rows: dpfRow[] = [];
  let capital = initCapital;
  for (let i = 0; i < years; i++) {
    const interestValue = (capital * interest) / 100;
    capital += interestValue;
    rows.push({
      key: (i + 1).toString(),
      year: i + 1,
      interest: parseFloat(interestValue.toFixed(2)),
      capital: parseFloat(capital.toFixed(2)),
    });
  }
  return rows;
}
