import type { Financials } from "@/lib/financials";
import { money } from "@/lib/financials";
import { Card, MoneyRow, NumericText } from "./ui";
export function ReconciliationWaterfall({
  financials: f,
}: {
  financials: Financials;
}) {
  return (
    <Card
      title={
        f.canceled
          ? "Original booking charges"
          : "From booking charges to your payout"
      }
      subtitle={
        f.canceled
          ? "Historical amounts, not current charges due."
          : "Every amount visible. No hidden calculations."
      }
    >
      {f.canceled && (
        <p className="mb-4 rounded-2xl bg-soft p-3 text-sm font-medium">
          Stay canceled before check-in · Zero deposit
        </p>
      )}
      <MoneyRow
        label={
          f.canceled ? "Original recorded charges" : "Recorded guest charges"
        }
        amount={money(f.recordedCharges)}
      />
      <div className="rounded-2xl bg-soft px-4 pb-4">
        <MoneyRow
          label={
            f.canceled
              ? "Original occupancy taxes"
              : "Pass-through occupancy taxes"
          }
          amount={`${f.canceled ? "" : "−"}${money(f.totalTaxes)}`}
        />
        <p className="muted mb-3 text-xs">
          {f.canceled
            ? "Historical charges; remittance and refund details unavailable."
            : "Non-owner funds, collected for tax authorities and excluded from payout."}
        </p>
        {f.taxes.map((t) => (
          <div
            key={t.description}
            className="muted flex justify-between gap-4 py-1 text-xs"
          >
            <span>
              {t.description}
              {t.rate !== null && (
                <span className="numeric">{` · ${t.derived ? "≈ " : ""}${Number((t.rate * 100).toFixed(2))}%`}</span>
              )}
            </span>
            <span className="money">{money(t.cents)}</span>
          </div>
        ))}
      </div>
      <div className="border-b border-line">
        <MoneyRow
          label={
            f.canceled ? "Original listing charges" : "Gross listing revenue"
          }
          amount={money(f.grossRevenue)}
        />
        <div className="mb-4 border-l-2 border-line pl-3">
          <div className="muted flex justify-between py-1 text-xs">
            <span>Base accommodation</span>
            <span className="money">{money(f.baseRental)}</span>
          </div>
          <div className="muted flex justify-between py-1 text-xs">
            <span>
              <NumericText>
                {f.canceled
                  ? "Original cleaning charge"
                  : "Cleaning fee · 100% pass-through to owner"}
              </NumericText>
            </span>
            <span className="money">+{money(f.cleaningFee)}</span>
          </div>
        </div>
      </div>
      <MoneyRow
        label={
          f.canceled
            ? "Current Evolve Plus management fee"
            : "Evolve Plus management fee"
        }
        amount={`${f.canceled ? "" : "−"}${money(f.managementFee)}`}
      />
      <p className="muted text-xs">
        <NumericText>
          {f.canceled
            ? "Management fee is zero for this canceled record."
            : `15% × ${money(f.baseRental)} accommodation = ${money(f.managementFee)}. No commission on cleaning in this exercise.`}
        </NumericText>
      </p>
      {f.discrepancy && (
        <p
          role="alert"
          className="mt-4 border border-amber-300 bg-amber-50 p-3 text-sm"
        >
          Payout discrepancy: calculated {money(f.expectedNet)}, recorded{" "}
          {money(f.payout)}. Review required before relying on this record.
        </p>
      )}
      <div className="mt-5 rounded-2xl bg-soft px-4">
        <MoneyRow prominent label="Net owner payout" amount={money(f.payout)} />
      </div>
      <p className="mt-4 border-l-2 border-line pl-3 text-xs">
        <NumericText>
          {f.canceled
            ? "Original charges do not establish a completed guest payment or refund."
            : `The ${money(f.cleaningFee)} cleaning fee passes through to the owner in full.`}
        </NumericText>
      </p>
      <p className="muted mt-4 text-[11px]">
        Based on supplied booking charges. Separate channel fees and
        booking-level tax remittance confirmations are not provided.
      </p>
    </Card>
  );
}
