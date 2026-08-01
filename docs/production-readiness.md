# Production readiness

Ten dokument opisuje minimalny plan przygotowania aplikacji `Nasze Wesele` do sprzedazy jako produkt SaaS.

## Model sprzedazy

Rekomendowany start:

- `Start` - 199 zl: strona weselna, harmonogram, lokalizacje, FAQ, RSVP, QR.
- `Wesele Live` - 349 zl: upload zdjec i wideo, galeria, pokaz slajdow, ksiega gosci.
- `Organizer Pro` - 599 zl: plan stolow, mapa sali, planner, umowy, zaliczki, dokumenty.
- `Concierge` - od 1200 zl: konfiguracja przez zespol, import gosci, przygotowanie QR.

Na pierwsze wdrozenia warto sprzedawac `Concierge` lub `Organizer Pro`, bo pozwala zebrac feedback i recznie dopracowac onboarding.

## Infrastruktura

Rekomendowany stack:

- Vercel - hosting Next.js.
- Supabase - Postgres, Auth, Storage, RLS.
- Cloudflare - DNS, domena, ochrona.
- Resend - maile transakcyjne.
- Sentry - monitoring bledow.
- Plausible albo Umami - analityka.
- Stripe albo Przelewy24 - platnosci.

## Obsluga sprzedazy

Dodane ekrany operacyjne:

- `/start` - kokpit produktu i szybkie wejscie do najwazniejszych miejsc.
- `/oferta` - strona sprzedazowa z pakietami.
- `/zamowienie` - kreator instancji po zakupie.
- `/sprzedaz` - panel operatora z leadami, instancjami i statusami.

API sprzedazowe:

- `POST /api/sales/leads` - zapisuje lead do `sales_leads`.
- `POST /api/sales/checkout` - tworzy `weddings`, `wedding_subscriptions` i onboarding.
- `GET /api/sales/instances` - pobiera instancje wesel do panelu sprzedazy.

Na etapie lokalnym UI ma fallback do localStorage. Produkcyjnie po ustawieniu Supabase dane trafiaja do `sales_leads`, `weddings`, `wedding_subscriptions` i `wedding_onboarding_steps`.

## Multi-tenant

Jedna aplikacja obsluguje wiele wesel.

Docelowe adresy:

- landing: `/oferta`
- publiczna strona wesela: `/w/[slug]`
- panel konkretnego wesela: `/app/[slug]`
- demo publiczne: `/`
- demo admina: `/admin`

Kazda tabela biznesowa musi miec `wedding_id`. Publiczny adres wesela powinien pobierac rekord po `weddings.slug`.

Storage:

```text
weddings/{weddingSlug}/photos
weddings/{weddingSlug}/videos
weddings/{weddingSlug}/documents
weddings/{weddingSlug}/exports
```

## Prywatnosc strony gosci

Rekomendowany model dla par:

- publiczny link nie pokazuje od razu calej strony,
- gosc wpisuje kod wesela z zaproszenia,
- kod moze byc prosty do przepisania, np. `ANNA2026`,
- po wpisaniu kodu dostep jest zapamietywany w przegladarce na czas sesji,
- panel pary nadal wymaga osobnego logowania.

Kod z zaproszenia ogranicza przypadkowy dostep do strony przez osoby, ktore dostaly link. Nie nalezy traktowac go jako zabezpieczenia dla panelu administracyjnego albo dokumentow.

## Baza danych

Migracje:

- `202606020001_initial_wedding_schema.sql` - podstawowy model wesela.
- `202606030001_commercial_readiness.sql` - pakiety, leady, subskrypcje, usage, onboarding.
- `202606030002_superadmin_sales_security.sql` - superadmini i polityki sprzedazowe.

Przed produkcja trzeba jeszcze dodac:

- tabele dla realnych uploadow zdjec/wideo,
- superadminow,
- webhooki platnosci,
- logi zgody i akceptacji regulaminu,
- procedury retencji i usuwania danych.

## RLS i bezpieczenstwo

Wymagane zasady:

- administrator widzi tylko wesela, do ktorych jest przypisany w `wedding_admins`,
- publiczne strony widza tylko opublikowane wesela,
- upload musi sprawdzac limit pakietu i status platnosci,
- dokumenty i zalaczniki organizacyjne sa prywatne dla administratorow,
- service role key nie moze trafic do klienta ani do publicznego bundle.

Zabezpieczenia dodane w aplikacji:

- globalne security headers w `next.config.ts`,
- `X-Frame-Options: DENY`,
- `X-Content-Type-Options: nosniff`,
- `Referrer-Policy: strict-origin-when-cross-origin`,
- podstawowy `Content-Security-Policy`,
- `Permissions-Policy` ograniczajacy dostep do funkcji przegladarki,
- opcjonalny Basic Auth na `/start`, `/sprzedaz` i `/admin` po ustawieniu `INTERNAL_TOOLS_PASSWORD`.
- server-side Supabase client uzywa `SUPABASE_SERVICE_ROLE_KEY` tylko w API routes.

Przed publiczna sprzedaza trzeba dodatkowo:

- wlaczyc Supabase Auth dla `/app/[slug]`,
- ukryc `/sprzedaz` za rola `superadmin`,
- dodac auth check superadmina w API routes przed odczytem instancji,
- dodac rate limiting dla formularzy i uploadow,
- dodac captcha albo turnstile dla publicznych formularzy,
- limitowac rozmiar plikow na poziomie klienta i storage policy,
- podpisywac prywatne linki do dokumentow,
- dodac backup bazy i storage,
- dodac alerty kosztowe w Supabase/Vercel.

## Platnosci

Etap 1:

- platnosc reczna lub link platniczy,
- reczna aktywacja pakietu w bazie,
- faktura/paragon poza systemem.

Etap 2:

- checkout Stripe albo Przelewy24,
- webhook tworzy `wedding_subscriptions`,
- pakiet ustawia limity storage i czas dostepu,
- mail potwierdzajacy do pary.

## Onboarding klienta

Minimalny flow:

1. Para wybiera pakiet.
2. Para podaje imiona, date, email, telefon i preferowany slug.
3. System tworzy rekord `sales_leads`.
4. Po platnosci powstaje `weddings`.
5. Para dostaje link do `/app/[slug]`.
6. Onboarding prowadzi przez: dane wesela, motyw, gosci, stoliki, QR, galerie.

Aktualny MVP:

1. Operator wchodzi w `/zamowienie`.
2. Wpisuje dane pary i wybiera pakiet.
3. System generuje `/w/[slug]`, `/app/[slug]` oraz storage prefix.
4. Instancja pojawia sie w `/sprzedaz`.
5. Operator moze zmienic status instancji: robocze, platnosc, aktywne, pauza.

## Co jest juz w repo

- konfiguracja pakietow w `src/lib/commercial-config.ts`,
- helpery slugow i tenantow w `src/lib/tenant.ts`,
- strona oferty `/oferta`,
- publiczna sciezka tenantowa `/w/[slug]`,
- sciezka panelu tenantowego `/app/[slug]`,
- formularz leadow MVP zapisujacy dane lokalnie,
- migracja komercyjna Supabase.

## Najblizsze kroki techniczne

1. Podpiac formularz leadow pod `sales_leads` w Supabase.
2. Dodac Supabase Auth dla `/app/[slug]`.
3. Przeniesc admin demo z localStorage na dane z `wedding_id`.
4. Podpiac upload do Supabase Storage.
5. Dodac superadmina do zarzadzania leadami, pakietami i aktywacjami.
6. Dodac platnosci i webhooki.
