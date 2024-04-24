import { Store, WritableStore, compute, store } from "openrct2-flexui";
import { VisualisationMode, VisualisationSettings } from "../models";
import { cloneDeep, merge } from "lodash-es";
import { deepFreeze } from "../helpers/misc";
import { ForceColoursController } from "./force-colours-controller";
import { ForceThresholdsController } from "./force-thresholds-controller";
import { isTrackedRide } from "../helpers/track";
import { visualisationModes } from "../models/visualisation-mode";

const defaultValues = deepFreeze(<VisualisationSettings>{
  visualisationMode: VisualisationMode.All,
});

export class MainWindowController implements IDisposable {
  trackedRides: WritableStore<Ride[]>;
  trackedRideNames: Store<string[]>;

  selectedRideIndex: WritableStore<number>;
  visualisationModeIndex: WritableStore<number>;
  visualisationMode: Store<VisualisationMode>;
  disableLaterals: Store<boolean>;
  disableVerticals: Store<boolean>;

  colours: ForceColoursController;
  thresholds: ForceThresholdsController;

  constructor(initialValues?: Partial<VisualisationSettings>) {
    let settings: VisualisationSettings = merge(
      cloneDeep(defaultValues),
      initialValues
    );

    this.trackedRides = store(map.rides.filter(isTrackedRide));
    this.trackedRideNames = compute(this.trackedRides, (rides) =>
      rides.map((ride) => ride.name)
    );

    this.selectedRideIndex = store(this.indexOfRide(settings.selectedRide));

    this.visualisationModeIndex = store(
      visualisationModes.indexOf(settings.visualisationMode)
    );
    this.visualisationMode = compute(
      this.visualisationModeIndex,
      (index) => visualisationModes[index]
    );
    this.disableLaterals = compute(
      this.visualisationMode,
      (visualisationMode) => visualisationMode === VisualisationMode.Vertical
    );
    this.disableVerticals = compute(
      this.visualisationMode,
      (visualisationMode) => visualisationMode === VisualisationMode.Lateral
    );

    this.colours = new ForceColoursController(settings.colours);
    this.thresholds = new ForceThresholdsController(settings.thresholds);
  }

  private indexOfRide(ride: Ride): number {
    if (ride == null) return -1;

    const trackedRides = this.trackedRides.get();

    for (let i = 0; i < trackedRides.length; i++) {
      if (trackedRides[i].id === ride.id) {
        return i;
      }
    }

    return -1;
  }

  getSelectedRide(): Ride | null {
    return this.trackedRides.get()[this.selectedRideIndex.get()] ?? null;
  }

  getModel(): VisualisationSettings {
    const selectedRide = this.getSelectedRide();
    if (selectedRide == null) {
      throw new Error("No ride selected");
    }

    return {
      selectedRide,
      visualisationMode: this.visualisationMode.get(),
      colours: this.colours.getModel(),
      thresholds: this.thresholds.getModel(),
    };
  }

  reset(): void {
    this.selectedRideIndex.set(0);
    this.visualisationModeIndex.set(0);
    this.colours.reset();
    this.thresholds.reset();
  }

  dispose() {
    this.colours.dispose();
    this.thresholds.dispose();
  }
}
