/**
 * Returns true if the ride is a tracked ride, otherwise false
 * @param ride The ride to check
 * @returns True if the ride is a tracked ride
 */
export function isTrackedRide(ride: Ride): boolean {
  return ride.classification === "ride" && ride.object.carsPerFlatRide === 255;
}
