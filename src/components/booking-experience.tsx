"use client";
import { useState } from "react";
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
  const [selectedId, setSelectedId] = useState(bookings[0].id);
  const booking = bookings.find((b) => b.id === selectedId)!;
  const financials = calculateFinancials(booking);
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
        onSelect={setSelectedId}
        property={listing.name}
      />
      <main id="booking-content" className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              {listing.name} · {listing.city}, {listing.state}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {booking.guest
                ? `${booking.guest.name}’s booking`
                : "Owner reserved block"}
            </h1>
            <p className="muted mt-2 text-xs">
              {formatDate(booking.stay.checkIn, true)} –{" "}
              {formatDate(booking.stay.checkOut, true)} · {booking.stay.nights}{" "}
              {booking.stay.nights === 1 ? "night" : "nights"}
              {booking.bookingSite && ` · ${booking.bookingSite}`}
            </p>
          </div>
          <span className="muted text-xs">
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
                <RateIntelligence booking={booking} financials={financials} />
              </div>
            </>
          )
        )}
        <p className="muted mt-6 text-[11px]">
          Synthetic exercise data · As of {formatDate(today, true)} · USD
        </p>
        <div role="status" aria-live="polite" className="sr-only">
          Showing {booking.guest?.name ?? "owner reserved block"}.
        </div>
      </main>
    </>
  );
}
