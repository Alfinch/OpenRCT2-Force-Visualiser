import TrackElementPosition from "./track-element-position";

/**
 * Get all track elements for a given tracked ride
 * @param ride The ride to get the track elements for
 * @returns The track elements for the ride
 */
export default function getRideTrackElements(
  ride: Ride
): TrackElementPosition[] {
  const elements: TrackElementPosition[] = [];

  // Iterate over all tiles in the map
  for (var y = 0; y < map.size.y; y++) {
    for (var x = 0; x < map.size.x; x++) {
      var tile = map.getTile(x, y);

      // Iterate over all elements on the tile
      for (var i = 0; i < tile.numElements; i++) {
        var element = tile.getElement(i);

        // If the element is a track element belonging to the given ride, add it to the array
        if (element.type === "track" && element.ride === ride.id) {
          elements.push({
            position: { x: x * 32, y: y * 32, z: element.baseZ },
            element: element,
          });
        }
      }
    }
  }

  return elements;
}
