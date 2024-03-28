import { Store, WritableStore, compute, store } from "openrct2-flexui";
import { VisualisationMode } from "../models";
import { cloneDeep, merge } from "lodash-es";
import { deepFreeze } from "../helpers/misc";
import { ForceColoursController } from "./force-colours-controller";
import { ForceThresholdsController } from "./force-thresholds-controller";
import { MainWindow } from "./main-window";

const defaultValues = deepFreeze(<MainWindow>{
  selectedRide: null,
  visualisationMode: VisualisationMode.All,
});

export class MainWindowController implements IDisposable {
  selectedRide: WritableStore<Ride | null>;
  visualisationMode: WritableStore<VisualisationMode>;
  disableLaterals: Store<boolean>;
  disableVerticals: Store<boolean>;
  colours: ForceColoursController;
  thresholds: ForceThresholdsController;

  constructor(initialValues?: Partial<MainWindow>) {
    let mainWindow: MainWindow = merge(cloneDeep(defaultValues), initialValues);

    this.selectedRide = store<Ride | null>(mainWindow.selectedRide);
    this.visualisationMode = store<VisualisationMode>(
      mainWindow.visualisationMode
    );
    this.disableLaterals = compute(
      this.visualisationMode,
      (visualisationMode) => visualisationMode === VisualisationMode.Vertical
    );
    this.disableVerticals = compute(
      this.visualisationMode,
      (visualisationMode) => visualisationMode === VisualisationMode.Lateral
    );

    this.colours = new ForceColoursController(mainWindow.colours);
    this.thresholds = new ForceThresholdsController(mainWindow.thresholds);
  }

  getModel(): MainWindow {
    return {
      selectedRide: this.selectedRide.get(),
      visualisationMode: this.visualisationMode.get(),
      colours: this.colours.getModel(),
      thresholds: this.thresholds.getModel(),
    };
  }

  reset(): void {
    this.selectedRide.set(defaultValues.selectedRide as Ride | null);
    this.visualisationMode.set(defaultValues.visualisationMode);
    this.colours.reset();
    this.thresholds.reset();
  }

  dispose() {
    this.colours.dispose();
    this.thresholds.dispose();
  }
}
