import {
  button,
  colourPicker,
  dropdown,
  groupbox,
  label,
  window,
} from "openrct2-flexui";
import { colours, restoreColourSchemes } from "./colour-schemes";
import isTrackedRide from "./is-tracked-ride";
import visualiseForces from "./visualise-forces";

export default function openWindow() {
  const trackedRides = map.rides.filter(isTrackedRide);
  let selectedRide: Ride | null = trackedRides[0];

  let lowColour = colours.brightGreen;
  let midColour = colours.yellow;
  let highColour = colours.brightRed;

  let interval: IDisposable | null;

  window({
    title: "Force visualiser",
    width: 210,
    height: 210,
    content: [
      label({
        text: "Select a tracked ride",
      }),
      dropdown({
        items: trackedRides.map((ride) => ride.name),
        selectedIndex: 0,
        onChange: (i) => {
          if (selectedRide) {
            restoreColourSchemes(selectedRide);
          }
          selectedRide = trackedRides[i];
        },
      }),
      button({
        text: "All Gs",
        onClick: () => {
          if (interval) {
            interval.dispose();
            interval = null;
          }
          if (selectedRide) {
            restoreColourSchemes(selectedRide);
          }
          context.setTimeout(() => {
            if (selectedRide) {
              interval = visualiseForces(selectedRide, true, true);
            }
          }, 0);
        },
      }),
      button({
        text: "Vertical Gs",
        onClick: () => {
          if (interval) {
            interval.dispose();
            interval = null;
          }
          if (selectedRide) {
            restoreColourSchemes(selectedRide);
          }
          context.setTimeout(() => {
            if (selectedRide) {
              interval = visualiseForces(selectedRide, false, true);
            }
          }, 0);
        },
      }),
      button({
        text: "Lateral Gs",
        onClick: () => {
          if (interval) {
            interval.dispose();
            interval = null;
          }
          if (selectedRide) {
            restoreColourSchemes(selectedRide);
          }
          context.setTimeout(() => {
            if (selectedRide) {
              interval = visualiseForces(selectedRide, true, false);
            }
          }, 0);
        },
      }),
      groupbox({
        text: "Colours",
        content: [
          colourPicker({
            onChange: (colour: number) => {
              lowColour = colour;
            },
            colour: lowColour,
          }),
          colourPicker({
            onChange: (colour: number) => {
              midColour = colour;
            },
            colour: midColour,
          }),
          colourPicker({
            onChange: (colour: number) => {
              highColour = colour;
            },
            colour: highColour,
          }),
        ],
      }),
    ],
    onClose: () => {
      if (interval) {
        interval.dispose();
        interval = null;
      }
      if (selectedRide) {
        restoreColourSchemes(selectedRide);
      }
      selectedRide = null;
    },
  });
}
