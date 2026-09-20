export type BookingStatus =
  "checked_out" | "checked_in" | "booked" | "canceled" | "blocked";
export type PayoutStatus = "paid" | "pending" | "scheduled" | "canceled";
export type BookingSite =
  "Airbnb" | "VRBO" | "Evolve" | "Expedia" | "Booking.com" | "Hopper";
export interface LineItem {
  description: string;
  amount: number;
  type: "base" | "fee" | "tax";
}
export interface Payout {
  amount: number;
  managementFee: number;
  status: PayoutStatus;
  expectedDepositDate: string;
  depositedDate: string | null;
}
export interface Guest {
  name: string;
  email: string | null;
  phone: string | null;
}
export interface Stay {
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number | null;
  children: number | null;
  infants: number | null;
  pets: boolean | null;
}
interface BookingBase {
  id: string;
  stay: Stay;
  dateBooked: string;
  returningGuest: boolean;
}
export interface Reservation extends BookingBase {
  status: Exclude<BookingStatus, "blocked">;
  bookingSite: BookingSite;
  guest: Guest;
  lineItems: LineItem[];
  payout: Payout;
}
export interface OwnerBlock extends BookingBase {
  status: "blocked";
  bookingSite: null;
  guest: null;
  lineItems: [];
  payout: null;
}
export type Booking = Reservation | OwnerBlock;
export interface Dataset {
  meta: {
    description: string;
    generatedOn: string;
    todayForExercise: string;
    currencyCode: string;
    currencySymbol: string;
  };
  owner: {
    id: string;
    displayName: string;
    email: string;
    bankAccount: { institution: string; lastFour: string };
    plan: string;
    planDescription: string;
  };
  listing: {
    id: string;
    name: string;
    city: string;
    state: string;
    country: string;
    bedrooms: number;
    bathrooms: number;
    sleeps: number;
    managementFeeRate: number;
    cleaningFee: number;
  };
  taxes: { name: string; rate: number; appliesTo: string }[];
  payoutTimingNote: string;
  bookings: Booking[];
}
