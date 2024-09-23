declare const Proxy;

export function ref<T>(
  init: T,
  min?: number,
  max?: number,
  step?: number
): { current: T; listeners: ((value: T) => void)[]; min?: number; max?: number; step?: number } {
  return new Proxy(
    { current: init, listeners: <((value: T) => void)[]>[], min, max, step },
    {
      get(target, key) {
        return target[key];
      },
      set(target, prop, value) {
        if (prop === 'current') {
          target.current = value;
          target.listeners.forEach(listener => listener(value));
        }
        return true;
      },
    }
  );
}

export type Ref<T> = ReturnType<typeof ref<T>>;
