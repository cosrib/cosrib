import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Coscribe – Produkt & Features",
  description:
    "Was Coscribe kann: Outreach, Follow-ups und persönliche E-Mails für Freelancer.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Start
          </Link>
          <div className="flex items-center gap-2 min-w-0 ml-auto">
            <Mail className="w-6 h-6 text-primary shrink-0" aria-hidden />
            <span className="text-xl font-semibold tracking-tight">Coscribe</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        <article className="space-y-10 text-foreground">
          <div className="space-y-3">
            <p className="text-sm font-medium text-accent-foreground uppercase tracking-wide">
              Produkt
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Was Coscribe für Freelancer sein soll
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Kurz und klar: weniger Zeit mit leeren Formularen, mehr Zeit für Kunden.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Das Problem</h2>
            <p className="text-muted-foreground leading-relaxed">
              Outreach, Follow-ups und Antworten fressen Zeit – und oft klingen sie, als kämen
              sie aus derselben Vorlage. Coscribe soll helfen, schnell zu schreiben – aber
              persönlich, wie du selbst.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Features (Roadmap)</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>
                <span className="text-foreground font-medium">Kontext</span> – Kontakte,
                Schreibstil und Verlauf an einem Ort.
              </li>
              <li>
                <span className="text-foreground font-medium">Kalt-Email &amp; Follow-up</span>{" "}
                – strukturierte Hilfe statt leerer Seite.
              </li>
              <li>
                <span className="text-foreground font-medium">Antworten</span> – schnell auf
                eingehende Mails reagieren.
              </li>
              <li>
                <span className="text-foreground font-medium">Übersicht</span> – Kennzahlen und
                Aktivität ohne Overhead.
              </li>
            </ul>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nicht alles ist von Tag eins live – ihr baut Schritt für Schritt. Diese Seite ist
              euer öffentliches Versprechen, was kommen soll.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Warteliste</h2>
            <p className="text-muted-foreground leading-relaxed">
              Auf der Startseite kannst du dich mit Name und E-Mail eintragen – ohne Login. Wir
              melden uns, wenn es weitergeht.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-primary text-primary-foreground hover:bg-[#171717] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-sm font-medium"
            >
              Zur Warteliste
            </Link>
          </section>
        </article>
      </main>
    </div>
  );
}
