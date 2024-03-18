import { ForceColours } from "./force-colours";
import getRideTrackElements from "./get-ride-track-elements";
import positionToKey from "./position-to-key";

export const colourIds: { [key: string]: number } = {
  grey: 1,
  brightGreen: 14,
  yellow: 18,
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
 * Save the current colour schemes for a ride so they can be restored later
 * @param ride The ride to save the colour schemes for
 */
export function saveColourSchemes(ride: Ride) {
  const elementColourSchemes = getRideTrackElements(ride).reduce(
    (acc, { position, element }) => {
      acc[positionToKey(position)] = element.colourScheme;
      return acc;
    },
    {} as { [elementId: string]: number | null }
  );

  savedColourSchemes[ride.id] = {
    colorSchemes: ride.colourSchemes,
    elementColourSchemes,
  };
}

/**
 * Override the colour schemes for a ride with the force visualisation colours
 * @param ride The ride to override the colour schemes for
 */
export function overrideColourSchemes(ride: Ride, colours: ForceColours) {
  const trackColours = [
    colourIds.grey,
    colours.low,
    colours.moderate,
    colours.excessive,
  ];

  for (let i = 0; i < 4; i++) {
    context.executeAction("ridesetappearance", {
      ride: ride.id,
      index: i,
      type: 0,
      value: trackColours[i],
    });
    context.executeAction("ridesetappearance", {
      ride: ride.id,
      index: i,
      type: 1,
      value: trackColours[i],
    });
    context.executeAction("ridesetappearance", {
      ride: ride.id,
      index: i,
      type: 2,
      value: colourIds.transparent,
    });
  }
}

/**
 * Remove the alternate colour schemes for a ride
 * @param ride The ride to remove the alternate colour schemes for
 */
export function removeAlternateColourSchemes(ride: Ride) {
  const trackElements = getRideTrackElements(ride);
  trackElements.forEach(({ element }) => (element.colourScheme = 0));
}

/**
 * Restore the colour schemes for a ride to the original colour schemes
 * @param ride The ride to restore the colour schemes for
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
