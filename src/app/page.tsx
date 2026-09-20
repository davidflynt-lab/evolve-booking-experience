import { BookingExperience } from "@/components/booking-experience";
import { dataset, scenarios } from "@/lib/data";
export default function Page() {
  return (
    <BookingExperience
      bookings={scenarios}
      owner={dataset.owner}
      listing={dataset.listing}
      today={dataset.meta.todayForExercise}
    />
  );
}
