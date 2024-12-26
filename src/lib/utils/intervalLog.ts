let count = 0

export function intervalLog(interval: number, ...args: any[]) {
  if (count % interval === 0) {
    console.log(...args)
  }
  count++
}