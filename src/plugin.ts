import openMainWindow from "./open-main-window";

registerPlugin({
  name: "Force visualiser",
  version: "1.0",
  authors: ["Alfie Woodland"],
  type: "local",
  licence: "MIT",
  targetApiVersion: 77,
  minApiVersion: 77,
  main: main,
});

function main() {
  openMainWindow();
  ui.registerMenuItem("Force visualiser", openMainWindow);
}
