/**
 * Get the global coordinates of a track element based on the track segment coordinates and the element vector
 * @param segmentPosition The global coordinates and direction of the track segment
 * @param elementVector The relative vector pointing to the track element
 * @returns The global coordinates of the track element
 */
export default function getTrackElementCoords(
  segmentCoords: CoordsXYZD,
  elementVector: CoordsXYZ
): CoordsXYZ {
  let rotatedVector: CoordsXY;

  switch (segmentCoords.direction) {
    case 0: // No rotation
      rotatedVector = { ...elementVector };
      break;
    case 1: // 90 degrees clockwise
      rotatedVector = { x: elementVector.y, y: -elementVector.x };
      break;
    case 2: // 180 degrees
      rotatedVector = { x: -elementVector.x, y: -elementVector.y };
      break;
    case 3: // 270 degrees clockwise
      rotatedVector = { x: -elementVector.y, y: elementVector.x };
      break;
  }

  return {
    x: segmentCoords.x + rotatedVector.x,
    y: segmentCoords.y + rotatedVector.y,
    z: segmentCoords.z + elementVector.z,
  };
}
