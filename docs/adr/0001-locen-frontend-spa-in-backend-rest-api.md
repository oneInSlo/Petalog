---
status: sprejeto
date: 2026-10-24
---

# Ločen frontend (SPA) in backend (REST API)

## Kontekst in opis problema

Petalog uporabljajo štiri vloge z različnimi pravicami (lastnik, receptor, veterinar, administrator). Pravila, kot so zaklepanje zapisov, prosti termini in pravila odpovedi, morajo veljati ne glede na to, kako uporabnik dostopa do sistema. Odločiti se moramo, kako razdeliti prikaz in poslovno logiko.

## Dejavniki odločitve

* poslovnih pravil in preverjanja pravic ne sme biti mogoče obiti iz brskalnika
* interaktiven vmesnik (časovnica, grafi teže, izbira prostega termina)
* možnost kasnejšega drugega odjemalca (npr. mobilna aplikacija)

## Obravnavane možnosti

* strežniško izrisane strani (Express + predloge, npr. EJS)
* full-stack ogrodje (Next.js)
* ločen frontend (React SPA) in backend (REST API)

## Izid odločitve

Izbrana možnost: »ločen frontend (React SPA) in backend (REST API)«, ker jasno loči prikaz od poslovne logike. Backend je edino mesto, kjer se izvajajo pravila in preverjajo pravice, API pa lahko kasneje uporabi tudi drug odjemalec.

### Posledice

* Dobro, ker so vsa pravila na enem mestu in jih ni mogoče obiti iz brskalnika.
* Dobro, ker je mogoče frontend in backend razvijati in testirati ločeno.
* Slabo, ker je treba vzdrževati API pogodbo med obema deloma (oblike zahtev, napak).
* Slabo, ker SPA zahteva lastno usmerjanje in upravljanje stanja ter pazljivo nastavitev piškotkov in CORS (rešeno s Vite proxyjem med razvojem).

## Prednosti in slabosti možnosti

### Strežniško izrisane strani

* Dobro, ker je arhitektura preprosta (en proces, brez CORS).
* Slabo, ker je interaktivne zaslone (grafi, izbira termina) težje izdelati.
* Slabo, ker API ni na voljo drugim odjemalcem.

### Full-stack ogrodje (Next.js)

* Dobro, ker združuje frontend in backend v enem projektu.
* Slabo, ker se meja med prikazom in poslovnimi pravili zabriše.
* Slabo, ker je ogrodje kompleksnejše od potreb projekta.
