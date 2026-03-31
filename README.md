# Coscribe

E-Mail-Outreach und Follow-ups für **Freelancer**: Warteliste, später Dashboard mit Entwürfen und CRM-Bausteinen.  
**Repo-Name (npm):** `outreach-ai` · **Produktname:** **Coscribe**

---

## Inhalt

1. [Was ist drin (Stand)](#was-ist-drin-stand)
2. [Technologie (exakte Versionen)](#technologie-exakte-versionen)
3. [Repository klonen & lokal starten](#repository-klonen--lokal-starten)
4. [Umgebungsvariablen](#umgebungsvariablen)
5. [NPM-Scripts](#npm-scripts)
6. [Routen & API](#routen--api)
7. [Ordnerstruktur](#ordnerstruktur)
8. [Supabase: Warteliste](#supabase-warteliste)
9. [Weitere Dokumentation](#weitere-dokumentation)
10. [Deployment](#deployment)

---

## Was ist drin (Stand)

| Bereich | Verhalten |
|---------|-----------|
| **Startseite `/`** | Nur **Landing** mit **Warteliste** (Name + E-Mail). Kein Login-Link im Header. |
| **`ScribeApp`** (`src/app/components/ScribeApp.tsx`) | Rendert **nur** `LandingPage` – **kein** automatisches Dashboard bei Session. |
| **Dashboard-Komponenten** | Liegen im Repo (`Dashboard.tsx`, …), werden auf **`/`** aktuell **nicht** gemountet. |
| **Auth `/auth`** | Supabase Login/Registrierung – **nur** über direkte URL `/auth`. |
| **Blog `/blog`** | Statische Infoseite „Produkt & Features“. |
| **Warteliste (API)** | `POST /api/waitlist` → Insert in Supabase-Tabelle `waitlist`, wenn Supabase korrekt konfiguriert ist. |
| **Lokale Daten** | Entwürfe, Kontakte, Profil: `src/lib/scribeLocalStorage.ts` (Browser-`localStorage`). |

---

## Technologie (exakte Versionen)

Aus `package.json` (bei Abweichung: Datei ist maßgeblich):

| Paket | Version |
|-------|---------|
| `next` | 16.1.6 |
| `react` / `react-dom` | 19.2.3 |
| `typescript` | ^5 |
| `tailwindcss` | ^4 |
| `@supabase/supabase-js` | ^2.99.1 |

**Node:** LTS empfohlen (z. B. 20.x oder 22.x).

---

## Repository klonen & lokal starten

```bash
git clone <deine-repo-url> FreelancerOS
cd FreelancerOS
npm install
```

Entwicklungsserver:

```bash
npm run dev
```

- **URL:** http://localhost:3000  
- **Port belegt:** Next.js schlägt ggf. **3001** vor – URL in der Konsole ablesen.

Produktions-Build prüfen:

```bash
npm run build
npm start
```

---

## Umgebungsvariablen

Datei **`.env.local`** im **Projektroot** (steht in `.gitignore` – **nicht** committen):

| Variable | Pflicht für | Beschreibung |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase (Auth, Warteliste) | Projekt-URL aus dem Supabase-Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Anon/Public Key |

**Ohne** gültige Werte:

- `src/lib/supabase.ts` nutzt interne Platzhalter → **Build kann trotzdem grün sein**.
- **`POST /api/waitlist`** antwortet mit **503** und Hinweistext, wenn Supabase nicht als „konfiguriert“ erkannt wird.
- **Auth** auf `/auth` ist nicht sinnvoll nutzbar ohne echtes Projekt.

---

## NPM-Scripts

| Script | Befehl |
|--------|--------|
| Entwicklung | `npm run dev` |
| Produktions-Build | `npm run build` |
| Server nach Build | `npm start` |
| ESLint | `npm run lint` |
| Git (Shortcut) | `npm run sync` → `git add . && git commit -m "Auto save" && git push` — **nur** nutzen, wenn ihr das wollt |

---

## Routen & API

### Seiten (App Router)

| Pfad | Datei | Zweck |
|------|--------|--------|
| `/` | `src/app/page.tsx` → `ScribeApp` | Landing + Warteliste |
| `/blog` | `src/app/blog/page.tsx` | Produkt-/Feature-Text |
| `/auth` | `src/app/auth/page.tsx` | Supabase Auth |

### API (Route Handlers)

| Methode & Pfad | Datei | Zweck |
|----------------|--------|--------|
| `POST /api/waitlist` | `src/app/api/waitlist/route.ts` | JSON `{ "name": string, "email": string }` → Supabase `waitlist` |
| `POST /api/scribe/agent` | `src/app/api/scribe/agent/route.ts` | Platzhalter (**501**), noch keine KI-Engine |

---

## Ordnerstruktur

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root-Layout, Metadata (Titel Coscribe)
│   │   ├── page.tsx            # Eintrag: ScribeApp
│   │   ├── globals.css
│   │   ├── auth/page.tsx
│   │   ├── blog/page.tsx
│   │   └── api/
│   │       ├── waitlist/route.ts
│   │       └── scribe/agent/route.ts
│   ├── components/             # LandingPage, Dashboard, …
│   └── lib/                    # supabase.ts, scribeLocalStorage.ts, …
├── project  md/                # Doku (Ordnername: "project" + 2 Leerzeichen + "md")
├── .cursor/rules/              # Cursor-Projektregeln (*.mdc)
├── package.json
└── README.md
```

**Hinweis:** `HTML/` und `CSS/` (falls vorhanden) sind **ältere Vanilla-Dateien**, nicht mit Next-`src/` synchron gepflegt.

---

## Supabase: Warteliste

1. Im Supabase-Projekt SQL ausführen (siehe **`supabase/waitlist-supabase.sql`**): Tabelle `waitlist`, RLS für `anon`-Insert.
2. `.env.local` mit echten `NEXT_PUBLIC_SUPABASE_*` setzen.
3. Formular auf `/` testen → Zeile in `waitlist` prüfen.

---

## Weitere Dokumentation

| Ort | Inhalt |
|-----|--------|
| `project  md/README.md` | Index der Projekt-Doku |
| `project  md/PROJECT-STATUS.md` | Feature-/Status-Übersicht |
| `project  md/CURSOR-CONTEXT.md` | Regeln für KI/Cursor/Cowork |
| `project  md/COMMANDS-UND-GIT.md` | Git & Befehle |

---

## Deployment

- **Host:** z. B. **Vercel** (Next.js) oder andere Node-Hosts.
- **Build:** `npm run build` muss lokal oder in CI grün sein.
- **Env:** dieselben Supabase-Variablen in der Hosting-Umgebung setzen (nicht `.env.local` aus dem Repo).

---

## Lizenz

`package.json`: `"private": true` — keine öffentliche Lizenz gesetzt; Nutzung nach eurem Projekt.
