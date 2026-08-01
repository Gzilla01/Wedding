# Scenariusz zarabiania na Nasze Wesele

Ten dokument opisuje, co trzeba ogarnac, zeby aplikacja mogla realnie zarabiac.

## 1. Minimalny model sprzedazy

Najprostszy start:

1. Pokazujesz klientowi `/oferta`.
2. Klient wybiera pakiet.
3. Pobierasz platnosc recznie albo przez link platniczy.
4. Wchodzisz w `/zamowienie`.
5. Wpisujesz dane pary.
6. System tworzy instancje `/w/[slug]` i `/app/[slug]`.
7. Para dostaje link do panelu i QR do publicznej strony.
8. Ty obslugujesz klienta przez `/sprzedaz`.

To pozwala sprzedawac zanim powstanie pelny self-service.

## 2. Pakiety i ceny startowe

Rekomendacja:

- `Start` - 199 zl: strona, RSVP, harmonogram, lokalizacje, FAQ, QR.
- `Wesele Live` - 349 zl: upload zdjec/wideo, galeria, pokaz slajdow, ksiega gosci.
- `Organizer Pro` - 599 zl: plan stolow, mapa sali, dokumenty, umowy, zaliczki.
- `Concierge` - 1200-2500 zl: konfiguracja przez Ciebie, import gosci, QR, wsparcie.

Na pierwsze 10-20 klientow najlepiej sprzedawac `Concierge` albo `Organizer Pro`, bo feedback jest wazniejszy niz automatyzacja.

## 3. Co jest juz gotowe technicznie

- `/start` - kokpit produktu.
- `/oferta` - oferta i lead form.
- `/zamowienie` - kreator instancji po zakupie.
- `/sprzedaz` - panel leadow i instancji.
- `/w/[slug]` - publiczny adres wesela.
- `/app/[slug]` - docelowy panel konkretnego wesela.
- API:
  - `POST /api/sales/leads`
  - `POST /api/sales/checkout`
  - `GET /api/sales/instances`
- Migracje:
  - commercial readiness,
  - superadmin sales security.

## 4. Co trzeba jeszcze zrobic przed pierwsza platna sprzedaza

Technicznie:

- zalozyc Supabase project,
- uruchomic wszystkie migracje,
- ustawic `.env.local` i zmienne na Vercel,
- ustawic `INTERNAL_TOOLS_PASSWORD`,
- dodac pierwszego superadmina w `app_superadmins`,
- przetestowac tworzenie wesela przez `/zamowienie`,
- podpiac upload zdjec i dokumentow do Supabase Storage,
- ustawic limity uploadu per pakiet,
- dodac backup bazy i storage,
- dodac monitoring bledow w Sentry.

Produktowo:

- przygotowac 3 ladne motywy demo,
- przygotowac PDF i demo dla par,
- przygotowac gotowe QR do druku,
- przygotowac onboarding mailowy dla pary,
- przygotowac instrukcje dla gosci w 3 zdaniach.

Prawnie:

- regulamin uslugi,
- polityka prywatnosci,
- zgody na przetwarzanie zdjec/wideo,
- zasady retencji danych po weselu,
- procedura usuniecia danych,
- informacja kto jest administratorem danych,
- umowa powierzenia, jesli sprzedajesz B2B salom/wedding plannerom,
- konsultacja czy Twoj obecny kontrakt pozwala na komercjalizacje projektu.

Finansowo:

- forma rozliczenia: dzialalnosc, JDG, spolka albo inna forma,
- fakturowanie/paragony,
- bramka platnosci: Przelewy24 lub Stripe,
- konto firmowe,
- cennik brutto,
- zasady zwrotow i reklamacji.

Sprzedazowo:

- landing na domenie,
- formularz kontaktowy,
- 10-20 rozmow z parami,
- 5 rozmow z wedding plannerami,
- 5 rozmow z salami weselnymi,
- program polecen: 20-30% prowizji dla partnera,
- materialy: PDF, demo, krotka wiadomosc do polecen.

## 5. Co trzeba zrobic przed self-service

Self-service oznacza, ze klient placi i wszystko robi sie samo.

Wymagane:

- checkout Stripe/Przelewy24,
- webhook platnosci,
- automatyczne tworzenie `weddings`,
- automatyczne przypisanie wlasciciela w Supabase Auth,
- email z linkiem magicznym do `/app/[slug]`,
- onboarding krok po kroku,
- automatyczne faktury lub integracja ksiegowa,
- panel klienta do zmiany pakietu,
- automatyczna blokada po wygasnieciu pakietu,
- automatyczne ostrzezenia o limicie storage.

## 6. Kolejnosc dzialania

Najrozsadniejsza kolejnosc:

1. Skonfiguruj Supabase i Vercel.
2. Uruchom aplikacje na domenie.
3. Ustaw Basic Auth na ekrany operatorskie.
4. Sprzedaj pierwsze 3 wesela recznie.
5. Pomoz klientom skonfigurowac strone.
6. Zbierz feedback i screeny.
7. Dopiero wtedy dopnij automatyczne platnosci.
8. Potem idz w B2B: sale, plannerzy, fotografowie.

## 7. Najwieksze ryzyka

- Za duzo supportu przy tanim pakiecie.
- Upload wideo moze szybko generowac koszty.
- Brak regulaminu i zgody na zdjecia moze byc problemem.
- Pary beda chcialy personalizacji, wiec trzeba miec jasne granice pakietow.
- Bez partnerow koszt pozyskania klienta moze byc wysoki.

## 8. Pierwsza oferta do rynku

Najlepszy komunikat:

> Cyfrowe centrum wesela pod QR. Goscie widza plan dnia, stoliki, lokalizacje i dodaja zdjecia. Para ma panel do organizacji, QR, RSVP, dokumentow i planu sali.

Pierwsza promocja:

> Szukamy pierwszych 10 par. Konfiguracja z nasza pomoca, specjalna cena startowa, w zamian prosimy o feedback i zgode na anonimowe case study.
