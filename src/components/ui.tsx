import type { ReactNode } from "react";
export function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="card">
      <header className="card-heading">
        <h2>{title}</h2>
        {subtitle && <p className="muted text-xs mt-2">{subtitle}</p>}
      </header>
      <div className="p-6">{children}</div>
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
export function Badge({ children }: { children: ReactNode }) {
  return <span className="badge">{children}</span>;
}
