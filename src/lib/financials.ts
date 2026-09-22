import type { Booking, Reservation } from "@/types/booking";
import { dayNumber } from "./dates";
export function toCents(amount: number): number {
  const cents = Math.round(amount * 100);
  if (
    !Number.isFinite(amount) ||
    !Number.isSafeInteger(cents) ||
    Math.abs(amount * 100 - cents) > 0.000001
  )
    throw new Error(
      "Expected a safe monetary amount with at most two decimal places",
    );
  return cents;
}
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
/** Tax identity is semantic, never dependent on line ordering. Unknown taxes use a derived rate. */
export function taxRate(
  description: string,
  amountCents: number,
  taxableBaseCents: number,
) {
  if (/county/i.test(description)) return { rate: 0.02, derived: false };
  if (/austin/i.test(description)) return { rate: 0.09, derived: false };
  if (/state/i.test(description)) return { rate: 0.06, derived: false };
  return {
    rate: taxableBaseCents ? amountCents / taxableBaseCents : null,
    derived: true,
  };
}
export function calculateFinancials(booking: Booking) {
  if (booking.status === "blocked") return null;
  const sum = (type: "base" | "fee" | "tax") =>
    booking.lineItems
      .filter((item) => item.type === type)
      .reduce((total, item) => total + toCents(item.amount), 0);
  const baseRental = sum("base");
  const cleaningFee = booking.lineItems
    .filter((item) => item.type === "fee" && /cleaning/i.test(item.description))
    .reduce((total, item) => total + toCents(item.amount), 0);
  const otherFees = sum("fee") - cleaningFee;
  const managementFee = toCents(booking.payout.managementFee);
  const payout = toCents(booking.payout.amount);
  // Integer cents give an exact assertion, without floating-point tolerances.
  const calculatedNet = baseRental + cleaningFee - managementFee;
  const canceled =
    booking.status === "canceled" || booking.payout.status === "canceled";
  // Original canceled charges are history, not a current payout obligation.
  const expectedNet = canceled ? 0 : calculatedNet;
  const discrepancy =
    payout !== expectedNet ||
    (canceled && managementFee !== 0) ||
    otherFees !== 0;
  const taxes = booking.lineItems
    .filter((item) => item.type === "tax")
    .map((item) => ({
      description: item.description,
      cents: toCents(item.amount),
      ...taxRate(
        item.description,
        toCents(item.amount),
        baseRental + cleaningFee,
      ),
    }));
  return {
    baseRental,
    cleaningFee,
    otherFees,
    managementFee,
    payout,
    calculatedNet,
    expectedNet,
    discrepancy,
    delta: payout - expectedNet,
    taxes,
    totalTaxes: sum("tax"),
    grossRevenue: baseRental + sum("fee"),
    recordedCharges: baseRental + sum("fee") + sum("tax"),
    averageNightly:
      booking.stay.nights > 0
        ? Math.round(baseRental / booking.stay.nights)
        : null,
    leadTimeDays:
      dayNumber(booking.stay.checkIn) - dayNumber(booking.dateBooked),
    canceled,
  };
}
export type Financials = NonNullable<ReturnType<typeof calculateFinancials>>;
export function payoutIssues(booking: Reservation, today: string): string[] {
  const issues: string[] = [];
  if (calculateFinancials(booking)?.discrepancy)
    issues.push(
      "Recorded payout does not reconcile with the supported booking calculation.",
    );
  if (booking.payout.status === "paid" && !booking.payout.depositedDate)
    issues.push("The paid record has no deposit date.");
  if (booking.payout.depositedDate && booking.payout.depositedDate > today)
    issues.push("The recorded deposit is later than the exercise date.");
  return issues;
}

/** Audit-aware presentation shared by navigation and the payout card. */
export function resolvePayoutDisplay(booking: Booking, today: string) {
  const issues =
    booking.status === "blocked" ? [] : payoutIssues(booking, today);
  if (issues.length)
    return { label: "Under Review", tone: "neutral" as const, issues };
  if (booking.status === "blocked")
    return { label: "Nonfinancial", tone: "neutral" as const, issues };
  const labels = {
    paid: "Paid",
    pending: "Pending",
    scheduled: "Scheduled",
    canceled: "Canceled",
  };
  return {
    label: labels[booking.payout.status],
    tone:
      booking.payout.status === "scheduled"
        ? ("neutral" as const)
        : booking.payout.status,
    issues,
  };
}
