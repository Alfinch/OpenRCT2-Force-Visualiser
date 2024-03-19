import {
  LayoutDirection,
  WritableStore,
  button,
  checkbox,
  colourPicker,
  compute,
  dropdown,
  groupbox,
  horizontal,
  label,
  spinner,
  store,
  twoway,
  window,
} from "openrct2-flexui";
import { colourIds } from "./colour-schemes";
import isTrackedRide from "./is-tracked-ride";
import { ForceThresholds, ForceThresholdsModel } from "./force-thresholds";
import { VisualisationMode } from "./visualisation-mode";
import openVisualiseWindow from "./open-visualise-window";
import { ForceColours, ForceColoursModel } from "./force-colours";
import onNextTick from "./on-next-tick";

const LOW_G_COLOUR = colourIds.brightGreen;
const MODERATE_G_COLOUR = colourIds.yellow;
const EXCESSIVE_G_COLOUR = colourIds.brightRed;

const MODERATE_POSITIVE_VERTICAL_G = 250;
const MODERATE_NEGATIVE_VERTICAL_G = -100;
const MODERATE_LATERAL_G = 140;

const EXCESSIVE_POSITIVE_VERTICAL_G = 500;
const EXCESSIVE_NEGATIVE_VERTICAL_G = -200;
const EXCESSIVE_LATERAL_G = 280;

export default function openMainWindow() {
  const trackedRides = map.rides.filter(isTrackedRide);
  const initialRide = trackedRides.length > 0 ? trackedRides[0] : null;

  const visualisationModes = [
    VisualisationMode.All,
    VisualisationMode.Vertical,
    VisualisationMode.Lateral,
  ];

  const model = getModel(initialRide, null, null);

  const disableLaterals = compute(
    model.visualisationMode,
    (visualisationMode) => visualisationMode === VisualisationMode.Vertical
  );

  const disableVerticals = compute(
    model.visualisationMode,
    (visualisationMode) => visualisationMode === VisualisationMode.Lateral
  );

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
          model.selectedRide.set(trackedRides[i]);
        },
      }),
      dropdown({
        items: visualisationModes,
        selectedIndex: 0,
        onChange: (i) => {
          model.visualisationMode.set(visualisationModes[i]);
        },
      }),
      groupbox({
        text: "Colours",
        direction: LayoutDirection.Vertical,
        content: [
          horizontal([
            colourPicker({
              colour: twoway(model.colours.low),
            }),
            label({ text: "Low" }),
            colourPicker({
              colour: twoway(model.colours.moderate),
            }),
            label({ text: "Moderate" }),
            colourPicker({
              colour: twoway(model.colours.excessive),
            }),
            label({ text: "Excessive" }),
          ]),
          checkbox({
            text: "Hide supports",
            isChecked: twoway(model.colours.hideSupports),
          }),
        ],
      }),
      groupbox({
        text: "Moderate force thresholds",
        content: [
          horizontal([
            label({
              text: "+/- Lateral",
              disabled: disableLaterals,
            }),
            label({
              text: "+ Vertical",
              disabled: disableVerticals,
            }),
            label({
              text: "- Vertical",
              disabled: disableVerticals,
            }),
          ]),
          horizontal([
            spinner({
              value: twoway(model.thresholds.moderate.lateral),
              step: 10,
              minimum: 0,
              maximum: 1000,
              format: formatGForce,
              disabled: disableLaterals,
            }),
            spinner({
              value: twoway(model.thresholds.moderate.positiveVertical),
              step: 10,
              minimum: 0,
              maximum: 1000,
              format: formatGForce,
              disabled: disableVerticals,
            }),
            spinner({
              value: twoway(model.thresholds.moderate.negativeVertical),
              step: 10,
              minimum: -1000,
              maximum: 0,
              format: formatGForce,
              disabled: disableVerticals,
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
              disabled: disableLaterals,
            }),
            label({
              text: "+ Vertical",
              disabled: disableVerticals,
            }),
            label({
              text: "- Vertical",
              disabled: disableVerticals,
            }),
          ]),
          horizontal([
            spinner({
              value: twoway(model.thresholds.excessive.lateral),
              step: 10,
              minimum: 0,
              maximum: 1000,
              format: formatGForce,
              disabled: disableLaterals,
            }),
            spinner({
              value: twoway(model.thresholds.excessive.positiveVertical),
              step: 10,
              minimum: 0,
              maximum: 1000,
              format: formatGForce,
              disabled: disableVerticals,
            }),
            spinner({
              value: twoway(model.thresholds.excessive.negativeVertical),
              step: 10,
              minimum: -1000,
              maximum: 0,
              format: formatGForce,
              disabled: disableVerticals,
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
              model.selectedRide.get() as Ride,
              forceColoursModelToForceColours(model.colours),
              forceThresholdsModelToForceThresholds(model.thresholds),
              model.visualisationMode.get()
            )
          );
        },
        disabled: compute(
          model.selectedRide,
          (selectedRide) => selectedRide == null
        ),
      }),
      button({
        text: "Reset to defaults",
        height: 21,
        onClick: () => {
          resetModel(model);
        },
      }),
    ],
  });

  mainWindow.open();
}

interface MainWindowModel {
  selectedRide: WritableStore<Ride | null>;
  visualisationMode: WritableStore<VisualisationMode>;
  colours: ForceColoursModel;
  thresholds: ForceThresholdsModel;
}

function getModel(
  initialRide: Ride | null,
  savedColours: ForceColours | null,
  savedThresholds: ForceThresholds | null
): MainWindowModel {
  return {
    selectedRide: store<Ride | null>(initialRide),
    visualisationMode: store<VisualisationMode>(VisualisationMode.All),
    colours: <ForceColoursModel>{
      low: store<number>(savedColours?.low ?? LOW_G_COLOUR),
      moderate: store<number>(savedColours?.moderate ?? MODERATE_G_COLOUR),
      excessive: store<number>(savedColours?.excessive ?? EXCESSIVE_G_COLOUR),
      hideSupports: store<boolean>(savedColours?.hideSupports ?? true),
    },
    thresholds: <ForceThresholdsModel>{
      moderate: {
        lateral: store<number>(
          savedThresholds?.moderate.lateral ?? MODERATE_LATERAL_G
        ),
        positiveVertical: store<number>(
          savedThresholds?.moderate.positiveVertical ??
            MODERATE_POSITIVE_VERTICAL_G
        ),
        negativeVertical: store<number>(
          savedThresholds?.moderate.negativeVertical ??
            MODERATE_NEGATIVE_VERTICAL_G
        ),
      },
      excessive: {
        lateral: store<number>(
          savedThresholds?.excessive.lateral ?? EXCESSIVE_LATERAL_G
        ),
        positiveVertical: store<number>(
          savedThresholds?.excessive.positiveVertical ??
            EXCESSIVE_POSITIVE_VERTICAL_G
        ),
        negativeVertical: store<number>(
          savedThresholds?.excessive.negativeVertical ??
            EXCESSIVE_NEGATIVE_VERTICAL_G
        ),
      },
    },
  };
}

function resetModel(model: MainWindowModel) {
  model.colours.low.set(LOW_G_COLOUR);
  model.colours.moderate.set(MODERATE_G_COLOUR);
  model.colours.excessive.set(EXCESSIVE_G_COLOUR);
  model.colours.hideSupports.set(true);

  model.thresholds.moderate.lateral.set(MODERATE_LATERAL_G);
  model.thresholds.moderate.positiveVertical.set(MODERATE_POSITIVE_VERTICAL_G);
  model.thresholds.moderate.negativeVertical.set(MODERATE_NEGATIVE_VERTICAL_G);

  model.thresholds.excessive.lateral.set(EXCESSIVE_LATERAL_G);
  model.thresholds.excessive.positiveVertical.set(
    EXCESSIVE_POSITIVE_VERTICAL_G
  );
  model.thresholds.excessive.negativeVertical.set(
    EXCESSIVE_NEGATIVE_VERTICAL_G
  );
}

function forceColoursModelToForceColours(
  model: ForceColoursModel
): ForceColours {
  return {
    low: model.low.get(),
    moderate: model.moderate.get(),
    excessive: model.excessive.get(),
    hideSupports: model.hideSupports.get(),
  };
}

function forceThresholdsModelToForceThresholds(
  model: ForceThresholdsModel
): ForceThresholds {
  return {
    moderate: {
      lateral: model.moderate.lateral.get(),
      positiveVertical: model.moderate.positiveVertical.get(),
      negativeVertical: model.moderate.negativeVertical.get(),
    },
    excessive: {
      lateral: model.excessive.lateral.get(),
      positiveVertical: model.excessive.positiveVertical.get(),
      negativeVertical: model.excessive.negativeVertical.get(),
    },
  };
}

function formatGForce(value: number): string {
  return (value / 100).toFixed(1) + "G";
}
