export async function sleep(ms: number = 0) {
  await new Promise(resolve => setTimeout(resolve, ms));
}
