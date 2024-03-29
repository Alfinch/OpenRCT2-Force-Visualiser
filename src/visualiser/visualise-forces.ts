import { formatGForce, getTrain, positionToKey } from "../helpers/misc";
import {
  saveColourSchemes,
  overrideColourSchemes,
  removeAlternateColourSchemes,
  restoreColourSchemes,
} from "../helpers/paint";
import {
  getIndexOfTrackElement,
  getTrackElementCoords,
  getTrackElementsAtPosition,
} from "../helpers/track";
import { VisualisationSettings } from "../models";
import { ForceLevel } from "./force-level";
import { getForceLevel } from "./get-force-level";

export function visualiseForces(settings: VisualisationSettings): IDisposable {
  saveColourSchemes(settings.selectedRide);
  overrideColourSchemes(settings.selectedRide, settings.colours);
  removeAlternateColourSchemes(settings.selectedRide);

  let trackSegmentForces: { [key: string]: ForceLevel } = {};

  // Get all selected cars on the ride
  const cars = settings.selectedRide.vehicles
    .map((zeroCarId) =>
      settings.selectedCar === -1
        ? getTrain(zeroCarId)
        : [getTrain(zeroCarId)[settings.selectedCar]]
    )
    .reduce((acc, val) => acc.concat(val), []);

  const interval = context.subscribe("interval.tick", () => {
    cars.forEach((car) => {
      let forceLevel = getForceLevel(
        car.gForces,
        settings.thresholds,
        settings.visualisationMode
      );

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
        .map((coords) =>
          getTrackElementsAtPosition(coords, settings.selectedRide.id)
        )
        .reduce((acc, val) => acc.concat(val), []);

      trackElements.forEach((element) => (element.colourScheme = forceLevel));
    });
  });

  return <IDisposable>{
    dispose() {
      interval.dispose();
      restoreColourSchemes(settings.selectedRide);
    },
  };
}
