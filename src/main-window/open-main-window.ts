import {
  LayoutDirection,
  button,
  checkbox,
  colourPicker,
  compute,
  dropdown,
  groupbox,
  horizontal,
  label,
  spinner,
  twoway,
  window,
} from "openrct2-flexui";
import { formatGForce, onNextTick } from "../helpers/misc";
import { isTrackedRide } from "../helpers/track";
import { VisualisationMode } from "../models";
import { openVisualiseWindow } from "../visualise-window";
import { MainWindowController } from "./main-window-controller";

export function openMainWindow() {
  let isClosed = false;

  const trackedRides = map.rides.filter(isTrackedRide);
  const initialRide = trackedRides.length > 0 ? trackedRides[0] : null;

  const visualisationModes = [
    VisualisationMode.All,
    VisualisationMode.Vertical,
    VisualisationMode.Lateral,
  ];

  const controller = new MainWindowController({
    selectedRide: initialRide,
  });

  const mainWindow = window({
    title: "Force visualiser",
    width: 280,
    height: "auto",
    content: [
      label({
        text: "Select a tracked ride",
      }),
      dropdown({
        items: trackedRides.map((ride) => ride.name),
        selectedIndex: 0,
        onChange: (i) => {
          controller.selectedRide.set(trackedRides[i]);
        },
      }),
      dropdown({
        items: visualisationModes,
        selectedIndex: 0,
        onChange: (i) => {
          controller.visualisationMode.set(visualisationModes[i]);
        },
      }),
      groupbox({
        text: "Colours",
        direction: LayoutDirection.Vertical,
        content: [
          horizontal([
            colourPicker({
              colour: twoway(controller.colours.low),
            }),
            label({ text: "Low" }),
            colourPicker({
              colour: twoway(controller.colours.moderate),
            }),
            label({ text: "Moderate" }),
            colourPicker({
              colour: twoway(controller.colours.excessive),
            }),
            label({ text: "Excessive" }),
          ]),
          checkbox({
            text: "Hide supports",
            isChecked: twoway(controller.colours.hideSupports),
          }),
        ],
      }),
      groupbox({
        text: "Moderate force thresholds",
        content: [
          horizontal([
            label({
              text: "+/- Lateral",
              disabled: controller.disableLaterals,
            }),
            label({
              text: "+ Vertical",
              disabled: controller.disableVerticals,
            }),
            label({
              text: "- Vertical",
              disabled: controller.disableVerticals,
            }),
          ]),
          horizontal([
            spinner({
              value: twoway(controller.thresholds.moderate.lateral),
              step: 10,
              minimum: 0,
              maximum: 1000,
              format: formatGForce,
              disabled: controller.disableLaterals,
            }),
            spinner({
              value: twoway(controller.thresholds.moderate.positiveVertical),
              step: 10,
              minimum: 0,
              maximum: 1000,
              format: formatGForce,
              disabled: controller.disableVerticals,
            }),
            spinner({
              value: twoway(controller.thresholds.moderate.negativeVertical),
              step: 10,
              minimum: -1000,
              maximum: 0,
              format: formatGForce,
              disabled: controller.disableVerticals,
            }),
          ]),
        ],
      }),
      groupbox({
        text: "Excessive force thresholds",
        content: [
          horizontal([
            label({
              text: "+/- Lateral",
              disabled: controller.disableLaterals,
            }),
            label({
              text: "+ Vertical",
              disabled: controller.disableVerticals,
            }),
            label({
              text: "- Vertical",
              disabled: controller.disableVerticals,
            }),
          ]),
          horizontal([
            spinner({
              value: twoway(controller.thresholds.excessive.lateral),
              step: 10,
              minimum: 0,
              maximum: 1000,
              format: formatGForce,
              disabled: controller.disableLaterals,
            }),
            spinner({
              value: twoway(controller.thresholds.excessive.positiveVertical),
              step: 10,
              minimum: 0,
              maximum: 1000,
              format: formatGForce,
              disabled: controller.disableVerticals,
            }),
            spinner({
              value: twoway(controller.thresholds.excessive.negativeVertical),
              step: 10,
              minimum: -1000,
              maximum: 0,
              format: formatGForce,
              disabled: controller.disableVerticals,
            }),
          ]),
        ],
      }),
      button({
        text: "Visualise forces",
        height: 42,
        onClick: () => {
          mainWindow.close();
          onNextTick(() =>
            openVisualiseWindow(
              controller.selectedRide.get() as Ride,
              controller.colours.getModel(),
              controller.thresholds.getModel(),
              controller.visualisationMode.get()
            )
          );
        },
        disabled: compute(
          controller.selectedRide,
          (selectedRide) => selectedRide == null
        ),
      }),
      button({
        text: "Reset to defaults",
        height: 21,
        onClick: () => {
          controller.reset();
        },
      }),
    ],
    onClose: () => {
      if (isClosed) {
        return;
      }

      controller.dispose();

      isClosed = true;
    },
  });

  mainWindow.open();
}
