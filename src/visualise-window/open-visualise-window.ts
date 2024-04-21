import {
  window,
  label,
  viewport,
  checkbox,
  twoway,
  store,
  compute,
  horizontal,
  button,
} from "openrct2-flexui";
import { getTrain, lowercaseFirstLetter } from "../helpers/misc";
import { VisualisationSettings } from "../models";
import { visualiseForces } from "../visualiser";

export function openVisualiseWindow(
  settings: VisualisationSettings,
  onClose: (settings: VisualisationSettings) => void
) {
  const interval = visualiseForces(settings);

  const eventListener = context.subscribe(
    "action.execute",
    (e: GameActionEventArgs) => {
      if (e.action === "ridedemolish") {
        visualiseWindow.close();
      }
    }
  );

  const showViewport = store(true);

  console.log(settings.selectedRide.object);

  const vehicleString =
    settings.selectedRide.object.maxCarsInTrain -
      settings.selectedRide.object.zeroCars >
    1
      ? "train"
      : "car";
  const allVehicles = settings.selectedRide.vehicles.map(
    (v) =>
      getTrain(v)[settings.selectedCar === -1 ? 0 : settings.selectedCar].id
  );
  const selectedVehicleIndex = store(0);
  const selectedVehicle = compute(
    selectedVehicleIndex,
    (index) => allVehicles[index]
  );

  const visualisingDescription = compute(
    selectedVehicleIndex,
    (index) =>
      `Visualising ${lowercaseFirstLetter(
        settings.visualisationMode
      )} for ${vehicleString} ${index + 1}`
  );

  const visualiseWindow = window({
    title: "Force visualiser",
    width: 280,
    height: "auto",
    content: [
      label({
        text: `${settings.selectedRide.name}`,
      }),
      label({
        text: visualisingDescription /* for ${
          settings.selectedCar === -1
            ? "all cars"
            : "car " + (settings.selectedCar + 1).toString(10)
        }`*/,
      }),
      checkbox({
        text: "Show viewport",
        isChecked: twoway(showViewport),
      }),
      viewport({
        target: selectedVehicle,
        visibility: compute(showViewport, (checked) =>
          checked ? "visible" : "none"
        ),
        height: 210,
      }),
      horizontal({
        content: [
          button({
            text: `Previous ${vehicleString}`,
            height: 21,
            visibility: compute(showViewport, (checked) =>
              checked && allVehicles.length > 1 ? "visible" : "none"
            ),
            onClick: () => {
              selectedVehicleIndex.set(
                (selectedVehicleIndex.get() - 1 + allVehicles.length) %
                  allVehicles.length
              );
            },
          }),
          button({
            text: `Next ${vehicleString}`,
            height: 21,
            visibility: compute(showViewport, (checked) =>
              checked && allVehicles.length > 1 ? "visible" : "none"
            ),
            onClick: () => {
              selectedVehicleIndex.set(
                (selectedVehicleIndex.get() + 1) % allVehicles.length
              );
            },
          }),
        ],
      }),
    ],
    onClose: () => {
      interval.dispose();
      eventListener.dispose();
      onClose(settings);
    },
  });

  visualiseWindow.open();
}
