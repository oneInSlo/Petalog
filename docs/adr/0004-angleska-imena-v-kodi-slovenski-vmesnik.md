---
status: sprejeto
date: 2026-10-24
---

# Angleška imena v kodi, slovenski uporabniški vmesnik

## Kontekst in opis problema

Uporabniki sistema so slovensko govoreči, knjižnice in ogrodja (Prisma, Express) pa uporabljajo angleške konvencije. Odločiti se moramo, v katerem jeziku poimenujemo module, endpointe, entitete in spremenljivke.

## Dejavniki odločitve

* doslednost poimenovanja v celotni kodi
* skladnost s knjižnicami (brez šumnikov v identifikatorjih)
* uporabniki morajo vmesnik razumeti v slovenščini

## Obravnavane možnosti

* vse v slovenščini (koda in vmesnik)
* vse v angleščini
* angleška imena v kodi, slovenski vmesnik in e-pošta

## Izid odločitve

Izbrana možnost: »angleška imena v kodi, slovenski vmesnik«, ker se imena brez šumnikov skladajo s knjižnicami in konvencijami ter ostanejo dosledna v celotni kodi, uporabniki pa vidijo slovenski vmesnik.

### Posledice

* Dobro, ker koda bere enotno skupaj z generirano kodo Prisme in knjižnic.
* Dobro, ker je kodo lažje deliti in iskati pomoč za napake.
* Slabo, ker je treba vzdrževati slovar izrazov (v `03-podatkovni-model.md`), ki povezuje domenske pojme v obeh jezikih.
* Slabo, ker obstaja tveganje neenotnih prevodov pojmov, če slovar ni posodobljen.

## Prednosti in slabosti možnosti

### Vse v slovenščini

* Dobro, ker se domenski pojmi ujemajo z vmesnikom.
* Slabo, ker mešanje z angleškimi imeni knjižnic in težave s šumniki vodijo v nedoslednost.

### Vse v angleščini

* Dobro, ker je najbolj dosledno.
* Slabo, ker ciljni uporabniki potrebujejo slovenski vmesnik.
