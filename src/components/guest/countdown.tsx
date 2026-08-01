"use client";

import { useEffect, useState } from "react";

export function Countdown({ targetDate }: { targetDate: string }) {
  const [label, setLabel] = useState("Ladujemy odliczanie");

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff < -24 * 60 * 60 * 1000) {
        setLabel("Dziekujemy za wspolne swietowanie");
        return;
      }
      if (diff <= 0) {
        setLabel("Dzis jest nasz dzien");
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      setLabel(`${days} dni i ${hours} godzin do uroczystosci`);
    };
    tick();
    const timer = window.setInterval(tick, 60000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="w-full rounded-[1.25rem] border border-white/30 bg-white/18 p-4 text-white shadow-2xl shadow-stone-950/15 backdrop-blur-md sm:max-w-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">Odliczanie</p>
      <p className="mt-1 text-2xl font-semibold">{label}</p>
    </div>
  );
}
