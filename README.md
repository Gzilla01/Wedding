# Aleksandra i Pawel 2028

Prywatna aplikacja do organizacji jednego wesela: strona dla gosci, RSVP, wyszukiwarka stolika, upload zdjec, ksiega gosci, ankieta muzyczna i panel administracyjny.

## Najwazniejsze adresy

- strona gosci: `/`
- panel administracyjny: `/admin`
- RSVP: `/rsvp`
- zdjecia od gosci: `/upload`
- galeria: `/gallery`
- ksiega gosci: `/guestbook`
- muzyka: `/music`

Stare ekrany sprzedazowe i multi-wedding zostaly usuniete z kodu aplikacji.

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Lokalnie aplikacja startuje na `http://localhost:3000`.

## Zmienne produkcyjne

W Railway ustaw zmienne z `.env.example`. Dla obecnej produkcji najwazniejsze sa:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ovmtavyxmwvbvsftzrmx.supabase.co
NEXT_PUBLIC_WEDDING_SLUG=aleksandra-pawel-2028
NEXT_PUBLIC_SITE_URL=https://www.aleksandrapawel-2028.pl
SUPABASE_STORAGE_BUCKET=wedding-media
INTERNAL_TOOLS_PASSWORD=...
RESEND_API_KEY=...
EMAIL_FROM=Aleksandra i Pawel <powiadomienia@twoja-domena.pl>
EMAIL_REPLY_TO=gradit.consulting@gmail.com
```

Nie commituj prawdziwych kluczy Supabase ani hasla panelu. Klucz `service_role` trzymaj tylko w Railway/Supabase secrets.

Do wysylki maili z linkiem do nowego konta ustaw w Railway `RESEND_API_KEY`, `EMAIL_FROM` oraz opcjonalnie `EMAIL_REPLY_TO`.

## Supabase

SQL do bazy jest w `supabase/migrations/`. Produkcyjny seed jednego wesela jest w `supabase/seed-production.sql`.

Potrzebny bucket Storage:

- `wedding-media`

Moze byc prywatny. Uploady przechodza przez API aplikacji.

## Deployment

Railway buduje projekt z GitHuba. Po kazdym `git push` Railway robi nowy deploy. Domena produkcyjna:

[https://www.aleksandrapawel-2028.pl](https://www.aleksandrapawel-2028.pl)
