export function fmtCopyTradeScore(value: number): string {
  return value.toFixed(1);
}

export function fmtCopyTradeMomentum(value: number): string {
  const withSign = value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  return withSign;
}

export function fmtCopyTradeUpdated(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleString("en-GB", { month: "short" }).toUpperCase();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${hh}:${mm}`;
}
