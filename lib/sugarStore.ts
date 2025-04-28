import { PrefabRow } from '#/ui/tabletable';

export interface sugarStoreRow extends PrefabRow {
  key: string;
  day: number;
  sugarStock: number;
  todayDemand: number;
  dailySales: number;
  lostSales: number;
  holdingCostToday: number;
  orderCostToday: number;
  orderedAmount: number;
  timeToDelivery: number;
  todayIncome: number;
  todayCost: number;
  todayProfit: number;
}
