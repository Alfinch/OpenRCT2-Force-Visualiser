import { overrideColourSchemes } from "./colour-schemes";
import positionToKey from "./position-to-key";
import getIndexOfTrackElement from "./get-index-of-track-element";
import getTrackElementCoords from "./get-track-element-coords";
import getTrackElementsAtPosition from "./get-track-elements-at-position";

const MODERATE_POSITIVE_VERTICAL_G = 250;
const MODERATE_NEGATIVE_VERTICAL_G = -100;
const MODERATE_LATERAL_G = 137.5;

const EXCESSIVE_POSITIVE_VERTICAL_G = 500;
const EXCESSIVE_NEGATIVE_VERTICAL_G = -200;
const EXCESSIVE_LATERAL_G = 275;

function getForceLevel(force: GForces, laterals: boolean, verticals: boolean) {
  let forceLevel = 1; // 1 = low, 2 = moderate, 3 = excessive

  if (
    laterals &&
    (force.lateralG > MODERATE_LATERAL_G ||
      force.lateralG < -MODERATE_LATERAL_G)
  ) {
    forceLevel = 2;
  }

  if (
    verticals &&
    (force.verticalG > MODERATE_POSITIVE_VERTICAL_G ||
      force.verticalG < MODERATE_NEGATIVE_VERTICAL_G)
  ) {
    forceLevel = 2;
  }

  if (
    laterals &&
    (force.lateralG > EXCESSIVE_LATERAL_G ||
      force.lateralG < -EXCESSIVE_LATERAL_G)
  ) {
    forceLevel = 3;
  }

  if (
    verticals &&
    (force.verticalG > EXCESSIVE_POSITIVE_VERTICAL_G ||
      force.verticalG < EXCESSIVE_NEGATIVE_VERTICAL_G)
  ) {
    forceLevel = 3;
  }

  return forceLevel;
}

export default function visualiseForces(
  ride: Ride,
  laterals: boolean,
  verticals: boolean
): IDisposable {
  let trackSegmentForces: { [key: string]: number } = {};

  // Override the ride colour schemes with the force visualisation colours
  overrideColourSchemes(ride);

  // Get all lead cars on the ride
  const zeroCars = map
    .getAllEntities("car")
    .filter((car) => car.id && ride.vehicles.indexOf(car.id) !== -1);

  const interval = context.subscribe("interval.tick", () => {
    zeroCars.forEach((car) => {
      const force = car.gForces;
      let forceLevel = getForceLevel(force, laterals, verticals);

      const key = positionToKey(car.trackLocation);
      let savedForceLevel = trackSegmentForces[key];
      if (savedForceLevel != null) {
        if (savedForceLevel > forceLevel) {
          forceLevel = savedForceLevel;
        } else if (savedForceLevel < forceLevel) {
          trackSegmentForces[key] = forceLevel;
        }
        if (savedForceLevel === forceLevel) {
          return;
        }
      } else {
        trackSegmentForces[key] = forceLevel;
      }

      const tile = map.getTile(
        car.trackLocation.x / 32,
        car.trackLocation.y / 32
      );
      const trackIndex = getIndexOfTrackElement(tile, car.trackLocation.z);
      const trackIterator = map.getTrackIterator(car.trackLocation, trackIndex);

      if (!trackIterator) {
        throw new Error(
          `Could not find track iterator at x: ${car.trackLocation.x}, y: ${car.trackLocation.y}, z: ${car.trackLocation.z}, d: ${car.trackLocation.direction}`
        );
      }

      if (!trackIterator.segment) {
        throw new Error(
          `Could not find track segment at x: ${car.trackLocation.x}, y: ${car.trackLocation.y}, z: ${car.trackLocation.z}, d: ${car.trackLocation.direction}`
        );
      }

      const trackElements = trackIterator.segment.elements
        .map((elementVector) =>
          getTrackElementCoords(trackIterator.position, elementVector)
        )
        .map((coords) => getTrackElementsAtPosition(coords))
        .reduce((acc, val) => acc.concat(val), []);

      trackElements.forEach((element) => (element.colourScheme = forceLevel));
    });
  });

  console.log(`Visualising forces for ${ride.name}`);
  park.postMessage({
    type: "chart",
    text: `Visualising forces for ${ride.name}`,
  });

  return <IDisposable>{
    dispose() {
      interval.dispose();
      trackSegmentForces = {};
    },
  };
}
