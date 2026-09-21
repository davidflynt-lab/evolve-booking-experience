import type { Metadata } from "next";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
export const metadata: Metadata = {
  title: "Booking details | Evolve",
  description: "Understand your booking payout, rates, and fees.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
