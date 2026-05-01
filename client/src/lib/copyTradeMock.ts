export function isCopyTradeMockEnabled(): boolean {
  return import.meta.env.VITE_COPYTRADE_USE_MOCK === "true";
}
