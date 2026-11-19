import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Screen } from "@/components/screen";
import { useHydrated, useStudio } from "@/lib/store";
import { fmtWhen, rub } from "@/lib/studio";

type SuccessSearch = { id: string; sent: string };

export const Route = createFileRoute("/success")({
  validateSearch: (search: Record<string, unknown>): SuccessSearch => ({
    id: typeof search.id === "string" ? search.id : "",
    sent: search.sent === "1" ? "1" : "0",
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { id, sent } = Route.useSearch();
  const ready = useHydrated();
  const booking = useStudio((s) => s.bookings.find((b) => b.id === id));

  return (
    <Screen>
      <div className="mt-10 flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-full bg-blue text-white"><Check size={32} /></span>
        <h1 className="mt-5 text-[28px] font-extrabold">Вы в расписании</h1>
      </div>
      {!ready ? <p className="mt-3 text-muted">Открываем запись…</p> : null}
      {ready && booking ? (
        <article className="mt-5 rounded-[20px] bg-card p-4 ring-1 ring-line">
          <p className="text-lg font-semibold">{booking.serviceName}</p>
          <p className="mt-1 text-muted">{fmtWhen(booking.start)}</p>
          <p className="mt-1">{rub(booking.price)}</p>
          <p className="mt-3 text-sm text-muted">
            {booking.name}
            {booking.car ? ` · ${booking.car}` : ""}
          </p>
          <p className="mt-3 text-sm text-muted">
            {sent === "1"
              ? "Студия получила уведомление."
              : "Запись сохранена на этом устройстве. Мессенджер не настроен — см. NOTIFY_CHANNEL в окружении."}
          </p>
        </article>
      ) : null}
      {ready && !booking ? <p className="mt-4 text-muted">Запись не найдена на этом устройстве.</p> : null}
      <Link to="/mine" className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-blue font-semibold text-white">
        Мои записи
      </Link>
      <Link to="/" className="mt-2.5 flex min-h-12 items-center justify-center rounded-full bg-card font-semibold ring-1 ring-line">
        На главную
      </Link>
    </Screen>
  );
}
