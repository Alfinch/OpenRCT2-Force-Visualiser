import { ForceThresholds, VisualisationMode } from "../models";
import { ForceLevel } from "./force-level";

export function getForceLevel(
  force: GForces,
  thresholds: ForceThresholds,
  visualisationMode: VisualisationMode
): ForceLevel {
  const includeLaterals =
    visualisationMode === VisualisationMode.All ||
    visualisationMode === VisualisationMode.Lateral;
  const includeVerticals =
    visualisationMode === VisualisationMode.All ||
    visualisationMode === VisualisationMode.Vertical;

  let forceLevel: ForceLevel = 1;

  if (
    includeLaterals &&
    (force.lateralG > thresholds.moderate.lateral ||
      force.lateralG < -thresholds.moderate.lateral)
  ) {
    forceLevel = 2;
  }

  if (
    includeVerticals &&
    (force.verticalG > thresholds.moderate.positiveVertical ||
      force.verticalG < thresholds.moderate.negativeVertical)
  ) {
    forceLevel = 2;
  }

  if (
    includeLaterals &&
    (force.lateralG > thresholds.excessive.lateral ||
      force.lateralG < -thresholds.excessive.lateral)
  ) {
    forceLevel = 3;
  }

  if (
    includeVerticals &&
    (force.verticalG > thresholds.excessive.positiveVertical ||
      force.verticalG < thresholds.excessive.negativeVertical)
  ) {
    forceLevel = 3;
  }

  return forceLevel;
}
