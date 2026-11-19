import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarCheck, Home, LayoutGrid, MessageCircle, Send, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { sendNotify } from "@/lib/notify";
import { useRehydrate, useStudio } from "@/lib/store";

export function Screen({
  children,
  tone = "blue",
  admin = false,
}: {
  children: React.ReactNode;
  tone?: "blue" | "orange";
  admin?: boolean;
}) {
  useRehydrate();
  useEffect(() => {
    if (!admin) return;
    document.body.classList.add("admin-bg");
    return () => document.body.classList.remove("admin-bg");
  }, [admin]);
  return (
    <div className={`relative mx-auto min-h-dvh w-full max-w-[480px] px-4 pb-28 ${admin ? "admin-look pt-4" : "pt-0"}`}>
      {children}
      <SiteFooter />
      <ChatFab tone={tone} />
      {admin ? null : <BottomNavigation />}
    </div>
  );
}

export function BrandRow() {
  const short = useStudio((s) => s.brandShort);
  const logo = useStudio((s) => s.logoImage);
  return (
    <header className="flex min-h-[60px] items-center justify-between py-3.5">
      <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label={`${short} — главная`}>
        <img
          src={logo || "/favicon.svg"}
          alt=""
          className="size-10 rounded-lg bg-black object-contain"
        />
        <span className="truncate text-base font-bold tracking-[0.04em] text-white">{short}</span>
      </Link>
      <Link
        to="/mine"
        aria-label="Профиль и записи"
        className="grid size-9 place-items-center rounded-full text-muted ring-1 ring-line"
      >
        <UserRound className="size-[18px]" />
      </Link>
    </header>
  );
}

export function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "active" }}>
        <Home size={19} />
        <span>Главная</span>
      </Link>
      <Link to="/services" activeProps={{ className: "active" }}>
        <LayoutGrid size={19} />
        <span>Услуги</span>
      </Link>
      <Link to="/mine" activeProps={{ className: "active" }}>
        <CalendarCheck size={19} />
        <span>Моя запись</span>
      </Link>
    </nav>
  );
}

export function SectionTitle({
  title,
  action,
  to,
}: {
  title: string;
  action?: string;
  to?: "/services" | "/works";
}) {
  return (
    <div className="mt-7 mb-3 flex items-center justify-between gap-3">
      <h2 className="text-xl font-extrabold text-white">{title}</h2>
      {action && to ? (
        <Link to={to} className="flex items-center gap-1 text-sm font-medium text-muted">
          {action} <ArrowUpRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}

export function FrameImage({
  src,
  alt,
  scale,
  x,
  y,
}: {
  src: string;
  alt: string;
  scale: number;
  x: number;
  y: number;
}) {
  return (
    <div className="h-[180px] overflow-hidden bg-card-2">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        style={{ transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: "center" }}
      />
    </div>
  );
}

function ChatFab({ tone }: { tone: "blue" | "orange" }) {
  const [open, setOpen] = useState(false);
  const studio = useStudio();
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [personalConsent, setPersonalConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const glow = tone === "orange" ? "var(--color-orange)" : "var(--color-blue)";
  const btn = tone === "orange" ? "bg-orange text-on-orange" : "bg-blue text-on-blue";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    if (!personalConsent) { setNote("Подтвердите согласие на обработку персональных данных."); return; }
    setBusy(true);
    setNote("");
    try {
      const res = await sendNotify({
        data: {
          kind: "message",
          title: "KoreaFan Auto — сообщение с витрины",
          lines: [`Имя: ${name || "—"}`, `Телефон: ${phone || "—"}`, text.trim()],
        },
      });
      setNote(
        res.delivered
          ? "Ушло в выбранный канал."
          : "Канал не настроен: NOTIFY_CHANNEL, токен и chat/peer в окружении сервера.",
      );
      if (res.delivered) setText("");
    } catch {
      setNote("Не удалось отправить. Напишите в Telegram или VK.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Написать в студию"
        onClick={() => setOpen(true)}
        style={{ ["--glow" as string]: glow }}
        className={`fab-glow fab-pos grid size-14 place-items-center rounded-full ${btn}`}
      >
        <MessageCircle className="size-7" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-bg/70 px-3 pb-3">
          <div className="w-full max-w-md rounded-card bg-card-2 p-4 ring-1 ring-line">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Написать в студию</h2>
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-full bg-card"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mb-3 grid grid-cols-3 gap-2 text-sm">
              <a className="rounded-pill bg-card px-2 py-3 text-center ring-1 ring-line" href={studio.telegram} target="_blank" rel="noreferrer">
                Telegram
              </a>
              <a className="rounded-pill bg-card px-2 py-3 text-center ring-1 ring-line" href={studio.vk} target="_blank" rel="noreferrer">
                VK
              </a>
              <a className="rounded-pill bg-card px-2 py-3 text-center ring-1 ring-line" href={studio.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
            <form onSubmit={submit} className="space-y-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" className="w-full rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" className="w-full rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue" />
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Вопрос по Hyundai, Kia или записи" rows={3} className="w-full resize-none rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue" />
              <label className="flex items-start gap-2 text-xs leading-relaxed text-muted"><input type="checkbox" checked={personalConsent} onChange={(e) => setPersonalConsent(e.target.checked)} className="mt-0.5" />Согласен на обработку данных для ответа на обращение. <Link to="/legal" className="underline">Политика</Link>.</label>
              {note ? <p className="text-sm text-muted">{note}</p> : null}
              <button type="submit" disabled={busy} className={`flex h-12 w-full items-center justify-center gap-2 rounded-full font-semibold ${btn} disabled:opacity-60`}>
                <Send className="size-4" />
                {busy ? "Отправляем" : "Отправить"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}


function SiteFooter() {
  const studio = useStudio();
  return (
    <footer className="mt-6 text-sm text-muted">
      <div className="flex items-center justify-between px-1 py-2">
        <span className="font-bold text-white">{studio.brandFull}</span>
        <a
          href={studio.vk || "https://vk.com/koreafanauto"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[13px] font-medium"
        >
          ВКонтакте <ArrowUpRight className="size-3.5" />
        </a>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-[#3f3f46]">
        <Link to="/legal">Документы и политика</Link>
        <Link to="/admin">Админ</Link>
      </div>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-[#3f3f46]">
        © {new Date().getFullYear()} {studio.brandFull}. Информация об услугах и стоимости уточняется при обращении.
      </p>
    </footer>
  );
}
