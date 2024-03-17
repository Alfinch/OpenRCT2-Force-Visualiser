import getRideTrackElements from "./get-ride-track-elements";
import positionToKey from "./position-to-key";

export const colours: { [key: string]: number } = {
  grey: 1,
  brightGreen: 14,
  yellow: 18,
  //lightOrange: 20,
  brightRed: 28,
  transparent: 54,
};

/**
 * Saved colour schemes for a ride so they can be restored later
 */
const savedColourSchemes: {
  [rideId: string]: {
    colorSchemes: TrackColour[];
    elementColourSchemes: { [elementId: string]: number | null };
  } | null;
} = {};

/**
 * Override the colour schemes for a ride with the force visualisation colours
 * @param ride The ride to override the colour schemes for
 */
export function overrideColourSchemes(ride: Ride) {
  // Get all track elements
  const trackElements = getRideTrackElements(ride);

  // Save the current colour scheme so it can be restored later
  savedColourSchemes[ride.id] = {
    colorSchemes: ride.colourSchemes,
    elementColourSchemes: trackElements.reduce(
      (acc, { position, element: trackElement }) => {
        acc[positionToKey(position)] = trackElement.colourScheme;
        return acc;
      },
      {} as { [elementId: string]: number | null }
    ),
  };

  trackElements.forEach(({ element }) => (element.colourScheme = 0));

  for (let i = 0; i < 4; i++) {
    const colour = Object.keys(colours)[i];
    context.executeAction("ridesetappearance", {
      ride: ride.id,
      index: i,
      type: 0,
      value: colours[colour],
    });
    context.executeAction("ridesetappearance", {
      ride: ride.id,
      index: i,
      type: 1,
      value: colours[colour],
    });
    context.executeAction("ridesetappearance", {
      ride: ride.id,
      index: i,
      type: 2,
      value: colours.transparent,
    });
  }
}

/**
 * Restore the colour schemes for a ride to the original colour schemes
 * @param ride The ride to reset the colour schemes for
 */
export function restoreColourSchemes(ride: Ride) {
  const saved = savedColourSchemes[ride.id];
  if (!saved) {
    return;
  }
  savedColourSchemes[ride.id] = null;

  for (let i = 0; i < saved.colorSchemes.length; i++) {
    const colourScheme = saved.colorSchemes[i];
    context.executeAction("ridesetappearance", {
      ride: ride.id,
      index: i,
      type: 0,
      value: colourScheme.main,
    });
    context.executeAction("ridesetappearance", {
      ride: ride.id,
      index: i,
      type: 1,
      value: colourScheme.additional,
    });
    context.executeAction("ridesetappearance", {
      ride: ride.id,
      index: i,
      type: 2,
      value: colourScheme.supports,
    });
  }

  getRideTrackElements(ride).forEach(
    ({ element, position }) =>
      (element.colourScheme =
        saved.elementColourSchemes[positionToKey(position)])
  );
}
