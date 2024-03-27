import positionToKey from "./position-to-key";
import getIndexOfTrackElement from "./get-index-of-track-element";
import getTrackElementCoords from "./get-track-element-coords";
import getTrackElementsAtPosition from "./get-track-elements-at-position";
import { ForceThresholds } from "./force-thresholds";
import { VisualisationMode } from "./visualisation-mode";
import {
  overrideColourSchemes,
  removeAlternateColourSchemes,
  restoreColourSchemes,
  saveColourSchemes,
} from "./colour-schemes";
import { ForceColours } from "./force-colours";

function getForceLevel(
  force: GForces,
  thresholds: ForceThresholds,
  visualisationMode: VisualisationMode
) {
  const includeLaterals =
    visualisationMode === VisualisationMode.All ||
    visualisationMode === VisualisationMode.Lateral;
  const includeVerticals =
    visualisationMode === VisualisationMode.All ||
    visualisationMode === VisualisationMode.Vertical;

  let forceLevel = 1; // 1 = low, 2 = moderate, 3 = excessive

  if (
    includeLaterals &&
    (force.lateralG > thresholds.moderate.lateral ||
      force.lateralG < -thresholds.moderate.lateral)
  ) {
    forceLevel = 2;
  }

  if (
    includeVerticals &&
    (force.verticalG > thresholds.moderate.positiveVertical ||
      force.verticalG < thresholds.moderate.negativeVertical)
  ) {
    forceLevel = 2;
  }

  if (
    includeLaterals &&
    (force.lateralG > thresholds.excessive.lateral ||
      force.lateralG < -thresholds.excessive.lateral)
  ) {
    forceLevel = 3;
  }

  if (
    includeVerticals &&
    (force.verticalG > thresholds.excessive.positiveVertical ||
      force.verticalG < thresholds.excessive.negativeVertical)
  ) {
    forceLevel = 3;
  }

  return forceLevel;
}

export default function visualiseForces(
  ride: Ride,
  colours: ForceColours,
  thresholds: ForceThresholds,
  visualisationMode: VisualisationMode
): IDisposable {
  saveColourSchemes(ride);
  overrideColourSchemes(ride, colours);
  removeAlternateColourSchemes(ride);

  let trackSegmentForces: { [key: string]: number } = {};

  // Get all lead cars on the ride
  const zeroCars = map
    .getAllEntities("car")
    .filter((car) => car.id && ride.vehicles.indexOf(car.id) !== -1);

  const interval = context.subscribe("interval.tick", () => {
    zeroCars.forEach((car) => {
      const force = car.gForces;
      let forceLevel = getForceLevel(force, thresholds, visualisationMode);

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
        .map((coords) => getTrackElementsAtPosition(coords, ride.id))
        .reduce((acc, val) => acc.concat(val), []);

      trackElements.forEach((element) => (element.colourScheme = forceLevel));
    });
  });

  return <IDisposable>{
    dispose() {
      interval.dispose();
      restoreColourSchemes(ride);
    },
  };
}
