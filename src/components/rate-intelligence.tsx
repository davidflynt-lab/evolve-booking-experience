import type { Reservation } from "@/types/booking";
import type { Financials } from "@/lib/financials";
import { money } from "@/lib/financials";
import { formatDate } from "@/lib/dates";
import { Card, Badge } from "./ui";
export function RateIntelligence({
  booking: b,
  financials: f,
}: {
  booking: Reservation;
  financials: Financials;
}) {
  return (
    <aside className="space-y-5">
      <Card title={f.canceled ? "Original booked rates" : "Rate intelligence"}>
        <p className="eyebrow">Average accommodation rate</p>
        <p className="money mt-2 text-3xl">
          {f.averageNightly === null
            ? "Unavailable"
            : `≈ ${money(f.averageNightly)}`}{" "}
          <span className="font-sans text-xs text-muted">/ night</span>
        </p>
        <p className="muted mt-3 text-xs">
          Calculated across {b.stay.nights} nights from aggregate accommodation
          revenue. Rounded average is display-only.
        </p>
        <div className="mt-5 border-t border-line pt-5">
          <p className="eyebrow">Advance booking lead time</p>
          <p className="mt-2 font-medium">
            Booked {f.leadTimeDays} days in advance
          </p>
          <p className="muted mt-2 text-xs">
            {formatDate(b.dateBooked, true)} →{" "}
            {formatDate(b.stay.checkIn, true)}
          </p>
          <p className="muted mt-2 text-xs">
            Lead time does not explain why this rate was set.
          </p>
        </div>
      </Card>
      <Card title="Booking & contract context">
        <div className="space-y-5">
          <div>
            <p className="eyebrow mb-2">Channel</p>
            <Badge>{b.bookingSite}</Badge>
          </div>
          <div>
            <p className="eyebrow mb-2">Rate data</p>
            <Badge>Aggregate accommodation supplied</Badge>
            <p className="muted mt-2 text-xs">
              Daily rates, discount codes, and booking-specific pricing
              rationale are not provided. Standard pricing cannot be confirmed.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-2">Guest history</p>
            <Badge>{b.returningGuest ? "Returning guest" : "First stay"}</Badge>
          </div>
          <div>
            <p className="eyebrow mb-2">Management plan</p>
            <Badge>Plus · 15% of accommodation</Badge>
          </div>
        </div>
      </Card>
    </aside>
  );
}
