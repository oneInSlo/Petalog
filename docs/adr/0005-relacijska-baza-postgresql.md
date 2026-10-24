---
status: sprejeto
date: 2026-10-24
---

# Relacijska podatkovna baza PostgreSQL

## Kontekst in opis problema

Podatki Petaloga so močno povezani (lastnik → žival → zapisi, cepljenja, termini, obvestila). Nekatere operacije morajo biti atomarne, npr. ponovni izračun rokov z zapisom zgodovine ali preverjanje prekrivanja ob shranjevanju termina. Odločiti se moramo, katero bazo uporabimo.

## Dejavniki odločitve

* tuji ključi, transakcije in unikatne omejitve (npr. preprečevanje podvojenih obvestil)
* sočasen dostop spletne aplikacije in časovnega opravila
* enostaven lokalni zagon

## Obravnavane možnosti

* dokumentna baza (MongoDB)
* SQLite
* PostgreSQL

## Izid odločitve

Izbrana možnost: »PostgreSQL«, ker relacijski model z tujimi ključi, transakcijami in unikatnimi omejitvami ustreza povezanim podatkom. Ker sistem že teče v Dockerju, je PostgreSQL enako enostaven za zagon kot SQLite, hkrati pa je strežniška baza, primerna za sočasno delo več uporabnikov.

### Posledice

* Dobro, ker baza sama varuje celovitost podatkov (ni sirotnih zapisov, ni podvojenih obvestil).
* Dobro, ker agregacije v SQL omogočajo statistiko brez dodatnih orodij.
* Slabo, ker je potreben ločen strežnik baze (kontejner) in upravljanje migracij.
* Slabo, ker je spreminjanje sheme manj prožno kot v dokumentni bazi.

## Prednosti in slabosti možnosti

### Dokumentna baza (MongoDB)

* Dobro, ker je shema prožna.
* Slabo, ker tujih ključev, transakcij in unikatnih omejitev med zbirkami ne nudi na enak način.

### SQLite

* Dobro, ker ne potrebuje strežnika.
* Slabo, ker je manj primerna za sočasno pisanje več procesov (API in časovno opravilo).
* Slabo, ker se razlikuje od baz, ki se uporabljajo v produkciji.
