import {
  LayoutDirection,
  button,
  colourPicker,
  compute,
  dropdown,
  groupbox,
  horizontal,
  label,
  spinner,
  store,
  window,
} from "openrct2-flexui";
import {
  colourIds,
  restoreColourSchemes,
  saveColourSchemes,
} from "./colour-schemes";
import isTrackedRide from "./is-tracked-ride";
import { ForceThresholds } from "./force-thresholds";
import { VisualisationMode } from "./visualisation-mode";
import openVisualiseWindow from "./open-visualise-window";
import { ForceColours } from "./force-colours";
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
  console.log("Opening main window");

  const trackedRides = map.rides.filter(isTrackedRide);
  const initialRide = trackedRides.length > 0 ? trackedRides[0] : null;

  const visualisationModes = [
    VisualisationMode.All,
    VisualisationMode.Vertical,
    VisualisationMode.Lateral,
  ];

  const model = {
    selectedRide: store<Ride | null>(initialRide),
    visualisationMode: store<VisualisationMode>(VisualisationMode.All),
    colours: <ForceColours>{
      low: LOW_G_COLOUR,
      moderate: MODERATE_G_COLOUR,
      excessive: EXCESSIVE_G_COLOUR,
    },
    thresholds: <ForceThresholds>{
      moderate: {
        lateral: MODERATE_LATERAL_G,
        positiveVertical: MODERATE_POSITIVE_VERTICAL_G,
        negativeVertical: MODERATE_NEGATIVE_VERTICAL_G,
      },
      excessive: {
        lateral: EXCESSIVE_LATERAL_G,
        positiveVertical: EXCESSIVE_POSITIVE_VERTICAL_G,
        negativeVertical: EXCESSIVE_NEGATIVE_VERTICAL_G,
      },
    },
  };

  model.selectedRide.subscribe((ride) => {
    console.log(`Selected ride changed to "${ride?.name ?? "null"}"`);
    if (ride != null) {
      saveColourSchemes(ride);
    }
  });

  const mainWindow = window({
    title: "Force visualiser",
    width: 280,
    height: 280,
    content: [
      label({
        text: "Select a tracked ride",
      }),
      dropdown({
        items: trackedRides.map((ride) => ride.name),
        selectedIndex: 0,
        onChange: (i) => {
          const selectedRide = model.selectedRide.get();
          if (selectedRide != null) {
            restoreColourSchemes(selectedRide);
          }
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
        direction: LayoutDirection.Horizontal,
        content: [
          colourPicker({
            onChange: (colour: number) => {
              model.colours.low = colour;
            },
            colour: model.colours.low,
          }),
          label({ text: "Low" }),
          colourPicker({
            onChange: (colour: number) => {
              model.colours.moderate = colour;
            },
            colour: model.colours.moderate,
          }),
          label({ text: "Moderate" }),
          colourPicker({
            onChange: (colour: number) => {
              model.colours.excessive = colour;
            },
            colour: model.colours.excessive,
          }),
          label({ text: "Excessive" }),
        ],
      }),
      groupbox({
        text: "Moderate force thresholds",
        content: [
          horizontal([
            label({
              text: "+/- Lateral",
              disabled: compute(
                model.visualisationMode,
                (visualisationMode) =>
                  visualisationMode === VisualisationMode.Vertical
              ),
            }),
            label({
              text: "+ Vertical",
              disabled: compute(
                model.visualisationMode,
                (visualisationMode) =>
                  visualisationMode === VisualisationMode.Lateral
              ),
            }),
            label({
              text: "- Vertical",
              disabled: compute(
                model.visualisationMode,
                (visualisationMode) =>
                  visualisationMode === VisualisationMode.Lateral
              ),
            }),
          ]),
          horizontal([
            spinner({
              onChange: (number: number) => {
                console.log(number);
              },
              value: model.thresholds.moderate.lateral,
              step: 10,
              minimum: 0,
              maximum: 1000,
              format: (value) => (value / 100).toFixed(1) + "G",
              disabled: compute(
                model.visualisationMode,
                (visualisationMode) =>
                  visualisationMode === VisualisationMode.Vertical
              ),
            }),
            spinner({
              onChange: (number: number) => {
                console.log(number);
              },
              value: model.thresholds.moderate.positiveVertical,
              step: 10,
              minimum: 0,
              maximum: 1000,
              format: (value) => (value / 100).toFixed(1) + "G",
              disabled: compute(
                model.visualisationMode,
                (visualisationMode) =>
                  visualisationMode === VisualisationMode.Lateral
              ),
            }),
            spinner({
              onChange: (number: number) => {
                console.log(number);
              },
              value: model.thresholds.moderate.negativeVertical,
              step: 10,
              minimum: -1000,
              maximum: 0,
              format: (value) => (value / 100).toFixed(1) + "G",
              disabled: compute(
                model.visualisationMode,
                (visualisationMode) =>
                  visualisationMode === VisualisationMode.Lateral
              ),
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
              disabled: compute(
                model.visualisationMode,
                (visualisationMode) =>
                  visualisationMode === VisualisationMode.Vertical
              ),
            }),
            label({
              text: "+ Vertical",
              disabled: compute(
                model.visualisationMode,
                (visualisationMode) =>
                  visualisationMode === VisualisationMode.Lateral
              ),
            }),
            label({
              text: "- Vertical",
              disabled: compute(
                model.visualisationMode,
                (visualisationMode) =>
                  visualisationMode === VisualisationMode.Lateral
              ),
            }),
          ]),
          horizontal([
            spinner({
              onChange: (number: number) => {
                console.log(number);
              },
              value: model.thresholds.excessive.lateral,
              step: 10,
              minimum: 0,
              maximum: 1000,
              format: (value) => (value / 100).toFixed(1) + "G",
              disabled: compute(
                model.visualisationMode,
                (visualisationMode) =>
                  visualisationMode === VisualisationMode.Vertical
              ),
            }),
            spinner({
              onChange: (number: number) => {
                console.log(number);
              },
              value: model.thresholds.excessive.positiveVertical,
              step: 10,
              minimum: 0,
              maximum: 1000,
              format: (value) => (value / 100).toFixed(1) + "G",
              disabled: compute(
                model.visualisationMode,
                (visualisationMode) =>
                  visualisationMode === VisualisationMode.Lateral
              ),
            }),
            spinner({
              onChange: (number: number) => {
                console.log(number);
              },
              value: model.thresholds.excessive.negativeVertical,
              step: 10,
              minimum: -1000,
              maximum: 0,
              format: (value) => (value / 100).toFixed(1) + "G",
              disabled: compute(
                model.visualisationMode,
                (visualisationMode) =>
                  visualisationMode === VisualisationMode.Lateral
              ),
            }),
          ]),
        ],
      }),
      button({
        text: "Visualise forces",
        onClick: () => {
          mainWindow.close();
          onNextTick(() =>
            openVisualiseWindow(
              model.selectedRide.get() as Ride,
              model.colours,
              model.thresholds,
              model.visualisationMode.get()
            )
          );
        },
        disabled: compute(
          model.selectedRide,
          (selectedRide) => selectedRide == null
        ),
      }),
    ],
  });

  mainWindow.open();
}
