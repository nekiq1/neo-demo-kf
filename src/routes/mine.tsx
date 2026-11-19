import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, User, Mail, ShieldCheck, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { Screen } from "@/components/screen";
import { useStudio } from "@/lib/store";
import { STATUS_LABEL, digits, fmtWhen, rub } from "@/lib/studio";
import { subscribeNewsletter } from "@/lib/notify";

export const Route = createFileRoute("/mine")({ component: MinePage });

function MinePage() {
  const bookings = useStudio((s) => s.bookings);
  const [phone, setPhone] = useState("");
  const wanted = digits(phone);
  const mine =
    wanted.length >= 10 ? bookings.filter((b) => digits(b.phone).endsWith(wanted.slice(-10))) : [];

  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) { setMsg("Отметьте согласие на рассылку."); return; }
    setBusy(true); setMsg("");
    try {
      await subscribeNewsletter({ data: { email, consent: true } });
      setMsg("Вы успешно подписаны!");
      setEmail("");
      setConsent(false);
    } catch {
      setMsg("Ошибка сохранения. Попробуйте позже.");
    } finally { setBusy(false); }
  }

  return (
    <Screen>
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-white transition">
        <ChevronLeft className="size-4" /> На главную
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="grid size-16 place-items-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/30">
           <User size={32} />
        </div>
        <div>
          <h1 className="text-[32px] font-black tracking-tight text-white leading-none">Профиль</h1>
          <p className="text-sm text-muted mt-1">Записи и подписки</p>
        </div>
      </div>

      <section className="mb-8">
         <h2 className="text-[22px] font-bold text-white mb-3 flex items-center gap-2">
           <CalendarCheck className="size-5 text-blue-500" /> Мои записи
         </h2>
         <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Введите телефон" inputMode="tel" className="w-full rounded-xl bg-card px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue mb-3" />
         <div className="space-y-3">
           {wanted.length >= 10 && mine.length === 0 ? <p className="text-sm text-muted">Записей с этим номером нет.</p> : null}
           {mine.map((b) => (
             <article key={b.id} className="rounded-[20px] bg-card p-4 ring-1 ring-line">
               <div className="flex items-start justify-between gap-3">
                 <p className="font-semibold text-white">{b.serviceName}</p>
                 <p className="text-sm text-muted">{STATUS_LABEL[b.status]}</p>
               </div>
               <p className="mt-1 text-sm text-muted">{fmtWhen(b.start)}</p>
               <p className="mt-1 font-bold text-white">{rub(b.price)}</p>
             </article>
           ))}
         </div>
      </section>

      <section className="mb-8 rounded-[20px] bg-card p-5 ring-1 ring-line">
        <h2 className="text-[22px] font-bold text-white mb-2 flex items-center gap-2">
          <Mail className="size-5 text-blue-500" /> Рассылка
        </h2>
        <p className="text-sm text-muted mb-4">Узнавайте первыми об акциях и спецпредложениях.</p>
        <form onSubmit={subscribe} className="space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ваш email" className="w-full rounded-xl bg-bg px-3.5 py-3 ring-1 ring-line outline-none focus:ring-blue" />
          <label className="flex items-start gap-2 text-xs text-muted">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
            Я согласен получать новости.
          </label>
          {msg ? <p className="text-sm text-blue-400 font-medium">{msg}</p> : null}
          <button disabled={busy} className="glow w-full rounded-full bg-blue py-3.5 font-semibold text-white disabled:opacity-50 transition">
            {busy ? "Сохраняем..." : "Подписаться"}
          </button>
        </form>
      </section>

      <section className="rounded-[20px] bg-card-2 p-5 ring-1 ring-line">
         <h2 className="text-[22px] font-bold text-white mb-2 flex items-center gap-2">
           <ShieldCheck className="size-5 text-blue-500" /> Сотрудникам
         </h2>
         <p className="text-sm text-muted mb-4">Доступ к расписанию и управлению базой.</p>
         <Link to="/admin" className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/10 transition">
           Войти в админку
         </Link>
      </section>
    </Screen>
  );
}