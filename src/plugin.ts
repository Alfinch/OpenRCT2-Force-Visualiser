import { WindowTemplate } from "openrct2-flexui";
import { openMainWindow } from "./main-window/open-main-window";
import { onNextTick } from "./helpers/misc";
import { openVisualiseWindow } from "./visualise-window";
import { VisualisationSettings } from "./models";

registerPlugin({
  name: "Force visualiser",
  version: "1.1.0",
  authors: ["Alfie Woodland"],
  type: "local",
  licence: "MIT",
  targetApiVersion: 77,
  minApiVersion: 77,
  main: main,
});

function main() {
  ui.registerMenuItem("Force visualiser", () => {
    openMainWindow(null, onMainWindowClose, onVisualise);
  });
}

function onMainWindowClose(
  _mainWindow: WindowTemplate,
  _setttings: VisualisationSettings
) {
  // Do nothing
}

function onVisualise(
  mainWindow: WindowTemplate,
  settings: VisualisationSettings
) {
  mainWindow.close();
  onNextTick(() => openVisualiseWindow(settings, onVisualiseWindowClose));
}

function onVisualiseWindowClose(settings: VisualisationSettings) {
  onNextTick(() => openMainWindow(settings, onMainWindowClose, onVisualise));
}
