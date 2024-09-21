export function ref<T>(init: T) {
  return {
    current: init,
  };
}
