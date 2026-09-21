import { Suspense } from "react";
import { BookingExperience } from "@/components/booking-experience";
import { dataset, scenarios } from "@/lib/data";
export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl p-8" role="status">
          Loading booking details…
        </main>
      }
    >
      <BookingExperience
        bookings={scenarios}
        owner={dataset.owner}
        listing={dataset.listing}
        today={dataset.meta.todayForExercise}
      />
    </Suspense>
  );
}
