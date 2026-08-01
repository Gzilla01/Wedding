export type DemoTheme = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  audience: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  details: string[];
};

export const demoThemes: DemoTheme[] = [
  {
    id: "editorial-gold",
    name: "Editorial Gold",
    tagline: "Premium, elegancko, wieczorowo.",
    description: "Motyw dla klasycznego wesela w stylu hotelu, dworku albo eleganckiej sali. Duze zdjecie pary, ciemna zielen, zloto i kremowe tlo.",
    audience: "Sale premium, wesela black tie, klasyczne przyjecia.",
    colors: {
      background: "#fffaf4",
      surface: "#ffffff",
      primary: "#234d43",
      secondary: "#7b544d",
      accent: "#d8bd72",
      text: "#1c1917",
    },
    details: ["Zlote detale QR", "Kontrastowe przyciski", "Eleganckie karty", "Najlepszy do sprzedazy Pro/Concierge"],
  },
  {
    id: "botanical-green",
    name: "Botanical Green",
    tagline: "Naturalnie, cieplo, ogrodowo.",
    description: "Motyw dla wesel rustykalnych, boho i plenerowych. Jasne tlo, butelkowa zielen, roslinne akcenty i bardzo czytelny interfejs.",
    audience: "Stodoly, ogrody, dworki, plener.",
    colors: {
      background: "#f5f4eb",
      surface: "#ffffff",
      primary: "#315b46",
      secondary: "#8b7356",
      accent: "#b9a268",
      text: "#23251f",
    },
    details: ["Miekkie sekcje", "Cieple kontrasty", "Czytelne dla starszych gosci", "Dobry do pakietu Live"],
  },
  {
    id: "modern-white",
    name: "Modern White",
    tagline: "Minimalistycznie, jasno, bardzo czytelnie.",
    description: "Motyw dla par, ktore chca prostoty i wysokiej czytelnosci. Biala przestrzen, delikatny roz, czarne naglowki i spokojne layouty.",
    audience: "Nowoczesne sale, miejskie wesela, minimalizm.",
    colors: {
      background: "#fbfaf8",
      surface: "#ffffff",
      primary: "#1f2933",
      secondary: "#9f6f6d",
      accent: "#e7c9c4",
      text: "#111827",
    },
    details: ["Najmniej ozdobny", "Najbardziej uniwersalny", "Szybki onboarding", "Dobry jako demo Start"],
  },
];

export function getDemoTheme(themeId: string) {
  return demoThemes.find((theme) => theme.id === themeId) ?? demoThemes[0];
}
