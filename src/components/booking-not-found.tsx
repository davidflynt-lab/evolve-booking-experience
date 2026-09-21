"use client";
import { useEffect, useRef } from "react";
export function BookingNotFound({ onReturn }: { onReturn: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <section
      className="card mx-auto my-10 max-w-2xl p-8 sm:p-12"
      aria-labelledby="booking-not-found-title"
    >
      <p className="eyebrow mb-4">Reservation unavailable</p>
      <h1
        ref={heading}
        tabIndex={-1}
        id="booking-not-found-title"
        className="font-display text-4xl focus:outline-none"
      >
        Booking Not Found
      </h1>
      <p className="muted mt-4 leading-relaxed">
        The requested reservation ID does not exist in Jordan Avery’s property
        records.
      </p>
      <button type="button" className="control mt-7" onClick={onReturn}>
        Return to Latest Booking
      </button>
    </section>
  );
}
