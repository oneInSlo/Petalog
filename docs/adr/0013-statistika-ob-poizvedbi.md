---
status: sprejeto
date: 2026-10-24
---

# Statistika se računa ob poizvedbi

## Kontekst in opis problema

Administrator in receptor potrebujeta statistiko za izbrano obdobje (obravnave po storitvah in veterinarjih, delež pravočasnih cepljenj, odpovedi in neprihodi). Odločiti se moramo, ali statistiko računamo sproti ali jo vnaprej pripravimo.

## Dejavniki odločitve

* majhna količina podatkov ene ambulante
* podatki morajo biti vedno ažurni
* čim manj dodatnih tabel in sinhronizacije

## Obravnavane možnosti

* predračunane tabele, ki jih posodablja časovno opravilo
* materializirani pogledi v PostgreSQL
* agregacije v SQL ob vsaki zahtevi

## Izid odločitve

Izbrana možnost: »agregacije v SQL ob vsaki zahtevi«, ker je količina podatkov ene ambulante majhna, zato agregacije delujejo dovolj hitro in so vedno ažurne, brez dodatnih tabel in sinhronizacije.

### Posledice

* Dobro, ker so podatki vedno točni in ni nevarnosti neskladja.
* Dobro, ker ni dodatne sheme ali opravil za osveževanje.
* Slabo, ker se čas poizvedbe veča z rastjo podatkov.
* Slabo, ker bi ob razširitvi na več ambulant odločitev morali ponovno pregledati.

## Prednosti in slabosti možnosti

### Predračunane tabele

* Dobro, ker so poizvedbe hitre ne glede na količino podatkov.
* Slabo, ker zahtevajo sinhronizacijo in so lahko zastarele.

### Materializirani pogledi

* Dobro, ker logika ostane v SQL.
* Slabo, ker jih je treba osveževati in jih Prisma ne podpira neposredno.
