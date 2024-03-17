export default function isTrackedRide(ride: Ride) {
  return (
    ride.classification === "ride" &&
    ride.stations.some((station) => station.length > 0)
  );
}
