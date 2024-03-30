import {
  window,
  label,
  viewport,
  checkbox,
  twoway,
  store,
  compute,
} from "openrct2-flexui";
import { getTrain, lowercaseFirstLetter, onNextTick } from "../helpers/misc";
import { openMainWindow } from "../main-window";
import { VisualisationSettings } from "../models";
import { visualiseForces } from "../visualiser";

export function openVisualiseWindow(settings: VisualisationSettings) {
  const interval = visualiseForces(settings);

  const eventListener = context.subscribe(
    "action.execute",
    (e: GameActionEventArgs) => {
      if (e.action === "ridedemolish") {
        visualiseWindow.close();
      }
    }
  );

  const checked = store(true);

  const visualiseWindow = window({
    title: "Force visualiser",
    width: 280,
    height: "auto",
    content: [
      label({
        text: `${settings.selectedRide.name}`,
      }),
      label({
        text: `Visualising ${lowercaseFirstLetter(
          settings.visualisationMode
        )}` /* for ${
          settings.selectedCar === -1
            ? "all cars"
            : "car " + (settings.selectedCar + 1).toString(10)
        }`*/,
      }),
      checkbox({
        text: "Show viewport",
        isChecked: twoway(checked),
      }),
      viewport({
        target: getTrain(settings.selectedRide.vehicles[0])[
          settings.selectedCar === -1 ? 0 : settings.selectedCar
        ].id,
        visibility: compute(checked, (checked) =>
          checked ? "visible" : "none"
        ),
        height: 210,
      }),
    ],
    onClose: () => {
      interval.dispose();
      eventListener.dispose();
      onNextTick(() => openMainWindow());
    },
  });

  visualiseWindow.open();
}
