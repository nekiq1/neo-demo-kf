import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  LogOut,
  MapPin,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Stamp,
  Upload,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Screen } from "@/components/screen";
import { checkAdminPin, notifyStatus, sendNotify } from "@/lib/notify";
import { useStudio } from "@/lib/store";
import {
  STATUS_LABEL,
  WEEKDAYS,
  activeServices,
  addDays,
  fmtDay,
  fmtRange,
  fmtTime,
  fmtWhen,
  hoursLabel,
  nextStatus,
  rub,
  startOfDay,
  startOfWeek,
  type Promo,
  type Service,
  type WorkItem,
} from "@/lib/studio";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type Panel =
  | "add"
  | "hours"
  | "contacts"
  | "cards"
  | "services"
  | "logo"
  | "hero"
  | "works"
  | "promos"
  | null;

type Status = { channel: string; telegram: boolean; vk: boolean; pin: boolean };

function AdminPage() {
  const data = useStudio();
  const [mode, setMode] = useState<"day" | "week">("week");
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()));
  const [panel, setPanel] = useState<Panel>(null);
  const [gate, setGate] = useState<"check" | "open" | "lock">("check");
  const [status, setStatus] = useState<Status | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    void notifyStatus()
      .then((s) => {
        setStatus(s);
        if (!s.pin || sessionStorage.getItem("koreafan-admin") === "1") setGate("open");
        else setGate("lock");
      })
      .catch(() => setGate("lock"));
  }, []);

  const from = mode === "week" ? startOfWeek(anchor) : anchor;
  const to = addDays(from, mode === "week" ? 7 : 1);
  const inRange = data.bookings.filter((b) => {
    const t = new Date(b.start);
    return t >= from && t < to;
  });
  const visits = inRange.filter((b) => b.status !== "cancelled");
  const done = inRange.filter((b) => b.status === "completed");
  const money = done.reduce((sum, b) => sum + b.price, 0);
  const label =
    mode === "week" ? fmtRange(from, addDays(from, 6)) : `${fmtDay(from)} ${from.getFullYear()} г.`;

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    const res = await checkAdminPin({ data: { username, password, pin } });
    if (res.ok) {
      sessionStorage.setItem("koreafan-admin", "1");
      setGate("open");
    } else setPinError("Неверный код");
  }

  if (gate !== "open") {
    return (
      <Screen tone="orange" admin>
        <h1 className="mt-8 text-5xl font-extrabold tracking-tight">Расписание</h1>
        {gate === "check" ? <p className="mt-3 text-muted">Открываем…</p> : null}
        {gate === "lock" ? (
          <form onSubmit={unlock} className="mt-6 space-y-3">
            <p className="text-muted">Вход администратора</p>
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" placeholder="Логин" className="w-full rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" placeholder="Пароль" className="w-full rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue" />
            <details className="text-xs text-dim"><summary>Войти по старому PIN</summary><input value={pin} onChange={(e) => setPin(e.target.value)} type="password" placeholder="ADMIN_PIN" className="mt-2 w-full rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue" /></details>
            {pinError ? <p className="text-sm text-orange">{pinError}</p> : null}
            <button className="h-12 w-full rounded-full bg-blue font-semibold text-on-blue">Войти</button>
          </form>
        ) : null}
      </Screen>
    );
  }

  return (
    <Screen tone="orange" admin>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight">Расписание</h1>
          <p className="mt-2 text-lg text-muted">{data.district}</p>
        </div>
        <Link to="/" aria-label="Назад" className="grid size-14 place-items-center rounded-full bg-card ring-1 ring-line">
          <LogOut className="size-5" />
        </Link>
      </div>

      <p className="mt-8 px-2 text-lg text-dim">Дата</p>
      <div className="mt-2 flex items-center gap-2">
        <button type="button" aria-label="Назад" onClick={() => setAnchor(addDays(anchor, mode === "week" ? -7 : -1))} className="grid size-14 shrink-0 place-items-center rounded-full bg-card ring-1 ring-line">
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex h-14 flex-1 items-center justify-center rounded-full bg-card px-3 text-center text-lg font-medium ring-1 ring-line">
          {label}
        </div>
        <button type="button" aria-label="Вперёд" onClick={() => setAnchor(addDays(anchor, mode === "week" ? 7 : 1))} className="grid size-14 shrink-0 place-items-center rounded-full bg-card ring-1 ring-line">
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => setMode("day")} className={`h-16 rounded-full text-lg font-semibold ${mode === "day" ? "glow bg-blue text-on-blue" : "bg-card ring-1 ring-line"}`}>
          День
        </button>
        <button type="button" onClick={() => setMode("week")} className={`h-16 rounded-full text-lg font-semibold ${mode === "week" ? "glow bg-blue text-on-blue" : "bg-card ring-1 ring-line"}`}>
          Неделя
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <Stat label="Заезды" value={String(visits.length)} />
        <Stat label="Выполнено" value={String(done.length)} />
        <Stat label="Получено" value={rub(money)} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Tile accent icon={<Plus className="size-4" />} label="Добавить запись" onClick={() => setPanel("add")} />
        <Tile icon={<Calendar className="size-4" />} label="Часы работы" onClick={() => setPanel("hours")} />
        <Tile icon={<MapPin className="size-4" />} label="Контакты" onClick={() => setPanel("contacts")} />
        <Tile icon={<SlidersHorizontal className="size-4" />} label="Карточки витрины" onClick={() => setPanel("cards")} />
        <Tile icon={<Wrench className="size-4" />} label="Услуги" onClick={() => setPanel("services")} />
        <Tile icon={<Stamp className="size-4" />} label="Логотип" onClick={() => setPanel("logo")} />
        <Tile icon={<ImageIcon className="size-4" />} label="Главное фото" onClick={() => setPanel("hero")} />
        <Tile icon={<Upload className="size-4" />} label="Работы" onClick={() => setPanel("works")} />
      </div>
      <button type="button" onClick={() => setPanel("promos")} className="mt-3 flex h-16 w-full items-center justify-center gap-2 rounded-full bg-card text-base font-semibold ring-1 ring-line">
        <Sparkles className="size-4" /> Акции
      </button>

      <h2 className="mt-8 text-3xl font-extrabold">Брони ({visits.length})</h2>
      <div className="mt-3 space-y-2">
        {inRange.length === 0 ? <p className="text-sm text-muted">На эти даты заездов нет.</p> : null}
        {inRange.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => data.setBookingStatus(b.id, nextStatus(b.status))}
            className="w-full rounded-[20px] bg-card px-4 py-3 text-left ring-1 ring-line"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">{b.serviceName}</p>
              <p className="text-sm text-muted">{STATUS_LABEL[b.status]}</p>
            </div>
            <p className="mt-1 text-sm text-dim">
              {fmtWhen(b.start)} · {b.name} · {b.phone}
            </p>
            <p className="mt-1 text-sm">{rub(b.price)} · нажмите, чтобы сменить статус</p>
          </button>
        ))}
      </div>

      {panel ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-bg/75 px-3 pb-3">
          <div className="max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-card bg-card-2 p-4 ring-1 ring-line">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{PANEL_TITLE[panel]}</h2>
              <button type="button" onClick={() => setPanel(null)} className="rounded-full bg-card px-3 py-2 text-sm">
                Закрыть
              </button>
            </div>
            {panel === "add" ? <AddPanel onDone={() => setPanel(null)} /> : null}
            {panel === "hours" ? <HoursPanel /> : null}
            {panel === "contacts" ? <ContactsPanel status={status} /> : null}
            {panel === "cards" ? <CardsPanel /> : null}
            {panel === "services" ? <ServicesPanel /> : null}
            {panel === "logo" ? <LogoPanel /> : null}
            {panel === "hero" ? <HeroPanel /> : null}
            {panel === "works" ? <WorksPanel /> : null}
            {panel === "promos" ? <PromosPanel /> : null}
          </div>
        </div>
      ) : null}
    </Screen>
  );
}

const PANEL_TITLE: Record<Exclude<Panel, null>, string> = {
  add: "Новая запись",
  hours: "Часы работы",
  contacts: "Контакты",
  cards: "Карточки витрины",
  services: "Услуги",
  logo: "Логотип",
  hero: "Главное фото",
  works: "Работы",
  promos: "Акции",
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[28px] bg-card px-4 pt-5 pb-4 ring-1 ring-line">
      <p className="text-base text-muted">{label}</p>
      <p className="mt-5 text-4xl font-bold">{value}</p>
    </div>
  );
}

function Tile({
  icon,
  label,
  onClick,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-16 items-center justify-center gap-2 rounded-full px-3 py-2 text-center text-base leading-tight font-semibold ${accent ? "glow bg-blue text-on-blue" : "bg-card ring-1 ring-line"}`}
    >
      {icon}
      {label}
    </button>
  );
}

const field = "mt-2 w-full rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue";

function AddPanel({ onDone }: { onDone: () => void }) {
  const data = useStudio();
  const services = activeServices(data);
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [when, setWhen] = useState(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(Math.min(20, Math.max(10, d.getHours() + 1)));
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    return local;
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [car, setCar] = useState("");
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const service = services.find((s) => s.id === serviceId);
    if (!service || name.trim().length < 2 || phone.trim().length < 6) {
      setError("Укажите услугу, имя и телефон.");
      return;
    }
    const start = new Date(when);
    if (Number.isNaN(start.getTime())) {
      setError("Некорректная дата.");
      return;
    }
    const end = new Date(start.getTime() + service.minutes * 60_000);
    const booking = {
      id: crypto.randomUUID(),
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      name: name.trim(),
      phone: phone.trim(),
      car: car.trim(),
      start: start.toISOString(),
      end: end.toISOString(),
      status: "confirmed" as const,
      note: "Добавлено из расписания",
      createdAt: new Date().toISOString(),
    };
    data.addBooking(booking);
    try {
      await sendNotify({
        data: {
          kind: "booking",
          title: "KoreaFan Auto — запись из админки",
          lines: [
            `${service.name} · ${rub(service.price)}`,
            `${fmtDay(start)} ${fmtTime(start)}`,
            `${booking.name} · ${booking.phone}`,
            booking.car || "Авто не указано",
          ],
        },
      });
    } catch {
      /* запись уже в расписании */
    }
    onDone();
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <select className={field} value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <input type="datetime-local" className={field} value={when} onChange={(e) => setWhen(e.target.value)} />
      <input className={field} placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
      <input className={field} placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input className={field} placeholder="Авто" value={car} onChange={(e) => setCar(e.target.value)} />
      {error ? <p className="text-sm text-orange">{error}</p> : null}
      <button className="h-12 w-full rounded-full bg-blue font-semibold text-on-blue">Сохранить</button>
    </form>
  );
}

function HoursPanel() {
  const data = useStudio();
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">{hoursLabel(data)}</p>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((name, i) => {
          const n = i + 1;
          const on = data.workDays.includes(n);
          return (
            <button
              key={name}
              type="button"
              onClick={() =>
                data.patch({
                  workDays: on ? data.workDays.filter((d) => d !== n) : [...data.workDays, n],
                })
              }
              className={`h-10 rounded-full text-xs ${on ? "bg-blue text-on-blue" : "bg-card text-muted ring-1 ring-line"}`}
            >
              {name}
            </button>
          );
        })}
      </div>
      <Num label="Начало, час" value={data.workStart} onChange={(workStart) => data.patch({ workStart })} />
      <Num label="Конец, час" value={data.workEnd} onChange={(workEnd) => data.patch({ workEnd })} />
      <Num label="Шаг слота, мин" value={data.slotStep} onChange={(slotStep) => data.patch({ slotStep })} />
      <Num label="Боксов" value={data.boxes} onChange={(boxes) => data.patch({ boxes })} />
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block text-sm text-muted">
      {label}
      <input
        type="number"
        className={field}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function ContactsPanel({ status }: { status: Status | null }) {
  const data = useStudio();
  const [note, setNote] = useState("");
  const channel = status?.channel ?? "telegram";
  const ready =
    channel === "vk" ? status?.vk : channel === "both" ? status?.telegram || status?.vk : status?.telegram;

  return (
    <div className="space-y-3">
      <input className={field} value={data.district} onChange={(e) => data.patch({ district: e.target.value })} placeholder="Район" />
      <input className={field} value={data.address} onChange={(e) => data.patch({ address: e.target.value })} placeholder="Адрес" />
      <input className={field} value={data.phone} onChange={(e) => data.patch({ phone: e.target.value })} placeholder="Телефон" />
      <textarea className={`${field} rounded-card`} rows={3} value={data.tagline} onChange={(e) => data.patch({ tagline: e.target.value })} />
      <input className={field} value={data.telegram} onChange={(e) => data.patch({ telegram: e.target.value })} placeholder="Telegram" />
      <input className={field} value={data.vk} onChange={(e) => data.patch({ vk: e.target.value })} placeholder="VK" />
      <input className={field} value={data.whatsapp} onChange={(e) => data.patch({ whatsapp: e.target.value })} placeholder="WhatsApp" />
      <p className="text-sm text-muted">
        Уведомления: {channel === "vk" ? "ВКонтакте" : channel === "both" ? "Telegram и VK" : "Telegram"}.{" "}
        {ready ? "Ключи на месте." : "Ключей нет — задайте их в окружении сервера, образец в .env.example."}
      </p>
      <button
        type="button"
        className="h-12 w-full rounded-full bg-card ring-1 ring-line"
        onClick={() => {
          void sendNotify({
            data: {
              kind: "message",
              title: "KoreaFan Auto — проверка канала",
              lines: ["Тестовое сообщение из админки."],
            },
          })
            .then((r) => setNote(r.delivered ? "Тест дошёл." : "Не отправлено: проверьте токен и peer."))
            .catch(() => setNote("Сеть недоступна."));
        }}
      >
        Проверить уведомление
      </button>
      {note ? <p className="text-sm text-muted">{note}</p> : null}
      <button type="button" className="h-12 w-full rounded-full bg-card text-sm ring-1 ring-line" onClick={() => data.restoreCatalog()}>
        Вернуть прайс и тексты с карт
      </button>
    </div>
  );
}

function CardsPanel() {
  const data = useStudio();
  return (
    <div className="space-y-3">
      <input className={field} value={data.cardServiceLabel} onChange={(e) => data.patch({ cardServiceLabel: e.target.value })} />
      <input className={field} value={data.cardBoxLabel} onChange={(e) => data.patch({ cardBoxLabel: e.target.value })} />
      <input className={field} value={data.cardPriceLabel} onChange={(e) => data.patch({ cardPriceLabel: e.target.value })} />
      <p className="text-sm text-muted">Числа считаются сами: услуги, боксы и минимальная цена.</p>
    </div>
  );
}

function ServicesPanel() {
  const services = useStudio((s) => s.services);
  const upsert = useStudio((s) => s.upsertService);
  const remove = useStudio((s) => s.removeService);
  const blank = useMemo<Service>(
    () => ({
      id: "new",
      name: "Новая услуга",
      price: 0,
      minutes: 60,
      blurb: "",
      includes: [],
      active: true,
    }),
    [],
  );

  return (
    <div className="space-y-4">
      {services.map((s) => (
        <ServiceCard key={s.id} service={s} onSave={upsert} onRemove={() => remove(s.id)} />
      ))}
      <button
        type="button"
        className="h-12 w-full rounded-full bg-blue font-semibold text-on-blue"
        onClick={() => upsert({ ...blank, id: crypto.randomUUID() })}
      >
        Добавить услугу
      </button>
    </div>
  );
}

function ServiceCard({
  service,
  onSave,
  onRemove,
}: {
  service: Service;
  onSave: (s: Service) => void;
  onRemove: () => void;
}) {
  const [s, setS] = useState(service);
  return (
    <div className="space-y-2 rounded-card bg-card p-3 ring-1 ring-line">
      <input className={field} value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} />
      <div className="grid grid-cols-2 gap-2">
        <input className={field} type="number" value={s.price} onChange={(e) => setS({ ...s, price: Number(e.target.value) })} />
        <input className={field} type="number" value={s.minutes} onChange={(e) => setS({ ...s, minutes: Number(e.target.value) })} />
      </div>
      <textarea className={`${field} rounded-card`} rows={2} value={s.blurb} onChange={(e) => setS({ ...s, blurb: e.target.value })} />
      <textarea
        className={`${field} rounded-card`}
        rows={4}
        value={s.includes.join("\n")}
        onChange={(e) => setS({ ...s, includes: e.target.value.split("\n").filter(Boolean) })}
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={s.active} onChange={(e) => setS({ ...s, active: e.target.checked })} />
        В прайсе
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="h-11 rounded-full bg-blue text-sm font-semibold text-on-blue" onClick={() => onSave(s)}>
          Сохранить
        </button>
        <button type="button" className="h-11 rounded-full bg-card-2 text-sm ring-1 ring-line" onClick={onRemove}>
          Удалить
        </button>
      </div>
    </div>
  );
}

function LogoPanel() {
  const data = useStudio();
  return (
    <div className="space-y-3">
      <input className={field} value={data.monogram} maxLength={4} onChange={(e) => data.patch({ monogram: e.target.value.toUpperCase() })} placeholder="Монограмма" />
      <input className={field} value={data.brandShort} onChange={(e) => data.patch({ brandShort: e.target.value })} placeholder="Короткое имя" />
      <input className={field} value={data.brandFull} onChange={(e) => data.patch({ brandFull: e.target.value })} placeholder="Полное имя" />
      <FileButton
        label="Заменить знак"
        onPick={(logoImage) => data.patch({ logoImage })}
      />
      <button type="button" className="h-11 w-full rounded-full bg-card text-sm ring-1 ring-line" onClick={() => data.patch({ logoImage: "" })}>
        Вернуть знак KF
      </button>
    </div>
  );
}

function HeroPanel() {
  const data = useStudio();
  return (
    <div className="space-y-3">
      <img src={data.hero} alt="" className="h-36 w-full rounded-card object-cover" />
      <FileButton label="Загрузить фото" onPick={(hero) => data.patch({ hero })} />
      <Range label="Масштаб" min={1} max={1.8} step={0.01} value={data.heroScale} onChange={(heroScale) => data.patch({ heroScale })} />
      <Range label="Сдвиг X" min={-30} max={30} step={1} value={data.heroX} onChange={(heroX) => data.patch({ heroX })} />
      <Range label="Сдвиг Y" min={-30} max={30} step={1} value={data.heroY} onChange={(heroY) => data.patch({ heroY })} />
    </div>
  );
}

function WorksPanel() {
  const works = useStudio((s) => s.works);
  const upsert = useStudio((s) => s.upsertWork);
  const remove = useStudio((s) => s.removeWork);
  return (
    <div className="space-y-4">
      {works.map((w) => (
        <WorkCard key={w.id} work={w} onSave={upsert} onRemove={() => remove(w.id)} />
      ))}
      <button
        type="button"
        className="h-12 w-full rounded-full bg-blue font-semibold text-on-blue"
        onClick={() =>
          upsert({
            id: crypto.randomUUID(),
            title: "Новая работа",
            image: "/studio/work-detail.jpg",
            scale: 1,
            x: 0,
            y: 0,
          })
        }
      >
        Добавить карточку
      </button>
    </div>
  );
}

function WorkCard({
  work,
  onSave,
  onRemove,
}: {
  work: WorkItem;
  onSave: (w: WorkItem) => void;
  onRemove: () => void;
}) {
  const [w, setW] = useState(work);
  return (
    <div className="space-y-2 rounded-card bg-card p-3 ring-1 ring-line">
      <img src={w.image} alt="" className="h-28 w-full rounded-2xl object-cover" style={{ transform: `scale(${w.scale})` }} />
      <input className={field} value={w.title} onChange={(e) => setW({ ...w, title: e.target.value })} />
      <FileButton label="Сменить фото" onPick={(image) => setW({ ...w, image })} />
      <Range label="Масштаб" min={1} max={2} step={0.01} value={w.scale} onChange={(scale) => setW({ ...w, scale })} />
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="h-11 rounded-full bg-blue text-sm font-semibold text-on-blue" onClick={() => onSave(w)}>
          Сохранить
        </button>
        <button type="button" className="h-11 rounded-full text-sm ring-1 ring-line" onClick={onRemove}>
          Удалить
        </button>
      </div>
    </div>
  );
}

function PromosPanel() {
  const promos = useStudio((s) => s.promos);
  const upsert = useStudio((s) => s.upsertPromo);
  const remove = useStudio((s) => s.removePromo);
  return (
    <div className="space-y-3">
      {promos.map((p) => (
        <PromoCard key={p.id} promo={p} onSave={upsert} onRemove={() => remove(p.id)} />
      ))}
      <button
        type="button"
        className="h-12 w-full rounded-full bg-blue font-semibold text-on-blue"
        onClick={() => upsert({ id: crypto.randomUUID(), title: "Акция", text: "", active: true })}
      >
        Добавить акцию
      </button>
    </div>
  );
}

function PromoCard({
  promo,
  onSave,
  onRemove,
}: {
  promo: Promo;
  onSave: (p: Promo) => void;
  onRemove: () => void;
}) {
  const [p, setP] = useState(promo);
  return (
    <div className="space-y-2 rounded-card bg-card p-3 ring-1 ring-line">
      <input className={field} value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} />
      <textarea className={`${field} rounded-card`} rows={2} value={p.text} onChange={(e) => setP({ ...p, text: e.target.value })} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={p.active} onChange={(e) => setP({ ...p, active: e.target.checked })} />
        Показывать на витрине
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="h-11 rounded-full bg-blue text-sm font-semibold text-on-blue" onClick={() => onSave(p)}>
          Сохранить
        </button>
        <button type="button" className="h-11 rounded-full text-sm ring-1 ring-line" onClick={onRemove}>
          Удалить
        </button>
      </div>
    </div>
  );
}

function Range({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block text-sm text-muted">
      {label}
      <input className="mt-2 w-full accent-blue" type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function FileButton({ label, onPick }: { label: string; onPick: (dataUrl: string) => void }) {
  const [error, setError] = useState("");
  return (
    <label className="flex h-12 cursor-pointer items-center justify-center rounded-full bg-card text-sm ring-1 ring-line">
      {error || label}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          if (file.size > 900_000) {
            setError("Файл больше 900 КБ");
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            setError("");
            onPick(String(reader.result));
          };
          reader.readAsDataURL(file);
        }}
      />
    </label>
  );
}
