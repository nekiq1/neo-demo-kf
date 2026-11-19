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
        className={`fab-glow absolute bottom-24 right-4 z-50 grid size-14 place-items-center rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)] ${btn}`}
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
    <footer className="mt-8 mb-4 text-sm text-muted">
      <div className="flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-6">
        <div className="flex items-center gap-3">
          {studio.telegram ? (
            <a href={studio.telegram} target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full bg-card hover:bg-white/10 ring-1 ring-line transition">
              <Send className="size-[18px]" />
            </a>
          ) : null}
          {studio.vk ? (
            <a href={studio.vk} target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full bg-card hover:bg-white/10 ring-1 ring-line transition">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.942 1.077 1.193-1.385 5.543-1.407 5.543-.593 0-2.581-5.836-2.797-6.924-.155-.781-.433-1.03-1.204-1.03h-3.46c-.898 0-1.427.493-.993 1.42 1.268 2.708 3.352 7.502 5.813 9.554 1.725 1.441 4.142 1.422 6.086 1.422z"/>
              </svg>
            </a>
          ) : null}
          {studio.whatsapp ? (
            <a href={studio.whatsapp} target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full bg-card hover:bg-white/10 ring-1 ring-line transition">
              <Phone className="size-[18px]" />
            </a>
          ) : null}
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="font-bold text-white">{studio.brandFull}</span>
          <div className="flex gap-4 text-[11px] text-[#3f3f46]">
            <Link to="/legal" className="hover:text-white transition">Документы и политика</Link>
            <Link to="/admin" className="hover:text-white transition">Админ</Link>
          </div>
          <p className="text-center text-[11px] leading-relaxed text-[#3f3f46]">
            © {new Date().getFullYear()} {studio.brandFull}. Информация об услугах и стоимости уточняется при обращении.
          </p>
        </div>
      </div>
    </footer>
  );
}