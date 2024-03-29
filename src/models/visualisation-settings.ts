import { ForceColours, ForceThresholds, VisualisationMode } from ".";

export interface VisualisationSettings {
  selectedRide: Ride;
  selectedCar: number; // -1 for all cars
  visualisationMode: VisualisationMode;
  colours: ForceColours;
  thresholds: ForceThresholds;
}
