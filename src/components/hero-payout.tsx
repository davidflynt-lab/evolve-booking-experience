import type { Reservation, Dataset } from "@/types/booking";
import { money, toCents, resolvePayoutDisplay } from "@/lib/financials";
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
  const display = resolvePayoutDisplay(booking, today);
  const { issues } = display;
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
            <Badge tone={display.tone}>
              {display.label === "Pending" ? "Pending deposit" : display.label}
            </Badge>
          </div>
        </div>
        <div className="text-sm sm:text-right">
          {issues.length === 0 && (
            <strong className="font-medium">
              <NumericText>
                {canceled
                  ? "Zero deposit"
                  : paid
                    ? `Deposited ${formatDate(p.depositedDate!, true)}`
                    : `Estimated deposit ${formatDate(p.expectedDepositDate, true)}`}
              </NumericText>
            </strong>
          )}
          <p className="muted mt-2 text-sm leading-relaxed">
            <NumericText>
              {canceled
                ? "No transfer for this booking"
                : `${owner.bankAccount.institution} ····${owner.bankAccount.lastFour}`}
            </NumericText>
          </p>
        </div>
      </div>
      {issues.length > 0 && (
        <div
          role="alert"
          data-testid="payout-audit-notice"
          className="mx-7 mb-5 rounded-2xl border border-[#EADCC5] bg-[#FBF6ED] p-4 text-sm leading-relaxed"
        >
          <NumericText>
            {futureDatedDeposit
              ? `Deposit recorded for ${formatDate(p.depositedDate!, true)}, which is after the current system date (${formatDate(today, true)}). Requires operational reconciliation.`
              : issues.join(" ")}
          </NumericText>
        </div>
      )}
      <PayoutLifecycle booking={booking} invalid={issues.length > 0} />
    </section>
  );
}
