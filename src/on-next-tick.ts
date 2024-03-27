/**
 * Perform an action on the next game tick, or on the next event loop if the game is paused.
 * */
export default function onNextTick(action: () => void) {
  const handler = () => {
    action();
    tickInterval.dispose();
    context.clearTimeout(timeout);
  };

  const tickInterval = context.subscribe("interval.tick", handler);
  const timeout = context.setTimeout(handler, 0);
}
