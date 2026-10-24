---
status: sprejeto
date: 2026-10-24
---

# Poslovna pravila v service plasti backenda

## Kontekst in opis problema

Petalog vsebuje več poslovnih pravil: izračun rokov cepljenj, zaklepanje zaključenih zapisov, izračun prostih terminov, izbor živali za kampanjo in izračun odmerka. Odločiti se moramo, kje ta pravila izvajamo.

## Dejavniki odločitve

* pravil ne sme biti mogoče obiti
* pravila morajo biti testabilna
* pravila naj bodo na enem mestu

## Obravnavane možnosti

* v frontendu
* v bazi (prožilci, shranjene procedure)
* v service plasti backenda, baza varuje le ključne omejitve

## Izid odločitve

Izbrana možnost: »v service plasti backenda«, ker so tam pravila zbrana na enem mestu in jih je mogoče testirati (Vitest). Baza dodatno varuje le ključne omejitve (unikatnost, tuji ključi).

### Posledice

* Dobro, ker so pravila napisana v TypeScriptu in pokrita z enotskimi testi.
* Dobro, ker frontend ostane preprost in ne vsebuje logike, ki bi jo bilo mogoče obiti.
* Slabo, ker mora vsak dostop do podatkov potekati skozi service plast (neposreden vnos v bazo pravila obide).
* Slabo, ker mora frontend za takojšnjo povratno informacijo nekatera preverjanja (npr. obrazci) podvojiti.

## Prednosti in slabosti možnosti

### V frontendu

* Dobro, ker je odziv takojšen.
* Slabo, ker jih je mogoče obiti z neposrednimi klici API.

### V bazi

* Dobro, ker veljajo za vsak dostop do podatkov.
* Slabo, ker je logiko v SQL težje pisati, testirati in različicirati.
