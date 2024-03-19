import { WritableStore } from "openrct2-flexui";

export interface ForceColours {
  low: number;
  moderate: number;
  excessive: number;
  hideSupports: boolean;
}

export interface ForceColoursModel {
  low: WritableStore<number>;
  moderate: WritableStore<number>;
  excessive: WritableStore<number>;
  hideSupports: WritableStore<boolean>;
}
