import { ForceColours, ForceThresholds, VisualisationMode } from ".";

export interface VisualisationSettings {
  selectedRide: Ride;
  visualisationMode: VisualisationMode;
  colours: ForceColours;
  thresholds: ForceThresholds;
}
