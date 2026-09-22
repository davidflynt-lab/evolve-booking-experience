"use client";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import type { Booking } from "@/types/booking";
import { money, toCents, resolvePayoutDisplay } from "@/lib/financials";
import { stayRange } from "@/lib/dates";
import { Badge, ChevronIcon } from "./ui";
export function BookingNavigation({
  bookings,
  selected,
  onSelect,
  property,
  today,
}: {
  bookings: Booking[];
  selected: Booking | undefined;
  onSelect: (id: string) => void;
  property: string;
  today: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = useRef<(HTMLLIElement | null)[]>([]);
  const index = bookings.findIndex((b) => b.id === selected?.id);
  const choose = (i: number, focus = false) => {
    onSelect(bookings[(i + bookings.length) % bookings.length].id);
    setOpen(false);
    if (focus) trigger.current?.focus();
  };
  const focusOption = (i: number) => {
    const next = (i + bookings.length) % bookings.length;
    setActive(next);
    options.current[next]?.focus();
  };
  const show = () => {
    setActive(Math.max(index, 0));
    setOpen(true);
  };
  // Only this selector handles shortcuts. No window/document keyboard listeners.
  const keys = (event: KeyboardEvent<HTMLElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      choose(
        index < 0
          ? event.key === "ArrowRight"
            ? 0
            : bookings.length - 1
          : index + (event.key === "ArrowRight" ? 1 : -1),
        true,
      );
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (open) focusOption(active + (event.key === "ArrowDown" ? 1 : -1));
      else show();
    } else if (open && (event.key === "Home" || event.key === "End")) {
      event.preventDefault();
      focusOption(event.key === "Home" ? 0 : bookings.length - 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    } else if (open && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      choose(active, true);
    }
  };
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-3 text-sm leading-relaxed text-muted"
        >
          <Image
            src="/logo_black.svg"
            alt="Evolve"
            width={28}
            height={28}
            className="mr-3 h-7 w-7 shrink-0"
          />
          <span className="text-lg font-bold tracking-tight text-ink">
            evolve
          </span>
          <span aria-hidden="true">/</span>
          <span>{property}</span>
          <span aria-hidden="true">/</span>
          <span>Bookings</span>
          <span aria-hidden="true">/</span>
        </nav>
        <div className="flex min-w-0 items-center gap-2">
          <div
            className="relative"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
            }}
            onKeyDown={keys}
          >
            <button
              ref={trigger}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls="booking-list"
              className="control text-left text-sm leading-relaxed"
              onClick={() => (open ? setOpen(false) : show())}
            >
              {selected ? (
                <>
                  {selected.guest?.name ?? "Owner Block"} ·{" "}
                  <span className="numeric">
                    {stayRange(selected.stay.checkIn, selected.stay.checkOut)}
                  </span>{" "}
                  {`(${resolvePayoutDisplay(selected, today).label})`}
                </>
              ) : (
                "Select a booking"
              )}{" "}
              <span aria-hidden="true" className="ml-3">
                ▾
              </span>
            </button>
            {open && (
              <>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Close booking selector"
                  className="fixed inset-0 z-0 cursor-default"
                  onClick={() => {
                    setOpen(false);
                    trigger.current?.focus();
                  }}
                />
                <ul
                  id="booking-list"
                  role="listbox"
                  aria-label="Bookings"
                  className="absolute left-0 top-full z-10 mt-2 max-h-[65vh] w-[370px] max-w-[85vw] overflow-auto rounded-2xl border border-line bg-white p-2 shadow-[0_16px_48px_-12px_rgba(15,40,42,0.2)]"
                >
                  {bookings.map((b, i) => (
                    <li
                      key={b.id}
                      ref={(node) => {
                        options.current[i] = node;
                        if (node && i === active) node.focus();
                      }}
                      role="option"
                      aria-selected={b.id === selected?.id}
                      tabIndex={i === active ? 0 : -1}
                      data-id={b.id}
                      className={`flex cursor-pointer items-center justify-between gap-4 min-h-14 rounded-xl p-3 text-sm leading-relaxed outline-offset-[-2px] hover:bg-soft ${b.id === selected?.id ? "bg-soft" : ""}`}
                      onFocus={() => setActive(i)}
                      onClick={() => choose(i, true)}
                    >
                      <span>
                        <strong className="block">
                          {b.guest?.name ?? "Owner Block"}
                        </strong>
                        <span className="muted mt-1 block">
                          {b.status === "blocked"
                            ? "Owner reserved dates"
                            : b.status === "checked_in"
                              ? "In flight · Pending deposit"
                              : b.status === "checked_out"
                                ? "Completed stay"
                                : b.status === "canceled"
                                  ? "Historic record"
                                  : "Upcoming stay"}
                        </span>
                      </span>
                      <span className="flex flex-col items-end gap-1">
                        <Badge tone={resolvePayoutDisplay(b, today).tone}>
                          {resolvePayoutDisplay(b, today).label}
                        </Badge>
                        <span className="money">
                          {b.payout
                            ? money(toCents(b.payout.amount))
                            : "Nonfinancial"}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <button
            className="control px-3"
            aria-label="Previous booking"
            onClick={() => choose(index < 0 ? bookings.length - 1 : index - 1)}
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            className="control px-3"
            aria-label="Next booking"
            onClick={() => choose(index + 1)}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </header>
  );
}
