declare const Proxy;

const allRefs: Ref<any>[] = [];

export function ref<T>(
  init: T,
  min?: number,
  max?: number,
  step?: number
): {
  current: T;
  initial: T;
  listeners: ((value: T, changed: boolean) => void)[];
  min?: number;
  max?: number;
  step?: number;
  triggerListeners: () => void;
} {
  const ref = new Proxy(
    {
      current: init,
      prev: init,
      initial: JSON.parse(JSON.stringify(init) ?? null),
      listeners: <((value: T, changed: boolean) => void)[]>[],
      min,
      max,
      step,
      triggerListeners: () => {},
    },
    {
      get(target, key) {
        if (key === 'triggerListeners') {
          return () => {
            target.listeners.forEach(listener =>
              listener(target.current, target.current !== target.prev)
            );
          };
        }
        return target[key];
      },
      set(target, prop, value) {
        if (prop === 'current') {
          target.current = value;
          target.listeners.forEach(listener => listener(value, target.current !== target.prev));
          target.prev = value;
        }
        return true;
      },
    }
  );

  allRefs.push(ref);

  return ref;
}

export type Ref<T> = ReturnType<typeof ref<T>>;

export function resetAllRefs() {
  allRefs.forEach(ref => {
    ref.listeners = [];
    ref.current = ref.initial;
  });
}
