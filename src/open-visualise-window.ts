import { window, label, viewport } from "openrct2-flexui";
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
  const interval = visualiseForces(
    ride,
    colours,
    thresholds,
    visualisationMode
  );

  const visualiseWindow = window({
    title: "Force visualiser",
    width: 280,
    height: 210,
    content: [
      label({
        text: `Visualising ${lowercaseFirstLetter(visualisationMode)} for ${
          ride.name
        }`,
      }),
      viewport({
        target: ride.vehicles[0],
      }),
    ],
    onClose: () => {
      interval.dispose();
      onNextTick(() => openMainWindow());
    },
  });

  visualiseWindow.open();
}
