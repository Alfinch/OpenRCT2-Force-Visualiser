/**
 * Perform an action on the next game tick, or on the next event loop if the game is paused.
 * @param action The action to perform.
 * */
export function onNextTick(action: () => void): void {
  const handler = () => {
    action();
    tickInterval.dispose();
    context.clearTimeout(timeout);
  };

  const tickInterval = context.subscribe("interval.tick", handler);
  const timeout = context.setTimeout(handler, 0);
}
