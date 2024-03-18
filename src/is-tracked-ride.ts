export default function isTrackedRide(ride: Ride) {
  return ride.classification === "ride" && ride.object.carsPerFlatRide === 255;
}
