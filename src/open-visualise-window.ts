import { window, label, button, viewport } from "openrct2-flexui";
import { ForceThresholds } from "./force-thresholds";
import { VisualisationMode } from "./visualisation-mode";
import visualiseForces from "./visualise-forces";
import openMainWindow from "./open-main-window";
import { ForceColours } from "./force-colours";
import onNextTick from "./on-next-tick";

export default function openVisualiseWindow(
  ride: Ride,
  colours: ForceColours,
  thresholds: ForceThresholds,
  visualisationMode: VisualisationMode
) {
  console.log("Opening visualise window");

  const interval = visualiseForces(
    ride,
    colours,
    thresholds,
    visualisationMode
  );

  const visualiseWindow = window({
    title: "Force visualiser",
    width: 280,
    height: 280,
    content: [
      label({
        text: `Visualising ${visualisationMode.toLocaleLowerCase()} forces for "${
          ride.name
        }"`,
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
