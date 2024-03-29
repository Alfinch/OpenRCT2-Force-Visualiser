import { getTrain } from "./get-train";

export function getRideCarCount(ride: Ride): number {
  if (ride.vehicles.length === 0) return 0;
  return getTrain(ride.vehicles[0]).length;
}
