# Evolve Booking Detail

A Next.js App Router application for the single-booking financial experience. Built with TypeScript, React, and Tailwind CSS, using the unchanged synthetic payout dataset. Adaeze is selected by default; the breadcrumb selector and pager expose six curated records across all five core booking states.

## Run locally

Requires Node.js 20.9 or newer and pnpm 11.19.0 (Node 24 was used for verification).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. For a production preview, run `pnpm build` then `pnpm start`.

## Checks

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Lint fails on any warning. Financial tests cover all active records, one-cent discrepancies, tax reordering, canceled history, owner blocks, and the future-paid anomaly. These are targeted correctness checks rather than broad coverage.

## Structure

- `src/app`: App Router page, layout, and Tailwind theme tokens.
- `src/components/booking-navigation.tsx`: breadcrumb selector, focus management, and pager.
- `src/components/hero-payout.tsx` and `payout-lifecycle.tsx`: amount, deposit status, and four-stage lifecycle.
- `src/components/reconciliation-waterfall.tsx`: visible charge, tax, cleaning, fee, and payout arithmetic.
- `src/components/rate-intelligence.tsx`: average rate, booking lead time, and data boundaries.
- `src/components/owner-block.tsx`: calendar reservation without monetary fields.
- `src/lib/financials.ts`: integer-cent calculation, discrepancy flags, and semantic tax matching.
- `src/data/payouts.json`: original, unchanged fixture.

## Financial rules

All financial helper values use integer cents. `calculatedNet = baseRental + cleaningFee - managementFee`; a mismatch with the stored payout sets `discrepancy`. Unexpected non-cleaning fees are also flagged rather than silently ignored. Canceled historical charges are retained, while the current expected payout and management fee are zero. Owner blocks return no financial model.

Tax descriptions are matched by County, Austin, or State keywords. Unknown descriptions use a derived amount/base rate, marked approximate. No tax rate depends on array position.

The exercise's 15% fee applies only to accommodation. This is the supplied Plus model, not a general statement about production Evolve contracts. Rounded nightly averages are never multiplied back into accommodation totals.

## Accessibility and navigation

The selector uses a normal button with `aria-haspopup="listbox"` and `aria-expanded`. Focus enters the list when opened; Up/Down, Home/End, Enter/Space, and Escape work within it. Left/Right change the booking only when the selector trigger or dropdown has focus. No global arrow or digit listeners exist. Tab exits normally. Pager buttons have accessible labels. Selection changes are announced through a polite status region.

## Data boundaries and intentional assumptions

- Today is fixed to May 17, 2026.
- Stage 3 displays typical processing timing (~2 business days post check-in), not a calculated date or confirmation of initiation.
- The stated 5–9 business-day settlement convention is measured from check-in. Supplied sample settlement dates can differ from it.
- Charges do not prove guest payment or tax remittance. Daily prices, discount codes, and causal pricing explanations are absent.
- Cancellation retains original charges but does not invent refund information.
- The owner block has no supplied maintenance reason, so the app calls it an owner reservation.
- Booking 15165409 has a future actual-deposit date relative to the exercise date. The helper flags it without modifying the source. It is directly selectable in the dropdown with an Under Review status.

## Scope

This is a runnable production-build scaffold, not a deployed service. It has no backend, authentication, real bank integration, or fabricated pricing explanations. All 40 records are reachable through `/?bookingId=<id>`. Missing parameters default to Adaeze; unknown or empty IDs display an accessible not-found card. Preset and pager selections update the URL, and browser back/forward restore selection. The six curated presets remain in the dropdown; when a nonpreset or unknown record is open, Next enters the presets at Adaeze and Previous at the owner block. The missing-record view is a client-rendered state within the static page, not an HTTP 404 response. The original standalone wireframe is retained outside this application.

Configuration follows the official Next.js App Router and Tailwind PostCSS setup:

- https://nextjs.org/docs/app/getting-started/installation
- https://nextjs.org/docs/app/api-reference/config/eslint
- https://tailwindcss.com/docs/installation/framework-guides/nextjs
