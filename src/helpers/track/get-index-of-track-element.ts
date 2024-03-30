/**
 * Get the index of the track element on a given tile at the specified z coordinate
 * @param tile
 * @param z The z coordinate of the track element
 * @returns The index of the track element on the tile at the specified z coordinate
 */
export function getIndexOfTrackElement(tile: Tile, z: number): number {
  const matches: { element: TrackElement; index: number }[] = tile.elements
    .map((element, index) => ({ element: element as TrackElement, index }))
    .filter((obj) => obj.element.type === "track" && obj.element.baseZ === z);

  // If there are multiple track elements at the same z coordinate, sort them by sequence with the lowest first
  if (matches.length > 1) {
    matches.sort(
      (a, b) => (a.element.sequence ?? 0) - (b.element.sequence ?? 0)
    );
  }

  // If there is only one track element at the specified z coordinate, return its index
  if (matches.length > 0) {
    return matches[0].index;
  }

  // If there are no track elements at the specified z coordinate, return -1
  return -1;
}
