---
status: sprejeto
date: 2026-10-24
---

# Časovno opravilo znotraj backenda (node-cron)

## Kontekst in opis problema

Sistem mora vsak dan poslati opomnike za jutrišnje termine in za cepljenja, ki zapadejo čez 14 dni. Isti opomnik se ne sme poslati dvakrat. Odločiti se moramo, kje in kako teče to opravilo.

## Dejavniki odločitve

* majhna količina dela (eno dnevno opravilo za eno ambulanto)
* preprečevanje podvojenih obvestil tudi ob ponovnem zagonu
* čim manj dodatne infrastrukture

## Obravnavane možnosti

* ločen proces z vrsto sporočil (npr. BullMQ + Redis)
* zunanji razporejevalnik (sistemski cron), ki kliče endpoint
* node-cron v istem procesu kot API

## Izid odločitve

Izbrana možnost: »node-cron v istem procesu kot API«, ker za eno ambulanto zadošča eno dnevno opravilo brez ločene storitve ali vrste sporočil. Podvojena obvestila preprečujeta zapis v tabeli `Notification` in unikatne omejitve, zato je opravilo varno tudi ob ponovnem zagonu.

### Posledice

* Dobro, ker ni dodatnega kontejnerja ali storitve.
* Dobro, ker opravilo uporablja iste module in pravila kot API.
* Slabo, ker se ob več instancah backenda opravilo zažene večkrat (podvajanje sicer preprečijo unikatne omejitve, a delo se izvede po nepotrebnem).
* Slabo, ker se opravilo ob 7.00 ne izvede, če backend takrat ne teče (rešeno z ročnim proženjem s strani administratorja).

## Prednosti in slabosti možnosti

### Ločen proces z vrsto sporočil

* Dobro, ker omogoča ponovne poskuse in skaliranje.
* Slabo, ker zahteva Redis in dodatno storitev za zelo malo dela.

### Zunanji razporejevalnik

* Dobro, ker je neodvisen od procesa backenda.
* Slabo, ker je odvisen od okolja namestitve in ga ni v Docker Compose.
