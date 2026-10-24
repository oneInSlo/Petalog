# Petalog

> Spletni informacijski sistem za manjšo veterinarsko ambulanto, ki združuje naročanje, zdravstveni karton živali in cepilni koledar.

## O projektu

Manjše veterinarske ambulante pogosto vodijo podatke razpršeno: termine v rokovnici, zapise v Wordu ali Excelu, cepljenja pa v knjižici, ki jo ima lastnik. **Petalog** (angl. *pet* + *catalog*) vse to združi v eno spletno aplikacijo. Osebje ima vse podatke o pacientu na enem mestu, lastniki pa sami rezervirajo termin in spremljajo zdravstveno stanje svojih živali.

Uporabniške vloge: **lastnik živali**, **receptor**, **veterinar** in **administrator** (upravitelj ambulante).

Ključne funkcionalnosti:

- zdravstveni karton s časovnico, opozorilom na alergije in zaklepanjem zaključenih zapisov,
- cepilni koledar s samodejnim izračunom rokov ponovnega cepljenja,
- rezervacija termina glede na trajanje storitve in delovni čas veterinarja,
- e-poštni opomniki in kampanje za cepljenje,
- izvoz terminov v osebni koledar (iCal),
- sledenje teži s kalkulatorjem odmerka ter statistika dela ambulante.

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

Utemeljitve izbir so zapisane v [arhitekturnih odločitvah (ADR)](docs/adr/).

## Struktura repozitorija

```
├── README.md
├── .gitignore
├── frontend/        # React + Vite aplikacija
├── backend/         # Express API, časovno opravilo, Prisma shema in migracije
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

1. Iz veje `main` ustvari novo vejo z opisnim imenom (npr. `feature/cepilni-koledar`, `docs/adr-0015`).
2. Spremembe commitaj na to vejo.
3. Odpri pull request v `main`.
4. Po pregledu PR združi (merge) in izbriši vejo.

Veja `main` je zaščitena: neposredni push, prisilno prepisovanje zgodovine in brisanje veje niso dovoljeni.