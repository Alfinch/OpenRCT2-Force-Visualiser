import { getTrackElementCoords } from "../track";

export function paintTrackSegment(
  position: CoordsXYZD,
  segment: TrackSegment,
  colourScheme: number
) {
  querySetColourScheme(position, segment, colourScheme, (canSet) => {
    if (canSet) {
      setColourScheme(position, segment, colourScheme);
    } else {
      // Sometimes segments are reversed - try selecting the other end of the segment
      const endPosition = getTrackElementCoords(position, {
        x: segment.endX,
        y: segment.endY,
        z: 0,
      });

      querySetColourScheme(
        { ...endPosition, direction: position.direction },
        segment,
        colourScheme,
        (canSet) => {
          if (canSet) {
            setColourScheme(
              { ...endPosition, direction: position.direction },
              segment,
              colourScheme
            );
          } else {
            throw new Error("Could not set colour scheme for track segment");
          }
        }
      );
    }
  });
}

function querySetColourScheme(
  position: CoordsXYZD,
  segment: TrackSegment,
  colourScheme: number,
  callback: (canSet: boolean) => void
) {
  context.queryAction(
    "ridesetcolourscheme",
    {
      ...position,
      trackType: segment.type,
      colourScheme,
    },
    (result) => callback(result.error == null || result.error === 0)
  );
}

function setColourScheme(
  position: CoordsXYZD,
  segment: TrackSegment,
  colourScheme: number
) {
  context.executeAction("ridesetcolourscheme", {
    ...position,
    trackType: segment.type,
    colourScheme,
  });
}
