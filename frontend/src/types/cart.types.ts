import type { Item } from "./item.types";

export interface CartItem extends Item {
  quantity: number;
}
