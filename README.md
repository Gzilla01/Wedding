# Nasze Wesele

Nowoczesna aplikacja Next.js dla gosci weselnych oraz panel administracyjny dla pary mlodej. Projekt jest mobile-first i gotowy do wdrozenia na Vercel po podlaczeniu Supabase.

## Funkcje

- strona glowna z hero, odliczaniem, informacjami organizacyjnymi i komunikatami,
- harmonogram dnia wesela,
- wyszukiwarka miejsca goscia z mapa sali i prywatnym widokiem stolika,
- lokalizacje, transport, noclegi, FAQ, menu, kontakty,
- upload zdjec i filmow z walidacja rozmiaru w UI,
- galeria gosci i tryb pokazu slajdow,
- RSVP, ksiega gosci i ankieta muzyczna,
- panel `/admin` z dashboardem, CRUD demo, stolami, gosciami, QR, galeria i motywem,
- strona sprzedazowa `/oferta` z pakietami i formularzem leadow MVP,
- kokpit produktu `/start` z latwym dostepem do wszystkich kluczowych ekranow,
- kreator instancji po zakupie `/zamowienie`,
- panel sprzedazowy `/sprzedaz` dla leadow i utworzonych wesel,
- materialy sprzedazowe `/materialy`, motywy `/motywy` i QR do druku `/materialy/qr`,
- przygotowanie multi-tenant: `/w/[slug]` dla wesela i `/app/[slug]` dla panelu,
- PWA manifest,
- migracje Supabase, RLS, seed demo, pakiety komercyjne i dokumentacja bazy.

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Aplikacja bedzie dostepna pod `http://localhost:3000`.

Panel administratora: `http://localhost:3000/admin`.

Oferta sprzedazowa: `http://localhost:3000/oferta`.

Kokpit produktu: `http://localhost:3000/start`.

Kreator po zakupie: `http://localhost:3000/zamowienie`.

Panel sprzedazowy: `http://localhost:3000/sprzedaz`.

Materialy sprzedazowe: `http://localhost:3000/materialy`.

Motywy demo: `http://localhost:3000/motywy`.

Demo dla par: `http://localhost:3000/demo`.

QR do druku: `http://localhost:3000/materialy/qr`.

Przykladowy tenant: `http://localhost:3000/w/anna-michal`.

## Konfiguracja Supabase

1. Utworz projekt w Supabase.
2. Skopiuj `.env.example` do `.env.local`.
3. Uzupelnij:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WEDDING_SLUG=nasze-wesele
```

4. W Supabase SQL Editor uruchom migracje:

```text
supabase/migrations/202606020001_initial_wedding_schema.sql
supabase/migrations/202606030001_commercial_readiness.sql
supabase/migrations/202606030002_superadmin_sales_security.sql
supabase/migrations/202608010001_production_app_completion.sql
```

5. Nastepnie uruchom seed:

```text
supabase/seed.sql
```

Szczegoly modelu danych sa w `docs/database.md`.

Plan przygotowania infrastruktury produkcyjnej jest w `docs/production-readiness.md`.

Checklist zarabiania i wejscia na rynek jest w `docs/go-to-market-checklist.md`.

Materialy produktowe:

- `exports/nasze-wesele-pakiet-dla-par.pdf`
- `docs/onboarding-emails.md`
- `docs/guest-instructions.md`
- `docs/legal/`

## Przygotowanie do sprzedazy

Aplikacja ma teraz podstawowa warstwe komercyjna:

- pakiety `Start`, `Wesele Live`, `Organizer Pro`, `Concierge`,
- publiczna sprzedaz przez zapytanie ofertowe, nie przez sklep,
- kontakt przez `NEXT_PUBLIC_CONTACT_EMAIL` i formularz oferty,
- limity storage i czasu dostepu per pakiet,
- migracje dla leadow, subskrypcji, usage i onboardingu,
- publiczny landing `/oferta`,
- formularz leadow MVP zapisujacy zgloszenia lokalnie,
- kreator instancji `/zamowienie`, ktory tworzy `/w/[slug]` i `/app/[slug]`,
- panel sprzedazy `/sprzedaz` pokazujacy leady i utworzone instancje,
- API sprzedazowe: `/api/sales/leads`, `/api/sales/checkout`, `/api/sales/instances`,
- helpery slugow i sciezki tenantow.
- produkcyjny snapshot panelu wesela w Supabase przez `/api/admin/weddings/[slug]/data`,
- publiczne endpointy gosci: RSVP, ksiega gosci, ankieta muzyczna i upload do Supabase Storage.

Formularz leadow i kreator instancji probuja zapisac dane przez API/Supabase. Jesli Supabase nie jest skonfigurowany, UI korzysta z lokalnego fallbacku w przegladarce.

Docelowo panel `/app/[slug]` trzeba podpiac do Supabase Auth i danych po `wedding_id`.

Ekrany operatorskie `/start`, `/sprzedaz` i `/admin` mozna zabezpieczyc Basic Auth ustawiajac `INTERNAL_TOOLS_PASSWORD` w zmiennych srodowiskowych.

## Zabezpieczenia produkcyjne

- ustaw `INTERNAL_TOOLS_PASSWORD` przed publicznym wdrozeniem,
- utworz bucket Supabase Storage zgodny z `SUPABASE_STORAGE_BUCKET` (domyslnie `wedding-media`),
- trzymaj dane panelu pary za Supabase Auth i RLS po `wedding_id`,
- wlacz Vercel Firewall albo Cloudflare dla limitow, botow i geoblokad,
- trzymaj upload w Supabase Storage z limitami rozmiaru, typow plikow i moderacja,
- regularnie eksportuj kopie danych wesela oraz ustaw retencje po wydarzeniu,
- monitoruj bledy przez Sentry i logi Supabase.

## Dane demo

Demo zawiera wesele Anny i Michala, 90 gosci, 10 stolikow, harmonogram, FAQ, komunikaty, wpisy ksiegi gosci i przykladowe dane administracyjne.

Przykladowy administrator powinien zostac utworzony w Supabase Auth, a nastepnie przypisany do wesela w tabeli `wedding_admins`. Seed nie tworzy kont Auth.

## Wdrozenie na Vercel

1. Dodaj repozytorium do Vercel.
2. Ustaw zmienne srodowiskowe jak w `.env.example`.
3. Upewnij sie, ze migracje i seed zostaly uruchomione w Supabase.
4. Podlacz domene w Cloudflare lub Vercel.
5. Skonfiguruj platnosci, maile i monitoring bledow.
6. Wykonaj deploy.

## Komendy

```bash
npm run dev
npm run lint
npm run build
```
