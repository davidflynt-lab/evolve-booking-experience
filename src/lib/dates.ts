export function dayNumber(iso: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new Error("Invalid ISO date");
  const ms = Date.parse(`${iso}T00:00:00Z`);
  if (!Number.isFinite(ms) || new Date(ms).toISOString().slice(0, 10) !== iso)
    throw new Error("Invalid calendar date");
  return ms / 86400000;
}
export function formatDate(iso: string, year = false) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(year ? ({ year: "numeric" } as const) : {}),
    timeZone: "UTC",
  }).format(new Date(iso + "T00:00:00Z"));
}
export function addBusinessDays(iso: string, count: number) {
  dayNumber(iso);
  const date = new Date(iso + "T00:00:00Z");
  while (count > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (![0, 6].includes(date.getUTCDay())) count--;
  }
  return date.toISOString().slice(0, 10);
}
export function stayRange(start: string, end: string) {
  return `${formatDate(start)} to ${start.slice(0, 7) === end.slice(0, 7) ? Number(end.slice(-2)) : formatDate(end)}`;
}
