/**
 * Takes a numerical force value in 1/100ths of a G and returns a user-friendly string representation
 * @param value
 * @returns
 */
export function formatGForce(value: number): string {
  return (value / 100).toFixed(1) + "G";
}
