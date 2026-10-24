---
status: sprejeto
date: 2026-10-24
---

# Monolitni backend, razdeljen na module po domenah

## Kontekst in opis problema

Backend vsebuje veliko domen (živali, zdravstveni zapisi, cepljenja, termini, obvestila, kampanje, statistika), ki se razvijajo postopoma v več fazah. Odločiti se moramo, kako backend strukturirati.

## Dejavniki odločitve

* sistem je namenjen eni ambulanti z malo uporabniki
* funkcionalnosti se dodajajo v fazah (najprej MVP okoli kartona, nato naročanje in obveščanje)
* majhna ekipa, omejen čas

## Obravnavane možnosti

* mikrostoritve
* monolit brez notranje strukture
* modularni monolit (moduli po domenah s plastmi routes → controller → service)

## Izid odločitve

Izbrana možnost: »modularni monolit«, ker so mikrostoritve za eno ambulanto nepotrebno zapletene, moduli po domenah pa omogočajo postopno dodajanje funkcionalnosti brez preoblikovanja obstoječe kode.

### Posledice

* Dobro, ker je en proces enostaven za zagon, razhroščevanje in namestitev.
* Dobro, ker jasne meje modulov olajšajo dodajanje novih domen (npr. zaloga, računi).
* Slabo, ker se backend lahko skalira samo kot celota.
* Slabo, ker meje med moduli niso tehnično vsiljene, zato je potrebna disciplina pri odvisnostih med njimi.

## Prednosti in slabosti možnosti

### Mikrostoritve

* Dobro, ker se storitve lahko neodvisno skalirajo in nameščajo.
* Slabo, ker zahtevajo komunikacijo med storitvami, ločene baze in več infrastrukture.

### Monolit brez strukture

* Dobro, ker je začetek najhitrejši.
* Slabo, ker koda z rastjo postane prepletena in težko vzdrževana.
