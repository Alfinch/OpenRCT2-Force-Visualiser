export interface ForceThresholds {
  moderate: ForceThreshold;
  excessive: ForceThreshold;
}

export interface ForceThreshold {
  lateral: number;
  positiveVertical: number;
  negativeVertical: number;
}
