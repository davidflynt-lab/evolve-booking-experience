import raw from "@/data/payouts.json";
import type { Booking, Dataset } from "@/types/booking";
// Local, immutable exercise fixture. Types describe the supplied data, not an external API.
export const dataset = raw as Dataset;
export const DEFAULT_BOOKING_ID = "15932931";
/** Every record lookup, whether a preset or a deep link, uses this resolver. */
export function getBookingById(id: string): Booking | undefined {
  return dataset.bookings.find((booking) => booking.id === id);
}
export const scenarioIds = [
  "15932931",
  "15659176",
  "15003717",
  "Z87337818",
  "15165409",
  "a0APl00000LT0TPBMAB",
];
export const scenarios = scenarioIds.map((id) => {
  const booking = getBookingById(id);
  if (!booking) throw new Error(`Missing scenario ${id}`);
  return booking;
});
