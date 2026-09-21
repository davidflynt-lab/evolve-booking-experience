import type { Reservation } from "@/types/booking";
import type { Financials } from "@/lib/financials";
import { money } from "@/lib/financials";
import { formatDate } from "@/lib/dates";
import { Card, Badge, NumericText } from "./ui";
export function RateIntelligence({
  booking: b,
  financials: f,
}: {
  booking: Reservation;
  financials: Financials;
}) {
  return (
    <aside className="space-y-5">
      <Card
        soft
        title={f.canceled ? "Original booked rates" : "Rate intelligence"}
      >
        <p className="eyebrow">Average accommodation rate</p>
        <p className="money mt-2 text-3xl">
          {f.averageNightly === null
            ? "Unavailable"
            : `≈ ${money(f.averageNightly)}`}{" "}
          <span className="font-sans text-sm leading-relaxed text-muted">
            / night
          </span>
        </p>
        <p className="muted mt-3 text-sm leading-relaxed">
          Calculated across <span className="numeric">{b.stay.nights}</span>{" "}
          nights from aggregate accommodation revenue. Rounded average is
          display-only.
        </p>
        <div className="mt-5 border-t border-line pt-5">
          <p className="eyebrow">Advance booking lead time</p>
          <p className="mt-2 font-medium">
            Booked <span className="numeric">{f.leadTimeDays}</span> days in
            advance
          </p>
          <p className="numeric muted mt-2 text-sm leading-relaxed">
            {formatDate(b.dateBooked, true)} →{" "}
            {formatDate(b.stay.checkIn, true)}
          </p>
          <p className="muted mt-2 text-sm leading-relaxed">
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
            <p className="muted mt-2 text-sm leading-relaxed">
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
            <Badge tone="plus">
              <NumericText>Plus · 15% of accommodation</NumericText>
            </Badge>
          </div>
        </div>
      </Card>
    </aside>
  );
}
