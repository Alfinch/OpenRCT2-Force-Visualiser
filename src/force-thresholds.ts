import { WritableStore } from "openrct2-flexui";

export interface ForceThresholds {
  moderate: ForceThreshold;
  excessive: ForceThreshold;
}

export interface ForceThreshold {
  lateral: number;
  positiveVertical: number;
  negativeVertical: number;
}

export interface ForceThresholdsModel {
  moderate: ForceThresholdModel;
  excessive: ForceThresholdModel;
}

export interface ForceThresholdModel {
  lateral: WritableStore<number>;
  positiveVertical: WritableStore<number>;
  negativeVertical: WritableStore<number>;
}
