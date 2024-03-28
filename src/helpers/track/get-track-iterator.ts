import { getIndexOfTrackElement } from "./get-index-of-track-element";
import { isTrackedRide } from "./is-tracked-ride";

/**
 * Get the track iterator for a ride
 * @param ride The ride to get the track iterator for
 * @returns The track iterator for the ride
 */
export function getTrackIterator(ride: Ride): TrackIterator | null {
  if (isTrackedRide(ride) === false) {
    return null;
  }

  const startCoords = ride.stations[0].start;
  const tileCoords = { x: startCoords.x / 32, y: startCoords.y / 32 };
  const tile = map.getTile(tileCoords.x, tileCoords.y);

  const startIndex = getIndexOfTrackElement(tile, startCoords.z);

  const trackIterator = map.getTrackIterator(startCoords, startIndex);

  return trackIterator;
}
