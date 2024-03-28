import { ForceColours, ForceThresholds, VisualisationMode } from "../models";

export interface MainWindow {
  selectedRide: Ride | null;
  visualisationMode: VisualisationMode;
  colours: ForceColours;
  thresholds: ForceThresholds;
}
