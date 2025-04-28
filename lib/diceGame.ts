import { PrefabRow } from '#/ui/tabletable';

export interface diceGameRow extends PrefabRow {
  key: string;
  dice1: number;
  dice2: number;
  sumDice: number;
  win: string;
  profits: number;
}
