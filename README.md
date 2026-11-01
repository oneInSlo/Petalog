# Petalog

> Spletni informacijski sistem za manjšo veterinarsko ambulanto, ki združuje naročanje, zdravstveni karton živali in cepilni koledar.

## O projektu

Manjše veterinarske ambulante pogosto vodijo podatke razpršeno: termine v rokovnici, zapise v Wordu ali Excelu, cepljenja pa v knjižici, ki jo ima lastnik. **Petalog** (angl. *pet* + *catalog*) vse to združi v eno spletno aplikacijo. Osebje ima vse podatke o pacientu na enem mestu, lastniki pa sami rezervirajo termin in spremljajo zdravstveno stanje svojih živali.

Uporabniške vloge: **lastnik živali**, **receptor**, **veterinar** in **administrator** (upravitelj ambulante).

Načrtovane ključne funkcionalnosti (kaj že deluje, je opisano v razdelku [Stanje projekta](#stanje-projekta)):

- zdravstveni karton s časovnico, opozorilom na alergije in zaklepanjem zaključenih zapisov,
- cepilni koledar s samodejnim izračunom rokov ponovnega cepljenja,
- rezervacija termina glede na trajanje storitve in delovni čas veterinarja,
- e-poštni opomniki in kampanje za cepljenje,
- izvoz terminov v osebni koledar (iCal),
- sledenje teži s kalkulatorjem odmerka ter statistika dela ambulante.

## Stanje projekta

Trenutna različica je MVP, ki obsega uporabniške zgodbe US-01 do US-08.

| Vloga | Kaj lahko naredi v MVP |
|-------|------------------------|
| Lastnik | se registrira, upravlja svoje živali, vidi roke cepljenj ter karton s časovnico in alergijami, brez osnutkov |
| Veterinar | išče paciente, vidi zapadla cepljenja, vnaša cepljenja in alergije, ureja in zaključuje zdravstvene zapise ter jim dodaja dodatke |
| Receptor | prek naslova `/animals/<id>` vidi podatke živali in cepilni koledar |
| Administrator | ustvarja, deaktivira in znova aktivira račune osebja |

Omejitve MVP:

- Termini, opomniki, kampanje, iCal, teža in statistika še niso narejeni. Na nadzorni plošči lastnika je zato razdelek terminov prazen.
- Receptor še nima svoje nadzorne plošče, po prijavi vidi začasno stran.
- Aplikacija še ne pošilja e-pošte, zato je Mailpit v MVP prazen.
- Zdravstvenih zapisov, cepljenj in alergij ni mogoče izbrisati, ker se medicinska evidenca ne briše. Zato tudi žival z evidenco ni izbrisljiva.

## Lokalni zagon

### Predpogoji

- [Docker](https://docs.docker.com/get-docker/) z Docker Compose (Docker Desktop mora biti zagnan),
- Git,
- [Node.js 20](https://nodejs.org/) samo za delo izven kontejnerjev, npr. za preverjanje tipov v urejevalniku. Za zagon aplikacije ni potreben.

### 1. Priprava `.env`

V korenski mapi repozitorija kopiraj predlogo:

```bash
# Linux, macOS, Git Bash
cp .env.example .env
```

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

V datoteki `.env` zamenjaj vrednosti `change-me` pri `POSTGRES_PASSWORD`, `JWT_SECRET` in `SEED_PASSWORD`. Vrednost `SEED_PASSWORD` je geslo vseh testnih računov. Datoteka `.env` ni v repozitoriju.

### 2. Zagon

```bash
docker compose up --build -d
```

Ukaz zažene štiri kontejnerje: `db`, `mailpit`, `backend` in `frontend`. Migracije baze se izvedejo samodejno ob vsakem zagonu backenda. Prvi zagon traja nekaj minut, potek pa lahko spremljaš z ukazom `docker compose logs -f backend`.

### 3. Testni podatki (seed)

Ko backend izpiše `Backend listening on port 3000`, enkrat zaženi:

```bash
docker compose exec backend npx prisma db seed
```

Seed naloži cepiva, račune za vse vloge in testne živali. Ponovni zagon ne ustvari dvojnikov.

### 4. Naslovi

Naslovi veljajo za privzete vrednosti vrat iz `.env.example`.

| Storitev | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000/api (preverjanje delovanja: http://localhost:3000/api/health) |
| Mailpit | http://localhost:8025 |

### Testni računi

Geslo vseh računov je vrednost `SEED_PASSWORD` iz tvoje datoteke `.env`.

| Vloga | E-pošta | Testne živali |
|-------|---------|---------------|
| Administrator | `admin@petalog.test` | |
| Veterinar | `veterinar@petalog.test` | |
| Receptor | `receptor@petalog.test` | |
| Lastnik | `lastnik@petalog.test` | Luna, Muri, Snežko, Piko |
| Lastnik | `lastnik2@petalog.test` | Rex, Mici, Pepi, Ferko, Kiki |

Seed ne vsebuje cepljenj in zapisov, zato jih za preizkus nadzornih plošč najprej vnesi kot veterinar. Pri veterinarju živali najdeš z iskanjem na nadzorni plošči.

### Pogosti ukazi

| Namen | Ukaz |
|-------|------|
| Backend testi | `docker compose exec backend npm test` |
| Preverjanje tipov | `docker compose exec backend npx tsc --noEmit` in `docker compose exec frontend npx tsc --noEmit` |
| Dnevniki | `docker compose logs -f backend` |
| Ustavitev (podatki ostanejo) | `docker compose down` |
| Ponastavitev baze (**izbriše vse podatke**) | `docker compose down -v`, nato znova koraka 2 in 3 |

### Odpravljanje težav

- **Vrata so zasedena:** v `.env` spremeni `DB_PORT`, `BACKEND_PORT`, `FRONTEND_PORT` ali `MAILPIT_UI_PORT`.
- **Geslo testnih računov ne deluje:** seed obstoječih računov ne posodobi, zato sprememba `SEED_PASSWORD` velja šele po ponastavitvi baze.
- **Po spremembi `POSTGRES_PASSWORD` se backend ne poveže z bazo:** geslo se nastavi ob prvem zagonu baze, zato je potrebna ponastavitev baze.
- **Po dodajanju paketa ga kontejner ne najde:** kontejnerji imajo svoj `node_modules`, zato zaženi `docker compose up --build -V -d`.
- **Urejevalnik javlja, da Prisma tipi ne obstajajo:** v mapi `backend/` zaženi `npm install` in `npx prisma generate`.

## Tehnološki sklad

| Sloj | Tehnologija |
|------|-------------|
| Frontend | React 18, TypeScript, Vite, React Router, Tailwind CSS, Recharts, Zod |
| Backend | Node.js 20, Express, TypeScript, Zod, date-fns(-tz), node-cron |
| Podatkovna baza | PostgreSQL 16, Prisma ORM |
| Avtentikacija | JWT v httpOnly piškotku, bcrypt |
| Obveščanje in integracije | Nodemailer (SMTP), Mailpit (razvoj), ical-generator |
| Lokalni razvoj | Docker, Docker Compose |
| Kakovost kode | Vitest, Prettier, SonarQube for IDE |

Recharts, node-cron, Nodemailer in ical-generator so načrtovani za funkcionalnosti po MVP in še niso nameščeni. Utemeljitve izbir so zapisane v [arhitekturnih odločitvah (ADR)](docs/adr/).

## Struktura repozitorija

```
├── README.md
├── .gitignore
├── .env.example     # predloga spremenljivk okolja
├── docker-compose.yml
├── frontend/        # React + Vite aplikacija
├── backend/         # Express API, Prisma shema, migracije in seed
└── docs/            # projektna dokumentacija
    ├── wireframes/  # skice uporabniškega vmesnika
    └── adr/         # arhitekturne odločitve (MADR)
```

## Dokumentacija

1. [Zasnova rešitve](docs/01-zasnova-resitve.md)
2. [Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
3. [Podatkovni model](docs/03-podatkovni-model.md)
4. [Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
5. [Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
6. [Wireframes](docs/06-wireframes.md)
7. [Arhitekturne odločitve (ADR)](docs/adr/)

## Razvojni proces

Projekt sledi strategiji [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow):

1. Iz veje `main` ustvari novo vejo z opisnim imenom (npr. `feat/11-cepljenja-vmesnik`, `docs/19-readme-zagon`).
2. Spremembe commitaj na to vejo.
3. Odpri pull request v `main`.
4. Po pregledu PR združi (merge) in izbriši vejo.

Veja `main` je zaščitena: neposredni push, prisilno prepisovanje zgodovine in brisanje veje niso dovoljeni.