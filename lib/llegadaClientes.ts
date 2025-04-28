import { PrefabRow } from '#/ui/tabletable';

export interface customerArrivalRow extends PrefabRow {
  key: string;
  day: number;
  itemsSold: number;
  income: number;
  totalCosts: number;
  netProfit: number;
}
