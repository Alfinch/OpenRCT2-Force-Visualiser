import { positionToKey } from "../misc";
import { getRideTrackElements } from "../track";
import { savedColourSchemes } from "./saved-colour-schemes";

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
