export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export function deepFreeze<T>(object: T): DeepReadonly<T> {
  if (isObject(object)) {
    const propNames = Object.getOwnPropertyNames(object);
    for (const name of propNames) {
      deepFreeze(object[name]);
    }
  }
  return Object.freeze(object);
}

function isObject(value: unknown): value is { [key: string]: unknown } {
  return (
    (value != null && typeof value === "object") || typeof value === "function"
  );
}
