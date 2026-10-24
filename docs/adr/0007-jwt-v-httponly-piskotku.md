---
status: sprejeto
date: 2026-10-24
---

# JWT žeton v httpOnly piškotku

## Kontekst in opis problema

Po prijavi mora backend na vsaki zahtevi vedeti, kdo je uporabnik in katero vlogo ima. Sistem hrani zdravstvene podatke živali in osebne podatke lastnikov, zato mora biti žeton zaščiten. Odločiti se moramo, kako vzdržujemo prijavljeno stanje.

## Dejavniki odločitve

* zaščita žetona pred krajo z XSS
* hitro preverjanje vloge na vsaki zahtevi
* preprostost implementacije

## Obravnavane možnosti

* strežniške seje (express-session s shrambo sej)
* JWT v `localStorage`
* JWT v httpOnly piškotku

## Izid odločitve

Izbrana možnost: »JWT v httpOnly piškotku«, ker omogoča preprosto avtentikacijo brez strežniškega hranjenja sej, piškotek httpOnly ščiti žeton pred dostopom iz JavaScripta, vloga v žetonu pa omogoča hitro preverjanje pravic.

### Posledice

* Dobro, ker JavaScript v brskalniku do žetona nima dostopa.
* Dobro, ker backendu ni treba hraniti sej.
* Slabo, ker žetona ni mogoče preklicati pred iztekom (npr. ob deaktivaciji uporabnika), zato je veljavnost omejena (8 ur) in mora backend dodatno preverjati `isActive`.
* Slabo, ker piškotek zahteva zaščito pred CSRF (nastavitev `SameSite`).

## Prednosti in slabosti možnosti

### Strežniške seje

* Dobro, ker je sejo mogoče takoj preklicati.
* Slabo, ker zahtevajo shrambo sej in poizvedbo ob vsaki zahtevi.

### JWT v localStorage

* Dobro, ker je enostaven za uporabo v SPA.
* Slabo, ker je žeton dostopen iz JavaScripta in ranljiv za krajo z XSS.
