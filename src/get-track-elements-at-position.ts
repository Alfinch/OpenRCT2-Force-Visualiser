/**
 * Get the track element at the specified global coordinates
 * @param position The global coordinates of the track element
 * @returns The track element at the specified position
 */
export default function getTrackElementsAtPosition(
  position: CoordsXYZ
): TrackElement[] {
  return map
    .getTile(position.x / 32, position.y / 32)
    .elements.filter(
      (e): e is TrackElement => e.baseZ === position.z && e.type === "track"
    );
}
