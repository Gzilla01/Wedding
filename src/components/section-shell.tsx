import { ReactNode } from "react";

export function SectionShell({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="section-bloom reveal-section mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12" id={id}>
      <p className="wedding-eyebrow mb-3">{eyebrow}</p>
      <h2 className="mb-6 max-w-3xl text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">{title}</h2>
      {children}
    </section>
  );
}
