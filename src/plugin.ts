import openWindow from "./open-window";

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
  openWindow();
  ui.registerMenuItem("Force visualiser", openWindow);
}
