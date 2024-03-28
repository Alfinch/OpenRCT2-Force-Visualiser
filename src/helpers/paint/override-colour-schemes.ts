import { ForceColours } from "../../models";
import { colourIds } from "./colour-ids";

/**
 * Override the colour schemes for a ride with the force visualisation colours
 * @param ride The ride to override the colour schemes for
 * @param colours The colours to use for the force visualisation
 */
export function overrideColourSchemes(
  ride: Ride,
  colours: ForceColours
) {
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
      value: colours.hideSupports ? colourIds.transparent : colourIds.grey,
    });
  }
}
