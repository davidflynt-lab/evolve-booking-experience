import type { Reservation, Dataset } from "@/types/booking";
import { money, toCents, payoutIssues } from "@/lib/financials";
import { formatDate } from "@/lib/dates";
import { PayoutLifecycle } from "./payout-lifecycle";
import { Badge, NumericText } from "./ui";
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
  const futureDatedDeposit =
    paid && p.depositedDate !== null && p.depositedDate > today;
  return (
    <section className="card" aria-label="Payout summary">
      <div className="flex flex-wrap items-center justify-between gap-8 p-8 sm:p-9">
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
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <strong
              className="money text-4xl font-medium tracking-[-0.05em] sm:text-6xl"
              data-testid="payout"
            >
              {money(toCents(p.amount))}
            </strong>
            <Badge
              tone={
                issues.length
                  ? "neutral"
                  : p.status === "scheduled"
                    ? "neutral"
                    : p.status
              }
            >
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
          <strong className="font-medium">
            <NumericText>
              {issues.length
                ? "Deposit information needs review"
                : canceled
                  ? "Zero deposit"
                  : paid
                    ? `Deposited ${formatDate(p.depositedDate!, true)}`
                    : `Estimated deposit ${formatDate(p.expectedDepositDate, true)}`}
            </NumericText>
          </strong>
          <p className="muted mt-2 text-xs">
            <NumericText>
              {canceled
                ? "No transfer for this booking"
                : `${owner.bankAccount.institution} ····${owner.bankAccount.lastFour}`}
            </NumericText>
          </p>
        </div>
      </div>
      {futureDatedDeposit && (
        <div
          className="mx-7 mb-5"
          role="status"
          data-testid="future-deposit-notice"
        >
          <Badge tone="pending">
            <NumericText>{`Notice: Deposit date is future-dated relative to ${formatDate(today)} evaluation date`}</NumericText>
          </Badge>
        </div>
      )}
      {issues.length > 0 && (
        <div
          role="alert"
          className="mx-7 mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm"
        >
          {issues.join(" ")}
        </div>
      )}
      <PayoutLifecycle booking={booking} invalid={issues.length > 0} />
    </section>
  );
}
