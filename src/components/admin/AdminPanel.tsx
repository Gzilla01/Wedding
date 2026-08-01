"use client";

import { FormEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  createAdminId,
  demoWeddingAdminData,
  emptyGalleryItem,
  emptyFaqItem,
  emptyGuest,
  emptyPlanningAttachment,
  emptyPlanningExpense,
  emptyPlanningPayment,
  emptyPlanningTask,
  emptyQrInvite,
  emptyRoomElement,
  emptyScheduleItem,
  emptyTable,
  emptyVendor,
  emptyWeddingDocument,
  guestFullName,
  type AdminSection,
  type FaqItem,
  type GalleryItem,
  type Guest,
  type PlanningAttachment,
  type PlanningData,
  type PlanningExpense,
  type PlanningPayment,
  type PlanningTask,
  type QrInvite,
  type RoomElement,
  type ScheduleItem,
  type TablePlan,
  type ThemeSettings,
  type Vendor,
  type WeddingAdminData,
  type WeddingDocument,
  type WeddingInfo,
} from "@/lib/admin-data";
import { useWeddingDataStore } from "@/lib/wedding-data-store";

const sections: Array<{ id: AdminSection; label: string }> = [
  { id: "dashboard", label: "Start" },
  { id: "wedding", label: "Dane wesela" },
  { id: "locations", label: "Miejsca" },
  { id: "schedule", label: "Harmonogram" },
  { id: "guests", label: "Goscie" },
  { id: "tables", label: "Stoliki" },
  { id: "faq", label: "FAQ" },
  { id: "qr", label: "QR" },
  { id: "publish", label: "Publikacja" },
  { id: "gallery", label: "Galeria" },
  { id: "room", label: "Mapa sali" },
  { id: "planning", label: "Planowanie" },
  { id: "accounts", label: "Konta" },
];

const statusLabel: Record<string, string> = {
  planned: "Planowane",
  confirmed: "Potwierdzone",
  "needs-review": "Do sprawdzenia",
  invited: "Zaproszony",
  declined: "Odmowa",
  pending: "W moderacji",
  approved: "Zatwierdzone",
  rejected: "Odrzucone",
  todo: "Do zrobienia",
  doing: "W toku",
  done: "Gotowe",
  blocked: "Blokada",
  lead: "Kontakt",
  shortlisted: "Wybrany",
  booked: "Zarezerwowany",
  missing: "Brak",
  draft: "Robocza",
  signed: "Podpisana",
  needed: "Potrzebny",
  uploaded: "Wgrany",
  archived: "Archiwum",
};

export function AdminPanel({ storageKey, initialData = demoWeddingAdminData, remoteSlug }: { storageKey?: string; initialData?: WeddingAdminData; remoteSlug?: string }) {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [data, setData] = useWeddingDataStore(storageKey, initialData, { remoteSlug });
  const savedAt = "auto";

  const stats = useMemo(() => {
    const confirmedGuests = data.guests.filter((guest) => guest.status === "confirmed").length;
    const declinedGuests = data.guests.filter((guest) => guest.status === "declined").length;
    const invitedGuests = data.guests.filter((guest) => guest.status === "invited").length;
    const pendingPhotos = data.gallery.filter((item) => item.status === "pending").length;
    const totalSeats = data.tables.reduce((sum, table) => sum + table.capacity, 0);
    const assignedGuests = data.guests.filter((guest) => guest.tableId).length;
    const unassignedGuests = data.guests.length - assignedGuests;
    const allergyCount = data.guests.filter((guest) => guest.dietaryNotes.trim()).length;
    const accommodationCount = data.guests.filter((guest) => guest.accommodation.trim()).length;
    const transportCount = data.guests.filter((guest) => guest.transport).length;
    return { confirmedGuests, declinedGuests, invitedGuests, pendingPhotos, totalSeats, assignedGuests, unassignedGuests, allergyCount, accommodationCount, transportCount };
  }, [data]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(194,164,93,0.18),transparent_28rem),linear-gradient(180deg,#fffaf4,#f8f5ef)] text-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-[#d8bd72]/30 bg-white/82 p-5 shadow-xl shadow-stone-900/5 backdrop-blur lg:flex lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-[#d8bd72]/35 bg-[#fff7ed] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Panel pary mlodej</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">{data.wedding.bride} i {data.wedding.groom}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Spokojne centrum przygotowan: dane wesela, goscie, stoliki, plan sali, QR, zdjecia i sprawy organizacyjne w jednym miejscu.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:mt-0">
            <Metric label="Goscie" value={data.guests.length.toString()} />
            <Metric label="Bez stolika" value={stats.unassignedGuests.toString()} />
            <Metric label="Miejsca" value={stats.totalSeats.toString()} />
            <Metric label="Zapisano" value={savedAt} />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-2 overflow-x-auto rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-[#d8bd72]/20 lg:flex-col lg:overflow-visible">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onPointerDown={() => setActiveSection(section.id)}
                onClick={() => setActiveSection(section.id)}
                className={`h-11 shrink-0 rounded-md px-4 text-left text-sm font-medium transition ${
                  activeSection === section.id ? "bg-[#2f5d50] text-white shadow-md" : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-[#fff7ed]"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <section className="min-w-0">
            {activeSection === "dashboard" && <Dashboard data={data} stats={stats} setActiveSection={setActiveSection} />}
            {activeSection === "wedding" && <WeddingManager wedding={data.wedding} onChange={(wedding) => setData((current) => ({ ...current, wedding }))} />}
            {activeSection === "locations" && <LocationsManager wedding={data.wedding} onChange={(wedding) => setData((current) => ({ ...current, wedding }))} />}
            {activeSection === "schedule" && <ScheduleManager items={data.schedule} onChange={(schedule) => setData((current) => ({ ...current, schedule }))} />}
            {activeSection === "guests" && <GuestManager guests={data.guests} tables={data.tables} onChange={(guests) => setData((current) => ({ ...current, guests }))} />}
            {activeSection === "tables" && <TableManager tables={data.tables} guests={data.guests} onChange={(tables, guests = data.guests) => setData((current) => ({ ...current, tables, guests }))} />}
            {activeSection === "faq" && <FaqManager items={data.faqItems} onChange={(faqItems) => setData((current) => ({ ...current, faqItems }))} />}
            {activeSection === "publish" && <PublicationManager settings={data.theme} wedding={data.wedding} onChange={(theme) => setData((current) => ({ ...current, theme }))} />}
            {activeSection === "room" && <RoomManager tables={data.tables} guests={data.guests} elements={data.roomElements} onTablesChange={(tables) => setData((current) => ({ ...current, tables }))} onGuestsChange={(guests) => setData((current) => ({ ...current, guests }))} onElementsChange={(roomElements) => setData((current) => ({ ...current, roomElements }))} />}
            {activeSection === "planning" && <PlanningManager planning={data.planning} onChange={(planning) => setData((current) => ({ ...current, planning }))} />}
            {activeSection === "accounts" && <AccountsManager />}
            {activeSection === "qr" && <QrManager items={data.qrInvites} onChange={(qrInvites) => setData((current) => ({ ...current, qrInvites }))} />}
            {activeSection === "gallery" && <GalleryManager items={data.gallery} onChange={(gallery) => setData((current) => ({ ...current, gallery }))} />}
            {activeSection === "theme" && <ThemeManager settings={data.theme} onChange={(theme) => setData((current) => ({ ...current, theme }))} onReset={() => setData(initialData)} />}
          </section>
        </div>
      </div>
    </main>
  );
}

function Dashboard({
  data,
  stats,
  setActiveSection,
}: {
  data: WeddingAdminData;
  stats: { confirmedGuests: number; declinedGuests: number; invitedGuests: number; pendingPhotos: number; totalSeats: number; assignedGuests: number; unassignedGuests: number; allergyCount: number; accommodationCount: number; transportCount: number };
  setActiveSection: (section: AdminSection) => void;
}) {
  const rsvpAnswered = stats.confirmedGuests + stats.declinedGuests;
  const rsvpRate = data.guests.length ? Math.round((rsvpAnswered / data.guests.length) * 100) : 0;
  const cards = [
    { label: "Goscie", value: data.guests.length, target: "guests" as const },
    { label: "RSVP", value: `${rsvpRate}%`, target: "guests" as const },
    { label: "Stoliki", value: data.tables.length, target: "tables" as const },
    { label: "Bez stolika", value: stats.unassignedGuests, target: "guests" as const },
    { label: "Diety i alergie", value: stats.allergyCount, target: "guests" as const },
    { label: "FAQ", value: data.faqItems.filter((item) => item.active).length, target: "faq" as const },
    { label: "QR", value: data.qrInvites.filter((item) => item.active).length, target: "qr" as const },
    { label: "Foto czeka", value: stats.pendingPhotos, target: "gallery" as const },
  ];
  const overbookedTables = data.tables
    .map((table) => ({ table, assigned: data.guests.filter((guest) => guest.tableId === table.id).length }))
    .filter((entry) => entry.assigned > entry.table.capacity);
  const checklist = [
    { label: "Dane wesela", missing: "dane pary i data", done: Boolean(data.wedding.bride && data.wedding.groom && data.wedding.date), target: "wedding" as const },
    { label: "Miejsca", missing: "lokalizacja sali lub ceremonii", done: Boolean(data.wedding.ceremonyAddress && data.wedding.venueAddress), target: "locations" as const },
    { label: "Harmonogram", missing: "plan dnia", done: data.schedule.length >= 5, target: "schedule" as const },
    { label: "Goscie", missing: "lista gosci", done: data.guests.length > 0, target: "guests" as const },
    { label: "Stoliki", missing: "przypisania do stolikow", done: data.guests.length > 0 && stats.unassignedGuests === 0 && overbookedTables.length === 0, target: "tables" as const },
    { label: "FAQ", missing: "pytania i odpowiedzi", done: data.faqItems.some((item) => item.active && item.question.trim() && item.answer.trim()), target: "faq" as const },
    { label: "QR", missing: "kody QR", done: data.qrInvites.some((item) => item.active), target: "qr" as const },
    { label: "Publikacja", missing: "publikacja i dostep dla gosci", done: data.theme.accessMode === "public" || Boolean(data.theme.weddingCode.trim()), target: "publish" as const },
    { label: "Galeria", missing: "ustawienia galerii", done: data.theme.galleryModeration || data.gallery.length > 0, target: "gallery" as const },
  ];
  const readyCount = checklist.filter((item) => item.done).length;
  const readiness = Math.round((readyCount / checklist.length) * 100);
  const missing = checklist.filter((item) => !item.done).map((item) => item.missing);
  const issues = [
    ...(data.guests.length === 0 ? ["Brakuje listy gosci"] : []),
    ...(stats.invitedGuests > 0 ? [`${stats.invitedGuests} gosci bez odpowiedzi RSVP`] : []),
    ...(stats.unassignedGuests > 0 ? [`${stats.unassignedGuests} gosci bez stolika`] : []),
    ...overbookedTables.map((entry) => `Stolik ${entry.table.number} ma ${entry.assigned}/${entry.table.capacity} osob`),
    ...(stats.pendingPhotos > 0 ? [`${stats.pendingPhotos} zdjec czeka na moderacje`] : []),
  ];

  return (
    <div className="grid gap-4">
      <Panel title="Gotowosc do publikacji" description="Najpierw dopnij te elementy. To jest widok dla pary: ma szybko pokazac, czy strona jest gotowa dla gosci.">
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-[1.6rem] bg-[#234d43] p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">Status strony</p>
            <p className="mt-3 text-5xl font-semibold">{readiness}%</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[#d8bd72]" style={{ width: `${readiness}%` }} />
            </div>
            <p className="mt-4 text-sm leading-6 text-white/72">
              Strona gotowa w {readiness}%. Brakuje: {missing.length > 0 ? missing.slice(0, 3).join(", ") : "niczego krytycznego"}.
            </p>
          </div>
          <div className="grid gap-3">
            {checklist.map((item) => (
              <button key={item.label} type="button" onClick={() => setActiveSection(item.target)} className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 ${item.done ? "border-emerald-200 bg-emerald-50/70" : "border-amber-200 bg-amber-50/80"}`}>
                <span className="font-medium text-zinc-800">{item.label}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.done ? "bg-emerald-600 text-white" : "bg-amber-200 text-amber-900"}`}>{item.done ? "Gotowe" : "Do uzupelnienia"}</span>
              </button>
            ))}
          </div>
        </div>
      </Panel>
      {issues.length > 0 && (
        <Panel title="Wymaga uwagi">
          <div className="grid gap-2 md:grid-cols-2">
            {issues.slice(0, 6).map((issue) => <div key={issue} className="rounded-2xl border border-amber-200 bg-[#fff8e6] px-4 py-3 text-sm font-medium text-amber-950">{issue}</div>)}
          </div>
        </Panel>
      )}
      <Panel title="RSVP w skrocie" description="Prosty obraz tego, ile osob potwierdzilo obecnosc i ile odpowiedzi trzeba jeszcze zebrac.">
        <div className="grid gap-3 md:grid-cols-4">
          <Metric label="Potwierdzam" value={stats.confirmedGuests.toString()} />
          <Metric label="Nie bede" value={stats.declinedGuests.toString()} />
          <Metric label="Brak odpowiedzi" value={stats.invitedGuests.toString()} />
          <Metric label="Odpowiedzi" value={`${rsvpRate}%`} />
        </div>
      </Panel>
      <div className="grid gap-3 md:grid-cols-4">
        {cards.map((card) => (
          <button key={card.label} type="button" onClick={() => setActiveSection(card.target)} className="rounded-lg bg-white p-4 text-left ring-1 ring-zinc-200 transition hover:-translate-y-0.5 hover:shadow-sm">
            <span className="text-sm text-zinc-500">{card.label}</span>
            <strong className="mt-2 block text-3xl font-semibold">{card.value}</strong>
          </button>
        ))}
      </div>
      <Panel title="Szybki podglad sali">
        <RoomCanvas tables={data.tables} guests={data.guests} elements={data.roomElements} onTableMove={() => undefined} onElementMove={() => undefined} readonly />
      </Panel>
    </div>
  );
}

function WeddingManager({ wedding, onChange }: { wedding: WeddingInfo; onChange: (wedding: WeddingInfo) => void }) {
  const [draft, setDraft] = useState(wedding);
  return (
    <Panel title="Dane wesela" description="Tu para uzupelnia tylko podstawy: imiona, date, kontakt i krotkie powitanie. Miejsca sa w osobnym kroku.">
      <form onSubmit={(event) => { event.preventDefault(); onChange(draft); }} className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Imie panny mlodej"><input className={inputClass} value={draft.bride} onChange={(e) => setDraft({ ...draft, bride: e.target.value })} /></Field>
          <Field label="Imie pana mlodego"><input className={inputClass} value={draft.groom} onChange={(e) => setDraft({ ...draft, groom: e.target.value })} /></Field>
          <Field label="Data"><input className={inputClass} type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></Field>
          <Field label="Godzina ceremonii"><input className={inputClass} type="time" value={draft.ceremonyTime} onChange={(e) => setDraft({ ...draft, ceremonyTime: e.target.value })} /></Field>
        </div>
        <Field label="Telefon kontaktowy"><input className={inputClass} value={draft.contactPhone} onChange={(e) => setDraft({ ...draft, contactPhone: e.target.value })} /></Field>
        <Field label="Powitanie"><textarea className={inputClass} value={draft.welcomeText} onChange={(e) => setDraft({ ...draft, welcomeText: e.target.value })} /></Field>
        <button type="submit" className={primaryButtonClass}>Zapisz dane wesela</button>
      </form>
    </Panel>
  );
}

function LocationsManager({ wedding, onChange }: { wedding: WeddingInfo; onChange: (wedding: WeddingInfo) => void }) {
  const [draft, setDraft] = useState(wedding);
  return (
    <Panel title="Miejsca i dojazd" description="To sa informacje, ktore gosc najczesciej sprawdza w telefonie tuz przed wyjazdem.">
      <form onSubmit={(event) => { event.preventDefault(); onChange(draft); }} className="grid gap-4">
        <Field label="Adres ceremonii"><input className={inputClass} value={draft.ceremonyAddress} onChange={(e) => setDraft({ ...draft, ceremonyAddress: e.target.value })} placeholder="Kosciol / USC / plener" /></Field>
        <Field label="Adres sali"><input className={inputClass} value={draft.venueAddress} onChange={(e) => setDraft({ ...draft, venueAddress: e.target.value })} placeholder="Nazwa sali i adres" /></Field>
        <Field label="Transport i parking"><textarea className={`${inputClass} min-h-28`} value={draft.transportInfo} onChange={(e) => setDraft({ ...draft, transportInfo: e.target.value })} placeholder="Np. autobus o 02:00 i 04:00, parking przy sali, kontakt do kierowcy." /></Field>
        <div className="rounded-2xl border border-[#d8bd72]/25 bg-[#fffaf4] p-4 text-sm leading-6 text-zinc-600">
          <strong className="text-zinc-900">Podpowiedz dla pary:</strong> wpisz pelne adresy tak, jak maja pojawic sie w nawigacji. Gosc nie powinien zgadywac, gdzie zaparkowac albo skad odjezdza autobus.
        </div>
        <button type="submit" className={primaryButtonClass}>Zapisz miejsca</button>
      </form>
    </Panel>
  );
}

function FaqManager({ items, onChange }: { items: FaqItem[]; onChange: (items: FaqItem[]) => void }) {
  const [draft, setDraft] = useState(emptyFaqItem);
  const [editingId, setEditingId] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.question.trim() || !draft.answer.trim()) return;
    onChange(editingId ? items.map((item) => (item.id === editingId ? { ...draft, id: editingId } : item)) : [...items, { ...draft, id: createAdminId("faq") }]);
    setDraft(emptyFaqItem);
    setEditingId(null);
  }

  return (
    <CrudLayout title="FAQ dla gosci" description="Najlepsze FAQ odpowiada na pytania, ktore para dostalaby SMS-em w dniu wesela." form={
      <form onSubmit={submit} className="grid gap-3">
        <Field label="Pytanie"><input className={inputClass} value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} placeholder="Czy bedzie parking?" /></Field>
        <Field label="Odpowiedz"><textarea className={`${inputClass} min-h-28`} value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} placeholder="Tak, parking jest przy sali od strony..." /></Field>
        <Toggle label="Pokaz na stronie goscia" checked={draft.active} onChange={(active) => setDraft({ ...draft, active })} />
        <FormActions editing={Boolean(editingId)} onCancel={() => { setDraft(emptyFaqItem); setEditingId(null); }} />
      </form>
    }>
      <DataList items={items} render={(item) => (
        <Row key={item.id}>
          <div>
            <p className="font-medium">{item.question}</p>
            <p className="mt-1 text-sm leading-6 text-zinc-500">{item.answer}</p>
          </div>
          <Badge tone={item.active ? "default" : "danger"}>{item.active ? "Widoczne" : "Ukryte"}</Badge>
          <RowActions onEdit={() => { setDraft(item); setEditingId(item.id); }} onDelete={() => onChange(items.filter((entry) => entry.id !== item.id))} />
        </Row>
      )} />
    </CrudLayout>
  );
}

function PublicationManager({ settings, wedding, onChange }: { settings: ThemeSettings; wedding: WeddingInfo; onChange: (settings: ThemeSettings) => void }) {
  const [draft, setDraft] = useState(settings);
  const publicUrl = typeof window === "undefined" ? "/" : window.location.origin;
  return (
    <Panel title="Publikacja i dostep" description="Ostatni krok przed wyslaniem linku gosciom i drukiem QR.">
      <form onSubmit={(event) => { event.preventDefault(); onChange(draft); }} className="grid gap-4">
        <div className="rounded-2xl bg-[#234d43] p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Podglad linku</p>
          <p className="mt-2 break-all text-lg font-semibold">{publicUrl}</p>
          <p className="mt-2 text-sm text-white/70">{wedding.bride} i {wedding.groom} | {wedding.date || "data do uzupelnienia"}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nazwa strony"><input className={inputClass} value={draft.coupleName} onChange={(e) => setDraft({ ...draft, coupleName: e.target.value })} /></Field>
          <Field label="Tryb dostepu"><select className={inputClass} value={draft.accessMode} onChange={(e) => setDraft({ ...draft, accessMode: e.target.value as ThemeSettings["accessMode"] })}><option value="public">Publiczny link</option><option value="code">Kod z zaproszenia</option></select></Field>
          <Field label="Kod wesela"><input className={inputClass} value={draft.weddingCode} onChange={(e) => setDraft({ ...draft, weddingCode: e.target.value.toUpperCase() })} placeholder="AP2028" /></Field>
          <Field label="Motyw"><select className={inputClass} value={draft.themeId} onChange={(e) => setDraft({ ...draft, themeId: e.target.value as ThemeSettings["themeId"] })}><option value="gold">Eleganckie zloto</option><option value="rustic">Rustykalne wesele</option><option value="white">Minimalistyczna biel</option><option value="boho">Boho</option><option value="green">Butelkowa zielen</option></select></Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Toggle label="RSVP widoczne dla gosci" checked={draft.publicRsvp} onChange={(publicRsvp) => setDraft({ ...draft, publicRsvp })} />
          <Toggle label="Moderacja galerii" checked={draft.galleryModeration} onChange={(galleryModeration) => setDraft({ ...draft, galleryModeration })} />
          <Toggle label="Pokaz cala sale gosciom" checked={draft.showWholeRoomToGuests} onChange={(showWholeRoomToGuests) => setDraft({ ...draft, showWholeRoomToGuests })} />
        </div>
        <button type="submit" className={primaryButtonClass}>Zapisz publikacje</button>
      </form>
    </Panel>
  );
}

function ScheduleManager({ items, onChange }: { items: ScheduleItem[]; onChange: (items: ScheduleItem[]) => void }) {
  const [draft, setDraft] = useState(emptyScheduleItem);
  const [editingId, setEditingId] = useState<string | null>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onChange(editingId ? items.map((item) => (item.id === editingId ? { ...draft, id: editingId } : item)) : [...items, { ...draft, id: createAdminId("schedule") }]);
    setDraft(emptyScheduleItem);
    setEditingId(null);
  }
  return (
    <CrudLayout title="Harmonogram" description="Dodawaj, ukrywaj w przyszlosci i edytuj punkty dnia." form={
      <form onSubmit={submit} className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Godzina"><input className={inputClass} type="time" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} /></Field>
          <Field label="Status"><select className={inputClass} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as ScheduleItem["status"] })}><option value="planned">Planowane</option><option value="confirmed">Potwierdzone</option><option value="needs-review">Do sprawdzenia</option></select></Field>
        </div>
        <Field label="Tytul"><input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Miejsce"><input className={inputClass} value={draft.place} onChange={(e) => setDraft({ ...draft, place: e.target.value })} /></Field>
          <Field label="Opiekun"><input className={inputClass} value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} /></Field>
        </div>
        <FormActions editing={Boolean(editingId)} onCancel={() => { setDraft(emptyScheduleItem); setEditingId(null); }} />
      </form>
    }>
      <DataList items={items} render={(item) => <Row key={item.id}><div><p className="font-medium">{item.time} - {item.title}</p><p className="text-sm text-zinc-500">{item.place} / {item.owner}</p></div><Badge>{statusLabel[item.status]}</Badge><RowActions onEdit={() => { setDraft(item); setEditingId(item.id); }} onDelete={() => onChange(items.filter((entry) => entry.id !== item.id))} /></Row>} />
    </CrudLayout>
  );
}

function GuestManager({ guests, tables, onChange }: { guests: Guest[]; tables: TablePlan[]; onChange: (guests: Guest[]) => void }) {
  const [draft, setDraft] = useState(emptyGuest);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Guest["status"] | "unassigned" | "diet" | "transport" | "hotel" | "children">("all");
  const [tableFilter, setTableFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const selectedGuests = guests.filter((guest) => selectedIds.includes(guest.id));
  const visibleGuests = guests.filter((guest) => {
    const haystack = `${guestFullName(guest)} ${guest.companion} ${guest.group} ${guest.dietaryNotes} ${guest.accommodation} ${guest.note}`.toLowerCase();
    const matchesText = haystack.includes(filter.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      guest.status === statusFilter ||
      (statusFilter === "unassigned" && !guest.tableId) ||
      (statusFilter === "diet" && Boolean(guest.dietaryNotes.trim())) ||
      (statusFilter === "transport" && guest.transport) ||
      (statusFilter === "hotel" && Boolean(guest.accommodation.trim())) ||
      (statusFilter === "children" && guest.child);
    const matchesTable = tableFilter === "all" || (tableFilter === "none" ? !guest.tableId : guest.tableId === tableFilter);
    return matchesText && matchesStatus && matchesTable;
  });
  const assignedCount = guests.filter((guest) => guest.tableId).length;
  const totalSeats = tables.reduce((sum, table) => sum + table.capacity, 0);
  const overbookedTables = tables.filter((table) => guests.filter((guest) => guest.tableId === table.id).length > table.capacity);
  const dietCount = guests.filter((guest) => guest.dietaryNotes.trim()).length;
  const groups = Array.from(new Set(guests.map((guest) => guest.group).filter(Boolean))).sort();
  const householdCount = groups.length;
  const confirmedCount = guests.filter((guest) => guest.status === "confirmed").length;
  const declinedCount = guests.filter((guest) => guest.status === "declined").length;
  const invitedCount = guests.filter((guest) => guest.status === "invited").length;
  const responseRate = guests.length ? Math.round(((confirmedCount + declinedCount) / guests.length) * 100) : 0;
  const duplicateKeys = new Set(
    guests
      .map((guest) => normalizeGuestKey(guest))
      .filter((key, _index, keys) => key && keys.filter((entry) => entry === key).length > 1)
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.firstName.trim() || !draft.lastName.trim()) return;
    const companionName = draft.companion.trim();
    const nextGuest = { ...draft, companion: "", token: editingId ? guests.find((guest) => guest.id === editingId)?.token ?? createAdminId("token") : createAdminId("token") };

    if (editingId) {
      onChange(guests.map((guest) => (guest.id === editingId ? { ...nextGuest, id: editingId } : guest)));
    } else {
      const createdMainGuest = { ...nextGuest, id: createAdminId("guest") };
      const nextGuests = [...guests, createdMainGuest];
      if (companionName) nextGuests.push(createCompanionGuest(createdMainGuest, companionName, nextGuests));
      onChange(nextGuests);
    }
    setDraft(emptyGuest);
    setEditingId(null);
    setShowAdvanced(false);
  }

  function updateGuest(id: string, patch: Partial<Guest>) {
    onChange(guests.map((guest) => (guest.id === id ? { ...guest, ...patch } : guest)));
  }

  function removeGuest(id: string) {
    onChange(guests.filter((guest) => guest.id !== id));
    setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
  }

  function setSelection(id: string, selected: boolean) {
    setSelectedIds(selected ? Array.from(new Set([...selectedIds, id])) : selectedIds.filter((selectedId) => selectedId !== id));
  }

  function selectVisible() {
    setSelectedIds(Array.from(new Set([...selectedIds, ...visibleGuests.map((guest) => guest.id)])));
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  function bulkPatch(patch: Partial<Guest>) {
    if (!selectedIds.length) return;
    onChange(guests.map((guest) => selectedIds.includes(guest.id) ? { ...guest, ...patch } : guest));
  }

  function bulkAssignTable(tableId: string) {
    if (!selectedIds.length) return;
    if (!tableId) {
      bulkPatch({ tableId: "", seat: 1 });
      return;
    }
    const taken = guests.filter((guest) => guest.tableId === tableId && !selectedIds.includes(guest.id)).map((guest) => guest.seat);
    let cursor = 1;
    onChange(guests.map((guest) => {
      if (!selectedIds.includes(guest.id)) return guest;
      while (taken.includes(cursor)) cursor += 1;
      const seat = cursor;
      taken.push(seat);
      cursor += 1;
      return { ...guest, tableId, seat };
    }));
  }

  function exportVisibleGuests() {
    const header = ["imie", "nazwisko", "osoba_towarzyszaca", "grupa", "status", "stolik", "miejsce", "dieta_alergie", "dziecko", "nocleg", "transport", "notatka"];
    const rows = visibleGuests.map((guest) => {
      const table = tables.find((entry) => entry.id === guest.tableId);
      return [
        guest.firstName,
        guest.lastName,
        guest.companion,
        guest.group,
        statusLabel[guest.status],
        table ? `${table.number}. ${table.name}` : "",
        guest.seat.toString(),
        guest.dietaryNotes,
        guest.child ? "tak" : "nie",
        guest.accommodation,
        guest.transport ? "tak" : "nie",
        guest.note,
      ];
    });
    downloadTextFile("goscie-widoczni.csv", [header, ...rows].map((row) => row.map(csvCell).join(";")).join("\n"));
  }

  function clearVisibleTables() {
    if (!visibleGuests.length) return;
    const visibleIds = new Set(visibleGuests.map((guest) => guest.id));
    onChange(guests.map((guest) => visibleIds.has(guest.id) ? { ...guest, tableId: "", seat: 1 } : guest));
    clearSelection();
  }

  function createCompanionGuest(mainGuest: Guest, companionName: string, currentGuests: Guest[]): Guest {
    const { firstName, lastName } = splitGuestName(companionName, mainGuest.lastName);
    const takenSeats = currentGuests.filter((guest) => guest.tableId === mainGuest.tableId).map((guest) => guest.seat);
    const table = tables.find((item) => item.id === mainGuest.tableId);
    const nextSeat = mainGuest.tableId
      ? Array.from({ length: Math.max(table?.capacity ?? 12, takenSeats.length + 1) }, (_, index) => index + 1).find((seat) => !takenSeats.includes(seat)) ?? takenSeats.length + 1
      : 1;

    return {
      ...emptyGuest,
      id: createAdminId("guest"),
      firstName,
      lastName,
      group: mainGuest.group,
      status: mainGuest.status,
      tableId: mainGuest.tableId,
      seat: nextSeat,
      accommodation: mainGuest.accommodation,
      transport: mainGuest.transport,
      note: `Osoba towarzyszaca: ${guestFullName(mainGuest)}`,
      token: createAdminId("token"),
    };
  }

  function convertCompanionNotes() {
    const nextGuests: Guest[] = [];
    guests.forEach((guest) => {
      const companionName = guest.companion.trim();
      nextGuests.push({ ...guest, companion: "" });
      if (companionName) nextGuests.push(createCompanionGuest(guest, companionName, [...nextGuests, ...guests.filter((entry) => entry.id !== guest.id)]));
    });
    onChange(nextGuests);
  }

  function assignNextSeat(guestId: string, tableId: string) {
    if (!tableId) {
      updateGuest(guestId, { tableId: "", seat: 1 });
      return;
    }
    const table = tables.find((item) => item.id === tableId);
    const taken = guests.filter((guest) => guest.tableId === tableId && guest.id !== guestId).map((guest) => guest.seat);
    const nextSeat = Array.from({ length: table?.capacity ?? 30 }, (_, index) => index + 1).find((seat) => !taken.includes(seat)) ?? taken.length + 1;
    updateGuest(guestId, { tableId, seat: nextSeat });
  }

  function importText(value: string) {
    const tableSeatCounters = new Map<string, number>();
    const existingKeys = new Set(guests.map(normalizeGuestKey).filter(Boolean));
    const importKeys = new Set<string>();
    let skipped = 0;
    const imported = value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const parts = line.split(/[;,]/).map((part) => part.trim());
        const [firstName = "", lastName = "", tableNumber = "", group = "Import", rawStatus = "confirmed", dietaryNotes = "", accommodation = "", transport = ""] = parts;
        const table = tables.find((item) => item.number === Number(tableNumber) || item.name.toLowerCase() === tableNumber.toLowerCase());
        const tableCounterKey = table?.id ?? "none";
        const nextSeat = (tableSeatCounters.get(tableCounterKey) ?? guests.filter((guest) => guest.tableId === table?.id).length) + 1;
        tableSeatCounters.set(tableCounterKey, nextSeat);
        const importedStatus: Guest["status"] = rawStatus === "declined" || rawStatus === "invited" ? rawStatus : "confirmed";
        const importedGuest = {
          ...emptyGuest,
          id: createAdminId(`import-${index}`),
          firstName,
          lastName,
          group,
          status: importedStatus,
          tableId: table?.id ?? "",
          seat: table ? nextSeat : 1,
          dietaryNotes,
          accommodation,
          transport: ["tak", "true", "1", "yes"].includes(transport.toLowerCase()),
          token: createAdminId("token"),
        };
        const key = normalizeGuestKey(importedGuest);
        if (!key || existingKeys.has(key) || importKeys.has(key)) {
          skipped += 1;
          return null;
        }
        importKeys.add(key);
        return importedGuest;
      })
      .filter((guest): guest is Guest => Boolean(guest && guest.firstName && guest.lastName));
    if (imported.length) onChange([...guests, ...imported]);
    setImportMessage(`Zaimportowano ${imported.length} osob${skipped ? `, pominieto ${skipped} duplikatow lub pustych wierszy` : ""}.`);
  }

  return (
    <div className="grid gap-4">
      <Panel title="Goscie" description="Szybko dodawaj, filtruj, przypisuj do stolikow i wychwytuj problemy przed drukiem planu sali.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <Metric label="Wszyscy" value={guests.length.toString()} />
          <Metric label="Potwierdzeni" value={confirmedCount.toString()} />
          <Metric label="Nie beda" value={declinedCount.toString()} />
          <Metric label="RSVP" value={`${responseRate}%`} />
          <Metric label="Zaproszenia" value={householdCount.toString()} />
          <Metric label="Bez stolika" value={guests.filter((guest) => !guest.tableId).length.toString()} />
          <Metric label="Miejsca" value={`${assignedCount}/${totalSeats}`} />
          <Metric label="Diety" value={dietCount.toString()} />
          <Metric label="Problemy" value={(overbookedTables.length + guests.filter((guest) => !guest.tableId).length + duplicateKeys.size).toString()} />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-[#d8bd72]/20 bg-[#fffaf4] p-4">
            <p className="text-sm font-semibold text-zinc-900">RSVP</p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full bg-[#2f5d50]" style={{ width: `${responseRate}%` }} />
            </div>
            <p className="mt-2 text-sm text-zinc-600">Potwierdzam: {confirmedCount}. Nie bede: {declinedCount}. Brak odpowiedzi: {invitedCount}.</p>
          </div>
          <div className="rounded-2xl border border-[#d8bd72]/20 bg-white p-4">
            <p className="text-sm font-semibold text-zinc-900">Gospodarstwa / zaproszenia</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Grupa goscia dziala jak robocze gospodarstwo lub zaproszenie. Uzywaj jej do rodzin, znajomych, pracy i list od rodzicow.</p>
          </div>
        </div>
        {(overbookedTables.length > 0 || guests.some((guest) => !guest.tableId) || duplicateKeys.size > 0) && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Do sprawdzenia przed publikacja</p>
            <p className="mt-1">{guests.filter((guest) => !guest.tableId).length} osob bez stolika. {overbookedTables.length ? `Przepelnione stoliki: ${overbookedTables.map((table) => table.number).join(", ")}. ` : ""}{duplicateKeys.size ? `Mozliwe duplikaty: ${duplicateKeys.size}.` : ""}</p>
          </div>
        )}
        {guests.some((guest) => guest.companion.trim()) && (
          <div className="mt-4 rounded-2xl border border-[#d8bd72]/30 bg-[#fffaf4] p-4 text-sm text-zinc-700">
            <p className="font-semibold text-zinc-950">Osoby towarzyszace jako osobne miejsca</p>
            <p className="mt-1 leading-6">W danych sa jeszcze osoby towarzyszace zapisane jako dopisek. Zamien je na osobne rekordy, zeby poprawnie liczyc miejsca przy stolikach.</p>
            <button type="button" onClick={convertCompanionNotes} className="mt-3 h-10 rounded-full bg-[#2f5d50] px-4 text-sm font-semibold text-white">Zamien dopiski na gosci</button>
          </div>
        )}
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
        <Panel title={editingId ? "Edytuj goscia" : "Dodaj goscia"} description="Prosty formularz dla telefonu. Osoba towarzyszaca tworzy osobny rekord i zajmuje osobne miejsce przy stoliku.">
          <form onSubmit={submit} className="grid gap-3">
            <div className="rounded-2xl bg-[#e0f0eb] p-3 text-sm leading-6 text-[#1f5f52]">
              Dodajesz jedna osobe. Jesli wpiszesz osobe towarzyszaca, system doda ja jako drugiego goscia obok.
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Imie"><input className={inputClass} value={draft.firstName} onChange={(e) => setDraft({ ...draft, firstName: e.target.value })} /></Field>
              <Field label="Nazwisko"><input className={inputClass} value={draft.lastName} onChange={(e) => setDraft({ ...draft, lastName: e.target.value })} /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Grupa"><input list="guest-groups" className={inputClass} value={draft.group} onChange={(e) => setDraft({ ...draft, group: e.target.value })} /></Field>
              <Field label="Status"><select className={inputClass} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Guest["status"] })}><option value="confirmed">Potwierdzony</option><option value="invited">Zaproszony</option><option value="declined">Odmowa</option></select></Field>
            </div>
            <datalist id="guest-groups">{groups.map((group) => <option key={group} value={group} />)}</datalist>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Stolik"><select className={inputClass} value={draft.tableId} onChange={(e) => setDraft({ ...draft, tableId: e.target.value })}><option value="">Bez stolika</option>{tables.map((table) => <option key={table.id} value={table.id}>{table.number}. {table.name}</option>)}</select></Field>
              <Field label="Miejsce"><input className={inputClass} type="number" min={1} value={draft.seat} onChange={(e) => setDraft({ ...draft, seat: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Osoba towarzyszaca"><input className={inputClass} value={draft.companion} onChange={(e) => setDraft({ ...draft, companion: e.target.value })} placeholder="np. Jan Nowak" disabled={Boolean(editingId)} /></Field>
            {editingId && <p className="rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-800">Przy edycji dodaj osobe towarzyszaca jako nowego goscia, zeby nie nadpisac istniejacego planu miejsc.</p>}
            <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="h-11 rounded-full border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700">{showAdvanced ? "Ukryj dodatkowe pola" : "Diety, nocleg i notatki"}</button>
            {showAdvanced && (
              <div className="grid gap-3 rounded-2xl bg-[#fffaf4] p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nocleg"><input className={inputClass} value={draft.accommodation} onChange={(e) => setDraft({ ...draft, accommodation: e.target.value })} placeholder="np. Pokoj 205" /></Field>
                  <Toggle label="Transport" checked={draft.transport} onChange={(transport) => setDraft({ ...draft, transport })} />
                </div>
                <Field label="Dieta / alergie"><input className={inputClass} value={draft.dietaryNotes} onChange={(e) => setDraft({ ...draft, dietaryNotes: e.target.value })} /></Field>
                <Field label="Notatka"><input className={inputClass} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></Field>
                <Toggle label="Dziecko" checked={draft.child} onChange={(child) => setDraft({ ...draft, child })} />
              </div>
            )}
            <FormActions editing={Boolean(editingId)} onCancel={() => { setDraft(emptyGuest); setEditingId(null); setShowAdvanced(false); }} />
          </form>
        </Panel>

        <Panel title="Lista i przypisania" description="Filtruj, zaznaczaj wiele osob i zmieniaj stoliki bez wchodzenia w edycje kazdej osoby.">
          <div className="grid gap-3">
            <div className="grid gap-3 lg:grid-cols-[1fr_170px_180px]">
              <input className={inputClass} placeholder="Szukaj po imieniu, grupie, diecie, noclegu albo notatce" value={filter} onChange={(event) => setFilter(event.target.value)} />
              <select className={inputClass} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
                <option value="all">Wszyscy</option>
                <option value="confirmed">Potwierdzeni</option>
                <option value="invited">Zaproszeni</option>
                <option value="declined">Odmowy</option>
                <option value="unassigned">Bez stolika</option>
                <option value="diet">Diety/alergie</option>
                <option value="transport">Transport</option>
                <option value="hotel">Nocleg</option>
                <option value="children">Dzieci</option>
              </select>
              <select className={inputClass} value={tableFilter} onChange={(event) => setTableFilter(event.target.value)}>
                <option value="all">Wszystkie stoliki</option>
                <option value="none">Bez stolika</option>
                {tables.map((table) => <option key={table.id} value={table.id}>{table.number}. {table.name}</option>)}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#d8bd72]/20 bg-[#fffaf4] p-3">
              <span className="text-sm font-semibold text-zinc-700">Widoczne: {visibleGuests.length}</span>
              <span className="text-sm text-zinc-500">Zaznaczone: {selectedIds.length}</span>
              <SmallButton onClick={selectVisible}>Zaznacz widoczne</SmallButton>
              <SmallButton onClick={clearSelection}>Odznacz</SmallButton>
              <SmallButton onClick={exportVisibleGuests}>Eksport widocznych</SmallButton>
              <SmallButton onClick={clearVisibleTables}>Wyczysc stoliki widocznych</SmallButton>
              <BulkActions disabled={!selectedIds.length} tables={tables} onPatch={bulkPatch} onAssignTable={bulkAssignTable} onDelete={() => { onChange(guests.filter((guest) => !selectedIds.includes(guest.id))); clearSelection(); }} />
              <ImportBox onImport={importText} />
            </div>
            {importMessage && <div className="rounded-2xl bg-[#e0f0eb] px-4 py-3 text-sm font-medium text-[#1f5f52]">{importMessage}</div>}

            {selectedGuests.length > 0 && (
              <div className="rounded-2xl bg-[#e0f0eb] p-3 text-sm text-[#1f5f52]">
                Wybrano {selectedGuests.length}: {selectedGuests.slice(0, 4).map(guestFullName).join(", ")}{selectedGuests.length > 4 ? "..." : ""}
              </div>
            )}

            <div className="grid max-h-[760px] gap-2 overflow-auto pr-1">
              {visibleGuests.length === 0 && <EmptyState text="Nie znaleziono gosci dla tych filtrow." />}
              {visibleGuests.map((guest) => {
                const table = tables.find((entry) => entry.id === guest.tableId);
                const tableGuests = table ? guests.filter((entry) => entry.tableId === table.id) : [];
                const overbooked = table ? tableGuests.length > table.capacity : false;
                const duplicate = duplicateKeys.has(normalizeGuestKey(guest));
                return (
                  <article key={guest.id} className={`rounded-2xl border bg-white p-3 shadow-sm ${selectedIds.includes(guest.id) ? "border-[#2f5d50] ring-2 ring-[#2f5d50]/10" : "border-[#d8bd72]/18"}`}>
                    <div className="grid gap-3">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" checked={selectedIds.includes(guest.id)} onChange={(event) => setSelection(guest.id, event.target.checked)} className="mt-1 size-5 shrink-0" />
                        <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{guestFullName(guest)}</p>
                          {guest.child && <Badge>Dziecko</Badge>}
                          {guest.dietaryNotes && <Badge>Dieta</Badge>}
                          {overbooked && <Badge tone="danger">Za duzo osob</Badge>}
                          {!guest.tableId && <Badge tone="danger">Bez stolika</Badge>}
                          {duplicate && <Badge tone="danger">Duplikat?</Badge>}
                        </div>
                        <p className="mt-1 break-words text-sm text-zinc-500">{guest.group}{guest.note ? ` / ${guest.note}` : ""}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                          {guest.dietaryNotes && <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-800">{guest.dietaryNotes}</span>}
                          {guest.accommodation && <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-800">{guest.accommodation}</span>}
                          {guest.transport && <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-800">transport</span>}
                        </div>
                      </div>
                      </div>
                      <div className="grid gap-2 lg:grid-cols-[minmax(180px,1fr)_minmax(170px,220px)_auto] lg:items-center">
                      <select className={inputClass} value={guest.tableId} onChange={(event) => assignNextSeat(guest.id, event.target.value)}>
                        <option value="">Bez stolika</option>
                        {tables.map((entry) => <option key={entry.id} value={entry.id}>{entry.number}. {entry.name} ({guests.filter((item) => item.tableId === entry.id).length}/{entry.capacity})</option>)}
                      </select>
                      <div className="grid grid-cols-[1fr_82px] gap-2">
                        <select className={inputClass} value={guest.status} onChange={(event) => updateGuest(guest.id, { status: event.target.value as Guest["status"] })}>
                          <option value="confirmed">Potwierdzony</option>
                          <option value="invited">Zaproszony</option>
                          <option value="declined">Odmowa</option>
                        </select>
                        <input className={inputClass} type="number" min={1} value={guest.seat} onChange={(event) => updateGuest(guest.id, { seat: Number(event.target.value) })} />
                      </div>
                      <RowActions onEdit={() => { setDraft({ ...guest }); setEditingId(guest.id); setShowAdvanced(true); }} onDelete={() => removeGuest(guest.id)} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function BulkActions({ disabled, tables, onPatch, onAssignTable, onDelete }: { disabled: boolean; tables: TablePlan[]; onPatch: (patch: Partial<Guest>) => void; onAssignTable: (tableId: string) => void; onDelete: () => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <select className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs font-semibold text-zinc-700 disabled:opacity-50" disabled={disabled} defaultValue="" onChange={(event) => { if (event.target.value) onAssignTable(event.target.value); event.currentTarget.value = ""; }}>
        <option value="">Przypisz stolik</option>
        {tables.map((table) => <option key={table.id} value={table.id}>{table.number}. {table.name}</option>)}
      </select>
      <SmallButton onClick={() => onPatch({ status: "confirmed" })}>Potwierdz</SmallButton>
      <SmallButton onClick={() => onPatch({ status: "invited" })}>Zaproszeni</SmallButton>
      <SmallButton onClick={() => onPatch({ transport: true })}>Transport</SmallButton>
      <SmallButton onClick={() => onPatch({ tableId: "", seat: 1 })}>Bez stolika</SmallButton>
      <button type="button" disabled={disabled} onClick={onDelete} className="h-8 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50">Usun wybrane</button>
    </div>
  );
}

function TableManager({ tables, guests, onChange }: { tables: TablePlan[]; guests: Guest[]; onChange: (tables: TablePlan[], guests?: Guest[]) => void }) {
  const [draft, setDraft] = useState(emptyTable);
  const [editingId, setEditingId] = useState<string | null>(null);
  const tableSummaries = tables.map((table) => ({ table, assigned: guests.filter((guest) => guest.tableId === table.id).length }));
  const totalSeats = tables.reduce((sum, table) => sum + table.capacity, 0);
  const assignedGuests = guests.filter((guest) => guest.tableId).length;
  const unassignedGuests = guests.filter((guest) => !guest.tableId);
  const overbooked = tableSummaries.filter((entry) => entry.assigned > entry.table.capacity);
  const freeSeats = Math.max(totalSeats - assignedGuests, 0);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    onChange(editingId ? tables.map((table) => (table.id === editingId ? { ...draft, id: editingId } : table)) : [...tables, { ...draft, id: createAdminId("table") }]);
    setDraft({ ...emptyTable, number: tables.length + 2 });
    setEditingId(null);
  }
  function setTableCount(count: number) {
    const safeCount = Math.max(0, Math.min(40, count));
    if (safeCount === tables.length) return;
    if (safeCount < tables.length) {
      const kept = tables.slice(0, safeCount);
      const keptIds = new Set(kept.map((table) => table.id));
      onChange(kept, guests.map((guest) => (keptIds.has(guest.tableId) ? guest : { ...guest, tableId: "", seat: 1 })));
      return;
    }
    const next = [...tables];
    for (let index = tables.length; index < safeCount; index += 1) {
      next.push({ ...emptyTable, id: createAdminId("table"), number: index + 1, name: `Stolik ${index + 1}`, x: 12 + (index % 5) * 17, y: index < 5 ? 24 : 62 });
    }
    onChange(next);
  }
  return (
    <div className="grid gap-4">
      <Panel title="Stan usadzenia" description="To jest szybki test przed publikacja planu sali i drukiem winietek.">
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric label="Miejsca" value={totalSeats.toString()} />
          <Metric label="Przypisani" value={assignedGuests.toString()} />
          <Metric label="Wolne miejsca" value={freeSeats.toString()} />
          <Metric label="Bez stolika" value={unassignedGuests.length.toString()} />
        </div>
        {(overbooked.length > 0 || unassignedGuests.length > 0 || totalSeats < guests.length) && (
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {totalSeats < guests.length && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">Za malo miejsc: {totalSeats} miejsc na {guests.length} gosci.</div>}
            {unassignedGuests.length > 0 && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">{unassignedGuests.length} osob czeka na przypisanie do stolika.</div>}
            {overbooked.map((entry) => <div key={entry.table.id} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">Stolik {entry.table.number}: {entry.assigned}/{entry.table.capacity} osob.</div>)}
          </div>
        )}
      </Panel>
      <CrudLayout title="Stoliki" description="Ustal liczbe stolikow, ksztalt, pojemnosc, nazwe, numer i motyw." form={
      <form onSubmit={submit} className="grid gap-3">
        <Field label="Liczba stolikow"><input className={inputClass} type="number" min={0} max={40} value={tables.length} onChange={(e) => setTableCount(Number(e.target.value))} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Numer"><input className={inputClass} type="number" min={1} value={draft.number} onChange={(e) => setDraft({ ...draft, number: Number(e.target.value) })} /></Field>
          <Field label="Nazwa"><input className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Ksztalt"><select className={inputClass} value={draft.shape} onChange={(e) => setDraft({ ...draft, shape: e.target.value as TablePlan["shape"] })}><option value="round">Okragly</option><option value="rect">Prostokatny</option><option value="oval">Owalny</option><option value="head">Prezydialny</option></select></Field>
          <Field label="Liczba miejsc"><input className={inputClass} type="number" min={1} max={30} value={draft.capacity} onChange={(e) => setDraft({ ...draft, capacity: Number(e.target.value) })} /></Field>
          <Field label="Motyw"><input className={inputClass} value={draft.theme} onChange={(e) => setDraft({ ...draft, theme: e.target.value })} /></Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Pozycja X"><input className={inputClass} type="number" min={0} max={100} value={draft.x} onChange={(e) => setDraft({ ...draft, x: Number(e.target.value) })} /></Field>
          <Field label="Pozycja Y"><input className={inputClass} type="number" min={0} max={100} value={draft.y} onChange={(e) => setDraft({ ...draft, y: Number(e.target.value) })} /></Field>
        </div>
        <FormActions editing={Boolean(editingId)} onCancel={() => { setDraft(emptyTable); setEditingId(null); }} />
      </form>
    }>
      <DataList items={tables} render={(table) => {
        const assigned = guests.filter((guest) => guest.tableId === table.id).length;
        return <Row key={table.id}><div><p className="font-medium">{table.number}. {table.name}</p><p className="text-sm text-zinc-500">{shapeLabel(table.shape)} / {assigned}/{table.capacity} osob / {table.theme || "bez motywu"}</p></div><Badge tone={assigned > table.capacity ? "danger" : "default"}>{assigned > table.capacity ? "przekroczono" : "OK"}</Badge><RowActions onEdit={() => { setDraft(table); setEditingId(table.id); }} onDelete={() => { const kept = tables.filter((entry) => entry.id !== table.id); onChange(kept, guests.map((guest) => guest.tableId === table.id ? { ...guest, tableId: "", seat: 1 } : guest)); }} /></Row>;
      }} />
      </CrudLayout>
    </div>
  );
}

function RoomManager({ tables, guests, elements, onTablesChange, onGuestsChange, onElementsChange }: { tables: TablePlan[]; guests: Guest[]; elements: RoomElement[]; onTablesChange: (tables: TablePlan[]) => void; onGuestsChange: (guests: Guest[]) => void; onElementsChange: (elements: RoomElement[]) => void }) {
  const [draft, setDraft] = useState(emptyRoomElement);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [guestFilter, setGuestFilter] = useState("");
  const [selectedTableId, setSelectedTableId] = useState(tables[0]?.id ?? "");
  const selectedTable = tables.find((table) => table.id === selectedTableId) ?? tables[0];
  const visibleGuests = guests
    .filter((guest) => `${guestFullName(guest)} ${guest.group}`.toLowerCase().includes(guestFilter.toLowerCase()))
    .slice(0, 42);
  const selectedGuests = selectedTable ? guests.filter((guest) => guest.tableId === selectedTable.id).sort((a, b) => a.seat - b.seat) : [];
  function assignGuest(guestId: string, tableId: string) {
    const seatsTaken = guests.filter((guest) => guest.tableId === tableId).map((guest) => guest.seat);
    const table = tables.find((item) => item.id === tableId);
    const nextSeat = Array.from({ length: table?.capacity ?? 20 }, (_, index) => index + 1).find((seat) => !seatsTaken.includes(seat)) ?? seatsTaken.length + 1;
    onGuestsChange(guests.map((guest) => guest.id === guestId ? { ...guest, tableId, seat: nextSeat } : guest));
    setSelectedTableId(tableId);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.label.trim()) return;
    onElementsChange(editingId ? elements.map((element) => (element.id === editingId ? { ...draft, id: editingId } : element)) : [...elements, { ...draft, id: createAdminId("room") }]);
    setDraft(emptyRoomElement);
    setEditingId(null);
  }
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
      <Panel title="Mapa sali" description="Kliknij i przeciagnij stolik albo obiekt. Pozycje zapisza sie automatycznie.">
        <RoomCanvas tables={tables} guests={guests} elements={elements} selectedTableId={selectedTable?.id} onTableSelect={setSelectedTableId} onGuestAssign={assignGuest} onTableMove={(id, x, y) => onTablesChange(tables.map((table) => table.id === id ? { ...table, x, y } : table))} onElementMove={(id, x, y) => onElementsChange(elements.map((element) => element.id === id ? { ...element, x, y } : element))} />
        <div className="mt-4 rounded-2xl border border-[#d8bd72]/25 bg-[#fffaf4] p-4">
          <p className="font-semibold">Przeciagnij goscia na stolik</p>
          <p className="mt-1 text-sm text-zinc-600">Upusc osobe na wybrany stolik. System nada kolejne wolne miejsce i od razu pokaze sklad stolika.</p>
          <input className={`${inputClass} mt-3`} placeholder="Szukaj goscia do przeciagania" value={guestFilter} onChange={(event) => setGuestFilter(event.target.value)} />
          <div className="mt-3 grid max-h-44 grid-cols-1 gap-2 overflow-auto pr-1 sm:grid-cols-2">
            {visibleGuests.map((guest) => (
              <button key={guest.id} type="button" draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", guest.id)} className="cursor-grab rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left text-xs shadow-sm active:cursor-grabbing">
                <span className="block font-semibold">{guestFullName(guest)}</span>
                <span className="text-zinc-500">{tables.find((table) => table.id === guest.tableId)?.name ?? "bez stolika"} / miejsce {guest.seat}</span>
              </button>
            ))}
          </div>
        </div>
      </Panel>
      <Panel title="Obiekty na mapie" description="Dodaj parkiet, bar, toalety, bufet, fotobudke albo wlasny obiekt.">
        <form onSubmit={submit} className="grid gap-3">
          <Field label="Nazwa"><input className={inputClass} value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></Field>
          <Field label="Typ"><select className={inputClass} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as RoomElement["type"] })}><option value="dance">Parkiet</option><option value="stage">Scena</option><option value="entry">Wejscie</option><option value="bar">Bar</option><option value="toilets">Toalety</option><option value="buffet">Bufet</option><option value="photobooth">Fotobudka</option><option value="terrace">Taras</option><option value="kids">Kacik dla dzieci</option><option value="chillout">Chillout</option><option value="custom">Wlasny</option></select></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="X"><input className={inputClass} type="number" min={0} max={100} value={draft.x} onChange={(e) => setDraft({ ...draft, x: Number(e.target.value) })} /></Field><Field label="Y"><input className={inputClass} type="number" min={0} max={100} value={draft.y} onChange={(e) => setDraft({ ...draft, y: Number(e.target.value) })} /></Field><Field label="Szer."><input className={inputClass} type="number" min={4} max={40} value={draft.w} onChange={(e) => setDraft({ ...draft, w: Number(e.target.value) })} /></Field><Field label="Wys."><input className={inputClass} type="number" min={4} max={40} value={draft.h} onChange={(e) => setDraft({ ...draft, h: Number(e.target.value) })} /></Field></div>
          <FormActions editing={Boolean(editingId)} onCancel={() => { setDraft(emptyRoomElement); setEditingId(null); }} />
        </form>
        {selectedTable && (
          <div className="mt-4 rounded-2xl border border-[#d8bd72]/25 bg-[#fffaf4] p-3">
            <p className="font-semibold">{selectedTable.number}. {selectedTable.name}</p>
            <p className="text-sm text-zinc-600">Obsadzone: {selectedGuests.length}/{selectedTable.capacity}</p>
            <div className="mt-2 grid max-h-44 gap-1 overflow-auto">
              {selectedGuests.map((guest) => (
                <div className="rounded-lg bg-white px-2 py-1 text-xs" key={guest.id}>{guest.seat}. {guestFullName(guest)}</div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4 grid gap-2">{elements.map((element) => <Row key={element.id}><div><p className="font-medium">{element.label}</p><p className="text-sm text-zinc-500">{element.type} / x {element.x}, y {element.y}</p></div><RowActions onEdit={() => { setDraft(element); setEditingId(element.id); }} onDelete={() => onElementsChange(elements.filter((entry) => entry.id !== element.id))} /></Row>)}</div>
      </Panel>
    </div>
  );
}

function RoomCanvas({ tables, guests, elements, onTableMove, onElementMove, onGuestAssign, onTableSelect, selectedTableId, readonly = false }: { tables: TablePlan[]; guests: Guest[]; elements: RoomElement[]; onTableMove: (id: string, x: number, y: number) => void; onElementMove: (id: string, x: number, y: number) => void; onGuestAssign?: (guestId: string, tableId: string) => void; onTableSelect?: (tableId: string) => void; selectedTableId?: string; readonly?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{ kind: "table" | "element"; id: string } | null>(null);
  function move(kind: "table" | "element", id: string, clientX: number, clientY: number) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || readonly) return;
    const x = snap(clamp(Math.round(((clientX - rect.left) / rect.width) * 100), 3, 97));
    const y = snap(clamp(Math.round(((clientY - rect.top) / rect.height) * 100), 3, 97));
    if (kind === "table") onTableMove(id, x, y);
    else onElementMove(id, x, y);
  }
  function startDrag(event: PointerEvent<HTMLButtonElement>, kind: "table" | "element", id: string) {
    if (readonly) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging({ kind, id });
    move(kind, id, event.clientX, event.clientY);
  }
  function drag(event: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    move(dragging.kind, dragging.id, event.clientX, event.clientY);
  }
  return (
    <div
      ref={ref}
      className="relative min-h-[500px] touch-none overflow-hidden rounded-3xl border border-[#d8bd72]/30 bg-[#ece7dd] bg-[linear-gradient(rgba(47,93,80,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(47,93,80,0.05)_1px,transparent_1px)] bg-[length:28px_28px] shadow-inner"
      onPointerMove={drag}
      onPointerUp={() => setDragging(null)}
      onPointerCancel={() => setDragging(null)}
    >
      <div className="absolute left-4 top-4 z-40 rounded-2xl bg-white/90 px-4 py-3 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur">
        <span className="block text-[#2f5d50]">Mapa sali</span>
        <span className="font-normal">Przeciagaj stoliki i obiekty. Upusc goscia na stolik, aby go przypisac.</span>
      </div>
      {!readonly && (
        <div className="absolute right-4 top-4 z-40 hidden rounded-full bg-[#234d43] px-4 py-2 text-xs font-bold text-white shadow-sm sm:block">siatka co 2%</div>
      )}
      <div className="absolute inset-4 rounded-[1.4rem] border border-dashed border-[#d8bd72]/70" />
      {elements.map((element) => (
        <button key={element.id} type="button" disabled={readonly} onPointerDown={(event) => startDrag(event, "element", element.id)} className="absolute cursor-grab rounded-xl border border-zinc-300 bg-white/90 p-2 text-center text-xs font-semibold text-zinc-600 shadow-sm backdrop-blur active:cursor-grabbing" style={{ left: `${element.x}%`, top: `${element.y}%`, width: `${element.w}%`, height: `${element.h}%` }}>{element.label}</button>
      ))}
      {tables.map((table) => {
        const assigned = guests.filter((guest) => guest.tableId === table.id).length;
        const overCapacity = assigned > table.capacity;
        return (
          <button key={table.id} type="button" disabled={readonly} onClick={() => onTableSelect?.(table.id)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const guestId = event.dataTransfer.getData("text/plain"); if (guestId) onGuestAssign?.(guestId, table.id); }} onPointerDown={(event) => startDrag(event, "table", table.id)} className={`absolute flex -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center border bg-white text-center text-xs font-semibold text-zinc-800 shadow-md transition active:cursor-grabbing ${tableShapeClass(table.shape)} ${overCapacity ? "border-red-500 ring-4 ring-red-200" : "border-[#2f7d6d]"} ${dragging?.id === table.id || selectedTableId === table.id ? "z-30 scale-110 ring-4 ring-[#c2a45d]/35" : ""}`} style={{ left: `${table.x}%`, top: `${table.y}%` }} title={`${table.name}: ${assigned}/${table.capacity}`}>
            <span><span className="block text-sm">{table.number}</span><span className={overCapacity ? "text-red-700" : "text-zinc-500"}>{assigned}/{table.capacity}</span></span>
          </button>
        );
      })}
    </div>
  );
}

function QrManager({ items, onChange }: { items: QrInvite[]; onChange: (items: QrInvite[]) => void }) {
  const [draft, setDraft] = useState(emptyQrInvite);
  const [editingId, setEditingId] = useState<string | null>(null);
  const siteUrl = typeof window === "undefined" ? "http://localhost:3000" : window.location.origin;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.label.trim()) return;
    onChange(editingId ? items.map((item) => (item.id === editingId ? { ...draft, id: editingId } : item)) : [...items, { ...draft, id: createAdminId("qr") }]);
    setDraft(emptyQrInvite);
    setEditingId(null);
  }
  function qrValue(item: QrInvite) {
    return item.target.startsWith("http") ? item.target : `${siteUrl}${item.target}`;
  }
  function downloadPng(item: QrInvite) {
    const canvas = document.getElementById(`qr-${item.id}`) as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "qr"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
  function downloadSvg(item: QrInvite) {
    const canvas = document.getElementById(`qr-${item.id}`) as HTMLCanvasElement | null;
    if (!canvas) return;
    const value = qrValue(item);
    const image = canvas.toDataURL("image/png");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="560" viewBox="0 0 420 560">
  <rect width="420" height="560" rx="28" fill="#fffaf4"/>
  <rect x="28" y="28" width="364" height="504" rx="22" fill="#ffffff" stroke="#c2a45d"/>
  <text x="210" y="86" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#234d43">${escapeXml(item.label)}</text>
  <text x="210" y="122" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" fill="#57534e">Zeskanuj kod i przejdz do aplikacji weselnej</text>
  <image href="${image}" x="90" y="155" width="240" height="240"/>
  <text x="210" y="445" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#78716c">${escapeXml(value)}</text>
</svg>`;
    downloadTextFile(`${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "qr"}.svg`, svg);
  }
  function printCard(item: QrInvite, variant: "a4" | "table" = "a4") {
    const canvas = document.getElementById(`qr-${item.id}`) as HTMLCanvasElement | null;
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    const isTable = variant === "table";
    win.document.write(`<!doctype html><html><head><title>${item.label}</title><style>
      body{margin:0;background:#f8efe3;font-family:Arial,sans-serif;color:#1c1917}
      .page{width:210mm;min-height:297mm;margin:0 auto;background:#fffaf4;padding:22mm;box-sizing:border-box}
      .card{border:1px solid #c2a45d;border-radius:18px;padding:${isTable ? "10mm" : "18mm"};text-align:center;background:white;box-shadow:0 18px 45px rgba(80,50,28,.12);${isTable ? "width:95mm;margin:55mm auto 0;" : ""}}
      h1{font-size:28px;margin:0 0 8px} p{font-size:15px;color:#57534e;line-height:1.45}
      img{width:${isTable ? "48mm" : "72mm"};height:${isTable ? "48mm" : "72mm"};margin:10mm auto;display:block}
      .small{font-size:11px;color:#78716c;word-break:break-all}
      @media print{body{background:white}.page{margin:0}.card{box-shadow:none}}
    </style></head><body><main class="page"><section class="card"><h1>${item.label}</h1><p>${isTable ? "Zeskanuj i dodaj zdjecia z wesela." : "Zeskanuj kod i przejdz do naszej aplikacji weselnej."}</p><img src="${image}" alt="QR"><p class="small">${qrValue(item)}</p></section></main><script>window.print()</script></body></html>`);
    win.document.close();
  }
  return (
    <CrudLayout
      title="Kody QR do druku"
      description="Tworz kody do RSVP, galerii, dodawania zdjec i wyszukiwarki stolikow. Kazdy kod mozesz pobrac jako PNG albo wydrukowac jako elegancka kartke A4."
      form={
        <form onSubmit={submit} className="grid gap-3">
          <Field label="Etykieta"><input className={inputClass} value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></Field>
          <Field label="Adres docelowy"><select className={inputClass} value={draft.target} onChange={(e) => setDraft({ ...draft, target: e.target.value })}><option value="/">Strona glowna</option><option value="/#miejsce">Wyszukiwarka stolika</option><option value="/upload">Dodaj zdjecia</option><option value="/gallery">Galeria</option><option value="/rsvp">RSVP</option><option value="/guestbook">Ksiega gosci</option></select></Field>
          <div className="grid gap-3 sm:grid-cols-2"><Field label="Skanowania"><input className={inputClass} type="number" min={0} value={draft.scans} onChange={(e) => setDraft({ ...draft, scans: Number(e.target.value) })} /></Field><Toggle label="Aktywny" checked={draft.active} onChange={(active) => setDraft({ ...draft, active })} /></div>
          <FormActions editing={Boolean(editingId)} onCancel={() => { setDraft(emptyQrInvite); setEditingId(null); }} />
        </form>
      }
    >
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <article className="rounded-3xl border border-[#d8bd72]/30 bg-white p-4 shadow-sm" key={item.id}>
            <div className="flex gap-4">
              <div className="rounded-2xl bg-[#fffaf4] p-3"><QRCodeCanvas id={`qr-${item.id}`} value={qrValue(item)} size={112} marginSize={1} /></div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{item.label}</p>
                <p className="break-all text-sm text-zinc-500">{qrValue(item)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <SmallButton onClick={() => printCard(item)}>Drukuj A4</SmallButton>
                  <SmallButton onClick={() => printCard(item, "table")}>Kartka na stolik</SmallButton>
                  <SmallButton onClick={() => downloadPng(item)}>Pobierz PNG</SmallButton>
                  <SmallButton onClick={() => downloadSvg(item)}>Pobierz SVG</SmallButton>
                  <SmallButton onClick={() => { setDraft(item); setEditingId(item.id); }}>Edytuj</SmallButton>
                  <SmallButton onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}>Usun</SmallButton>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </CrudLayout>
  );
}

function GalleryManager({ items, onChange }: { items: GalleryItem[]; onChange: (items: GalleryItem[]) => void }) {
  const [draft, setDraft] = useState(emptyGalleryItem);
  const [editingId, setEditingId] = useState<string | null>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onChange(editingId ? items.map((item) => (item.id === editingId ? { ...draft, id: editingId } : item)) : [...items, { ...draft, id: createAdminId("photo") }]);
    setDraft(emptyGalleryItem);
    setEditingId(null);
  }
  return <CrudLayout title="Galeria i moderacja" description="Moderuj zdjecia od gosci." form={<form onSubmit={submit} className="grid gap-3"><Field label="Tytul"><input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field><Field label="Autor"><input className={inputClass} value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} /></Field><div className="grid gap-3 sm:grid-cols-2"><Field label="Status"><select className={inputClass} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as GalleryItem["status"] })}><option value="pending">W moderacji</option><option value="approved">Zatwierdzone</option><option value="rejected">Odrzucone</option></select></Field><Field label="Kategoria"><select className={inputClass} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as GalleryItem["category"] })}><option value="ceremony">Ceremonia</option><option value="party">Zabawa</option><option value="portraits">Portrety</option><option value="details">Detale</option></select></Field></div><FormActions editing={Boolean(editingId)} onCancel={() => { setDraft(emptyGalleryItem); setEditingId(null); }} /></form>}><DataList items={items} render={(item) => <Row key={item.id}><div><p className="font-medium">{item.title}</p><p className="text-sm text-zinc-500">{item.author} / {item.category}</p></div><Badge>{statusLabel[item.status]}</Badge><RowActions onEdit={() => { setDraft(item); setEditingId(item.id); }} onDelete={() => onChange(items.filter((entry) => entry.id !== item.id))} /></Row>} /></CrudLayout>;
}

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "superadmin";
  createdAt: string;
  lastSignInAt?: string | null;
};

function AccountsManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    setLoading(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Nie udalo sie pobrac kont.");
      return;
    }
    const payload = await response.json();
    setUsers(payload.users ?? []);
  }

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name")?.toString(),
        email: form.get("email")?.toString(),
        password: form.get("password")?.toString(),
      }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      setError(payload?.error ?? "Nie udalo sie utworzyc konta.");
      return;
    }
    event.currentTarget.reset();
    setMessage("Konto superadmina zostalo utworzone.");
    setUsers((current) => [payload.user, ...current.filter((user) => user.id !== payload.user.id)]);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="grid gap-4">
      <Panel title="Konta i uprawnienia" description="Na razie kazde konto ma role superadmina, czyli pelny dostep do panelu i wszystkich danych wesela.">
        <div className="flex flex-wrap gap-3">
          <SmallButton onClick={loadUsers}>{loading ? "Odswiezam..." : "Odswiez liste"}</SmallButton>
          <SmallButton onClick={logout}>Wyloguj</SmallButton>
        </div>
        {message && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p>}
        {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
      </Panel>

      <CrudLayout title="Dodaj superadmina" description="Utworzone konto loguje sie przez /login. Haslo musi miec minimum 8 znakow." form={
        <form onSubmit={createUser} className="grid gap-3">
          <Field label="Imie / nazwa"><input className={inputClass} name="name" placeholder="Aleksandra" required /></Field>
          <Field label="Email"><input className={inputClass} name="email" type="email" placeholder="osoba@example.com" required /></Field>
          <Field label="Haslo"><input className={inputClass} name="password" type="password" minLength={8} required /></Field>
          <button className={primaryButtonClass} type="submit">Utworz konto</button>
        </form>
      }>
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-[#fffaf4] text-xs uppercase tracking-[0.12em] text-zinc-500">
              <tr>
                <th className="px-4 py-3">Nazwa</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rola</th>
                <th className="px-4 py-3">Utworzone</th>
                <th className="px-4 py-3">Ostatnie logowanie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#fffaf4]">
                  <td className="px-4 py-3 font-semibold text-zinc-900">{user.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{user.email}</td>
                  <td className="px-4 py-3"><Badge>Superadmin</Badge></td>
                  <td className="px-4 py-3 text-zinc-600">{formatDateTime(user.createdAt)}</td>
                  <td className="px-4 py-3 text-zinc-600">{user.lastSignInAt ? formatDateTime(user.lastSignInAt) : "Jeszcze nie"}</td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td className="px-4 py-6 text-center text-zinc-500" colSpan={5}>{loading ? "Laduje konta..." : "Brak kont w Supabase Auth. Awaryjnie nadal dziala login admin + haslo panelu."}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CrudLayout>
    </div>
  );
}

function PlanningManager({ planning, onChange }: { planning: PlanningData; onChange: (planning: PlanningData) => void }) {
  const [tab, setTab] = useState<"budget" | "tasks" | "vendors" | "payments" | "documents" | "attachments">("budget");
  const plannedExpenses = planning.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = planning.expenses.reduce((sum, expense) => sum + expense.paidAmount, 0);
  const unpaid = Math.max(plannedExpenses - paidExpenses, 0);
  const budgetUsage = planning.budgetTarget > 0 ? Math.min(Math.round((plannedExpenses / planning.budgetTarget) * 100), 999) : 0;
  const signedContracts = planning.vendors.filter((vendor) => vendor.contractStatus === "signed").length;
  const doneTasks = planning.tasks.filter((task) => task.status === "done").length;
  const urgentTasks = planning.tasks.filter((task) => task.status !== "done").slice(0, 3);
  const openPayments = planning.payments.filter((payment) => !payment.paid).slice(0, 3);
  const dueExpenses = planning.expenses.filter((expense) => expense.status !== "paid").slice(0, 3);

  return (
    <div className="grid gap-4">
      <Panel title="Planowanie organizacyjne" description="Umowy, zaliczki, platnosci, dokumenty i lista zadan przed weselem.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <Metric label="Budzet" value={formatMoney(planning.budgetTarget)} />
          <Metric label="Planowane" value={formatMoney(plannedExpenses)} />
          <Metric label="Oplacone" value={formatMoney(paidExpenses)} />
          <Metric label="Do zaplaty" value={formatMoney(unpaid)} />
          <Metric label="Umowy" value={`${signedContracts}/${planning.vendors.length}`} />
          <Metric label="Zadania" value={`${doneTasks}/${planning.tasks.length}`} />
        </div>
        <div className="mt-4 rounded-2xl border border-[#d8bd72]/25 bg-[#fffaf4] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-zinc-800">Wykorzystanie budzetu</p>
            <p className={`text-sm font-bold ${budgetUsage > 100 ? "text-red-700" : "text-[#2f5d50]"}`}>{budgetUsage}%</p>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white ring-1 ring-[#d8bd72]/20">
            <div className={`h-full rounded-full ${budgetUsage > 100 ? "bg-red-500" : "bg-[#2f5d50]"}`} style={{ width: `${Math.min(budgetUsage, 100)}%` }} />
          </div>
          {budgetUsage > 100 && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">Planowane wydatki przekraczaja budzet o {formatMoney(plannedExpenses - planning.budgetTarget)}.</p>}
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#d8bd72]/25 bg-[#fffaf4] p-4">
            <p className="text-sm font-semibold text-zinc-800">Najblizsze sprawy</p>
            <div className="mt-3 grid gap-2">
              {urgentTasks.length ? urgentTasks.map((task) => <CompactLine key={task.id} title={task.title} meta={`${task.dueDate} / ${task.owner || "bez wlasciciela"}`} />) : <p className="text-sm text-zinc-500">Wszystkie zadania zamkniete.</p>}
            </div>
          </div>
          <div className="rounded-2xl border border-[#d8bd72]/25 bg-[#fffaf4] p-4">
            <p className="text-sm font-semibold text-zinc-800">Wydatki i platnosci do pilnowania</p>
            <div className="mt-3 grid gap-2">
              {dueExpenses.length ? dueExpenses.map((expense) => <CompactLine key={expense.id} title={expense.label} meta={`${expense.dueDate} / zostalo ${formatMoney(Math.max(expense.amount - expense.paidAmount, 0))}`} />) : openPayments.length ? openPayments.map((payment) => <CompactLine key={payment.id} title={payment.label} meta={`${payment.dueDate} / ${formatMoney(payment.amount)}`} />) : <p className="text-sm text-zinc-500">Brak otwartych platnosci.</p>}
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-2 rounded-2xl bg-[#fffaf4] p-2 sm:grid-cols-2 xl:grid-cols-6">
          {[
            { id: "budget", label: "Budzet i wydatki" },
            { id: "tasks", label: "Checklisty" },
            { id: "vendors", label: "Uslugodawcy i umowy" },
            { id: "payments", label: "Zaliczki i platnosci" },
            { id: "documents", label: "Dokumenty" },
            { id: "attachments", label: "Zalaczniki" },
          ].map((item) => (
            <button key={item.id} type="button" onClick={() => setTab(item.id as typeof tab)} className={`min-h-10 rounded-md px-3 py-2 text-sm font-semibold transition ${tab === item.id ? "bg-[#2f5d50] text-white" : "bg-white text-zinc-700 ring-1 ring-zinc-200"}`}>
              {item.label}
            </button>
          ))}
        </div>
      </Panel>
      {tab === "budget" && <BudgetManager planning={planning} onChange={onChange} />}
      {tab === "tasks" && <PlanningTasks tasks={planning.tasks} onChange={(tasks) => onChange({ ...planning, tasks })} />}
      {tab === "vendors" && <PlanningVendors vendors={planning.vendors} onChange={(vendors) => onChange({ ...planning, vendors })} />}
      {tab === "payments" && <PlanningPayments payments={planning.payments} vendors={planning.vendors} onChange={(payments) => onChange({ ...planning, payments })} />}
      {tab === "documents" && <PlanningDocuments documents={planning.documents} vendors={planning.vendors} onChange={(documents) => onChange({ ...planning, documents })} />}
      {tab === "attachments" && <PlanningAttachments attachments={planning.attachments} planning={planning} onChange={(attachments) => onChange({ ...planning, attachments })} />}
    </div>
  );
}

function BudgetManager({ planning, onChange }: { planning: PlanningData; onChange: (planning: PlanningData) => void }) {
  const [draft, setDraft] = useState(emptyPlanningExpense);
  const [editingId, setEditingId] = useState<string | null>(null);
  const planned = planning.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paid = planning.expenses.reduce((sum, expense) => sum + expense.paidAmount, 0);
  const leftToPay = Math.max(planned - paid, 0);
  const categories = Array.from(new Set(planning.expenses.map((expense) => expense.category)));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.label.trim()) return;
    const normalizedDraft = normalizeExpenseDraft(draft);
    onChange({
      ...planning,
      expenses: editingId
        ? planning.expenses.map((expense) => (expense.id === editingId ? { ...normalizedDraft, id: editingId } : expense))
        : [...planning.expenses, { ...normalizedDraft, id: createAdminId("expense") }],
    });
    setDraft(emptyPlanningExpense);
    setEditingId(null);
  }

  function setBudgetTarget(value: number) {
    onChange({ ...planning, budgetTarget: Math.max(value, 0) });
  }

  function markExpensePaid(id: string) {
    onChange({ ...planning, expenses: planning.expenses.map((expense) => expense.id === id ? { ...expense, paidAmount: expense.amount, status: "paid" } : expense) });
  }

  function removeExpense(id: string) {
    onChange({ ...planning, expenses: planning.expenses.filter((expense) => expense.id !== id) });
  }

  return (
    <div className="grid gap-4">
      <Panel title="Budzet wesela" description="Ustal budzet, dodawaj wydatki i lacz je z zaliczkami, dokumentami oraz umowami.">
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <Field label="Budzet calkowity"><input className={inputClass} type="number" min={0} value={planning.budgetTarget} onChange={(event) => setBudgetTarget(Number(event.target.value))} /></Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Planowane wydatki" value={formatMoney(planned)} />
            <Metric label="Oplacone" value={formatMoney(paid)} />
            <Metric label="Pozostalo" value={formatMoney(leftToPay)} />
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const amount = planning.expenses.filter((expense) => expense.category === category).reduce((sum, expense) => sum + expense.amount, 0);
            return <div key={category} className="rounded-2xl bg-[#fffaf4] px-4 py-3 text-sm"><p className="font-semibold">{expenseCategoryLabel(category)}</p><p className="mt-1 text-[#2f5d50]">{formatMoney(amount)}</p></div>;
          })}
        </div>
      </Panel>

      <CrudLayout title={editingId ? "Edytuj wydatek" : "Dodaj wydatek"} description="Koszt moze byc powiazany z uslugodawca, zaliczka/platnoscia, dokumentem albo umowa." form={
        <form onSubmit={submit} className="grid gap-3">
          <Field label="Nazwa wydatku"><input className={inputClass} value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="np. Tort weselny" /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Kategoria"><select className={inputClass} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as PlanningExpense["category"] })}>{expenseCategoryOptions.map((option) => <option key={option} value={option}>{expenseCategoryLabel(option)}</option>)}</select></Field>
            <Field label="Status"><select className={inputClass} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as PlanningExpense["status"] })}><option value="planned">Planowany</option><option value="deposit-paid">Zaliczka zaplacona</option><option value="paid">Oplacony</option><option value="overdue">Po terminie</option></select></Field>
            <Field label="Kwota calkowita"><input className={inputClass} type="number" min={0} value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })} /></Field>
            <Field label="Oplacono / zaliczki"><input className={inputClass} type="number" min={0} value={draft.paidAmount} onChange={(e) => setDraft({ ...draft, paidAmount: Number(e.target.value) })} /></Field>
            <Field label="Termin"><input className={inputClass} type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} /></Field>
            <Field label="Uslugodawca"><select className={inputClass} value={draft.vendorId} onChange={(e) => setDraft({ ...draft, vendorId: e.target.value })}><option value="">Bez powiazania</option>{planning.vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}</select></Field>
            <Field label="Platnosc / zaliczka"><select className={inputClass} value={draft.paymentId} onChange={(e) => setDraft({ ...draft, paymentId: e.target.value })}><option value="">Bez powiazania</option>{planning.payments.map((payment) => <option key={payment.id} value={payment.id}>{payment.label}</option>)}</select></Field>
            <Field label="Dokument / umowa"><select className={inputClass} value={draft.documentId} onChange={(e) => setDraft({ ...draft, documentId: e.target.value })}><option value="">Bez powiazania</option>{planning.documents.map((document) => <option key={document.id} value={document.id}>{document.name}</option>)}</select></Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Plik kosztu"><input className={inputClass} type="file" onChange={(e) => setDraft({ ...draft, fileName: e.target.files?.[0]?.name ?? draft.fileName })} /></Field>
            <Field label="Fotka / inspiracja"><input className={inputClass} type="file" accept="image/*" onChange={(e) => setDraft({ ...draft, imageName: e.target.files?.[0]?.name ?? draft.imageName })} /></Field>
          </div>
          {(draft.fileName || draft.imageName) && <p className="rounded-md bg-[#fff7ed] px-3 py-2 text-sm text-zinc-600">Pliki: {[draft.fileName, draft.imageName].filter(Boolean).join(", ")}</p>}
          <Field label="Notatka"><textarea className={inputClass} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></Field>
          <FormActions editing={Boolean(editingId)} onCancel={() => { setDraft(emptyPlanningExpense); setEditingId(null); }} />
        </form>
      }>
        {planning.expenses.length === 0 ? <EmptyState text="Brak wydatkow. Dodaj sale, fotografa, dekoracje albo stroje." /> : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
              <thead className="bg-[#fffaf4] text-xs uppercase tracking-[0.12em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Wydatek</th>
                  <th className="px-4 py-3">Kategoria</th>
                  <th className="px-4 py-3 text-right">Koszt</th>
                  <th className="px-4 py-3 text-right">Oplacono</th>
                  <th className="px-4 py-3 text-right">Do zaplaty</th>
                  <th className="px-4 py-3">Termin</th>
                  <th className="px-4 py-3">Uslugodawca</th>
                  <th className="px-4 py-3">Powiazania</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {planning.expenses.map((expense) => {
                  const vendor = planning.vendors.find((item) => item.id === expense.vendorId);
                  const payment = planning.payments.find((item) => item.id === expense.paymentId);
                  const document = planning.documents.find((item) => item.id === expense.documentId);
                  const remaining = Math.max(expense.amount - expense.paidAmount, 0);
                  return (
                    <tr key={expense.id} className="align-top hover:bg-[#fffaf4]">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-zinc-950">{expense.label}</p>
                        {expense.note && <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-500">{expense.note}</p>}
                        {(expense.fileName || expense.imageName) && <p className="mt-1 text-xs text-zinc-500">Zalaczniki: {[expense.fileName, expense.imageName].filter(Boolean).join(", ")}</p>}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">{expenseCategoryLabel(expense.category)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-zinc-950">{formatMoney(expense.amount)}</td>
                      <td className="px-4 py-3 text-right text-zinc-700">{formatMoney(expense.paidAmount)}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${remaining > 0 ? "text-[#7b544d]" : "text-[#2f5d50]"}`}>{formatMoney(remaining)}</td>
                      <td className="px-4 py-3 text-zinc-600">{expense.dueDate}</td>
                      <td className="px-4 py-3 text-zinc-700">{vendor?.name ?? "Brak"}</td>
                      <td className="px-4 py-3 text-xs leading-5 text-zinc-500">
                        <p>Platnosc: {payment?.label ?? "brak"}</p>
                        <p>Dokument: {document?.name ?? "brak"}</p>
                      </td>
                      <td className="px-4 py-3"><Badge tone={expense.status === "overdue" ? "danger" : "default"}>{expenseStatusLabel(expense.status)}</Badge></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <SmallButton onClick={() => markExpensePaid(expense.id)}>Oplacone</SmallButton>
                          <RowActions onEdit={() => { setDraft(expense); setEditingId(expense.id); }} onDelete={() => removeExpense(expense.id)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t border-zinc-200 bg-[#fffaf4] font-semibold text-zinc-950">
                <tr>
                  <td className="px-4 py-3" colSpan={2}>Razem</td>
                  <td className="px-4 py-3 text-right">{formatMoney(planned)}</td>
                  <td className="px-4 py-3 text-right">{formatMoney(paid)}</td>
                  <td className="px-4 py-3 text-right">{formatMoney(leftToPay)}</td>
                  <td className="px-4 py-3" colSpan={5} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </CrudLayout>
    </div>
  );
}

function PlanningTasks({ tasks, onChange }: { tasks: PlanningTask[]; onChange: (tasks: PlanningTask[]) => void }) {
  const [draft, setDraft] = useState(emptyPlanningTask);
  const [editingId, setEditingId] = useState<string | null>(null);
  const statusOrder: Array<PlanningTask["status"]> = ["todo", "doing", "blocked", "done"];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onChange(editingId ? tasks.map((task) => (task.id === editingId ? { ...draft, id: editingId } : task)) : [...tasks, { ...draft, id: createAdminId("task") }]);
    setDraft(emptyPlanningTask);
    setEditingId(null);
  }
  function setStatus(id: string, status: PlanningTask["status"]) {
    onChange(tasks.map((task) => (task.id === id ? { ...task, status } : task)));
  }
  return (
    <CrudLayout title="Checklisty organizacyjne" description="Pilnuj terminow, wlascicieli zadan i blokad przed weselem." form={
      <form onSubmit={submit} className="grid gap-3">
        <Field label="Zadanie"><input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Kategoria"><select className={inputClass} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as PlanningTask["category"] })}><option value="formalities">Formalnosci</option><option value="vendors">Uslugodawcy</option><option value="venue">Sala</option><option value="guests">Goscie</option><option value="decor">Dekoracje</option><option value="other">Inne</option></select></Field>
          <Field label="Status"><select className={inputClass} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as PlanningTask["status"] })}><option value="todo">Do zrobienia</option><option value="doing">W toku</option><option value="done">Gotowe</option><option value="blocked">Blokada</option></select></Field>
          <Field label="Odpowiedzialny"><input className={inputClass} value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} /></Field>
          <Field label="Termin"><input className={inputClass} type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} /></Field>
        </div>
        <Field label="Notatka"><textarea className={inputClass} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></Field>
        <FormActions editing={Boolean(editingId)} onCancel={() => { setDraft(emptyPlanningTask); setEditingId(null); }} />
      </form>
    }>
      <div className="grid gap-3">
        {tasks.length === 0 && <EmptyState text="Brak zadan. Dodaj pierwsza rzecz do dopilnowania." />}
        {statusOrder.map((status) => {
          const group = tasks.filter((task) => task.status === status);
          if (!group.length) return null;
          return (
            <section key={status} className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-700">{statusLabel[status]}</h3>
                <Badge tone={status === "blocked" ? "danger" : "default"}>{group.length}</Badge>
              </div>
              <div className="grid gap-2">
                {group.map((task) => (
                  <PlanningCard key={task.id}>
                    <div className="min-w-0 break-words">
                      <p className="font-semibold text-zinc-950">{task.title}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-500">{task.dueDate} / {task.owner || "bez wlasciciela"} / {categoryLabel(task.category)}</p>
                      {task.note && <p className="mt-2 text-sm leading-6 text-zinc-600">{task.note}</p>}
                    </div>
                    <StatusButtons current={task.status} options={statusOrder} onChange={(nextStatus) => setStatus(task.id, nextStatus)} />
                    <RowActions onEdit={() => { setDraft(task); setEditingId(task.id); }} onDelete={() => onChange(tasks.filter((entry) => entry.id !== task.id))} />
                  </PlanningCard>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </CrudLayout>
  );
}

function PlanningVendors({ vendors, onChange }: { vendors: Vendor[]; onChange: (vendors: Vendor[]) => void }) {
  const [draft, setDraft] = useState(emptyVendor);
  const [editingId, setEditingId] = useState<string | null>(null);
  const contractOptions: Array<Vendor["contractStatus"]> = ["missing", "draft", "signed"];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    onChange(editingId ? vendors.map((vendor) => (vendor.id === editingId ? { ...draft, id: editingId } : vendor)) : [...vendors, { ...draft, id: createAdminId("vendor") }]);
    setDraft(emptyVendor);
    setEditingId(null);
  }
  function setContractStatus(id: string, contractStatus: Vendor["contractStatus"]) {
    onChange(vendors.map((vendor) => (vendor.id === id ? { ...vendor, contractStatus } : vendor)));
  }
  return (
    <CrudLayout title="Uslugodawcy i umowy" description="Kontakty, status rezerwacji, umowy, koszt calkowity i zaplacone zaliczki." form={
      <form onSubmit={submit} className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Kategoria"><input className={inputClass} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></Field>
          <Field label="Nazwa"><input className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="Osoba kontaktowa"><input className={inputClass} value={draft.contactName} onChange={(e) => setDraft({ ...draft, contactName: e.target.value })} /></Field>
          <Field label="Telefon"><input className={inputClass} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></Field>
          <Field label="Email"><input className={inputClass} type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
          <Field label="Termin platnosci"><input className={inputClass} type="date" value={draft.paymentDueDate} onChange={(e) => setDraft({ ...draft, paymentDueDate: e.target.value })} /></Field>
          <Field label="Status"><select className={inputClass} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Vendor["status"] })}><option value="lead">Kontakt</option><option value="shortlisted">Wybrany</option><option value="booked">Zarezerwowany</option><option value="done">Zamkniete</option></select></Field>
          <Field label="Umowa"><select className={inputClass} value={draft.contractStatus} onChange={(e) => setDraft({ ...draft, contractStatus: e.target.value as Vendor["contractStatus"] })}><option value="missing">Brak</option><option value="draft">Robocza</option><option value="signed">Podpisana</option></select></Field>
          <Field label="Koszt calkowity"><input className={inputClass} type="number" min={0} value={draft.totalCost} onChange={(e) => setDraft({ ...draft, totalCost: Number(e.target.value) })} /></Field>
          <Field label="Zaliczka zaplacona"><input className={inputClass} type="number" min={0} value={draft.depositPaid} onChange={(e) => setDraft({ ...draft, depositPaid: Number(e.target.value) })} /></Field>
        </div>
        <Field label="Notatki"><textarea className={inputClass} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></Field>
        <FormActions editing={Boolean(editingId)} onCancel={() => { setDraft(emptyVendor); setEditingId(null); }} />
      </form>
    }>
      <div className="grid gap-3">
        {vendors.length === 0 && <EmptyState text="Brak uslugodawcow. Dodaj sale, fotografa, DJ-a albo dekoracje." />}
        {vendors.map((vendor) => (
          <PlanningCard key={vendor.id}>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-zinc-950">{vendor.name}</p>
                <Badge tone={vendor.contractStatus === "missing" ? "danger" : "default"}>{statusLabel[vendor.contractStatus]}</Badge>
              </div>
              <p className="mt-1 text-sm text-zinc-500">{vendor.category} / {vendor.contactName || "bez kontaktu"} / {vendor.phone || "bez telefonu"}</p>
              <div className="mt-3 grid gap-2 rounded-xl bg-[#fffaf4] p-3 text-sm text-zinc-700 sm:grid-cols-3">
                <span>Koszt: <strong>{formatMoney(vendor.totalCost)}</strong></span>
                <span>Zaliczka: <strong>{formatMoney(vendor.depositPaid)}</strong></span>
                <span>Termin: <strong>{vendor.paymentDueDate}</strong></span>
              </div>
              {vendor.notes && <p className="mt-2 text-sm leading-6 text-zinc-600">{vendor.notes}</p>}
            </div>
            <StatusButtons current={vendor.contractStatus} options={contractOptions} onChange={(nextStatus) => setContractStatus(vendor.id, nextStatus)} />
            <RowActions onEdit={() => { setDraft(vendor); setEditingId(vendor.id); }} onDelete={() => onChange(vendors.filter((entry) => entry.id !== vendor.id))} />
          </PlanningCard>
        ))}
      </div>
    </CrudLayout>
  );
}

function PlanningPayments({ payments, vendors, onChange }: { payments: PlanningPayment[]; vendors: Vendor[]; onChange: (payments: PlanningPayment[]) => void }) {
  const [draft, setDraft] = useState({ ...emptyPlanningPayment, vendorId: vendors[0]?.id ?? "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.label.trim()) return;
    onChange(editingId ? payments.map((payment) => (payment.id === editingId ? { ...draft, id: editingId } : payment)) : [...payments, { ...draft, id: createAdminId("payment") }]);
    setDraft({ ...emptyPlanningPayment, vendorId: vendors[0]?.id ?? "" });
    setEditingId(null);
  }
  function togglePaid(id: string) {
    onChange(payments.map((payment) => (payment.id === id ? { ...payment, paid: !payment.paid } : payment)));
  }
  return (
    <CrudLayout title="Zaliczki i platnosci" description="Pilnuj rat, zaliczek, metod platnosci i tego, co zostalo do oplacenia." form={
      <form onSubmit={submit} className="grid gap-3">
        <Field label="Opis platnosci"><input className={inputClass} value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Uslugodawca"><select className={inputClass} value={draft.vendorId} onChange={(e) => setDraft({ ...draft, vendorId: e.target.value })}><option value="">Bez dostawcy</option>{vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}</select></Field>
          <Field label="Kwota"><input className={inputClass} type="number" min={0} value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })} /></Field>
          <Field label="Termin"><input className={inputClass} type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} /></Field>
          <Field label="Metoda"><input className={inputClass} value={draft.method} onChange={(e) => setDraft({ ...draft, method: e.target.value })} /></Field>
        </div>
        <Toggle label="Platnosc oplacona" checked={draft.paid} onChange={(paid) => setDraft({ ...draft, paid })} />
        <FormActions editing={Boolean(editingId)} onCancel={() => { setDraft({ ...emptyPlanningPayment, vendorId: vendors[0]?.id ?? "" }); setEditingId(null); }} />
      </form>
    }>
      <div className="grid gap-3">
        {payments.length === 0 && <EmptyState text="Brak platnosci. Dodaj zaliczke albo rate do zaplaty." />}
        {payments.map((payment) => {
          const vendor = vendors.find((item) => item.id === payment.vendorId);
          return (
            <PlanningCard key={payment.id}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-zinc-950">{payment.label}</p>
                  <Badge tone={payment.paid ? "default" : "danger"}>{payment.paid ? "Oplacone" : "Do zaplaty"}</Badge>
                </div>
                <p className="mt-1 text-sm text-zinc-500">{vendor?.name ?? "Bez dostawcy"} / {payment.dueDate} / {payment.method}</p>
                <p className="mt-2 text-2xl font-semibold text-[#2f5d50]">{formatMoney(payment.amount)}</p>
              </div>
              <SmallButton onClick={() => togglePaid(payment.id)}>{payment.paid ? "Cofnij oplacenie" : "Oznacz jako oplacone"}</SmallButton>
              <RowActions onEdit={() => { setDraft(payment); setEditingId(payment.id); }} onDelete={() => onChange(payments.filter((entry) => entry.id !== payment.id))} />
            </PlanningCard>
          );
        })}
      </div>
    </CrudLayout>
  );
}

function PlanningDocuments({ documents, vendors, onChange }: { documents: WeddingDocument[]; vendors: Vendor[]; onChange: (documents: WeddingDocument[]) => void }) {
  const [draft, setDraft] = useState(emptyWeddingDocument);
  const [editingId, setEditingId] = useState<string | null>(null);
  const documentOptions: Array<WeddingDocument["status"]> = ["needed", "uploaded", "signed", "archived"];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    onChange(editingId ? documents.map((document) => (document.id === editingId ? { ...draft, id: editingId } : document)) : [...documents, { ...draft, id: createAdminId("document") }]);
    setDraft(emptyWeddingDocument);
    setEditingId(null);
  }
  function setDocumentStatus(id: string, status: WeddingDocument["status"]) {
    onChange(documents.map((document) => (document.id === id ? { ...document, status } : document)));
  }
  return (
    <CrudLayout title="Dokumenty i zalaczniki" description="Rejestr umow, faktur, pozwolen, menu i plikow do przygotowania. Plik jest zapisywany jako nazwa w wersji lokalnej." form={
      <form onSubmit={submit} className="grid gap-3">
        <Field label="Nazwa dokumentu"><input className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Typ"><select className={inputClass} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as WeddingDocument["type"] })}><option value="contract">Umowa</option><option value="invoice">Faktura</option><option value="permit">Formalnosci</option><option value="identity">Dokumenty osobiste</option><option value="menu">Menu</option><option value="other">Inne</option></select></Field>
          <Field label="Status"><select className={inputClass} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as WeddingDocument["status"] })}><option value="needed">Potrzebny</option><option value="uploaded">Wgrany</option><option value="signed">Podpisany</option><option value="archived">Archiwum</option></select></Field>
          <Field label="Powiazany uslugodawca"><select className={inputClass} value={draft.vendorId} onChange={(e) => setDraft({ ...draft, vendorId: e.target.value })}><option value="">Brak</option>{vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}</select></Field>
          <Field label="Termin"><input className={inputClass} type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} /></Field>
        </div>
        <Field label="Plik"><input className={inputClass} type="file" onChange={(e) => setDraft({ ...draft, fileName: e.target.files?.[0]?.name ?? draft.fileName })} /></Field>
        {draft.fileName && <p className="rounded-md bg-[#fff7ed] px-3 py-2 text-sm text-zinc-600">Wybrany plik: {draft.fileName}</p>}
        <Field label="Notatka"><textarea className={inputClass} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></Field>
        <FormActions editing={Boolean(editingId)} onCancel={() => { setDraft(emptyWeddingDocument); setEditingId(null); }} />
      </form>
    }>
      <div className="grid gap-3">
        {documents.length === 0 && <EmptyState text="Brak dokumentow. Dodaj umowe, fakture albo liste formalnosci." />}
        {documents.map((document) => {
          const vendor = vendors.find((item) => item.id === document.vendorId);
          return (
            <PlanningCard key={document.id}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-zinc-950">{document.name}</p>
                  <Badge tone={document.status === "needed" ? "danger" : "default"}>{statusLabel[document.status]}</Badge>
                </div>
                <p className="mt-1 text-sm text-zinc-500">{document.dueDate} / {vendor?.name ?? "bez dostawcy"} / {documentTypeLabel(document.type)}</p>
                <p className="mt-2 rounded-xl bg-[#fffaf4] px-3 py-2 text-sm text-zinc-700">{document.fileName || "Brak zalaczonego pliku"}</p>
                {document.note && <p className="mt-2 text-sm leading-6 text-zinc-600">{document.note}</p>}
              </div>
              <StatusButtons current={document.status} options={documentOptions} onChange={(nextStatus) => setDocumentStatus(document.id, nextStatus)} />
              <RowActions onEdit={() => { setDraft(document); setEditingId(document.id); }} onDelete={() => onChange(documents.filter((entry) => entry.id !== document.id))} />
            </PlanningCard>
          );
        })}
      </div>
    </CrudLayout>
  );
}

function PlanningAttachments({ attachments, planning, onChange }: { attachments: PlanningAttachment[]; planning: PlanningData; onChange: (attachments: PlanningAttachment[]) => void }) {
  const [draft, setDraft] = useState(emptyPlanningAttachment);
  const [editingId, setEditingId] = useState<string | null>(null);
  const relatedOptions = relatedItems(planning, draft.relatedType);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.fileName.trim()) return;
    onChange(editingId ? attachments.map((attachment) => (attachment.id === editingId ? { ...draft, id: editingId } : attachment)) : [...attachments, { ...draft, id: createAdminId("attachment") }]);
    setDraft(emptyPlanningAttachment);
    setEditingId(null);
  }

  return (
    <CrudLayout title="Zalaczniki" description="Dodawaj skany umow, faktury, moodboardy, menu i pliki powiazane z zadaniami lub uslugodawcami." form={
      <form onSubmit={submit} className="grid gap-3">
        <Field label="Nazwa zalacznika"><input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Powiazanie"><select className={inputClass} value={draft.relatedType} onChange={(e) => setDraft({ ...draft, relatedType: e.target.value as PlanningAttachment["relatedType"], relatedId: "" })}><option value="general">Ogolne</option><option value="task">Zadanie</option><option value="vendor">Uslugodawca</option><option value="payment">Platnosc</option><option value="document">Dokument</option></select></Field>
          <Field label="Rekord"><select className={inputClass} value={draft.relatedId} onChange={(e) => setDraft({ ...draft, relatedId: e.target.value })}><option value="">Bez powiazania</option>{relatedOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></Field>
          <Field label="Data dodania"><input className={inputClass} type="date" value={draft.uploadedAt} onChange={(e) => setDraft({ ...draft, uploadedAt: e.target.value })} /></Field>
          <Field label="Plik"><input className={inputClass} type="file" onChange={(e) => setDraft({ ...draft, fileName: e.target.files?.[0]?.name ?? draft.fileName })} /></Field>
        </div>
        {draft.fileName && <p className="rounded-md bg-[#fff7ed] px-3 py-2 text-sm text-zinc-600">Wybrany plik: {draft.fileName}</p>}
        <Field label="Notatka"><textarea className={inputClass} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></Field>
        <FormActions editing={Boolean(editingId)} onCancel={() => { setDraft(emptyPlanningAttachment); setEditingId(null); }} />
      </form>
    }>
      <div className="grid gap-3">
        {attachments.length === 0 && <EmptyState text="Brak zalacznikow. Dodaj pierwszy plik do organizacji wesela." />}
        {attachments.map((attachment) => (
          <PlanningCard key={attachment.id}>
            <div>
              <p className="font-semibold text-zinc-950">{attachment.title}</p>
              <p className="mt-1 text-sm text-zinc-500">{attachment.uploadedAt} / {attachmentRelationLabel(attachment, planning)}</p>
              <p className="mt-2 rounded-xl bg-[#fffaf4] px-3 py-2 text-sm font-medium text-zinc-700">{attachment.fileName}</p>
              {attachment.note && <p className="mt-2 text-sm leading-6 text-zinc-600">{attachment.note}</p>}
            </div>
            <Badge>{attachmentTypeLabel(attachment.relatedType)}</Badge>
            <RowActions onEdit={() => { setDraft(attachment); setEditingId(attachment.id); }} onDelete={() => onChange(attachments.filter((entry) => entry.id !== attachment.id))} />
          </PlanningCard>
        ))}
      </div>
    </CrudLayout>
  );
}

function ThemeManager({ settings, onChange, onReset }: { settings: ThemeSettings; onChange: (settings: ThemeSettings) => void; onReset: () => void }) {
  const [draft, setDraft] = useState(settings);
  return (
    <Panel title="Ustawienia motywu i prywatnosci">
      <form onSubmit={(event) => { event.preventDefault(); onChange(draft); }} className="grid gap-4">
        <Field label="Nazwa strony"><input className={inputClass} value={draft.coupleName} onChange={(e) => setDraft({ ...draft, coupleName: e.target.value })} /></Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Motyw"><select className={inputClass} value={draft.themeId} onChange={(e) => setDraft({ ...draft, themeId: e.target.value as ThemeSettings["themeId"] })}><option value="gold">Eleganckie zloto</option><option value="rustic">Rustykalne wesele</option><option value="white">Minimalistyczna biel</option><option value="boho">Boho</option><option value="green">Butelkowa zielen</option></select></Field>
          <Field label="Kolor akcentu"><input className={`${inputClass} h-11`} type="color" value={draft.accentColor} onChange={(e) => setDraft({ ...draft, accentColor: e.target.value })} /></Field>
          <Field label="Styl okladki"><select className={inputClass} value={draft.coverStyle} onChange={(e) => setDraft({ ...draft, coverStyle: e.target.value as ThemeSettings["coverStyle"] })}><option value="classic">Klasyczny</option><option value="editorial">Editorial</option><option value="minimal">Minimalny</option></select></Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Toggle label="Publiczne RSVP" checked={draft.publicRsvp} onChange={(publicRsvp) => setDraft({ ...draft, publicRsvp })} />
          <Toggle label="Moderacja galerii" checked={draft.galleryModeration} onChange={(galleryModeration) => setDraft({ ...draft, galleryModeration })} />
          <Toggle label="Gosc widzi cala sale" checked={draft.showWholeRoomToGuests} onChange={(showWholeRoomToGuests) => setDraft({ ...draft, showWholeRoomToGuests })} />
        </div>
        <div className="rounded-2xl border border-[#d8bd72]/25 bg-[#fffaf4] p-4">
          <h3 className="font-semibold">Dostep dla gosci</h3>
          <p className="mt-1 text-sm leading-6 text-zinc-600">Kod mozesz wydrukowac w zaproszeniu. Osoby z samym linkiem nie zobacza strony bez kodu.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Tryb dostepu"><select className={inputClass} value={draft.accessMode} onChange={(e) => setDraft({ ...draft, accessMode: e.target.value as ThemeSettings["accessMode"] })}><option value="public">Publiczny link</option><option value="code">Kod z zaproszenia</option></select></Field>
            <Field label="Kod wesela"><input className={inputClass} value={draft.weddingCode} onChange={(e) => setDraft({ ...draft, weddingCode: e.target.value.toUpperCase() })} placeholder="AP2028" /></Field>
          </div>
          {draft.accessMode === "code" && <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm text-zinc-600">Tekst do zaproszenia: Kod do strony weselnej: <strong>{draft.weddingCode || "AP2028"}</strong></p>}
        </div>
        <div className="flex flex-wrap gap-2"><button type="submit" className={primaryButtonClass}>Zapisz ustawienia</button><SmallButton onClick={onReset}>Przywroc ustawienia poczatkowe</SmallButton></div>
      </form>
    </Panel>
  );
}

function PlanningCard({ children }: { children: React.ReactNode }) {
  return <article className="flex min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-[#d8bd72]/20 bg-white p-4 shadow-sm">{children}</article>;
}

function StatusButtons<T extends string>({ current, options, onChange }: { current: T; options: T[]; onChange: (status: T) => void }) {
  return (
    <div className="flex min-w-0 max-w-full flex-wrap items-start gap-1.5 border-t border-zinc-100 pt-3">
      {options.map((option) => (
        <button key={option} type="button" onClick={() => onChange(option)} className={`min-h-8 rounded-full px-3 py-1 text-xs font-semibold leading-5 transition ${current === option ? "bg-[#2f5d50] text-white" : "bg-[#f8f5ef] text-zinc-600 ring-1 ring-zinc-200 hover:bg-white"}`}>
          {statusLabel[option] ?? option}
        </button>
      ))}
    </div>
  );
}

function CompactLine({ title, meta }: { title: string; meta: string }) {
  return <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-[#d8bd72]/18"><p className="text-sm font-semibold text-zinc-800">{title}</p><p className="text-xs text-zinc-500">{meta}</p></div>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-6 text-sm text-zinc-500">{text}</div>;
}

function categoryLabel(category: PlanningTask["category"]) {
  return { formalities: "formalnosci", vendors: "uslugodawcy", venue: "sala", guests: "goscie", decor: "dekoracje", other: "inne" }[category];
}

function documentTypeLabel(type: WeddingDocument["type"]) {
  return { contract: "umowa", invoice: "faktura", permit: "formalnosci", identity: "dokumenty", menu: "menu", other: "inne" }[type];
}

function attachmentTypeLabel(type: PlanningAttachment["relatedType"]) {
  return { task: "Zadanie", vendor: "Uslugodawca", payment: "Platnosc", document: "Dokument", general: "Ogolne" }[type];
}

function relatedItems(planning: PlanningData, type: PlanningAttachment["relatedType"]) {
  if (type === "task") return planning.tasks.map((task) => ({ id: task.id, label: task.title }));
  if (type === "vendor") return planning.vendors.map((vendor) => ({ id: vendor.id, label: vendor.name }));
  if (type === "payment") return planning.payments.map((payment) => ({ id: payment.id, label: payment.label }));
  if (type === "document") return planning.documents.map((document) => ({ id: document.id, label: document.name }));
  return [];
}

function attachmentRelationLabel(attachment: PlanningAttachment, planning: PlanningData) {
  const item = relatedItems(planning, attachment.relatedType).find((entry) => entry.id === attachment.relatedId);
  return item ? `${attachmentTypeLabel(attachment.relatedType)}: ${item.label}` : attachmentTypeLabel(attachment.relatedType);
}

const expenseCategoryOptions: PlanningExpense["category"][] = ["venue", "photo", "music", "decor", "outfit", "food", "transport", "paper", "beauty", "other"];

function normalizeExpenseDraft(expense: Omit<PlanningExpense, "id">) {
  const paidAmount = Math.min(Math.max(expense.paidAmount, 0), Math.max(expense.amount, 0));
  return {
    ...expense,
    amount: Math.max(expense.amount, 0),
    paidAmount,
    status: expense.amount > 0 && paidAmount >= expense.amount ? "paid" as const : paidAmount > 0 ? "deposit-paid" as const : expense.status,
  };
}

function expenseCategoryLabel(category: PlanningExpense["category"]) {
  return {
    venue: "Sala i menu",
    photo: "Foto / wideo",
    music: "Muzyka",
    decor: "Dekoracje",
    outfit: "Stroje",
    food: "Jedzenie i tort",
    transport: "Transport",
    paper: "Papeteria",
    beauty: "Beauty",
    other: "Inne",
  }[category];
}

function expenseStatusLabel(status: PlanningExpense["status"]) {
  return {
    planned: "Planowany",
    "deposit-paid": "Zaliczka",
    paid: "Oplacony",
    overdue: "Po terminie",
  }[status];
}

function normalizeGuestKey(guest: Guest) {
  return `${guest.firstName} ${guest.lastName}`.trim().toLowerCase().replace(/\s+/g, " ");
}

function splitGuestName(value: string, fallbackLastName: string) {
  const parts = value.trim().replace(/\s+/g, " ").split(" ").filter(Boolean);
  if (parts.length === 0) return { firstName: "Osoba", lastName: "towarzyszaca" };
  if (parts.length === 1) return { firstName: parts[0], lastName: fallbackLastName || "towarzyszaca" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function csvCell(value: string) {
  const escaped = value.replace(/"/g, '""');
  return /[;"\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
}

function downloadTextFile(fileName: string, value: string) {
  const blob = new Blob([value], { type: fileName.endsWith(".svg") ? "image/svg+xml;charset=utf-8" : "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;", "'": "&apos;" }[char] ?? char));
}

function ImportBox({ onImport }: { onImport: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  if (!open) return <SmallButton onClick={() => setOpen(true)}>Import CSV tekstem</SmallButton>;
  return <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3"><p className="mb-2 text-xs leading-5 text-zinc-500">Format: imie;nazwisko;stolik;grupa;status;dieta;nocleg;transport. Status: confirmed, invited albo declined.</p><textarea className={`${inputClass} min-h-28`} value={value} onChange={(event) => setValue(event.target.value)} placeholder={"Maria;Kowalska;1;Rodzina;confirmed;wegetarianska;Pokoj 205;tak\nJan;Nowak;2;Znajomi;invited;;;nie"} /><div className="mt-2 flex gap-2"><SmallButton onClick={() => { onImport(value); setValue(""); setOpen(false); }}>Importuj</SmallButton><SmallButton onClick={() => setOpen(false)}>Anuluj</SmallButton></div></div>;
}

function CrudLayout({ title, description, form, children }: { title: string; description: string; form: React.ReactNode; children: React.ReactNode }) {
  return <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(320px,390px)_minmax(0,1fr)]"><Panel title={title} description={description}>{form}</Panel><Panel title="Rekordy">{children}</Panel></div>;
}

function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return <div className="min-w-0 rounded-3xl border border-[#d8bd72]/22 bg-white/90 p-5 shadow-lg shadow-stone-900/5 ring-1 ring-white/60"><div className="mb-4"><h2 className="text-lg font-semibold">{title}</h2>{description && <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>}</div>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-medium text-zinc-700"><span>{label}</span>{children}</label>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700"><span>{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>;
}

function DataList<T>({ items, render }: { items: T[]; render: (item: T) => React.ReactNode }) {
  if (items.length === 0) return <div className="rounded-md border border-dashed border-zinc-300 p-6 text-sm text-zinc-500">Brak rekordow.</div>;
  return <div className="grid min-w-0 max-h-[720px] gap-2 overflow-y-auto overflow-x-hidden pr-1">{items.map(render)}</div>;
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid min-w-0 gap-3 rounded-md border border-zinc-100 bg-zinc-50 p-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">{children}</div>;
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return <div className="flex min-w-0 flex-wrap items-start gap-2 border-t border-zinc-100 pt-3"><SmallButton onClick={onEdit}>Edytuj</SmallButton><SmallButton onClick={onDelete}>Usun</SmallButton></div>;
}

function FormActions({ editing, onCancel }: { editing: boolean; onCancel: () => void }) {
  return <div className="flex flex-wrap gap-2"><button type="submit" className={primaryButtonClass}>{editing ? "Zapisz zmiany" : "Dodaj"}</button>{editing && <SmallButton onClick={onCancel}>Anuluj</SmallButton>}</div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-[#d8bd72]/25"><p className="text-xs text-zinc-500">{label}</p><p className="text-xl font-semibold">{value}</p></div>;
}

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "danger" }) {
  return <span className={`inline-flex h-7 items-center justify-center rounded-full px-3 text-xs font-semibold ${tone === "danger" ? "bg-red-50 text-red-700" : "bg-[#e0f0eb] text-[#1f5f52]"}`}>{children}</span>;
}

function SmallButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button type="button" onClick={onClick} className="h-8 rounded-md border border-zinc-300 bg-white px-3 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100">{children}</button>;
}

function shapeLabel(shape: TablePlan["shape"]) {
  return { round: "okragly", rect: "prostokatny", oval: "owalny", head: "prezydialny" }[shape];
}

function tableShapeClass(shape: TablePlan["shape"]) {
  if (shape === "round") return "h-20 w-20 rounded-full";
  if (shape === "oval") return "h-16 w-28 rounded-[999px]";
  if (shape === "head") return "h-14 w-36 rounded-md bg-[#fff8e6]";
  return "h-14 w-28 rounded-md";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function snap(value: number) {
  return Math.round(value / 2) * 2;
}

function formatMoney(value: number) {
  return `${Math.round(value).toLocaleString("pl-PL")} zl`;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
}

const inputClass = "min-h-11 w-full rounded-xl border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-[#2f7d6d] focus:ring-2 focus:ring-[#2f7d6d]/20";
const primaryButtonClass = "h-10 rounded-full bg-[#2f5d50] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#254b40]";
