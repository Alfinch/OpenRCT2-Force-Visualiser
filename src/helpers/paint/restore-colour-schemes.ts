import { getRideTrackElements } from "../track";
import { positionToKey } from "../misc";
import { savedColourSchemes } from "./saved-colour-schemes";

/**
 * Restore the colour schemes for a ride to the original colour schemes
 * @param ride The ride to restore the colour schemes for
 */
export function restoreColourSchemes(ride: Ride) {
  const saved = savedColourSchemes[ride.id];
  const rideExists = map.getRide(ride.id) !== null;
  if (!saved || !rideExists) {
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
