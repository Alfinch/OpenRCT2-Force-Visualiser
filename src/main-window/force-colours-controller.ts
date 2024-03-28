import { WritableStore, Store, store, compute } from "openrct2-flexui";
import { ForceColours } from "../models";
import { colourIds } from "../helpers/paint";
import { cloneDeep, merge } from "lodash-es";
import { deepFreeze } from "../helpers/misc";

const SAVED_FORCE_COLOURS_KEY = "forceVisualiser.forceColours";

const defaultValues = deepFreeze(<ForceColours>{
  low: colourIds.brightGreen,
  moderate: colourIds.yellow,
  excessive: colourIds.brightRed,
  hideSupports: false,
});

export class ForceColoursController implements IDisposable {
  low: WritableStore<number>;
  moderate: WritableStore<number>;
  excessive: WritableStore<number>;
  hideSupports: WritableStore<boolean>;

  private forceColours: Store<ForceColours>;
  private unsubscribe: () => void;

  constructor(initialValues?: Partial<ForceColours>) {
    // Initial values override saved values, and saved values override defaults
    let forceColours: ForceColours = cloneDeep(defaultValues);
    if (context.sharedStorage.has(SAVED_FORCE_COLOURS_KEY)) {
      forceColours = context.sharedStorage.get<ForceColours>(
        SAVED_FORCE_COLOURS_KEY
      ) as ForceColours;
    }
    if (initialValues != null) {
      forceColours = merge(forceColours, initialValues);
    }

    // Create stores for the model
    this.low = store<number>(forceColours.low);
    this.moderate = store<number>(forceColours.moderate);
    this.excessive = store<number>(forceColours.excessive);
    this.hideSupports = store<boolean>(forceColours.hideSupports);

    // Create a computed store that combines the individual stores
    this.forceColours = compute(
      this.low,
      this.moderate,
      this.excessive,
      this.hideSupports,
      (low, moderate, excessive, hideSupports) => {
        return <ForceColours>{
          low,
          moderate,
          excessive,
          hideSupports,
        };
      }
    );

    // Save the force colours to shared storage whenever they change
    this.unsubscribe = this.forceColours.subscribe((forceColours) => {
      context.sharedStorage.set(SAVED_FORCE_COLOURS_KEY, forceColours);
    });
  }

  getModel(): ForceColours {
    return this.forceColours.get();
  }

  reset(): void {
    this.low.set(defaultValues.low);
    this.moderate.set(defaultValues.moderate);
    this.excessive.set(defaultValues.excessive);
    this.hideSupports.set(defaultValues.hideSupports);
  }

  dispose(): void {
    this.unsubscribe();
  }
}
