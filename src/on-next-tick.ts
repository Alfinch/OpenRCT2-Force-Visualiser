export default function onNextTick(action: () => void) {
  const interval = context.subscribe("interval.tick", () => {
    action();
    interval.dispose();
  });
}
