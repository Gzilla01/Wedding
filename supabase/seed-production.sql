-- Clean production seed for Aleksandra & Pawel.
-- Run after all migrations in Supabase SQL Editor.

delete from public.weddings
where slug in ('aleksandra-pawel-2028', 'nasze-wesele');

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
  is_published,
  owner_email,
  public_url,
  plan_id,
  storage_limit_mb,
  video_limit_minutes,
  expires_at,
  privacy_level
) values (
  'aaaaaaaa-2028-4000-8000-000000000001',
  'aleksandra-pawel-2028',
  'Aleksandra i Pawel',
  '2028-06-17',
  '14:00',
  '16:00',
  'Miejsce ceremonii do uzupelnienia',
  'Sala weselna do uzupelnienia',
  'Cieszymy sie, ze bedziesz z nami. Tu znajdziesz najwazniejsze informacje o naszym weselu.',
  '2028-05-31',
  'kontakt@aleksandrapawel-2028.pl',
  '+48 500 100 200',
  true,
  'kontakt@aleksandrapawel-2028.pl',
  '/w/aleksandra-pawel-2028',
  'live',
  10240,
  30,
  '2028-12-31 23:59:59+01',
  'wedding_code'
);

insert into public.seating_tables (id, wedding_id, table_number, name, capacity, description)
select
  ('bbbbbbbb-2028-4000-8000-' || lpad(gs::text, 12, '0'))::uuid,
  'aaaaaaaa-2028-4000-8000-000000000001',
  gs,
  case when gs = 1 then 'Stol prezydialny' else 'Stolik ' || gs end,
  case when gs = 1 then 10 else 8 end,
  'Do uzupelnienia'
from generate_series(1, 10) as gs;

insert into public.schedule_items (wedding_id, starts_at, title, location, description, sort_order, is_public)
values
  ('aaaaaaaa-2028-4000-8000-000000000001', '2028-06-17 14:00:00+02', 'Ceremonia slubna', 'Do uzupelnienia', 'Szczegoly pojawia sie po uzupelnieniu panelu.', 10, true),
  ('aaaaaaaa-2028-4000-8000-000000000001', '2028-06-17 16:00:00+02', 'Przyjecie weselne', 'Do uzupelnienia', 'Szczegoly pojawia sie po uzupelnieniu panelu.', 20, true),
  ('aaaaaaaa-2028-4000-8000-000000000001', '2028-06-17 20:00:00+02', 'Tort weselny', 'Sala weselna', 'Godzina do potwierdzenia.', 30, true);

insert into public.faq_items (wedding_id, question, answer, category, sort_order, is_public)
values
  ('aaaaaaaa-2028-4000-8000-000000000001', 'Do kiedy potwierdzic obecnosc?', 'Prosimy o odpowiedz do 31 maja 2028.', 'RSVP', 10, true),
  ('aaaaaaaa-2028-4000-8000-000000000001', 'Gdzie znajde informacje o dojezdzie?', 'Adresy i wskazowki pojawia sie na tej stronie po uzupelnieniu przez pare.', 'Dojazd', 20, true),
  ('aaaaaaaa-2028-4000-8000-000000000001', 'Gdzie dodawac zdjecia?', 'Uzyj przycisku Dodaj zdjecia albo kodu QR.', 'Galeria', 30, true);

insert into public.wedding_admin_snapshots (wedding_id, data)
values (
  'aaaaaaaa-2028-4000-8000-000000000001',
  '{
    "wedding": {
      "bride": "Aleksandra",
      "groom": "Pawel",
      "date": "2028-06-17",
      "ceremonyTime": "14:00",
      "ceremonyAddress": "Miejsce ceremonii do uzupelnienia",
      "venueAddress": "Sala weselna do uzupelnienia",
      "welcomeText": "Cieszymy sie, ze bedziesz z nami. Tu znajdziesz najwazniejsze informacje o naszym weselu.",
      "contactPhone": "+48 500 100 200",
      "transportInfo": "Szczegoly transportu uzupelnimy blizej wesela."
    },
    "schedule": [
      { "id": "schedule-ceremony", "time": "14:00", "title": "Ceremonia slubna", "place": "Do uzupelnienia", "owner": "Aleksandra i Pawel", "status": "planned" },
      { "id": "schedule-party", "time": "16:00", "title": "Przyjecie weselne", "place": "Do uzupelnienia", "owner": "Aleksandra i Pawel", "status": "planned" },
      { "id": "schedule-cake", "time": "20:00", "title": "Tort weselny", "place": "Sala weselna", "owner": "Do uzupelnienia", "status": "planned" }
    ],
    "guests": [],
    "tables": [
      { "id": "table-1", "number": 1, "name": "Stol prezydialny", "shape": "head", "capacity": 10, "x": 50, "y": 16, "theme": "" },
      { "id": "table-2", "number": 2, "name": "Stolik 2", "shape": "round", "capacity": 8, "x": 24, "y": 40, "theme": "" },
      { "id": "table-3", "number": 3, "name": "Stolik 3", "shape": "round", "capacity": 8, "x": 50, "y": 42, "theme": "" },
      { "id": "table-4", "number": 4, "name": "Stolik 4", "shape": "round", "capacity": 8, "x": 76, "y": 40, "theme": "" },
      { "id": "table-5", "number": 5, "name": "Stolik 5", "shape": "round", "capacity": 8, "x": 35, "y": 66, "theme": "" },
      { "id": "table-6", "number": 6, "name": "Stolik 6", "shape": "round", "capacity": 8, "x": 65, "y": 66, "theme": "" }
    ],
    "roomElements": [
      { "id": "dance", "label": "Parkiet", "type": "dance", "x": 40, "y": 26, "w": 20, "h": 16 },
      { "id": "entry", "label": "Wejscie", "type": "entry", "x": 6, "y": 78, "w": 14, "h": 10 }
    ],
    "faqItems": [
      { "id": "faq-rsvp", "question": "Do kiedy potwierdzic obecnosc?", "answer": "Prosimy o odpowiedz do 31 maja 2028.", "active": true },
      { "id": "faq-photos", "question": "Gdzie dodawac zdjecia?", "answer": "Uzyj przycisku Dodaj zdjecia albo kodu QR.", "active": true }
    ],
    "qrInvites": [
      { "id": "qr-rsvp", "label": "RSVP", "target": "/rsvp", "scans": 0, "active": true },
      { "id": "qr-gallery", "label": "Dodaj zdjecia", "target": "/upload", "scans": 0, "active": true }
    ],
    "gallery": [],
    "planning": {
      "budgetTarget": 0,
      "tasks": [],
      "vendors": [],
      "expenses": [],
      "payments": [],
      "documents": [],
      "attachments": []
    },
    "theme": {
      "coupleName": "Aleksandra i Pawel",
      "themeId": "gold",
      "accentColor": "#2f7d6d",
      "coverStyle": "editorial",
      "accessMode": "code",
      "weddingCode": "AP2028",
      "publicRsvp": true,
      "galleryModeration": true,
      "showWholeRoomToGuests": false
    }
  }'::jsonb
);
