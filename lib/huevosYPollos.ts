import { PrefabRow } from '#/ui/tabletable';

export interface eggsAndChickensDayRow extends PrefabRow {
  key: string;
  day: number;
  totalEggs: number;
  brokenEggs: number;
  deadChickens: number;
  aliveChickens: number;
  totalSoldEggs: number;
  totalMoney: number;
}

export interface eggsAndChickensRunRow extends PrefabRow {
  key: string;
  run: number;
  runTotalEggs: number;
  runBrokenEggs: number;
  runDeadChickens: number;
  runAliveChickens: number;
  runTotalSoldEggs: number;
  runTotalMoney: number;
}
