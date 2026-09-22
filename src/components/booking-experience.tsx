"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_BOOKING_ID, getBookingById } from "@/lib/data";
import { BookingNotFound } from "./booking-not-found";
import type { Booking, Dataset } from "@/types/booking";
import { formatDate } from "@/lib/dates";
import { calculateFinancials } from "@/lib/financials";
import { BookingNavigation } from "./booking-navigation";
import { HeroPayout } from "./hero-payout";
import { ReconciliationWaterfall } from "./reconciliation-waterfall";
import { RateIntelligence } from "./rate-intelligence";
import { OwnerBlock } from "./owner-block";
export function BookingExperience({
  bookings,
  owner,
  listing,
  today,
}: {
  bookings: Booking[];
  owner: Dataset["owner"];
  listing: Dataset["listing"];
  today: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const booking = getBookingById(
    searchParams.get("bookingId") ?? DEFAULT_BOOKING_ID,
  );
  const selectBooking = (id: string) => {
    const resolved = getBookingById(id);
    if (!resolved) return;
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("bookingId", resolved.id);
    router.push(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };
  const financials = booking ? calculateFinancials(booking) : null;
  return (
    <>
      <a
        href="#booking-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3"
      >
        Skip to booking details
      </a>
      <BookingNavigation
        bookings={bookings}
        selected={booking}
        onSelect={selectBooking}
        property={listing.name}
        today={today}
      />
      <main id="booking-content" className="mx-auto max-w-6xl px-6 py-8">
        {!booking ? (
          <BookingNotFound onReturn={() => selectBooking(DEFAULT_BOOKING_ID)} />
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">
                  {listing.name} · {listing.city}, {listing.state}
                </p>
                <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                  {booking.guest
                    ? `${booking.guest.name}’s booking`
                    : "Owner reserved block"}
                </h1>
                <p className="numeric muted mt-3 text-sm leading-relaxed">
                  {formatDate(booking.stay.checkIn, true)} –{" "}
                  {formatDate(booking.stay.checkOut, true)} ·{" "}
                  {booking.stay.nights}{" "}
                  {booking.stay.nights === 1 ? "night" : "nights"}
                  {booking.bookingSite && ` · ${booking.bookingSite}`}
                </p>
              </div>
              <span className="muted text-sm leading-relaxed">
                {booking.status === "blocked" ? "Block" : "Booking"}{" "}
                <span className="money">{booking.id}</span>
              </span>
            </div>
            {booking.status === "blocked" ? (
              <OwnerBlock booking={booking} />
            ) : (
              financials && (
                <>
                  <HeroPayout booking={booking} owner={owner} today={today} />
                  <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.6fr_1fr]">
                    <ReconciliationWaterfall financials={financials} />
                    <RateIntelligence
                      booking={booking}
                      financials={financials}
                    />
                  </div>
                </>
              )
            )}
          </>
        )}
        <p className="numeric muted mt-6 text-sm leading-relaxed">
          Synthetic exercise data · As of {formatDate(today, true)} · USD
        </p>
        <div role="status" aria-live="polite" className="sr-only">
          {booking
            ? `Showing ${booking.guest?.name ?? "owner reserved block"}.`
            : "Booking Not Found."}
        </div>
      </main>
    </>
  );
}
