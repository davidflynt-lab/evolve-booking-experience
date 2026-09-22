import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BookingNavigation } from "../src/components/booking-navigation";
import { resolvePayoutDisplay } from "../src/lib/financials";
import { HeroPayout } from "../src/components/hero-payout";
import { dataset, getBookingById } from "../src/lib/data";

test("future paid deposit has one status chip and one explanatory alert", () => {
  const booking = getBookingById("15165409")!;
  if (booking.status === "blocked") throw new Error("Expected reservation");
  const html = renderToStaticMarkup(
    createElement(HeroPayout, {
      booking,
      owner: dataset.owner,
      today: dataset.meta.todayForExercise,
    }),
  );
  const nav = renderToStaticMarkup(
    createElement(BookingNavigation, {
      bookings: [booking],
      selected: booking,
      onSelect: () => {},
      property: dataset.listing.name,
      today: dataset.meta.todayForExercise,
    }),
  );
  assert.ok(nav.includes("(Under Review)"));
  assert.ok(!nav.includes("(Paid)"));
  assert.equal(
    resolvePayoutDisplay(booking, dataset.meta.todayForExercise).tone,
    "neutral",
  );
  assert.equal(
    resolvePayoutDisplay(
      getBookingById("15659176")!,
      dataset.meta.todayForExercise,
    ).label,
    "Paid",
  );
  const text = html.replace(/<[^>]+>/g, "");
  assert.equal((html.match(/role="alert"/g) ?? []).length, 1);
  assert.equal((html.match(/class="badge /g) ?? []).length, 1);
  assert.ok(text.includes("Under Review"));
  assert.ok(
    text.includes(
      "Deposit recorded for May 18, 2026, which is after the current system date (May 17, 2026). Requires operational reconciliation.",
    ),
  );
  assert.ok(!text.includes("Deposit information needs review"));
  assert.ok(!text.includes("Details need review"));
  assert.ok(!text.includes("Notice: Deposit date"));
  assert.ok(!text.includes("Deposited · Recorded"));
});
