"use client";

import { useMemo, useState } from "react";
import { MapPinned, Search, Sparkles, Users } from "lucide-react";
import {
  ADMIN_DATA_STORAGE_KEY,
  demoWeddingAdminData,
  guestFullName,
  type Guest,
  type RoomElement,
  type TablePlan,
  type WeddingAdminData,
} from "@/lib/admin-data";
import { useWeddingDataStore } from "@/lib/wedding-data-store";

export function GuestSearch({ initialData = demoWeddingAdminData, remoteSlug }: { initialData?: WeddingAdminData; remoteSlug?: string }) {
  const [data] = useWeddingDataStore(remoteSlug ? `${ADMIN_DATA_STORAGE_KEY}:${remoteSlug}` : undefined, initialData, remoteSlug ? { remoteSlug } : undefined);
  const [query, setQuery] = useState("");
  const [selectedGuestId, setSelectedGuestId] = useState<string>("");
  const [selectedTableId, setSelectedTableId] = useState<string>(demoWeddingAdminData.tables[0]?.id ?? "");

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) return [];
    return data.guests
      .map((guest) => ({
        guest,
        table: data.tables.find((table) => table.id === guest.tableId),
        score: scoreGuest(guest, normalized),
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || guestFullName(a.guest).localeCompare(guestFullName(b.guest)))
      .slice(0, 8);
  }, [data.guests, data.tables, query]);

  const selectedGuest = data.guests.find((guest) => guest.id === selectedGuestId) ?? null;
  const selectedTable = data.tables.find((table) => table.id === (selectedGuest?.tableId || selectedTableId)) ?? data.tables[0] ?? null;
  const canShowTableMates = data.theme.showWholeRoomToGuests || Boolean(selectedGuest);
  const tableMates = selectedTable && canShowTableMates ? data.guests.filter((guest) => guest.tableId === selectedTable.id).sort((a, b) => a.seat - b.seat) : [];

  function chooseGuest(guest: Guest) {
    setSelectedGuestId(guest.id);
    setSelectedTableId(guest.tableId);
    setQuery(guestFullName(guest));
  }

  function chooseTable(tableId: string) {
    setSelectedTableId(tableId);
    setSelectedGuestId("");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="wedding-card rounded-3xl p-5">
        <div className="mb-4 rounded-3xl bg-[#234d43] p-4 text-white">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d8bd72]"><Sparkles className="size-4" /> Asystent stolika</p>
          <h3 className="mt-2 text-2xl font-semibold">Znajdz miejsce w kilka sekund</h3>
          <p className="mt-2 text-sm leading-6 text-white/72">Wpisz fragment imienia lub nazwiska, a aplikacja podpowie pasujace osoby.</p>
        </div>
        <label className="text-sm font-semibold text-stone-600" htmlFor="guest-search">Wpisz imie, nazwisko, grupe albo numer stolika</label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#d8bd72]/45 bg-white px-4 shadow-inner shadow-stone-200/60">
          <Search className="size-5 text-[#2f5d50]" />
          <input
            id="guest-search"
            className="h-14 w-full bg-transparent text-lg outline-none"
            placeholder="np. Maria Kowalska albo stolik 3"
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
              setSelectedGuestId("");
            }}
            onInput={(event) => {
              setQuery(event.currentTarget.value);
              setSelectedGuestId("");
            }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-stone-500">
          <span className="rounded-full bg-[#fff7ed] px-3 py-1">np. Maria</span>
          <span className="rounded-full bg-[#fff7ed] px-3 py-1">np. Kowalska</span>
          <span className="rounded-full bg-[#fff7ed] px-3 py-1">np. stolik 3</span>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            {suggestions.map(({ guest, table }) => (
              <button key={guest.id} type="button" onClick={() => chooseGuest(guest)} className="flex w-full items-center justify-between gap-3 border-b border-stone-100 bg-white px-4 py-3 text-left last:border-b-0 hover:bg-[#fff7ed]">
                <span><span className="block font-semibold">{guestFullName(guest)}</span><span className="text-sm text-stone-500">{guest.group} / {table ? `${table.name}, miejsce ${guest.seat}` : "bez stolika"}</span></span>
                <span className="text-sm font-semibold text-[#2f5d50]">Wybierz</span>
              </button>
            ))}
          </div>
        )}

        {query.trim().length >= 2 && suggestions.length === 0 && <p className="mt-4 rounded-2xl bg-stone-50 p-4 text-stone-600">Nie znaleziono osoby. Sprobuj wpisac samo imie, nazwisko albo numer stolika.</p>}

        {selectedTable && (
          <div className="mt-5 space-y-4">
            <div className="rounded-3xl bg-gradient-to-br from-[#eef5f1] to-[#fff8e8] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2f5d50]">{selectedGuest ? "Twoje miejsce" : "Wybrany stolik"}</p>
              <p className="text-2xl font-semibold">{selectedTable.number}. {selectedTable.name}{selectedGuest ? `, miejsce ${selectedGuest.seat}` : ""}</p>
              <p className="mt-1 text-stone-600">{selectedTable.theme ? `Motyw stolika: ${selectedTable.theme}. ` : ""}{data.theme.showWholeRoomToGuests ? "Kliknij inny stolik na mapie, aby zobaczyc osoby siedzace razem." : "Po wyszukaniu swojej osoby zobaczysz liste osob przy swoim stoliku."}</p>
              <p className="mt-3 flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 text-sm font-medium text-[#2f5d50]"><MapPinned className="size-4" /> Wejscie znajduje sie w lewym dolnym rogu mapy.</p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-semibold"><Users className="size-5 text-[#2f5d50]" /> Osoby przy stoliku ({tableMates.length}/{selectedTable.capacity})</h3>
              {canShowTableMates ? (
                <ul className="mt-2 grid gap-2">
                  {tableMates.map((mate) => (
                    <li className={`rounded-2xl px-3 py-2 ${mate.id === selectedGuest?.id ? "bg-[#2f5d50] text-white" : "bg-stone-50"}`} key={mate.id}>
                      <span className="font-medium">{mate.seat}. {guestFullName(mate)}</span>
                      {mate.companion && <span className="block text-sm opacity-80">+ {mate.companion}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">Dla prywatnosci najpierw wybierz siebie z wyszukiwarki. Wtedy pokazemy osoby przy Twoim stoliku.</p>
              )}
            </div>
            {selectedGuest?.accommodation && <div className="rounded-2xl border border-stone-200 bg-white/70 p-4"><p className="font-semibold">Nocleg</p><p className="text-stone-600">{selectedGuest.accommodation}, sniadanie 09:00-11:00.</p></div>}
          </div>
        )}
      </div>

      <GuestRoomMap tables={data.tables} elements={data.roomElements} selectedTableId={selectedTable?.id ?? ""} onSelectTable={chooseTable} guests={data.guests} />
    </div>
  );
}

function GuestRoomMap({ tables, elements, selectedTableId, onSelectTable, guests }: { tables: TablePlan[]; elements: RoomElement[]; selectedTableId: string; onSelectTable: (id: string) => void; guests: Guest[] }) {
  return (
    <div className="wedding-card relative min-h-[420px] overflow-hidden rounded-3xl bg-[#fbfaf7] p-4">
      <div className="absolute inset-4 rounded-[1.4rem] border border-dashed border-[#d8bd72]/65 bg-[radial-gradient(circle_at_center,rgba(194,164,93,0.11),transparent_36%)]" />
      {elements.map((element) => (
        <div className="absolute rounded-xl border border-stone-300 bg-white/85 p-2 text-center text-xs font-semibold text-stone-600 shadow-sm backdrop-blur" key={element.id} style={{ left: `${element.x}%`, top: `${element.y}%`, width: `${element.w}%`, height: `${element.h}%` }}>
          {element.label}
        </div>
      ))}
      {tables.map((item) => {
        const active = selectedTableId === item.id;
        const assigned = guests.filter((guest) => guest.tableId === item.id).length;
        return (
          <button
            className={`absolute flex items-center justify-center text-center text-xs font-bold shadow-md transition hover:-translate-y-[calc(50%+2px)] ${tableShapeClass(item.shape)} ${active ? "z-20 scale-110 bg-[#2f5d50] text-white ring-4 ring-[#c2a45d]/40" : "bg-white text-stone-700 ring-1 ring-[#d8bd72]/45 hover:bg-[#eef5f1]"}`}
            key={item.id}
            onClick={() => onSelectTable(item.id)}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            type="button"
          >
            <span>{item.number}<br />{assigned}/{item.capacity}</span>
          </button>
        );
      })}
    </div>
  );
}

function scoreGuest(guest: Guest, query: string) {
  const name = guestFullName(guest).toLowerCase();
  const tableText = `stolik ${guest.tableId.replace("table-", "")}`;
  if (name === query) return 100;
  if (name.startsWith(query)) return 80;
  if (name.includes(query)) return 60;
  if (guest.lastName.toLowerCase().startsWith(query)) return 55;
  if (guest.firstName.toLowerCase().startsWith(query)) return 50;
  if (guest.group.toLowerCase().includes(query)) return 25;
  if (tableText.includes(query)) return 20;
  return 0;
}

function tableShapeClass(shape: TablePlan["shape"]) {
  if (shape === "round") return "h-[12%] w-[11%] -translate-x-1/2 -translate-y-1/2 rounded-full";
  if (shape === "oval") return "h-[10%] w-[15%] -translate-x-1/2 -translate-y-1/2 rounded-[999px]";
  if (shape === "head") return "h-[9%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-md";
  return "h-[10%] w-[15%] -translate-x-1/2 -translate-y-1/2 rounded-md";
}
