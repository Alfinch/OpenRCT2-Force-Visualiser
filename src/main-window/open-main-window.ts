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
import { VisualisationMode } from "../models";
import { openVisualiseWindow } from "../visualise-window";
import { MainWindowController } from "./main-window-controller";

export function openMainWindow() {
  const visualisationModes = [
    VisualisationMode.All,
    VisualisationMode.Vertical,
    VisualisationMode.Lateral,
  ];

  const controller = new MainWindowController();

  const mainWindow = window({
    title: "Force visualiser",
    width: 280,
    height: "auto",
    content: [
      label({
        text: "Select a tracked ride",
      }),
      dropdown({
        items: controller.trackedRideNames,
        selectedIndex: twoway(controller.selectedRideIndex),
      }),
      // Which car's forces to visualise - disabled for now as this feature isn't working as intended
      // dropdown({
      //   items: controller.rideCarOptions,
      //   selectedIndex: twoway(controller.selectedRideCarIndex),
      //   disabled: compute(controller.selectedRideIndex, (index) => {
      //     return index === -1;
      //   }),
      // }),
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
          onNextTick(() => openVisualiseWindow(controller.getModel()));
        },
        disabled: compute(
          controller.selectedRideIndex,
          (selectedRide) => selectedRide === -1
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
      controller.dispose();
    },
  });

  mainWindow.open();
}
