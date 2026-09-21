import type { ReactNode } from "react";
export function Card({
  title,
  subtitle,
  children,
  soft = false,
}: {
  title: string;
  subtitle?: string;
  soft?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={`card ${soft ? "card-soft" : ""}`}>
      <header className="card-heading">
        <h2>{title}</h2>
        {subtitle && (
          <p className="muted text-sm leading-relaxed mt-2">{subtitle}</p>
        )}
      </header>
      <div className="p-7">{children}</div>
    </section>
  );
}
export function MoneyRow({
  label,
  amount,
  prominent = false,
}: {
  label: ReactNode;
  amount: string;
  prominent?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-5 py-4 ${prominent ? "font-semibold" : ""}`}
    >
      <span>{label}</span>
      <span className={`money ${prominent ? "text-xl" : ""}`}>{amount}</span>
    </div>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "pending" | "paid" | "canceled" | "plus";
}) {
  return (
    <span className={`badge ${tone === "neutral" ? "" : `badge-${tone}`}`}>
      {children}
    </span>
  );
}
export function NumericText({ children }: { children: string }) {
  return (
    <>
      {children.split(/(\d+(?:[.,]\d+)*(?:%|–\d+)?)/g).map((part, i) =>
        /\d/.test(part) ? (
          <span key={i} className="numeric">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
export function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
export function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} />
    </svg>
  );
}
