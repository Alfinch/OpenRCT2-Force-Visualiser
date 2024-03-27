import {
  window,
  label,
  viewport,
  checkbox,
  twoway,
  store,
  compute,
} from "openrct2-flexui";
import { ForceThresholds } from "./force-thresholds";
import { VisualisationMode } from "./visualisation-mode";
import visualiseForces from "./visualise-forces";
import openMainWindow from "./open-main-window";
import { ForceColours } from "./force-colours";
import onNextTick from "./on-next-tick";
import lowercaseFirstLetter from "./lowercase-first-letter";

export default function openVisualiseWindow(
  ride: Ride,
  colours: ForceColours,
  thresholds: ForceThresholds,
  visualisationMode: VisualisationMode
) {
  let isClosed = false;

  const interval = visualiseForces(
    ride,
    colours,
    thresholds,
    visualisationMode
  );

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
        text: `Visualising ${lowercaseFirstLetter(visualisationMode)} for ${
          ride.name
        }`,
      }),
      checkbox({
        text: "Show viewport",
        isChecked: twoway(checked),
      }),
      viewport({
        target: ride.vehicles[0],
        visibility: compute(checked, (checked) =>
          checked ? "visible" : "none"
        ),
        height: 210,
      }),
    ],
    onClose: () => {
      if (isClosed) {
        return;
      }

      interval.dispose();
      eventListener.dispose();
      onNextTick(() => openMainWindow());

      isClosed = true;
    },
  });

  visualiseWindow.open();
}
