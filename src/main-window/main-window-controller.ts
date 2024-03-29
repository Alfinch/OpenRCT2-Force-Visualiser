import { Store, WritableStore, compute, store } from "openrct2-flexui";
import { VisualisationMode, VisualisationSettings } from "../models";
import { cloneDeep, merge, range } from "lodash-es";
import { deepFreeze, getRideCarCount } from "../helpers/misc";
import { ForceColoursController } from "./force-colours-controller";
import { ForceThresholdsController } from "./force-thresholds-controller";
import { isTrackedRide } from "../helpers/track";

const defaultValues = deepFreeze(<VisualisationSettings>{
  visualisationMode: VisualisationMode.All,
});

export class MainWindowController implements IDisposable {
  trackedRides: WritableStore<Ride[]>;
  trackedRideNames: Store<string[]>;
  rideCarOptions: Store<string[]>;

  selectedRideIndex: WritableStore<number>;
  selectedRideCarIndex: WritableStore<number>;
  visualisationMode: WritableStore<VisualisationMode>;
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

    this.rideCarOptions = compute(this.selectedRideIndex, () =>
      this.getCarOptions()
    );

    // Index 0 is "All cars", 1 is the first car, 2 is the second and so on
    // Default to 1 so that the first car is selected
    this.selectedRideCarIndex = store(1);

    this.visualisationMode = store<VisualisationMode>(
      settings.visualisationMode
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
    return this.trackedRides.get().indexOf(ride);
  }

  private getCarOptions(): string[] {
    const selectedRide = this.getSelectedRide();
    if (selectedRide == null) return [];
    const carCount = getRideCarCount(selectedRide);
    const options = range(1, carCount + 1).map((n) => `Car ${n}`);
    options.unshift("All cars");
    return options;
  }

  getSelectedRide(): Ride | null {
    return this.trackedRides.get()[this.selectedRideIndex.get()] ?? null;
  }

  getModel(): VisualisationSettings {
    const selectedRide = this.getSelectedRide();
    if (selectedRide == null) {
      throw new Error("No ride selected");
    }

    // Index 0 is "All cars", 1 is the first car, 2 is the second and so on
    // We subtract 1 so that -1 means all cars and all other values are the car index
    const selectedCar = this.selectedRideCarIndex.get() - 1;

    return {
      selectedRide,
      selectedCar,
      visualisationMode: this.visualisationMode.get(),
      colours: this.colours.getModel(),
      thresholds: this.thresholds.getModel(),
    };
  }

  reset(): void {
    this.selectedRideIndex.set(0);
    this.visualisationMode.set(defaultValues.visualisationMode);
    this.colours.reset();
    this.thresholds.reset();
  }

  dispose() {
    this.colours.dispose();
    this.thresholds.dispose();
  }
}
