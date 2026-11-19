import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Screen } from "@/components/screen";

export const Route = createFileRoute("/legal")({ component: LegalPage });

function LegalPage() {
  return <Screen>
    <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted"><ChevronLeft className="size-4" /> Назад</Link>
    <h1 className="text-3xl font-bold tracking-tight">Документы и обработка данных</h1>
    <p className="mt-2 text-sm text-muted">Информационная заготовка для владельца сайта. Перед публикацией владелец KoreaFan Auto должен проверить и заполнить сведения оператора, цели, сроки и способы обработки, контакты для обращений и фактических подрядчиков. Этот текст не является юридическим заключением.</p>
    <section className="mt-5 rounded-[20px] bg-card p-4 ring-1 ring-line">
      <h2 className="text-xl font-semibold">Политика обработки персональных данных</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">Сайт может обрабатывать имя, номер телефона, адрес электронной почты, сведения об автомобиле и содержание обращения — только для ответа на запрос, организации записи и, при отдельном согласии, отправки новостей и предложений.</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">Правовые основания, состав оператора, точные сроки хранения, порядок уничтожения данных, перечень лиц, которым поручена обработка, и адрес для обращений должны быть внесены владельцем до запуска. Не отправляйте через сайт паспортные и иные избыточные сведения.</p>
    </section>
    <section className="mt-3 rounded-[20px] bg-card p-4 ring-1 ring-line">
      <h2 className="text-xl font-semibold">Согласие на обработку данных</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">Согласие на обработку данных для ответа на обращение должно быть отдельным от согласия на рекламные рассылки. Маркетинговая подписка добровольна и не отмечена заранее. Предусмотрите отзыв согласия через контакт владельца.</p>
    </section>
    <section className="mt-3 rounded-[20px] bg-card p-4 ring-1 ring-line">
      <h2 className="text-xl font-semibold">Файлы cookie</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">До включения аналитики и необязательных файлов cookie владелец должен определить их фактический состав, цели, срок хранения и используемые сервисы, разместить отдельное уведомление и механизм выбора пользователя. В текущей версии сторонняя аналитика не подключена.</p>
    </section>
    <section className="mt-3 rounded-[20px] bg-card p-4 ring-1 ring-line">
      <h2 className="text-xl font-semibold">Реквизиты оператора</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">Укажите полное имя ИП/юридического лица или ФИО самозанятого, ИНН, ОГРНИП/ОГРН при наличии, адрес для корреспонденции, телефон и электронную почту. Сейчас эти сведения не подтверждены данными карточки организации и намеренно не выдуманы.</p>
    </section>
    <p className="mt-5 text-xs leading-relaxed text-dim">Основа технического чек-листа: загруженный пользователем документ «Чек-лист аудита и юридической защиты. Требования к сайтам в РФ на 2026 год», страницы 2–6. Перед использованием сверить актуальные нормы и применимость требований с юристом.</p>
  </Screen>;
}
