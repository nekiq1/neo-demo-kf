import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Download, LayoutGrid, Mail, MapPin, Phone, Tag, Wrench } from "lucide-react";
import { useState } from "react";
import { subscribeNewsletter } from "@/lib/notify";
import { BrandRow, FrameImage, Screen, SectionTitle } from "@/components/screen";
import { useStudio } from "@/lib/store";
import {
  MAPS_URL,
  PAYMENTS,
  RATING,
  REVIEWS,
  activeServices,
  bayLoad,
  dur,
  hoursLabel,
  minPrice,
  rub,
  startOfWeek,
} from "@/lib/studio";

export const Route = createFileRoute("/")({ component: Home });

type InstallPromptEvent = Event & { prompt: () => Promise<void> };
type PwaWindow = Window & { __pwaPrompt?: InstallPromptEvent };
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    (window as PwaWindow).__pwaPrompt = e as InstallPromptEvent;
  });
}

const CARD = "rounded-[22px] bg-card ring-1 ring-line";

function Home() {
  const data = useStudio();
  const services = activeServices(data);
  const price = minPrice(data);
  const promo = data.promos.find((p) => p.active);
  const load = bayLoad(data, startOfWeek(new Date()));
  const max = Math.max(data.boxes, ...load.map((d) => d.count), 1);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [newsletterBusy, setNewsletterBusy] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setNewsletterMessage("");
    if (!newsletterConsent) { setNewsletterMessage("Для подписки отметьте отдельное согласие на рассылку."); return; }
    setNewsletterBusy(true);
    try { await subscribeNewsletter({ data: { email: newsletterEmail, consent: true } }); setNewsletterMessage("Адрес добавлен в список подписчиков."); setNewsletterEmail(""); setNewsletterConsent(false); }
    catch { setNewsletterMessage("Не удалось сохранить адрес. Проверьте подключение базы данных PostgreSQL."); }
    finally { setNewsletterBusy(false); }
  }

  return (
    <Screen>
      <BrandRow />

      <section className="rise relative h-80 overflow-hidden rounded-3xl bg-[#0a0a0c] ring-1 ring-[#1c1c20]">
        <img
          src={data.hero}
          alt="Иллюстрация автомобиля для KoreaFan Auto"
          className="h-full w-full object-cover"
          style={{
            transformOrigin: "center",
            objectPosition: `${50 + data.heroX}% ${50 + data.heroY}%`,
            scale: String(data.heroScale),
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent via-40% to-black/55" />
        <svg
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
          className="pointer-events-none absolute left-0 -top-[2%] h-[62%] w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
              <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <filter id="arcBlur">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          <path d="M 20 155 Q 200 20 380 155" fill="none" stroke="url(#arcGrad)" strokeWidth="16" strokeLinecap="round" filter="url(#arcBlur)" />
          <path d="M 35 155 Q 200 35 365 155" fill="none" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" opacity="0.95" />
        </svg>
        <div className="absolute inset-x-3 bottom-3 z-[2]">
          <Link
            to="/book"
            className="flex items-center justify-between rounded-full border border-white/15 bg-[rgba(16,16,20,0.45)] px-[18px] py-3.5 text-[15px] font-semibold text-white backdrop-blur-xl"
          >
            Записаться
            <ArrowUpRight className="size-[18px]" />
          </Link>
        </div>
      </section>

      {promo ? (
        <div className="rise mt-3 rounded-pill bg-blue px-4 py-3 text-on-blue">
          <p className="font-semibold">{promo.title}</p>
          <p className="text-sm opacity-90">{promo.text}</p>
        </div>
      ) : null}

      <h1 className="rise mt-5 mb-2 text-[34px] font-black leading-[1.1] tracking-[-0.03em] text-white">{data.brandFull}</h1>
      <p className="rise mb-[18px] max-w-[360px] text-[15px] leading-[1.45] text-muted">{data.tagline}</p>

      <div className="mb-2.5 grid grid-cols-2 gap-2.5">
        <article className="rise rounded-[18px] bg-card px-3.5 py-4 ring-1 ring-line">
          <div className="mb-1.5 flex items-center gap-2 text-[22px] font-extrabold text-white">
            <Wrench className="size-4 text-[#a1a1aa]" />
            {services.length}
          </div>
          <p className="text-[13px] text-dim">{data.cardServiceLabel}</p>
        </article>
        <article className="rise rounded-[18px] bg-card px-3.5 py-4 ring-1 ring-line">
          <div className="mb-1.5 flex items-center gap-2 text-[22px] font-extrabold text-white">
            <LayoutGrid className="size-4 text-[#a1a1aa]" />
            {RATING.score}
          </div>
          <p className="text-[13px] text-dim">рейтинг в Яндекс Картах · {RATING.ratings} оценок</p>
        </article>
      </div>

      <div className="rise flex items-center justify-between rounded-[18px] bg-card px-4 py-3.5 ring-1 ring-line">
        <div className="flex items-center gap-2.5 text-lg font-extrabold text-white">
          <Tag className="size-[18px] text-[#a1a1aa]" />
          {price > 0 ? `от ${rub(price)}` : "Цена по запросу"}
        </div>
        <span className="text-[13px] text-dim">{data.cardPriceLabel}</span>
      </div>

      <SectionTitle title="Услуги" action="Все услуги" to="/services" />
      <div className="overflow-hidden rounded-[20px] bg-card ring-1 ring-line">
        {services.map((s, i) => (
          <Link
            key={s.id}
            to="/book"
            search={{ service: s.id }}
            className={`flex items-center justify-between gap-3 px-4 py-4 ${i ? "border-t border-line" : ""}`}
          >
            <div>
              <p className="text-[15px] font-bold text-white">{s.name}</p>
              <p className="mt-[3px] text-[13px] text-dim">{dur(s.minutes)}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[15px] font-bold text-white">{rub(s.price)}</p>
              <p className="mt-0.5 inline-flex items-center gap-0.5 text-xs text-dim">
                Выбрать <ArrowUpRight className="size-3" />
              </p>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-7">
        <h2 className="text-xl font-extrabold text-white">Неделя боксов</h2>
        <p className="mt-1 text-sm text-muted">Загрузка по записям, потолок — число боксов.</p>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {load.map((d, i) => (
            <div key={d.day.toISOString()} className="rounded-2xl bg-card px-1 py-3 text-center ring-1 ring-line">
              <div className="mx-auto flex h-16 w-3 items-end overflow-hidden rounded-full bg-card-2">
                <div
                  className="bar-in w-full rounded-full bg-blue"
                  style={{ height: `${Math.max(8, (d.count / max) * 100)}%`, animationDelay: `${i * 70}ms` }}
                />
              </div>
              <p className="mt-2 text-xs text-dim">{["Пн", "Вт", "Ср", "Чт", "Пт"][i]}</p>
              <p className="text-sm font-semibold">{d.count}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionTitle title="Работы студии" action="Все" to="/works" />
      <div className="flex flex-col gap-3">
        {data.works.map((w) => (
          <Link key={w.id} to="/works" className="block overflow-hidden rounded-[20px] bg-card ring-1 ring-line">
            <FrameImage src={w.image} alt={w.title} scale={w.scale} x={w.x} y={w.y} />
            <p className="px-3.5 py-2.5 text-[13px] text-muted">{w.title}</p>
          </Link>
        ))}
      </div>

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">Отзывы</h2>
          <p className="text-sm text-muted">
            {RATING.score} · {RATING.ratings} оценок
          </p>
        </div>
        <div className="space-y-3">
          {REVIEWS.map((r) => (
            <article key={r.name} className="rounded-[20px] bg-card px-4 py-4 ring-1 ring-line">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-bold text-white">{r.name}</p>
                <p className="text-xs text-dim">{r.date}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.text}</p>
            </article>
          ))}
        </div>
      </section>

      <h2 className="mt-7 mb-3 text-[22px] font-extrabold tracking-[-0.02em] text-white">Запись в студию</h2>
      <div
        className={`${CARD} mb-3 p-5`}
        style={{ backgroundImage: "radial-gradient(ellipse 80% 60% at 90% 20%, rgba(59,130,246,0.12), transparent)" }}
      >
        <h3 className="mb-1.5 text-lg font-extrabold text-white">Свежий вид для вашего авто</h3>
        <p className="mb-4 text-sm leading-[1.45] text-muted">Выберите услугу и удобное время — остальное возьмём на себя</p>
        <Link to="/book" className="flex items-center justify-center gap-2 rounded-full bg-blue px-[18px] py-3.5 text-[15px] font-semibold text-white">
          Выбрать время <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <section className={`${CARD} mb-3 p-[18px]`}>
        <div className="mb-3 flex items-center gap-2">
          <Mail className="size-5 text-blue" />
          <h2 className="text-base font-bold text-white">Новости и предложения</h2>
        </div>
        <p className="text-[13px] text-muted">Оставьте почту, чтобы подписаться на новости и специальные предложения KoreaFan Auto.</p>
        <form onSubmit={subscribe} className="mt-3 space-y-3">
          <input type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Электронная почта" autoComplete="email" className="w-full rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue" />
          <label className="flex items-start gap-2 text-xs leading-relaxed text-muted"><input type="checkbox" checked={newsletterConsent} onChange={(e) => setNewsletterConsent(e.target.checked)} className="mt-0.5" />Я отдельно соглашаюсь получать новости и рекламные сообщения на указанную почту. Согласие добровольное, его можно отозвать.</label>
          <p className="text-xs text-dim">Отправляя адрес, вы также подтверждаете ознакомление с <Link to="/legal" className="underline">политикой обработки данных</Link>.</p>
          {newsletterMessage ? <p role="status" className="text-sm text-muted">{newsletterMessage}</p> : null}
          <button disabled={newsletterBusy} className="flex w-full items-center justify-center gap-2 rounded-full bg-blue px-[18px] py-3.5 text-[15px] font-semibold text-white disabled:opacity-50">{newsletterBusy ? "Сохраняем…" : "Подписаться"}</button>
        </form>
      </section>

      <section className={`${CARD} mb-3.5 p-[18px]`}>
        <div className="mb-3 flex gap-2.5">
          <MapPin className="mt-0.5 size-[18px] shrink-0 text-[#a1a1aa]" />
          <div>
            <p className="text-[15px] font-semibold text-white">{data.address}</p>
            <p className="text-xs text-dim">{data.district}</p>
          </div>
        </div>
        <div className="mb-4 flex gap-2.5">
          <Clock className="mt-0.5 size-[18px] shrink-0 text-[#a1a1aa]" />
          <div>
            <p className="text-[15px] font-semibold text-white">{hoursLabel(data)}</p>
            <p className="text-xs text-dim">по времени студии</p>
          </div>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {PAYMENTS.map((p) => (
            <span key={p} className="rounded-full bg-card-2 px-3 py-1 text-xs text-muted ring-1 ring-line">
              {p}
            </span>
          ))}
        </div>
        <div className="mb-4 overflow-hidden rounded-2xl ring-1 ring-line">
          <iframe title="KoreaFan Auto на карте" src="https://yandex.ru/map-widget/v1/?ll=30.466641%2C60.012743&z=14&pt=30.466641%2C60.012743%2Cpm2rdm" width="100%" height="210" frameBorder="0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
        <div className="flex gap-2.5">
          <a href={MAPS_URL} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#2a2a32] px-3.5 py-3 text-sm font-semibold text-white">
            Маршрут <ArrowUpRight className="size-3.5" />
          </a>
          <a href={`tel:${data.phone.replace(/[^\d+]/g, "")}`} aria-label="Позвонить" className="grid size-12 place-items-center rounded-full border border-[#2a2a32] text-white">
            <Phone className="size-[18px]" />
          </a>
        </div>
      </section>

      <section
        className="mb-5 rounded-[22px] bg-card-2 p-5 ring-1 ring-line"
        style={{ backgroundImage: "radial-gradient(circle at 80% 30%, rgba(59,130,246,0.2), transparent 50%)" }}
      >
        <div className="mb-3.5 flex items-center gap-2.5">
          <img src={data.logoImage || "/favicon.svg"} alt="" className="size-10 rounded-xl bg-blue object-cover" />
          <div>
            <p className="text-sm font-bold text-white">{data.brandShort}</p>
            <p className="text-xs text-dim">Приложение студии</p>
          </div>
        </div>
        <h3 className="mb-2 text-2xl font-extrabold leading-[1.2] tracking-[-0.02em] text-white">
          Студия всегда
          <br />
          под рукой.
        </h3>
        <p className="mb-4 text-sm leading-[1.45] text-muted">Записывайтесь за несколько касаний, без поиска ссылки и звонков.</p>
        <button
          type="button"
          onClick={() => {
            const deferred = (window as PwaWindow).__pwaPrompt;
            if (deferred) void deferred.prompt();
            else alert("На iPhone: «Поделиться» → «На экран Домой». На Android: меню браузера → «Установить приложение».");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-blue px-[18px] py-3.5 text-[15px] font-semibold text-white"
        >
          <Download className="size-[18px]" />
          Добавить на экран
          <span className="opacity-80">→</span>
        </button>
        <p className="mt-2.5 text-center text-xs text-[#52525b]">Бесплатно. Установка через браузер.</p>
      </section>
    </Screen>
  );
}
