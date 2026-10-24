---
status: sprejeto
date: 2026-10-24
---

# Lokalni zagon z Docker Compose (štirje kontejnerji)

## Kontekst in opis problema

Sistem sestavljajo frontend, backend, PostgreSQL in testni poštni strežnik. Vsak razvijalec (in ocenjevalec) mora projekt zagnati čim hitreje in z enakimi različicami orodij. Odločiti se moramo, kako sistem zaganjamo lokalno.

## Dejavniki odločitve

* zagon z enim ukazom
* brez ročne namestitve Node.js, PostgreSQL ali poštnega strežnika
* enako okolje pri vseh razvijalcih

## Obravnavane možnosti

* ročna namestitev vseh delov na računalnik razvijalca
* Docker samo za bazo, aplikacija teče neposredno
* Docker Compose s štirimi kontejnerji (frontend, backend, db, mailpit)

## Izid odločitve

Izbrana možnost: »Docker Compose s štirimi kontejnerji«, ker se celoten sistem zažene z enim ukazom, brez ročne namestitve. Vsak del je ločen, zato ga je mogoče posebej pregledovati, ponovno zagnati ali zamenjati, novi razvijalec pa projekt zažene v nekaj minutah.

### Posledice

* Dobro, ker so različice (Node 20, PostgreSQL 16) določene v konfiguraciji.
* Dobro, ker podatki baze ostanejo v volumnu `pgdata`, koda pa je priklopljena (bind mount) in spremembe so vidne takoj.
* Slabo, ker mora imeti vsak razvijalec nameščen Docker, ki porabi več virov.
* Slabo, ker je bind mount na nekaterih sistemih (Windows, macOS) počasnejši pri spremljanju datotek.

## Prednosti in slabosti možnosti

### Ročna namestitev

* Dobro, ker ni dodatne plasti.
* Slabo, ker se različice med razvijalci razlikujejo in je postopek dolg.

### Docker samo za bazo

* Dobro, ker aplikacija teče hitreje in jo je lažje razhroščevati.
* Slabo, ker je treba Node.js še vedno namestiti ročno, Mailpit pa posebej.
