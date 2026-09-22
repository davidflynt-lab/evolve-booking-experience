import assert from "node:assert/strict";
import { test } from "node:test";
import {
  dataset,
  scenarios,
  getBookingById,
  DEFAULT_BOOKING_ID,
} from "../src/lib/data";
test("unified resolver reaches every one of the 40 records", () => {
  assert.equal(dataset.bookings.length, 40);
  for (const booking of dataset.bookings)
    assert.strictEqual(getBookingById(booking.id), booking);
});
test("six presets use the same resolver and Adaeze remains the default", () => {
  assert.equal(scenarios.length, 6);
  assert.ok(scenarios.some((booking) => booking.id === "15165409"));
  for (const booking of scenarios)
    assert.strictEqual(getBookingById(booking.id), booking);
  assert.equal(
    getBookingById(DEFAULT_BOOKING_ID)?.guest?.name,
    "Adaeze Okafor",
  );
});
test("nonpreset deep links resolve and unknown IDs do not fall back silently", () => {
  assert.equal(getBookingById("15024813")?.guest?.name, "Henri Beauchene");
  assert.equal(getBookingById("15165409")?.payout?.depositedDate, "2026-05-18");
  assert.equal(getBookingById("invalid999"), undefined);
  assert.equal(getBookingById(""), undefined);
});
