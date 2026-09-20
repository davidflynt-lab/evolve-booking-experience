import type { Reservation } from "@/types/booking";
import { addBusinessDays, formatDate } from "@/lib/dates";
export function PayoutLifecycle({
  booking: b,
  invalid = false,
}: {
  booking: Reservation;
  invalid?: boolean;
}) {
  const canceled = b.payout.status === "canceled";
  const checked = ["checked_in", "checked_out"].includes(b.status);
  const paid =
    b.payout.status === "paid" && !invalid && !!b.payout.depositedDate;
  const steps = [
    {
      name: "Booked",
      date: formatDate(b.dateBooked, true),
      note: "Recorded",
      done: true,
    },
    {
      name: canceled
        ? "Check-in canceled"
        : checked
          ? "Checked in"
          : "Check-in",
      date: formatDate(b.stay.checkIn, true),
      note: canceled
        ? "Stay did not take place"
        : checked
          ? "Recorded"
          : "Upcoming",
      done: checked && !canceled,
    },
    {
      name: "Payout processing",
      date: canceled
        ? "Not initiated"
        : formatDate(addBusinessDays(b.stay.checkIn, 2), true),
      note: canceled ? "Canceled" : "Illustrative estimate",
      done: false,
    },
    {
      name: "Bank settlement",
      date: canceled
        ? "No deposit"
        : invalid
          ? "Details need review"
          : formatDate(
              paid ? b.payout.depositedDate! : b.payout.expectedDepositDate,
              true,
            ),
      note: canceled
        ? "Zero payout"
        : paid
          ? "Deposited · Recorded"
          : "Estimated arrival",
      done: paid,
    },
  ];
  return (
    <div className="border-t border-line bg-canvas/40 px-6 py-5">
      <ol aria-label="Payout lifecycle" className="grid grid-cols-4 gap-2">
        {steps.map((step, i) => (
          <li key={step.name} className="relative min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs ${step.done ? "border-ink bg-ink text-white" : "border-dashed border-line bg-white"}`}
              >
                {step.done ? "✓" : canceled ? "–" : i + 1}
              </span>
              {i < 3 && <span className="h-px flex-1 bg-line" />}
            </div>
            <strong className="block text-xs">{step.name}</strong>
            <span className="muted mt-1 block text-xs">{step.date}</span>
            <span className="muted mt-1 block text-[10px]">{step.note}</span>
          </li>
        ))}
      </ol>
      <p className="muted mt-5 text-[11px]">
        {canceled
          ? "Canceled before check-in. The cancellation date and refund details are not supplied."
          : "Processing typically begins about 2 business days after check-in; bank settlement typically occurs 5–9 business days after check-in. Processing dates are illustrative weekday estimates, not recorded events, and do not account for holidays. Supplied settlement dates may differ from typical timing."}
      </p>
    </div>
  );
}
