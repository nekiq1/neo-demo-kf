import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import { Screen } from "@/components/screen";
import { useStudio } from "@/lib/store";
import { activeServices, dur, rub } from "@/lib/studio";

export const Route = createFileRoute("/services")({ component: ServicesPage });

function ServicesPage() {
  const data = useStudio();
  const services = activeServices(data);
  const max = Math.max(1, ...services.map((s) => s.minutes));

  return (
    <Screen>
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted">
        <ChevronLeft className="size-4" /> Назад
      </Link>
      <h1 className="text-2xl font-bold">Услуги</h1>
      <p className="mt-2 text-muted">Перечень направлений по карточке KoreaFan Auto. Стоимость и длительность уточняются при обращении.</p>

      <div className="mt-5 space-y-3">
        {services.map((s) => (
          <article key={s.id} className="rounded-[20px] bg-card p-4 ring-1 ring-line">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold">{s.name}</h2>
              <p className="shrink-0 font-semibold">{rub(s.price)}</p>
            </div>
            <p className="mt-1 text-sm text-dim">{dur(s.minutes)}</p>
            <p className="mt-2 text-sm text-muted">{s.blurb}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-card-2">
              <div className="bar-in h-full rounded-full bg-blue" style={{ width: `${(s.minutes / max) * 100}%` }} />
            </div>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {s.includes.map((line) => (
                <li key={line}>· {line}</li>
              ))}
            </ul>
            <Link
              to="/book"
              search={{ service: s.id }}
              className="mt-4 flex h-11 items-center justify-center gap-1 rounded-full bg-blue font-semibold text-on-blue"
            >
              Выбрать <ArrowUpRight className="size-4" />
            </Link>
          </article>
        ))}
      </div>
    </Screen>
  );
}
