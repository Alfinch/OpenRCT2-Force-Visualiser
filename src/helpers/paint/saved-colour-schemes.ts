/**
 * Saved colour schemes for a ride so they can be restored later
 */
export const savedColourSchemes: {
  [rideId: string]: {
    colorSchemes: TrackColour[];
    elementColourSchemes: { [elementId: string]: number | null };
  } | null;
} = {};
