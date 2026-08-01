export type AdminSection =
  | "dashboard"
  | "wedding"
  | "locations"
  | "schedule"
  | "guests"
  | "tables"
  | "faq"
  | "qr"
  | "publish"
  | "gallery"
  | "room"
  | "planning"
  | "theme";

export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  place: string;
  owner: string;
  status: "planned" | "confirmed" | "needs-review";
};

export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  companion: string;
  group: string;
  status: "invited" | "confirmed" | "declined";
  tableId: string;
  seat: number;
  dietaryNotes: string;
  child: boolean;
  accommodation: string;
  transport: boolean;
  note: string;
  token: string;
};

export type TableShape = "round" | "rect" | "oval" | "head";

export type TablePlan = {
  id: string;
  number: number;
  name: string;
  shape: TableShape;
  capacity: number;
  x: number;
  y: number;
  theme: string;
};

export type RoomElement = {
  id: string;
  label: string;
  type: "dance" | "stage" | "entry" | "bar" | "toilets" | "buffet" | "photobooth" | "terrace" | "kids" | "chillout" | "custom";
  x: number;
  y: number;
  w: number;
  h: number;
};

export type QrInvite = {
  id: string;
  label: string;
  target: string;
  scans: number;
  active: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  author: string;
  status: "pending" | "approved" | "rejected";
  category: "ceremony" | "party" | "portraits" | "details";
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  active: boolean;
};

export type PlanningTask = {
  id: string;
  title: string;
  category: "formalities" | "vendors" | "venue" | "guests" | "decor" | "other";
  owner: string;
  dueDate: string;
  status: "todo" | "doing" | "done" | "blocked";
  note: string;
};

export type Vendor = {
  id: string;
  category: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  status: "lead" | "shortlisted" | "booked" | "done";
  contractStatus: "missing" | "draft" | "signed";
  totalCost: number;
  depositPaid: number;
  paymentDueDate: string;
  notes: string;
};

export type PlanningPayment = {
  id: string;
  vendorId: string;
  label: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  method: string;
};

export type PlanningExpense = {
  id: string;
  label: string;
  category: "venue" | "photo" | "music" | "decor" | "outfit" | "food" | "transport" | "paper" | "beauty" | "other";
  vendorId: string;
  paymentId: string;
  documentId: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: "planned" | "deposit-paid" | "paid" | "overdue";
  fileName: string;
  imageName: string;
  note: string;
};

export type WeddingDocument = {
  id: string;
  name: string;
  type: "contract" | "invoice" | "permit" | "identity" | "menu" | "other";
  vendorId: string;
  status: "needed" | "uploaded" | "signed" | "archived";
  dueDate: string;
  fileName: string;
  note: string;
};

export type PlanningAttachment = {
  id: string;
  title: string;
  fileName: string;
  relatedType: "task" | "vendor" | "payment" | "document" | "general";
  relatedId: string;
  uploadedAt: string;
  note: string;
};

export type PlanningData = {
  budgetTarget: number;
  tasks: PlanningTask[];
  vendors: Vendor[];
  expenses: PlanningExpense[];
  payments: PlanningPayment[];
  documents: WeddingDocument[];
  attachments: PlanningAttachment[];
};

export type WeddingInfo = {
  bride: string;
  groom: string;
  date: string;
  ceremonyTime: string;
  ceremonyAddress: string;
  venueAddress: string;
  welcomeText: string;
  contactPhone: string;
  transportInfo: string;
};

export type ThemeSettings = {
  coupleName: string;
  themeId: "gold" | "rustic" | "white" | "boho" | "green";
  accentColor: string;
  coverStyle: "classic" | "editorial" | "minimal";
  accessMode: "public" | "code";
  weddingCode: string;
  publicRsvp: boolean;
  galleryModeration: boolean;
  showWholeRoomToGuests: boolean;
};

export type WeddingAdminData = {
  wedding: WeddingInfo;
  schedule: ScheduleItem[];
  guests: Guest[];
  tables: TablePlan[];
  roomElements: RoomElement[];
  faqItems: FaqItem[];
  qrInvites: QrInvite[];
  gallery: GalleryItem[];
  planning: PlanningData;
  theme: ThemeSettings;
};

export const ADMIN_DATA_STORAGE_KEY = "aleksandra-pawel-2028-admin-data";

export const emptyScheduleItem: Omit<ScheduleItem, "id"> = {
  time: "18:00",
  title: "",
  place: "",
  owner: "",
  status: "planned",
};

export const emptyGuest: Omit<Guest, "id" | "token"> = {
  firstName: "",
  lastName: "",
  companion: "",
  group: "Rodzina",
  status: "invited",
  tableId: "",
  seat: 1,
  dietaryNotes: "",
  child: false,
  accommodation: "",
  transport: false,
  note: "",
};

export const emptyTable: Omit<TablePlan, "id"> = {
  number: 1,
  name: "Nowy stolik",
  shape: "round",
  capacity: 8,
  x: 50,
  y: 50,
  theme: "",
};

export const emptyRoomElement: Omit<RoomElement, "id"> = {
  label: "Nowy obiekt",
  type: "custom",
  x: 12,
  y: 12,
  w: 16,
  h: 10,
};

export const emptyQrInvite: Omit<QrInvite, "id"> = {
  label: "",
  target: "/rsvp",
  scans: 0,
  active: true,
};

export const emptyGalleryItem: Omit<GalleryItem, "id"> = {
  title: "",
  author: "",
  status: "pending",
  category: "party",
};

export const emptyFaqItem: Omit<FaqItem, "id"> = {
  question: "",
  answer: "",
  active: true,
};

export const emptyPlanningTask: Omit<PlanningTask, "id"> = {
  title: "",
  category: "formalities",
  owner: "",
  dueDate: "2026-06-01",
  status: "todo",
  note: "",
};

export const emptyVendor: Omit<Vendor, "id"> = {
  category: "Sala weselna",
  name: "",
  contactName: "",
  phone: "",
  email: "",
  status: "lead",
  contractStatus: "missing",
  totalCost: 0,
  depositPaid: 0,
  paymentDueDate: "2026-06-01",
  notes: "",
};

export const emptyPlanningPayment: Omit<PlanningPayment, "id"> = {
  vendorId: "",
  label: "",
  amount: 0,
  dueDate: "2026-06-01",
  paid: false,
  method: "przelew",
};

export const emptyPlanningExpense: Omit<PlanningExpense, "id"> = {
  label: "",
  category: "other",
  vendorId: "",
  paymentId: "",
  documentId: "",
  amount: 0,
  paidAmount: 0,
  dueDate: "2026-06-01",
  status: "planned",
  fileName: "",
  imageName: "",
  note: "",
};

export const emptyWeddingDocument: Omit<WeddingDocument, "id"> = {
  name: "",
  type: "contract",
  vendorId: "",
  status: "needed",
  dueDate: "2026-06-01",
  fileName: "",
  note: "",
};

export const emptyPlanningAttachment: Omit<PlanningAttachment, "id"> = {
  title: "",
  fileName: "",
  relatedType: "general",
  relatedId: "",
  uploadedAt: "2026-06-01",
  note: "",
};

const firstNames = [
  "Maria",
  "Jan",
  "Katarzyna",
  "Piotr",
  "Agnieszka",
  "Tomasz",
  "Magdalena",
  "Pawel",
  "Joanna",
  "Krzysztof",
  "Natalia",
  "Adam",
  "Ewa",
  "Michal",
  "Karolina",
];

const lastNames = [
  "Kowalska",
  "Nowak",
  "Wisniewski",
  "Wojcik",
  "Kowalczyk",
  "Kaminska",
  "Lewandowski",
  "Zielinska",
  "Szymanski",
  "Dabrowska",
];

export const demoTables: TablePlan[] = Array.from({ length: 10 }, (_, index) => ({
  id: `table-${index + 1}`,
  number: index + 1,
  name: index === 0 ? "Stol prezydialny" : `Stolik ${index + 1}`,
  shape: index === 0 ? "head" : index % 4 === 0 ? "rect" : index % 5 === 0 ? "oval" : "round",
  capacity: index === 0 ? 10 : 9,
  x: 12 + (index % 5) * 17,
  y: index < 5 ? 24 : 62,
  theme: ["Piwonie", "Rzym", "Jazz", "Tatry", "Kino"][index % 5],
}));

export const demoGuests: Guest[] = Array.from({ length: 90 }, (_, index) => {
  const table = demoTables[index % demoTables.length];
  return {
    id: `guest-${index + 1}`,
    firstName: firstNames[index % firstNames.length],
    lastName: lastNames[(index + Math.floor(index / 7)) % lastNames.length],
    companion: index % 4 === 0 ? "osoba towarzyszaca" : "",
    group: index % 2 === 0 ? "Rodzina panny mlodej" : index % 3 === 0 ? "Znajomi" : "Rodzina pana mlodego",
    status: index % 8 === 0 ? "invited" : "confirmed",
    tableId: table.id,
    seat: (index % table.capacity) + 1,
    dietaryNotes: index % 17 === 0 ? "wegetarianska" : index % 23 === 0 ? "bez glutenu" : "",
    child: index % 19 === 0,
    accommodation: index % 5 === 0 ? `Pokoj 20${index % 9}` : "",
    transport: index % 6 === 0,
    note: index % 13 === 0 ? "Usadzic blisko rodziny" : "",
    token: `gosc-${index + 1}`,
  };
});

export const demoWeddingAdminData: WeddingAdminData = {
  wedding: {
    bride: "Aleksandra",
    groom: "Pawel",
    date: "2028-06-17",
    ceremonyTime: "14:00",
    ceremonyAddress: "Miejsce ceremonii do uzupelnienia",
    venueAddress: "Sala weselna do uzupelnienia",
    welcomeText: "Cieszymy sie, ze bedziesz z nami. Tu znajdziesz plan dnia, swoje miejsce, lokalizacje i galerie.",
    contactPhone: "+48 500 100 200",
    transportInfo: "Szczegoly transportu uzupelnimy blizej wesela.",
  },
  schedule: [
    { id: "schedule-ceremony", time: "14:00", title: "Ceremonia slubna", place: "Kosciol sw. Anny", owner: "Swiadkowa", status: "confirmed" },
    { id: "schedule-transfer", time: "15:15", title: "Przejazd na sale", place: "Plac przed kosciolem", owner: "Transport", status: "confirmed" },
    { id: "schedule-welcome", time: "16:00", title: "Powitanie pary mlodej", place: "Dworek Pod Lipami", owner: "Manager sali", status: "confirmed" },
    { id: "schedule-dinner", time: "16:15", title: "Obiad", place: "Sala glowna", owner: "Manager sali", status: "planned" },
    { id: "schedule-first-dance", time: "17:30", title: "Pierwszy taniec", place: "Parkiet", owner: "DJ", status: "confirmed" },
    { id: "schedule-cake", time: "20:00", title: "Tort weselny", place: "Parkiet", owner: "Cukiernia", status: "planned" },
  ],
  guests: [],
  tables: demoTables,
  roomElements: [
    { id: "dance", label: "Parkiet", type: "dance", x: 38, y: 38, w: 24, h: 18 },
    { id: "bar", label: "Bar", type: "bar", x: 80, y: 14, w: 12, h: 12 },
    { id: "entry", label: "Wejscie", type: "entry", x: 5, y: 78, w: 14, h: 10 },
    { id: "stage", label: "Scena", type: "stage", x: 43, y: 8, w: 18, h: 10 },
    { id: "kids", label: "Kacik dzieci", type: "kids", x: 74, y: 70, w: 16, h: 12 },
  ],
  qrInvites: [
    { id: "qr-rsvp", label: "RSVP glowne", target: "/rsvp", scans: 126, active: true },
    { id: "qr-gallery", label: "Dodaj zdjecia", target: "/upload", scans: 44, active: true },
  ],
  faqItems: [
    { id: "faq-parking", question: "Czy na miejscu jest parking?", answer: "Tak, parking jest bezplatny i znajduje sie przy sali.", active: true },
    { id: "faq-transport", question: "Czy bedzie transport powrotny?", answer: "Tak, autobusy odjezdzaja o 02:00 i 04:00.", active: true },
    { id: "faq-photos", question: "Gdzie wrzucac zdjecia?", answer: "Uzyj przycisku Dodaj zdjecia albo kodu QR na stoliku.", active: true },
  ],
  gallery: [],
  planning: {
    budgetTarget: 0,
    tasks: [],
    vendors: [],
    expenses: [],
    payments: [],
    documents: [],
    attachments: [],
  },
  theme: {
    coupleName: "Aleksandra i Pawel",
    themeId: "gold",
    accentColor: "#2f7d6d",
    coverStyle: "editorial",
    accessMode: "code",
    weddingCode: "AP2028",
    publicRsvp: true,
    galleryModeration: true,
    showWholeRoomToGuests: true,
  },
};

export function createAdminId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function guestFullName(guest: Pick<Guest, "firstName" | "lastName">) {
  return `${guest.firstName} ${guest.lastName}`.trim();
}

export function createWeddingAdminDataForCouple({
  coupleNames,
  weddingDate,
  phone,
  slug,
}: {
  coupleNames: string;
  weddingDate?: string;
  phone?: string;
  slug?: string;
}): WeddingAdminData {
  const { bride, groom } = splitCoupleNames(coupleNames);
  const weddingCode = slug ? slug.replace(/-/g, "").slice(0, 10).toUpperCase() : `${bride}${groom}`.replace(/\s+/g, "").slice(0, 10).toUpperCase();

  return normalizeWeddingAdminData({
    ...demoWeddingAdminData,
    wedding: {
      ...demoWeddingAdminData.wedding,
      bride,
      groom,
      date: weddingDate || demoWeddingAdminData.wedding.date,
      ceremonyAddress: "",
      venueAddress: "",
      welcomeText: "Cieszymy sie, ze bedziesz z nami. Tu znajdziesz najwazniejsze informacje o naszym weselu.",
      contactPhone: phone || "",
      transportInfo: "",
    },
    guests: [],
    tables: demoTables.map((table) => ({ ...table, id: `${slug || "wedding"}-${table.id}` })),
    faqItems: demoWeddingAdminData.faqItems,
    gallery: [],
    qrInvites: demoWeddingAdminData.qrInvites,
    theme: {
      ...demoWeddingAdminData.theme,
      coupleName: `${bride} i ${groom}`,
      weddingCode: weddingCode || "WESELE",
    },
  });
}

function splitCoupleNames(value: string) {
  const normalized = value.trim() || "Nowa Para";
  const parts = normalized.split(/\s+i\s+|\s*&\s*|\s+oraz\s+/i).map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return { bride: parts[0], groom: parts.slice(1).join(" i ") };
  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return { bride: words[0], groom: words.slice(1).join(" ") };
  return { bride: normalized, groom: "Partner" };
}

export function normalizeWeddingAdminData(raw: unknown): WeddingAdminData {
  if (!raw || typeof raw !== "object") return demoWeddingAdminData;
  const value = raw as Partial<WeddingAdminData> & {
    guests?: Array<Partial<Guest> & { name?: string; party?: string; email?: string }>;
    tables?: Array<Partial<TablePlan> & { shape?: string; capacity?: number }>;
  };

  const tables = Array.isArray(value.tables)
    ? value.tables.map((table, index) => ({
        ...demoTables[index % demoTables.length],
        ...table,
        id: table.id ?? createAdminId("table"),
        number: Number(table.number ?? index + 1),
        name: table.name ?? `Stolik ${index + 1}`,
        shape: normalizeShape(table.shape),
        capacity: Number(table.capacity ?? 8),
        x: Number(table.x ?? 12 + (index % 5) * 17),
        y: Number(table.y ?? (index < 5 ? 24 : 62)),
        theme: table.theme ?? "",
      }))
    : demoTables;

  const guests = Array.isArray(value.guests)
    ? value.guests.map((guest, index) => {
        const legacyGuest = guest as Partial<Guest> & { name?: string; party?: string };
        const fullName = legacyGuest.name ?? guestFullName({ firstName: guest.firstName ?? "", lastName: guest.lastName ?? "" });
        const [firstName = "", ...rest] = fullName.trim().split(/\s+/);
        const fallbackTable = tables[index % tables.length];
        return {
          ...demoGuests[index % demoGuests.length],
          ...guest,
          id: guest.id ?? createAdminId("guest"),
          firstName: guest.firstName ?? firstName,
          lastName: guest.lastName ?? rest.join(" "),
          companion: guest.companion ?? "",
          group: guest.group ?? legacyGuest.party ?? "Goscie",
          tableId: guest.tableId && tables.some((table) => table.id === guest.tableId) ? guest.tableId : fallbackTable?.id ?? "",
          seat: Number(guest.seat ?? ((index % (fallbackTable?.capacity ?? 8)) + 1)),
          dietaryNotes: guest.dietaryNotes ?? "",
          child: Boolean(guest.child),
          accommodation: guest.accommodation ?? "",
          transport: Boolean(guest.transport),
          note: guest.note ?? "",
          token: guest.token ?? createAdminId("token"),
        };
      }).filter((guest) => guest.firstName || guest.lastName)
    : demoGuests;

  return {
    ...demoWeddingAdminData,
    ...value,
    wedding: { ...demoWeddingAdminData.wedding, ...value.wedding },
    theme: { ...demoWeddingAdminData.theme, ...value.theme },
    tables,
    guests,
    roomElements: Array.isArray(value.roomElements) ? value.roomElements as RoomElement[] : demoWeddingAdminData.roomElements,
    schedule: Array.isArray(value.schedule) ? value.schedule as ScheduleItem[] : demoWeddingAdminData.schedule,
    faqItems: Array.isArray(value.faqItems) ? value.faqItems as FaqItem[] : demoWeddingAdminData.faqItems,
    qrInvites: Array.isArray(value.qrInvites) ? value.qrInvites as QrInvite[] : demoWeddingAdminData.qrInvites,
    gallery: Array.isArray(value.gallery) ? value.gallery as GalleryItem[] : demoWeddingAdminData.gallery,
    planning: normalizePlanning(value.planning),
  };
}

function normalizePlanning(planning: WeddingAdminData["planning"] | undefined): PlanningData {
  if (!planning || typeof planning !== "object") return demoWeddingAdminData.planning;
  return {
    budgetTarget: Number(planning.budgetTarget ?? demoWeddingAdminData.planning.budgetTarget),
    tasks: Array.isArray(planning.tasks) ? planning.tasks as PlanningTask[] : demoWeddingAdminData.planning.tasks,
    vendors: Array.isArray(planning.vendors) ? planning.vendors as Vendor[] : demoWeddingAdminData.planning.vendors,
    expenses: Array.isArray(planning.expenses) ? planning.expenses as PlanningExpense[] : demoWeddingAdminData.planning.expenses,
    payments: Array.isArray(planning.payments) ? planning.payments as PlanningPayment[] : demoWeddingAdminData.planning.payments,
    documents: Array.isArray(planning.documents) ? planning.documents as WeddingDocument[] : demoWeddingAdminData.planning.documents,
    attachments: Array.isArray(planning.attachments) ? planning.attachments as PlanningAttachment[] : demoWeddingAdminData.planning.attachments,
  };
}

function normalizeShape(shape: string | undefined): TableShape {
  if (shape === "round" || shape === "rect" || shape === "oval" || shape === "head") return shape;
  if (shape === "long") return "rect";
  return "round";
}
