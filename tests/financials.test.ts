import assert from "node:assert/strict";
import { test } from "node:test";
import { dataset } from "../src/lib/data";
import {
  calculateFinancials,
  payoutIssues,
  taxRate,
} from "../src/lib/financials";
const hero = dataset.bookings.find((b) => b.id === "15932931")!;
test("all active payouts reconcile exactly in integer cents", () => {
  for (const b of dataset.bookings) {
    const f = calculateFinancials(b);
    if (f && !f.canceled) assert.equal(f.discrepancy, false, b.id);
  }
});
test("hero totals, average, lead time and one-cent mismatch", () => {
  const f = calculateFinancials(hero)!;
  assert.equal(f.calculatedNet, 76232);
  assert.equal(f.averageNightly, 12202);
  assert.equal(f.leadTimeDays, 71);
  const changed = structuredClone(hero);
  if (changed.status !== "blocked") changed.payout.amount += 0.01;
  assert.equal(calculateFinancials(changed)?.discrepancy, true);
});
test("tax rates survive reordering and support unknown tax names", () => {
  const changed = structuredClone(hero);
  changed.lineItems.reverse();
  const taxes = calculateFinancials(changed)!.taxes;
  assert.equal(taxes.find((t) => /County/.test(t.description))?.rate, 0.02);
  assert.equal(taxes.find((t) => /Austin/.test(t.description))?.rate, 0.09);
  assert.equal(taxes.find((t) => /State/.test(t.description))?.rate, 0.06);
  assert.equal(taxRate("Other tax", 100, 10000).rate, 0.01);
});
test("canceled history is separated from current payout and blocks have no financial fields", () => {
  const canceled = calculateFinancials(
    dataset.bookings.find((b) => b.id === "Z87337818")!,
  )!;
  assert.equal(canceled.payout, 0);
  assert.equal(canceled.managementFee, 0);
  assert.equal(canceled.discrepancy, false);
  assert.ok(canceled.recordedCharges > 0);
  assert.equal(
    calculateFinancials(dataset.bookings.find((b) => b.status === "blocked")!),
    null,
  );
});
test("future paid date is flagged without altering source", () => {
  const b = dataset.bookings.find((b) => b.id === "15165409")!;
  if (b.status === "blocked") throw new Error();
  assert.ok(
    payoutIssues(b, dataset.meta.todayForExercise).some((i) =>
      i.includes("later"),
    ),
  );
});
