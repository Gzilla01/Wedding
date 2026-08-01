import { Cake, Car, Church, GlassWater, Music2, Sparkles, Utensils } from "lucide-react";

export const wedding = {
  bride: "Aleksandra",
  groom: "Pawel",
  date: "2028-06-17T14:00:00+02:00",
  displayDate: "17 czerwca 2028",
  ceremonyTime: "14:00",
  ceremonyAddress: "Miejsce ceremonii do uzupelnienia",
  venueAddress: "Sala weselna do uzupelnienia",
};

export const themes = [
  { id: "gold", name: "Eleganckie zloto", primary: "#2f5d50", accent: "#c2a45d" },
  { id: "rustic", name: "Rustykalne wesele", primary: "#7b544d", accent: "#d1a36a" },
  { id: "white", name: "Minimalistyczna biel", primary: "#44403c", accent: "#d6d3d1" },
  { id: "boho", name: "Boho", primary: "#8b5e3c", accent: "#d6a76c" },
  { id: "green", name: "Butelkowa zielen", primary: "#1f4d3a", accent: "#d8bd72" },
];

export const tables = Array.from({ length: 10 }, (_, index) => ({
  id: `table-${index + 1}`,
  number: index + 1,
  name: index === 0 ? "Stol prezydialny" : `Stolik ${index + 1}`,
  shape: index === 0 ? "head" : index % 3 === 0 ? "rect" : "round",
  seats: index === 0 ? 10 : 9,
  x: 12 + (index % 5) * 17,
  y: index < 5 ? 22 : 58,
  theme: ["Piwonie", "Rzym", "Jazz", "Tatry", "Kino"][index % 5],
}));

const firstNames = ["Maria", "Jan", "Katarzyna", "Piotr", "Agnieszka", "Tomasz", "Magdalena", "Pawel", "Joanna", "Krzysztof", "Natalia", "Adam", "Ewa", "Michal", "Karolina"];
const lastNames = ["Kowalska", "Nowak", "Wisniewski", "Wojcik", "Kowalczyk", "Kaminska", "Lewandowski", "Zielinska", "Szymanski", "Dabrowska"];

export const guests = Array.from({ length: 90 }, (_, index) => {
  const table = tables[index % tables.length];
  const diet = index % 17 === 0 ? "wegetarianska" : index % 23 === 0 ? "bez glutenu" : "";
  return {
    id: `guest-${index + 1}`,
    firstName: firstNames[index % firstNames.length],
    lastName: lastNames[index % lastNames.length],
    companion: index % 4 === 0 ? "osoba towarzyszaca" : "",
    group: index % 2 === 0 ? "Rodzina panny mlodej" : index % 3 === 0 ? "Znajomi" : "Rodzina pana mlodego",
    tableId: table.id,
    tableNumber: table.number,
    seat: (index % table.seats) + 1,
    diet,
    child: index % 19 === 0,
    accommodation: index % 5 === 0 ? "Pokoj 20" + (index % 9) : "",
    transport: index % 6 === 0,
    rsvp: index % 8 === 0 ? "oczekuje" : "potwierdzone",
    token: `gosc-${index + 1}`,
  };
});

export const roomElements = [
  { id: "dance", label: "Parkiet", type: "dance", x: 38, y: 38, w: 24, h: 18 },
  { id: "bar", label: "Bar", type: "bar", x: 80, y: 14, w: 12, h: 12 },
  { id: "entry", label: "Wejscie", type: "entry", x: 5, y: 78, w: 14, h: 10 },
  { id: "stage", label: "Scena", type: "stage", x: 43, y: 8, w: 18, h: 10 },
];

export const scheduleItems = [
  { id: "s1", time: "14:00", title: "Ceremonia slubna", description: "Spotykamy sie w Kosciele sw. Anny.", icon: Church, highlighted: true },
  { id: "s2", time: "15:15", title: "Przejazd na sale", description: "Autobus i samochody jada do Dworku Pod Lipami.", icon: Car },
  { id: "s3", time: "16:00", title: "Powitanie pary mlodej", description: "Toast powitalny przy wejsciu do sali.", icon: GlassWater, highlighted: true },
  { id: "s4", time: "16:15", title: "Obiad", description: "Pierwszy wspolny posilek.", icon: Utensils },
  { id: "s5", time: "17:30", title: "Pierwszy taniec", description: "Zapraszamy pod parkiet.", icon: Music2, highlighted: true },
  { id: "s6", time: "20:00", title: "Tort weselny", description: "Tort i wspolne zdjecie.", icon: Cake },
  { id: "s7", time: "23:00", title: "Oczepiny", description: "Krotkie zabawy i niespodzianka.", icon: Sparkles },
  { id: "s8", time: "02:00", title: "Pierwszy transport", description: "Odjazd spod glownego wejscia.", icon: Car },
  { id: "s9", time: "04:00", title: "Drugi transport", description: "Ostatni autobus powrotny.", icon: Car },
];

export const locations = [
  { id: "church", name: "Kosciol sw. Anny", address: "ul. sw. Anny 11, Krakow", description: "Ceremonia rozpoczyna sie punktualnie o 14:00.", googleMapsUrl: "https://maps.google.com/?q=Kosciol+sw+Anny+Krakow", navigationUrl: "https://www.google.com/maps/dir/?api=1&destination=Kosciol+sw+Anny+Krakow" },
  { id: "venue", name: "Dworek Pod Lipami", address: "ul. Lipowa 12, Krakow", description: "Przyjecie, nocleg i sniadanie nastepnego dnia.", googleMapsUrl: "https://maps.google.com/?q=Krakow+Lipowa+12", navigationUrl: "https://www.google.com/maps/dir/?api=1&destination=Krakow+Lipowa+12" },
  { id: "hotel", name: "Hotel dla gosci", address: "ul. Ogrodowa 4, Krakow", description: "Recepcja czynna cala dobe.", googleMapsUrl: "https://maps.google.com/?q=Krakow+Ogrodowa+4", navigationUrl: "https://www.google.com/maps/dir/?api=1&destination=Krakow+Ogrodowa+4" },
  { id: "parking", name: "Parking", address: "wjazd od ul. Lipowej", description: "Bezpłatny parking dla gosci weselnych.", googleMapsUrl: "https://maps.google.com/?q=Krakow+Lipowa+12", navigationUrl: "https://www.google.com/maps/dir/?api=1&destination=Krakow+Lipowa+12" },
];

export const transports = [
  { id: "t1", route: "Sala -> centrum Krakowa", time: "02:00", seats: 45, contact: "Pawel, +48 500 100 200" },
  { id: "t2", route: "Sala -> hotel i centrum", time: "04:00", seats: 45, contact: "Pawel, +48 500 100 200" },
];

export const faqItems = [
  { id: "f1", question: "Czy na miejscu jest parking?", answer: "Tak, parking jest bezplatny i znajduje sie przy sali." },
  { id: "f2", question: "Czy bedzie transport powrotny?", answer: "Tak, autobusy odjezdzaja o 02:00 i 04:00." },
  { id: "f3", question: "Czy mozna przyjsc z dziecmi?", answer: "Tak, przygotowalismy kacik dla dzieci i menu dziecięce." },
  { id: "f4", question: "Gdzie wrzucac zdjecia?", answer: "Uzyj przycisku Dodaj zdjecia albo kodu QR na stoliku." },
  { id: "f5", question: "Jaki obowiazuje stroj?", answer: "Elegancki, wygodny do tanca. Unikamy bieli." },
];

export const announcements = [
  { id: "a1", title: "Autobus powrotny", body: "Odjazdy o 02:00 i 04:00 spod glownego wejscia." },
  { id: "a2", title: "Sniadanie", body: "Dla nocujacych: 09:00-11:00 w oranzerii." },
  { id: "a3", title: "Galeria", body: "Prosimy o wrzucanie zdjec do wspolnej galerii." },
];

export const menuItems = [
  { id: "m1", name: "Krem z bialych warzyw", description: "Podawany z oliwa ziolowa.", tags: ["wegetarianskie"] },
  { id: "m2", name: "Policzki wolowe", description: "Puree ziemniaczane, sezonowe warzywa.", tags: ["cieply posilek"] },
  { id: "m3", name: "Talerz dziecięcy", description: "Mini kotleciki, frytki, surowka.", tags: ["dla dzieci"] },
  { id: "m4", name: "Opcja weganska", description: "Risotto z grzybami i zielonym groszkiem.", tags: ["weganskie", "bez glutenu"] },
];

export const photoChallenges = [
  { id: "pc1", title: "Selfie ze stolikiem", description: "Zrobcie wspolne zdjecie calego stolika i wrzuccie do galerii." },
  { id: "pc2", title: "Pierwszy taniec", description: "Uchwyc moment, ktory para mloda bedzie chciala zobaczyc po weselu." },
  { id: "pc3", title: "Najlepszy detal", description: "Dekoracje, winietki, bukiet, tort albo cos, co skradlo Ci oko." },
  { id: "pc4", title: "Parkiet zyje", description: "Zdjecie z tanca, smiechu albo weselnej energii." },
];

export const contacts = [
  { role: "Swiadek", name: "Pawel Nowak", phone: "+48500100200" },
  { role: "Swiadkowa", name: "Karolina Zielinska", phone: "+48500100300" },
  { role: "Transport", name: "Marek Bus", phone: "+48500100400" },
  { role: "Koordynator sali", name: "Ewa z Dworku", phone: "+48500100500" },
];

export const galleryItems = Array.from({ length: 12 }, (_, index) => ({
  id: `photo-${index + 1}`,
  src: `/gallery/photo-${(index % 6) + 1}.svg`,
  author: ["Kasia", "Pawel", "Ania", "Michal"][index % 4],
  caption: ["Pierwszy toast", "Parkiet", "Dekoracje", "Usmiechy"][index % 4],
  likes: 3 + index * 2,
  approved: index % 5 !== 0,
  favorite: index % 4 === 0,
}));
