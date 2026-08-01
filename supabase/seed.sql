insert into public.weddings (
  id,
  slug,
  couple_names,
  wedding_date,
  ceremony_time,
  reception_time,
  ceremony_location,
  reception_location,
  hero_message,
  rsvp_deadline,
  contact_email,
  contact_phone,
  is_published
) values (
  '11111111-1111-1111-1111-111111111111',
  'nasze-wesele',
  'Anna i Michal',
  '2026-06-20',
  '14:00',
  '16:00',
  'Kosciol sw. Anny, Krakow',
  'Dworek Pod Lipami, Wieliczka',
  'Cieszymy sie, ze bedziecie z nami w tym dniu.',
  '2026-05-31',
  'anna.michal@example.com',
  '+48 500 100 200',
  true
) on conflict (id) do nothing;

insert into public.seating_tables (id, wedding_id, table_number, name, capacity, description)
select
  ('20000000-0000-0000-0000-' || lpad(gs::text, 12, '0'))::uuid,
  '11111111-1111-1111-1111-111111111111',
  gs,
  'Stolik ' || gs,
  10,
  case
    when gs = 1 then 'Rodzice i swiadkowie'
    when gs in (2, 3) then 'Rodzina'
    when gs in (4, 5, 6) then 'Przyjaciele'
    else 'Znajomi i dalsza rodzina'
  end
from generate_series(1, 10) as gs
on conflict (wedding_id, table_number) do nothing;

insert into public.households (id, wedding_id, name, invite_code, contact_email, contact_phone, address, note)
select
  ('30000000-0000-0000-0000-' || lpad(gs::text, 12, '0'))::uuid,
  '11111111-1111-1111-1111-111111111111',
  'Zaproszenie ' || gs,
  'ANNA-MICHAL-' || lpad(gs::text, 2, '0'),
  'gosc' || gs || '@example.com',
  '+48 600 ' || lpad((100000 + gs)::text, 6, '0'),
  'Adres demo ' || gs,
  case when gs % 9 = 0 then 'Potwierdzic transport' else null end
from generate_series(1, 45) as gs
on conflict (wedding_id, invite_code) do nothing;

with first_names as (
  select array[
    'Adam','Agnieszka','Aleksandra','Andrzej','Barbara','Bartosz','Beata','Cezary','Damian','Dorota',
    'Ewa','Filip','Grzegorz','Hanna','Hubert','Iwona','Jakub','Joanna','Kamil','Karolina',
    'Katarzyna','Krzysztof','Laura','Lukasz','Magdalena','Marcin','Marek','Marta','Mateusz','Monika',
    'Natalia','Pawel','Piotr','Renata','Robert','Sandra','Tomasz','Weronika','Wojciech','Zofia',
    'Jan','Maria','Michal','Anna','Julia','Patryk','Oliwia','Rafal','Sylwia','Tadeusz'
  ] as names
),
last_names as (
  select array[
    'Kowalski','Nowak','Wisniewski','Wojcik','Kowalczyk','Kaminski','Lewandowski','Zielinski','Szymanski','Wozniak',
    'Dabrowski','Kozlowski','Jankowski','Mazur','Kwiatkowski','Krawczyk','Piotrowski','Grabowski','Nowakowski','Pawlak'
  ] as names
)
insert into public.guests (
  id,
  wedding_id,
  household_id,
  seating_table_id,
  first_name,
  last_name,
  age_group,
  is_plus_one,
  rsvp_status,
  meal_preference,
  dietary_notes,
  song_request,
  message_to_couple
)
select
  ('40000000-0000-0000-0000-' || lpad(gs::text, 12, '0'))::uuid,
  '11111111-1111-1111-1111-111111111111',
  ('30000000-0000-0000-0000-' || lpad(ceil(gs / 2.0)::int::text, 12, '0'))::uuid,
  ('20000000-0000-0000-0000-' || lpad((((gs - 1) % 10) + 1)::text, 12, '0'))::uuid,
  (select names[((gs - 1) % array_length(names, 1)) + 1] from first_names),
  (select names[((gs - 1) % array_length(names, 1)) + 1] from last_names),
  case when gs in (17, 34, 51, 68, 85) then 'child'::public.guest_age_group else 'adult'::public.guest_age_group end,
  gs % 2 = 0,
  case
    when gs % 13 = 0 then 'declined'::public.rsvp_status
    when gs % 5 = 0 then 'pending'::public.rsvp_status
    else 'accepted'::public.rsvp_status
  end,
  case
    when gs % 11 = 0 then 'weganskie'
    when gs % 7 = 0 then 'wegetarianskie'
    when gs % 5 = 0 then 'dzieciece'
    else 'standard'
  end,
  case
    when gs % 14 = 0 then 'bez glutenu'
    when gs % 9 = 0 then 'bez laktozy'
    else null
  end,
  case when gs % 8 = 0 then 'Perfect - Nie placz Ewka' else null end,
  case when gs % 10 = 0 then 'Nie mozemy sie doczekac!' else null end
from generate_series(1, 90) as gs
on conflict (id) do nothing;

insert into public.schedule_items (wedding_id, starts_at, ends_at, title, location, description, sort_order, is_public)
values
  ('11111111-1111-1111-1111-111111111111', '2026-06-20 14:00:00+02', '2026-06-20 15:00:00+02', 'Ceremonia slubna', 'Kosciol sw. Anny', 'Prosba o przybycie 15 minut wczesniej.', 10, true),
  ('11111111-1111-1111-1111-111111111111', '2026-06-20 15:15:00+02', '2026-06-20 15:45:00+02', 'Przejazd na sale', 'Plac przed kosciolem', 'Bus i samochody ruszaja do Dworku Pod Lipami.', 20, true),
  ('11111111-1111-1111-1111-111111111111', '2026-06-20 16:00:00+02', '2026-06-20 16:15:00+02', 'Powitanie pary mlodej', 'Dworek Pod Lipami', 'Toast powitalny i przekaski.', 30, true),
  ('11111111-1111-1111-1111-111111111111', '2026-06-20 16:15:00+02', '2026-06-20 17:15:00+02', 'Obiad weselny', 'Sala glowna', 'Pierwszy wspolny posilek.', 40, true),
  ('11111111-1111-1111-1111-111111111111', '2026-06-20 17:30:00+02', '2026-06-20 17:45:00+02', 'Pierwszy taniec', 'Parkiet', 'Start zabawy tanecznej.', 50, true),
  ('11111111-1111-1111-1111-111111111111', '2026-06-20 20:00:00+02', '2026-06-20 20:20:00+02', 'Tort weselny', 'Sala glowna', 'Krojenie tortu weselnego.', 60, true),
  ('11111111-1111-1111-1111-111111111111', '2026-06-20 23:00:00+02', '2026-06-20 23:30:00+02', 'Oczepiny', 'Parkiet', 'Tradycyjne zabawy.', 70, true),
  ('11111111-1111-1111-1111-111111111111', '2026-06-21 02:00:00+02', '2026-06-21 02:10:00+02', 'Pierwszy transport powrotny', 'Glowne wejscie', 'Autobus do centrum i hoteli.', 80, true),
  ('11111111-1111-1111-1111-111111111111', '2026-06-21 04:00:00+02', '2026-06-21 04:10:00+02', 'Drugi transport powrotny', 'Glowne wejscie', 'Ostatni autobus powrotny.', 90, true)
on conflict do nothing;

insert into public.faq_items (wedding_id, question, answer, category, sort_order, is_public)
values
  ('11111111-1111-1111-1111-111111111111', 'Do kiedy potwierdzic obecnosc?', 'Prosimy o odpowiedz do 31 maja 2026.', 'RSVP', 10, true),
  ('11111111-1111-1111-1111-111111111111', 'Czy jest zapewniony parking?', 'Tak, przy sali znajduje sie bezplatny parking dla gosci.', 'Dojazd', 20, true),
  ('11111111-1111-1111-1111-111111111111', 'Czy mozna przyjsc z dziecmi?', 'Tak, przygotujemy kilka miejsc i menu dzieciece.', 'Goscie', 30, true),
  ('11111111-1111-1111-1111-111111111111', 'Czy bedzie transport z Krakowa?', 'Planujemy bus po ceremonii oraz powrot w nocy. Szczegoly podamy w komunikatach.', 'Transport', 40, true),
  ('11111111-1111-1111-1111-111111111111', 'Jak zglosic diete specjalna?', 'Wpisz preferencje w formularzu RSVP albo skontaktuj sie z nami telefonicznie.', 'Menu', 50, true)
on conflict do nothing;

insert into public.announcements (wedding_id, title, body, tone, published_at, expires_at)
values
  ('11111111-1111-1111-1111-111111111111', 'Strona weselna jest juz dostepna', 'Bedziemy tu publikowac najwazniejsze informacje organizacyjne.', 'success', '2026-05-01 10:00:00+02', null),
  ('11111111-1111-1111-1111-111111111111', 'Przypomnienie o RSVP', 'Dajcie nam znac do 31 maja, czy bedziecie z nami.', 'important', '2026-05-15 09:00:00+02', '2026-06-01 00:00:00+02'),
  ('11111111-1111-1111-1111-111111111111', 'Transport po ceremonii', 'Bus do Dworku Pod Lipami odjedzie spod kosciola okolo 15:15.', 'info', '2026-06-01 12:00:00+02', null)
on conflict do nothing;

insert into public.guestbook_entries (wedding_id, author_name, message, is_approved, created_at)
values
  ('11111111-1111-1111-1111-111111111111', 'Kasia i Tomek', 'Kochani, zyczymy Wam duzo radosci i pieknych wspolnych lat.', true, '2026-05-04 18:20:00+02'),
  ('11111111-1111-1111-1111-111111111111', 'Rodzice', 'Niech ten dzien bedzie poczatkiem cudownej drogi.', true, '2026-05-05 11:30:00+02'),
  ('11111111-1111-1111-1111-111111111111', 'Magda', 'Odliczamy dni do wspolnej zabawy!', true, '2026-05-08 20:10:00+02'),
  ('11111111-1111-1111-1111-111111111111', 'Pawel', 'Wszystkiego najlepszego na nowej drodze zycia.', true, '2026-05-12 09:45:00+02'),
  ('11111111-1111-1111-1111-111111111111', 'Anonimowy gosc', 'Wpis oczekujacy na moderacje.', false, '2026-05-13 14:00:00+02')
on conflict do nothing;
