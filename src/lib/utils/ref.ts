declare const Proxy;

export function ref<T>(
  init: T,
  min?: number,
  max?: number,
  step?: number
): {
  current: T;
  listeners: ((value: T) => void)[];
  min?: number;
  max?: number;
  step?: number;
  triggerListeners: () => void;
} {
  return new Proxy(
    {
      current: init,
      listeners: <((value: T) => void)[]>[],
      min,
      max,
      step,
      triggerListeners: () => {},
    },
    {
      get(target, key) {
        if (key === 'triggerListeners') {
          return () => {
            target.listeners.forEach(listener => listener(target.current));
          };
        }
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
