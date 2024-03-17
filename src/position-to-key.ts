/**
 * Convert a position to a string key
 * @param position The position to convert
 * @returns The string key
 */
export default function positionToKey(position: CoordsXYZ) {
    return `${position.x},${position.y},${position.z}`;
  }