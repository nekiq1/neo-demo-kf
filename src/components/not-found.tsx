import { Link } from "@tanstack/react-router";
import { Home, ArrowLeft } from "lucide-react";

export function NotFoundComponent() {
return (
<main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
<div className="max-w-xl text-center">
<div className="text-7xl font-bold tracking-tight text-white/10">
404
</div>

    <h1 className="mt-4 text-3xl font-bold">
      Страница не найдена
    </h1>

    <p className="mt-4 text-white/50">
      Возможно, страница была перемещена или адрес указан неправильно.
    </p>

    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-white/80 transition"
      >
        <Home size={18} />
        На главную
      </Link>

      <button
        type="button"
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10 transition"
      >
        <ArrowLeft size={18} />
        Назад
      </button>
    </div>

    <div className="mt-12 text-xs tracking-[0.3em] text-white/30">
      KOREAFAN AUTO
    </div>
  </div>
</main>
);
}