import { Store, compute } from "openrct2-flexui";
import { ForceThresholds } from "../models";
import { cloneDeep, merge } from "lodash-es";
import { deepFreeze } from "../helpers/misc";
import { ForceThresholdController } from "./force-threshold-controller";

const SAVED_FORCE_THRESHOLDS_KEY = "forceVisualiser.forceThresholds";

const defaultValues = deepFreeze(<ForceThresholds>{
  moderate: {
    lateral: 140,
    positiveVertical: 250,
    negativeVertical: -100,
  },
  excessive: {
    lateral: 280,
    positiveVertical: 500,
    negativeVertical: -200,
  },
});

export class ForceThresholdsController implements IDisposable {
  moderate: ForceThresholdController;
  excessive: ForceThresholdController;

  private forceThresholds: Store<ForceThresholds>;
  private unsubscribe: () => void;

  constructor(initialValues?: Partial<ForceThresholds>) {
    // Initial values override saved values, and saved values override defaults
    let forceThresholds: ForceThresholds = cloneDeep(defaultValues);
    if (context.sharedStorage.has(SAVED_FORCE_THRESHOLDS_KEY)) {
      forceThresholds = context.sharedStorage.get<ForceThresholds>(
        SAVED_FORCE_THRESHOLDS_KEY
      ) as ForceThresholds;
    }
    if (initialValues != null) {
      forceThresholds = merge(forceThresholds, initialValues);
    }

    // Create child models
    this.moderate = new ForceThresholdController(forceThresholds.moderate);
    this.excessive = new ForceThresholdController(forceThresholds.excessive);

    // Create a computed store that combines the individual stores
    this.forceThresholds = compute(
      this.moderate.forceThreshold,
      this.excessive.forceThreshold,
      (moderate, excessive) => {
        return <ForceThresholds>{
          moderate,
          excessive,
        };
      }
    );

    // Save the force colours to shared storage whenever they change
    this.unsubscribe = this.forceThresholds.subscribe((forceThresholds) => {
      context.sharedStorage.set(SAVED_FORCE_THRESHOLDS_KEY, forceThresholds);
    });
  }

  getModel(): ForceThresholds {
    return this.forceThresholds.get();
  }

  reset(): void {
    this.moderate.lateral.set(defaultValues.moderate.lateral);
    this.moderate.positiveVertical.set(defaultValues.moderate.positiveVertical);
    this.moderate.negativeVertical.set(defaultValues.moderate.negativeVertical);

    this.excessive.lateral.set(defaultValues.excessive.lateral);
    this.excessive.positiveVertical.set(
      defaultValues.excessive.positiveVertical
    );
    this.excessive.negativeVertical.set(
      defaultValues.excessive.negativeVertical
    );
  }

  dispose(): void {
    this.unsubscribe();
  }
}
