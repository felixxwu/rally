export function ref<T>(init: T) {
  return {
    current: init,
  };
}

export type Ref<T> = ReturnType<typeof ref<T>>;
