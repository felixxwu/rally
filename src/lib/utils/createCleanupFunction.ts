export function createCleanupFunction() {
  let cleanupFunctions: (() => void)[] = [];

  return {
    addCleanupFunction: (fn: () => void) => {
      cleanupFunctions.push(fn);
    },
    cleanup: () => {
      cleanupFunctions.forEach(fn => fn());
      cleanupFunctions = [];
    },
  };
}
