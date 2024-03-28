/**
 * Get the index of the track element on a given tile at the specified z coordinate
 * @param tile
 * @param z The z coordinate of the track element
 * @returns The index of the track element on the tile at the specified z coordinate
 */
export function getIndexOfTrackElement(tile: Tile, z: number): number {
  const matches = tile.elements
    .map((element, index) => ({ element, index }))
    .filter((obj) => obj.element.type === "track" && obj.element.baseZ === z);
  if (matches.length > 0) {
    return matches[matches.length - 1].index;
  }
  return -1;
}
