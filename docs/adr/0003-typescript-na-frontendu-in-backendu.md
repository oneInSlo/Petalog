---
status: sprejeto
date: 2026-10-24
---

# TypeScript na frontendu in backendu

## Kontekst in opis problema

Podatki se prenašajo med frontendom in backendom (živali, zapisi, termini, cepljenja) in imajo veliko polj ter stanj. Odločiti se moramo, v katerem jeziku pišemo oba dela.

## Dejavniki odločitve

* manj napak pri delu s podatki in stanji
* en jezik za celoten projekt
* možnost deljenja validacijskih shem (Zod)

## Obravnavane možnosti

* JavaScript na obeh straneh
* TypeScript na obeh straneh
* TypeScript na frontendu in drug jezik na backendu (npr. Java + Spring, Python)

## Izid odločitve

Izbrana možnost: »TypeScript na obeh straneh«, ker je to en jezik v celotnem projektu, tipi pa zmanjšajo napake pri delu s podatki. Zod sheme in tipi se lahko uporabljajo na obeh straneh.

### Posledice

* Dobro, ker prevajalnik ujame napačna imena polj in neveljavne vrednosti že med razvojem.
* Dobro, ker se tipi iz Prisme in Zoda neposredno uporabljajo v kodi.
* Slabo, ker je potreben korak prevajanja in dodatna konfiguracija (tsconfig, tsx).
* Slabo, ker zahteva nekaj več časa za pisanje tipov.

## Prednosti in slabosti možnosti

### JavaScript na obeh straneh

* Dobro, ker ni koraka prevajanja.
* Slabo, ker se napake v oblikah podatkov pokažejo šele med izvajanjem.

### Drug jezik na backendu

* Dobro, ker so nekatera ogrodja (Spring) zelo zrela.
* Slabo, ker zahteva dva jezika in podvojene definicije podatkov.
