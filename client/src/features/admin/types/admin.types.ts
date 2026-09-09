export type TabType = "heritages" | "cultures" | "hotels" | "vehicles";

export interface EditItemState {
  type: TabType;
  data: any;
}
