export const MAPS_URL = "https://yandex.ru/maps/org/koreafan_auto/95831248215/";

export type Service = {
  id: string;
  name: string;
  price: number;
  minutes: number;
  blurb: string;
  includes: string[];
  active: boolean;
};

export type WorkItem = {
  id: string;
  title: string;
  image: string;
  scale: number;
  x: number;
  y: number;
};

export type Promo = {
  id: string;
  title: string;
  text: string;
  active: boolean;
};

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Booking = {
  id: string;
  serviceId: string;
  serviceName: string;
  price: number;
  name: string;
  phone: string;
  car: string;
  start: string;
  end: string;
  status: BookingStatus;
  note: string;
  createdAt: string;
};

export type StudioData = {
  brandShort: string;
  brandFull: string;
  monogram: string;
  tagline: string;
  district: string;
  address: string;
  phone: string;
  telegram: string;
  vk: string;
  whatsapp: string;
  workDays: number[];
  workStart: number;
  workEnd: number;
  slotStep: number;
  boxes: number;
  cardServiceLabel: string;
  cardBoxLabel: string;
  cardPriceLabel: string;
  logoImage: string;
  hero: string;
  heroScale: number;
  heroX: number;
  heroY: number;
  services: Service[];
  works: WorkItem[];
  promos: Promo[];
  bookings: Booking[];
};

export const REVIEWS = [
  {
    name: "Евгений Постнов",
    date: "16 февраля",
    text: "Приехал на Chevrolet Trailblazer из Кореи — застучали подшипники. Быстро нашли причину, дали рекомендации и нужные запчасти. Гуманные цены и отношение к клиенту.",
  },
  {
    name: "Виктория Ф.",
    date: "9 декабря 2025",
    text: "Мастера находят реальную проблему и не навязывают лишнее. Цены лояльные, персонал объясняет, что и почему нужно делать.",
  },
  {
    name: "А. Л.",
    date: "24 октября 2025",
    text: "Диагностика и ТО: нашли несколько неисправностей, заменили масло и фильтры, сказали, за чем следить. По срокам и стоимости осталась довольна.",
  },
] as const;

export const PAYMENTS = ["Карта", "СБП", "QR", "Наличные", "Перевод"] as const;

export const RATING = { score: "4,6", ratings: 12, reviews: 10 };

export const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

const MONTHS = [
  "янв.",
  "февр.",
  "мар.",
  "апр.",
  "мая",
  "июн.",
  "июл.",
  "авг.",
  "сент.",
  "окт.",
  "нояб.",
  "дек.",
];

export const defaultStudio = (): StudioData => ({
  brandShort: "KoreaFan",
  brandFull: "KoreaFan Auto",
  monogram: "KF",
  tagline: "Сервис Hyundai и Kia: точная диагностика, ТО и подвеска без лишних работ",
  district: "Санкт-Петербург · исторический район Ручьи",
  address: "Санкт-Петербург, исторический район Ручьи. Точный адрес уточняйте по телефону.",
  phone: "+7 (931) 100-77-79",
  telegram: "",
  vk: "https://vk.com/koreafanauto",
  whatsapp: "",
  workDays: [1, 2, 3, 4, 5],
  workStart: 10,
  workEnd: 21,
  slotStep: 60,
  boxes: 1,
  cardServiceLabel: "направлений работ",
  cardBoxLabel: "запись по времени",
  cardPriceLabel: "стоимость уточняется",
  logoImage: "",
  hero: "/studio/hero.jpg",
  heroScale: 1,
  heroX: 0,
  heroY: 0,
  services: [
    {
      id: 'svc-bearings',
      name: 'Ремонт шаровых опор',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-electric',
      name: 'Ремонт автоэлектрики',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-auto',
      name: 'Ремонт автомобиля',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-steering',
      name: 'Ремонт рулевого управления',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-cooling',
      name: 'Ремонт системы охлаждения',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-power-steering',
      name: 'Ремонт гидроусилителя руля',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-endoscopy',
      name: 'Эндоскопия двигателя',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-parts',
      name: 'Запчасти и аксессуары под заказ',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-polish',
      name: 'Полировка',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-clutch',
      name: 'Ремонт сцепления',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-axle',
      name: 'Ремонт моста',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-shock',
      name: 'Ремонт амортизаторов',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-headlights',
      name: 'Ремонт фар',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-ac',
      name: 'Заправка и ремонт кондиционера',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-paint',
      name: 'Покраска автомобиля',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-fuel',
      name: 'Ремонт топливной системы',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-bumper',
      name: 'Ремонт пластиковых бамперов',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-brakes',
      name: 'Ремонт тормозной системы',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-injector',
      name: 'Чистка топливных форсунок',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-starter',
      name: 'Ремонт стартера',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-parking',
      name: 'Установка парктроников',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-timing',
      name: 'Замена ремня ГРМ',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-oil',
      name: 'Замена масла',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-diagnostics',
      name: 'Компьютерная диагностика автомобиля',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-maintenance',
      name: 'Полное техническое обслуживание',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-equipment',
      name: 'Установка дополнительного оборудования',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-running',
      name: 'Ремонт ходовой части',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-exhaust',
      name: 'Ремонт выхлопной системы',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-catalyst',
      name: 'Удаление катализатора',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-gearbox',
      name: 'Ремонт коробки передач',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-engine',
      name: 'Ремонт двигателя',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-head',
      name: 'Ремонт головки блока цилиндров',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-tire',
      name: 'Шиномонтаж',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-balance',
      name: 'Балансировка колёс',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
    {
      id: 'svc-start',
      name: 'Помощь при запуске автомобиля',
      price: 0,
      minutes: 60,
      blurb: "Стоимость и длительность определяются после уточнения задачи и осмотра автомобиля.",
      includes: [],
      active: true,
    },
  ],
  works: [
    { id: "w1", title: "Иллюстрация · внешний вид автомобиля", image: "/studio/work-hood.jpg", scale: 1, x: 0, y: 0 },
    { id: "w2", title: "Иллюстрация · кузовные детали", image: "/studio/work-side.jpg", scale: 1, x: 0, y: 0 },
    { id: "w3", title: "Иллюстрация · детали автомобиля", image: "/studio/work-detail.jpg", scale: 1, x: 0, y: 0 },
  ],
  promos: [
    {
      id: "promo-diag",
      title: "Диагностика без навязывания",
      text: "Hyundai и Kia — 1 000 ₽. Сначала причина, потом смета.",
      active: false,
    },
  ],
  bookings: [],
});

export function rub(n: number) {
  return n > 0 ? `${new Intl.NumberFormat("ru-RU").format(n)} ₽` : "По запросу";
}

export function dur(min: number) {
  if (min > 0 && min % 1440 === 0) return `${min / 1440} д`;
  if (min > 0 && min % 60 === 0) return `${min / 60} ч`;
  return `${min} мин`;
}

export function digits(s: string) {
  return s.replace(/\D/g, "");
}

export function activeServices(data: StudioData) {
  return data.services.filter((s) => s.active);
}

export function minPrice(data: StudioData) {
  const list = activeServices(data);
  if (!list.length) return 0;
  const priced = list.map((s) => s.price).filter((n) => n > 0);
  return priced.length ? Math.min(...priced) : 0;
}

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function isoWeekday(d: Date) {
  const js = d.getDay();
  return js === 0 ? 7 : js;
}

export function isWorkDay(d: Date, days: number[]) {
  return days.includes(isoWeekday(d));
}

export function startOfWeek(d: Date) {
  const x = startOfDay(d);
  const diff = isoWeekday(x) - 1;
  return addDays(x, -diff);
}

export function fmtDay(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function fmtRange(a: Date, b: Date) {
  const y = b.getFullYear();
  if (a.getFullYear() === y) return `${fmtDay(a)} – ${fmtDay(b)} ${y} г.`;
  return `${fmtDay(a)} ${a.getFullYear()} – ${fmtDay(b)} ${y} г.`;
}

export function fmtWhen(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
}

export function fmtTime(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function hoursLabel(data: StudioData) {
  const days = data.workDays.slice().sort((a, b) => a - b);
  const names = days.map((n) => WEEKDAYS[n - 1]).join(", ");
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${names} · ${pad(data.workStart)}:00–${pad(data.workEnd)}:00 (график можно изменить в админ-панели)`;
}

export function slotOptions(day: Date, minutes: number, data: StudioData) {
  const open = new Date(day);
  open.setHours(data.workStart, 0, 0, 0);
  const close = new Date(day);
  close.setHours(data.workEnd, 0, 0, 0);
  const step = Math.max(15, data.slotStep) * 60_000;
  const need = Math.max(15, minutes) * 60_000;
  const out: { start: Date; end: Date; free: boolean }[] = [];
  for (let t = open.getTime(); t + need <= close.getTime(); t += step) {
    const start = new Date(t);
    const end = new Date(t + need);
    const busy = data.bookings.filter((b) => {
      if (b.status === "cancelled") return false;
      return new Date(b.start) < end && start < new Date(b.end);
    }).length;
    out.push({ start, end, free: start.getTime() > Date.now() && busy < data.boxes });
  }
  return out;
}

export function bayLoad(data: StudioData, from: Date) {
  const days = [0, 1, 2, 3, 4].map((i) => addDays(from, i));
  return days.map((day) => {
    const next = addDays(day, 1);
    const count = data.bookings.filter((b) => {
      if (b.status === "cancelled") return false;
      const t = new Date(b.start);
      return t >= day && t < next;
    }).length;
    return { day, count };
  });
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждена",
  completed: "Выполнена",
  cancelled: "Отмена",
};

export function nextStatus(s: BookingStatus): BookingStatus {
  if (s === "pending") return "confirmed";
  if (s === "confirmed") return "completed";
  if (s === "completed") return "cancelled";
  return "pending";
}
