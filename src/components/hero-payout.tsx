import type { Reservation, Dataset } from "@/types/booking";
import { money, toCents, payoutIssues } from "@/lib/financials";
import { formatDate } from "@/lib/dates";
import { PayoutLifecycle } from "./payout-lifecycle";
import { Badge } from "./ui";
export function HeroPayout({
  booking,
  owner,
  today,
}: {
  booking: Reservation;
  owner: Dataset["owner"];
  today: string;
}) {
  const p = booking.payout,
    canceled = p.status === "canceled",
    paid = p.status === "paid";
  const issues = payoutIssues(booking, today);
  return (
    <section className="card" aria-label="Payout summary">
      <div className="flex flex-wrap items-center justify-between gap-6 p-7">
        <div>
          <p className="eyebrow">
            {issues.length
              ? "Recorded payout"
              : canceled
                ? "No payout"
                : paid
                  ? "Actual payout"
                  : p.status === "scheduled"
                    ? "Scheduled payout"
                    : "Expected payout"}
          </p>
          <div className="mt-2 flex items-center gap-5">
            <strong
              className="money text-4xl tracking-tight sm:text-5xl"
              data-testid="payout"
            >
              {money(toCents(p.amount))}
            </strong>
            <Badge>
              {issues.length
                ? "Details need review"
                : canceled
                  ? "Canceled"
                  : paid
                    ? "Paid"
                    : p.status === "scheduled"
                      ? "Scheduled"
                      : "Pending deposit"}
            </Badge>
          </div>
        </div>
        <div className="text-sm sm:text-right">
          <strong>
            {issues.length
              ? "Deposit information needs review"
              : canceled
                ? "Zero deposit"
                : paid
                  ? `Deposited ${formatDate(p.depositedDate!, true)}`
                  : `Estimated deposit ${formatDate(p.expectedDepositDate, true)}`}
          </strong>
          <p className="muted mt-1 text-xs">
            {canceled
              ? "No transfer for this booking"
              : `${owner.bankAccount.institution} ····${owner.bankAccount.lastFour}`}
          </p>
        </div>
      </div>
      {issues.length > 0 && (
        <div
          role="alert"
          className="mx-7 mb-5 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm"
        >
          {issues.join(" ")}
        </div>
      )}
      <PayoutLifecycle booking={booking} invalid={issues.length > 0} />
    </section>
  );
}
