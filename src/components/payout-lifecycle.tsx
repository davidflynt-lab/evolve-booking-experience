import type { Reservation } from "@/types/booking";
import { formatDate } from "@/lib/dates";
import { CheckIcon } from "./ui";
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
        : "Initiated ~2 business days post check-in",
      note: canceled ? "Canceled" : "Typical timing · initiation not confirmed",
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
    <div className="border-t border-line bg-soft/50 px-7 py-6">
      <ol
        aria-label="Payout lifecycle"
        className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4"
      >
        {steps.map((step, i) => (
          <li key={step.name} className="relative min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-sm leading-relaxed ${step.done ? "border-paid bg-paid text-white" : "border-dashed border-line bg-white"}`}
              >
                {step.done ? (
                  <CheckIcon />
                ) : canceled ? (
                  "–"
                ) : (
                  <span className="numeric">{i + 1}</span>
                )}
              </span>
              {i < 3 && <span className="h-px flex-1 bg-line" />}
            </div>
            <strong className="block text-sm leading-relaxed">
              {step.name}
            </strong>
            <span className="numeric muted mt-1.5 block text-sm leading-relaxed">
              {step.date}
            </span>
            <span className="muted mt-1 block text-sm leading-relaxed">
              {step.note}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
