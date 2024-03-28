import { WritableStore, Store, store, compute } from "openrct2-flexui";
import { ForceThreshold } from "../models";

export class ForceThresholdController {
  lateral: WritableStore<number>;
  positiveVertical: WritableStore<number>;
  negativeVertical: WritableStore<number>;

  forceThreshold: Store<ForceThreshold>;

  constructor(forceThreshold: ForceThreshold) {
    // Create stores for the model
    this.lateral = store<number>(forceThreshold.lateral);
    this.positiveVertical = store<number>(forceThreshold.positiveVertical);
    this.negativeVertical = store<number>(forceThreshold.negativeVertical);

    // Create a computed store that combines the individual stores
    this.forceThreshold = compute(
      this.lateral,
      this.positiveVertical,
      this.negativeVertical,
      (lateral, positiveVertical, negativeVertical) => {
        return <ForceThreshold>{
          lateral,
          positiveVertical,
          negativeVertical,
        };
      }
    );
  }

  getModel(): ForceThreshold {
    return this.forceThreshold.get();
  }
}
