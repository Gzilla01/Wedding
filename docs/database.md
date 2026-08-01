# Database setup

Model danych znajduje sie w `supabase/migrations/202606020001_initial_wedding_schema.sql`, a dane demonstracyjne w `supabase/seed.sql`.

## Zakres modelu

Schemat obsluguje jedno lub wiele wesel przez klucz `wedding_id`. Demo zawiera wesele `nasze-wesele` dla pary Anna i Michal, date 2026-06-20, 90 gosci, 45 zaproszen domowych i 10 stolikow.

Glowne tabele:

- `weddings` - publiczna konfiguracja wesela, miejsca, terminy, kontakt i status publikacji.
- `wedding_admins` - powiazanie uzytkownikow Supabase Auth z weselem, ktorym zarzadzaja.
- `households` - zaproszenia rodzinne lub grupowe z kodem zaproszenia.
- `guests` - lista gosci, RSVP, preferencje menu, prosby muzyczne i przypisanie do stolika.
- `seating_tables` - stoliki, numeracja, nazwy i pojemnosc.
- `schedule_items` - harmonogram dnia.
- `faq_items` - pytania i odpowiedzi.
- `announcements` - komunikaty publikowane na stronie.
- `guestbook_entries` - wpisy ksiegi gosci z moderacja.

## RLS

Wszystkie tabele maja wlaczone Row Level Security.

Publicznie, bez logowania, mozna czytac:

- opublikowane rekordy z `weddings`,
- publiczny harmonogram i FAQ dla opublikowanego wesela,
- aktywne komunikaty z ustawionym `published_at`,
- zatwierdzone wpisy ksiegi gosci,
- stoliki dla opublikowanego wesela.

Publicznie mozna dodac wpis do ksiegi gosci tylko dla opublikowanego wesela. Nowy wpis musi miec `is_approved = false`, wiec wymaga moderacji.

Zarzadzanie danymi jest przeznaczone dla zalogowanych uzytkownikow przypisanych w `wedding_admins`. Funkcja `public.is_wedding_admin(wedding_id)` sprawdza `auth.uid()`.

## Uruchomienie lokalne

Typowy przeplyw Supabase CLI:

```bash
supabase start
supabase db reset
```

`supabase db reset` uruchomi migracje i seed. Po resecie demo jest dostepne pod slugiem `nasze-wesele`.

## Konfiguracja admina

Seed nie tworzy uzytkownika Supabase Auth, bo lokalne i produkcyjne projekty maja inne identyfikatory kont. Po utworzeniu konta admina dodaj powiazanie:

```sql
insert into public.wedding_admins (wedding_id, user_id)
values (
  '11111111-1111-1111-1111-111111111111',
  '<auth-user-uuid>'
);
```

## Uwaga o polskich znakach

Pliki SQL celowo uzywaja ASCII w danych demo, zeby byly odporne na rozne ustawienia terminala i klientow SQL. Interfejs moze wyswietlac polskie znaki z danych produkcyjnych bez zmian w schemacie.
