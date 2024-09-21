declare const Proxy;

export function ref<T>(init: T): { current: T; listeners: ((value: T) => void)[] } {
  return new Proxy(
    { current: init, listeners: <((value: T) => void)[]>[] },
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
