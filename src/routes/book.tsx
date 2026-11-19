import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Screen } from "@/components/screen";
import { sendNotify } from "@/lib/notify";
import { useStudio } from "@/lib/store";
import {
  activeServices,
  addDays,
  digits,
  dur,
  fmtDay,
  fmtTime,
  isWorkDay,
  rub,
  slotOptions,
  startOfDay,
} from "@/lib/studio";

type BookSearch = { service?: string };

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): BookSearch => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  component: BookPage,
});

function BookPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const data = useStudio();
  const services = activeServices(data);
  const [serviceId, setServiceId] = useState(search.service || services[0]?.id || "");
  const service = services.find((s) => s.id === serviceId) || services[0];
  const days = useMemo(() => {
    const out: Date[] = [];
    const cursor = startOfDay(new Date());
    for (let i = 0; i < 21 && out.length < 8; i++) {
      const day = addDays(cursor, i);
      if (isWorkDay(day, data.workDays)) out.push(day);
    }
    return out;
  }, [data.workDays]);
  const [dayKey, setDayKey] = useState(days[0]?.toDateString() ?? "");
  const day = days.find((d) => d.toDateString() === dayKey) ?? days[0];
  const slots = day && service ? slotOptions(day, service.minutes, data) : [];
  const [slotIso, setSlotIso] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [car, setCar] = useState("");
  const [note, setNote] = useState("");
  const [personalConsent, setPersonalConsent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!personalConsent) {
      setError("Подтвердите согласие на обработку персональных данных.");
      return;
    }
    if (!service || !slotIso) {
      setError("Выберите услугу и свободное время.");
      return;
    }
    if (name.trim().length < 2 || digits(phone).length < 10) {
      setError("Нужны имя и телефон.");
      return;
    }
    const slot = slots.find((s) => s.start.toISOString() === slotIso);
    if (!slot?.free) {
      setError("Это время уже занято.");
      return;
    }
    setBusy(true);
    setError("");
    const booking = {
      id: crypto.randomUUID(),
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      name: name.trim(),
      phone: phone.trim(),
      car: car.trim(),
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      status: "pending" as const,
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };
    data.addBooking(booking);
    let delivered = false;
    try {
      const res = await sendNotify({
        data: {
          kind: "booking",
          title: "KoreaFan Auto — новая запись",
          lines: [
            `Услуга: ${service.name} · ${rub(service.price)}`,
            `Когда: ${fmtDay(slot.start)} ${fmtTime(slot.start)}`,
            `Клиент: ${booking.name}`,
            `Телефон: ${booking.phone}`,
            `Авто: ${booking.car || "—"}`,
            booking.note ? `Комментарий: ${booking.note}` : "",
          ].filter(Boolean),
        },
      });
      delivered = res.delivered;
    } catch {
      delivered = false;
    }
    setBusy(false);
    await navigate({
      to: "/success",
      search: { id: booking.id, sent: delivered ? "1" : "0" },
    });
  }

  return (
    <Screen>
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted">
        <ChevronLeft className="size-4" /> Назад
      </Link>
      <h1 className="text-2xl font-bold">Запись</h1>
      <p className="mt-2 text-muted">Предварительная запись. Время и стоимость подтвердит администратор после уточнения работ.</p>

      <form onSubmit={submit} className="mt-5 space-y-3">
        <label className="block text-sm text-muted">
          Услуга
          <select
            value={service?.id ?? ""}
            onChange={(e) => {
              setServiceId(e.target.value);
              setSlotIso("");
            }}
            className="mt-2 w-full rounded-xl bg-bg px-3.5 py-3 text-fg ring-1 ring-line outline-none focus:ring-blue"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {rub(s.price)} · {dur(s.minutes)}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => {
            const on = d.toDateString() === day?.toDateString();
            return (
              <button
                key={d.toDateString()}
                type="button"
                onClick={() => {
                  setDayKey(d.toDateString());
                  setSlotIso("");
                }}
                className={`shrink-0 rounded-pill px-4 py-3 text-sm ${on ? "bg-blue text-on-blue" : "bg-card text-fg ring-1 ring-line"}`}
              >
                {fmtDay(d)}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {slots.length ? (
            slots.map((s) => {
              const on = slotIso === s.start.toISOString();
              return (
                <button
                  key={s.start.toISOString()}
                  type="button"
                  disabled={!s.free}
                  onClick={() => setSlotIso(s.start.toISOString())}
                  className={`h-11 rounded-pill text-sm ${on ? "bg-blue text-on-blue" : "bg-card ring-1 ring-line"} disabled:text-dim disabled:opacity-40`}
                >
                  {fmtTime(s.start)}
                </button>
              );
            })
          ) : (
            <p className="col-span-3 text-sm text-muted">В этот день свободных слотов нет.</p>
          )}
        </div>

        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" className="w-full rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" inputMode="tel" className="w-full rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue" />
        <input value={car} onChange={(e) => setCar(e.target.value)} placeholder="Авто, например Kia K5" className="w-full rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue" />
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Что беспокоит" rows={3} className="w-full resize-none rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue" />
        <label className="flex items-start gap-2 text-xs leading-relaxed text-muted"><input type="checkbox" checked={personalConsent} onChange={(e) => setPersonalConsent(e.target.checked)} className="mt-0.5" />Я даю согласие на обработку указанных персональных данных для ответа на обращение и организации записи. <Link to="/legal" className="underline">Политика обработки данных</Link>.</label>
        {error ? <p className="text-sm text-orange">{error}</p> : null}
        <button type="submit" disabled={busy} className="h-12 w-full rounded-full bg-blue font-semibold text-on-blue disabled:opacity-60">
          {busy ? "Сохраняем" : "Подтвердить запись"}
        </button>
      </form>
    </Screen>
  );
}
