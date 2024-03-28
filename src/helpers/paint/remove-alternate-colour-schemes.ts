import { getRideTrackElements } from "../track";

/**
 * Remove the alternate colour schemes for a ride
 * @param ride The ride to remove the alternate colour schemes for
 */
export function removeAlternateColourSchemes(ride: Ride) {
  const trackElements = getRideTrackElements(ride);
  trackElements.forEach(({ element }) => (element.colourScheme = 0));
}
