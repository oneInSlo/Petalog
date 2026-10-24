---
status: sprejeto
date: 2026-10-24
---

# Prisma ORM za dostop do baze

## Kontekst in opis problema

Backend potrebuje dostop do PostgreSQL, upravljanje sprememb sheme in začetne podatke za razvoj in MVP (cepiva, računi osebja). Vsak razvijalec mora imeti enako strukturo baze. Odločiti se moramo, kako dostopamo do baze.

## Dejavniki odločitve

* tipiziran dostop do podatkov v TypeScriptu
* migracije kot del repozitorija
* podpora za seed podatke

## Obravnavane možnosti

* surov SQL (knjižnica `pg`) ali gradnik poizvedb (Knex)
* TypeORM ali Sequelize
* Prisma ORM

## Izid odločitve

Izbrana možnost: »Prisma ORM«, ker ima shemo v eni berljivi datoteki, samodejne migracije, ki so del repozitorija, vgrajeno podporo za seed podatke in tipiziran dostop do baze.

### Posledice

* Dobro, ker shema v `schema.prisma` služi tudi kot dokumentacija podatkovnega modela.
* Dobro, ker generirani tipi preprečujejo napake v imenih polj.
* Slabo, ker je za zahtevnejše poizvedbe (npr. agregacije za statistiko) včasih treba uporabiti surov SQL.
* Slabo, ker projekt postane odvisen od generatorja Prisma in njegovih posodobitev.

## Prednosti in slabosti možnosti

### Surov SQL / Knex

* Dobro, ker omogoča popoln nadzor nad poizvedbami.
* Slabo, ker ni samodejnih tipov, migracije pa je treba pisati ročno.

### TypeORM / Sequelize

* Dobro, ker sta zrela in razširjena.
* Slabo, ker je tipizacija manj natančna, definicije modelov pa so razpršene po razredih.
