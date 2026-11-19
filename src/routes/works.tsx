import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { FrameImage, Screen } from "@/components/screen";
import { useStudio } from "@/lib/store";

export const Route = createFileRoute("/works")({ component: WorksPage });

function WorksPage() {
  const works = useStudio((s) => s.works);
  return (
    <Screen>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Работы студии</h1>
      <div className="mt-4 space-y-4">
        {works.map((w) => (
          <article key={w.id} className="overflow-hidden rounded-card bg-card ring-1 ring-line">
            <FrameImage src={w.image} alt={w.title} scale={w.scale} x={w.x} y={w.y} />
            <p className="px-4 py-3 text-sm text-muted">{w.title}</p>
          </article>
        ))}
      </div>
      <Link
        to="/book"
        className="mt-6 flex h-12 items-center justify-between rounded-pill bg-card px-4 font-medium ring-1 ring-line"
      >
        Запись в студию
        <ArrowUpRight className="size-5 text-muted" />
      </Link>
    </Screen>
  );
}
