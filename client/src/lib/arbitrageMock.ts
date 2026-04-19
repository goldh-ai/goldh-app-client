export function isArbitrageMockEnabled(): boolean {
  return import.meta.env.VITE_ARBITRAGE_USE_MOCK === "true";
}
