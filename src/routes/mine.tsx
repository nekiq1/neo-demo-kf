import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Screen } from "@/components/screen";
import { useStudio } from "@/lib/store";
import { STATUS_LABEL, digits, fmtWhen, rub } from "@/lib/studio";

export const Route = createFileRoute("/mine")({ component: MinePage });

function MinePage() {
  const bookings = useStudio((s) => s.bookings);
  const [phone, setPhone] = useState("");
  const wanted = digits(phone);
  const mine =
    wanted.length >= 10 ? bookings.filter((b) => digits(b.phone).endsWith(wanted.slice(-10))) : [];

  return (
    <Screen>
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted">
        <ChevronLeft className="size-4" /> Назад
      </Link>
      <h1 className="text-2xl font-bold">Мои записи</h1>
      <p className="mt-2 text-muted">Тот же номер, что оставляли при записи. Данные живут в этом браузере.</p>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Телефон"
        inputMode="tel"
        className="mt-5 w-full rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue"
      />
      <div className="mt-4 space-y-3">
        {wanted.length >= 10 && mine.length === 0 ? (
          <p className="text-sm text-muted">Записей с этим номером нет.</p>
        ) : null}
        {mine.map((b) => (
          <article key={b.id} className="rounded-[20px] bg-card p-4 ring-1 ring-line">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold">{b.serviceName}</p>
              <p className="text-sm text-muted">{STATUS_LABEL[b.status]}</p>
            </div>
            <p className="mt-1 text-sm text-muted">{fmtWhen(b.start)}</p>
            <p className="mt-1">{rub(b.price)}</p>
          </article>
        ))}
      </div>
    </Screen>
  );
}
