import raw from "@/data/payouts.json";
import type { Dataset } from "@/types/booking";
// Local, immutable exercise fixture. Types describe the supplied data, not an external API.
export const dataset = raw as Dataset;
export const scenarioIds = [
  "15932931",
  "15659176",
  "15003717",
  "Z87337818",
  "a0APl00000LT0TPBMAB",
];
export const scenarios = scenarioIds.map((id) => {
  const booking = dataset.bookings.find((b) => b.id === id);
  if (!booking) throw new Error(`Missing scenario ${id}`);
  return booking;
});
