import type { OwnerBlock as Block } from "@/types/booking";
import { formatDate } from "@/lib/dates";
import { Card, Badge } from "./ui";
export function OwnerBlock({ booking }: { booking: Block }) {
  return (
    <Card
      title="Owner reserved calendar"
      subtitle="These dates are unavailable for guest bookings."
    >
      <div className="flex items-center gap-6">
        <div className="overflow-hidden rounded-2xl border border-line text-center">
          <div className="bg-soft px-6 py-2 text-xs">
            {formatDate(booking.stay.checkIn).split(" ")[0]}
          </div>
          <div className="money p-3 text-4xl">
            {Number(booking.stay.checkIn.slice(-2))}
          </div>
        </div>
        <div>
          <h2 className="font-mono text-base tabular-nums">
            {formatDate(booking.stay.checkIn, true)} –{" "}
            {formatDate(booking.stay.checkOut, true)}
          </h2>
          <p className="muted my-3 text-sm">
            <span className="numeric">{booking.stay.nights}</span> night
            reserved · End date exclusive
          </p>
          <Badge>Owner block · No guest reservation</Badge>
        </div>
      </div>
      <p className="muted mt-6 text-sm">
        The source record does not specify the reason for this block. Created{" "}
        {formatDate(booking.dateBooked, true)}.
      </p>
    </Card>
  );
}
