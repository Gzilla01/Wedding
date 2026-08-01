export type PlanId = "start" | "live" | "pro" | "concierge";

export type CommercialPlan = {
  id: PlanId;
  name: string;
  pricePln: number;
  tagline: string;
  storageGb: number;
  videoMinutes: number;
  weddingMonths: number;
  recommended?: boolean;
  features: string[];
};

export const commercialPlans: CommercialPlan[] = [
  {
    id: "start",
    name: "Start",
    pricePln: 199,
    tagline: "Elegancka strona weselna i podstawowa organizacja.",
    storageGb: 0,
    videoMinutes: 0,
    weddingMonths: 12,
    features: ["Strona weselna", "Harmonogram", "Lokalizacje", "FAQ", "RSVP", "Kod QR do strony"],
  },
  {
    id: "live",
    name: "Wesele Live",
    pricePln: 349,
    tagline: "Najlepszy pakiet na dzien wesela i zdjecia od gosci.",
    storageGb: 10,
    videoMinutes: 30,
    weddingMonths: 12,
    recommended: true,
    features: ["Wszystko ze Start", "Upload zdjec i wideo", "Galeria gosci", "Pokaz slajdow", "Ksiega gosci", "QR do druku"],
  },
  {
    id: "pro",
    name: "Organizer Pro",
    pricePln: 599,
    tagline: "Pelna organizacja wesela, stoliki, dokumenty i platnosci.",
    storageGb: 25,
    videoMinutes: 90,
    weddingMonths: 18,
    features: ["Wszystko z Live", "Plan stolow", "Mapa sali", "Planner organizacyjny", "Umowy i zaliczki", "Dokumenty i zalaczniki"],
  },
  {
    id: "concierge",
    name: "Concierge",
    pricePln: 1200,
    tagline: "Konfiguracja z pomoca i gotowy pakiet QR dla pary.",
    storageGb: 50,
    videoMinutes: 180,
    weddingMonths: 24,
    features: ["Wszystko z Pro", "Import listy gosci", "Ustawienie strony", "Przygotowanie QR", "Wsparcie przed weselem", "Priorytetowy support"],
  },
];

export const salesChannels = [
  "Para mloda",
  "Wedding planner",
  "Sala weselna",
  "Fotograf",
  "DJ lub zespol",
  "Polecenie znajomego",
];

export function formatPlanPrice(pricePln: number) {
  return `${pricePln.toLocaleString("pl-PL")} zl`;
}

export function getPlan(planId: PlanId) {
  return commercialPlans.find((plan) => plan.id === planId) ?? commercialPlans[1];
}
