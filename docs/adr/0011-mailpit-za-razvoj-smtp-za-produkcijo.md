---
status: sprejeto
date: 2026-10-24
---

# Mailpit za razvoj, SMTP za produkcijo

## Kontekst in opis problema

Sistem pošilja opomnike in vabila na cepljenje po e-pošti. Med razvojem in predstavitvijo projekta sporočila ne smejo doseči pravih naslovov, hkrati pa želimo preveriti njihovo vsebino. Odločiti se moramo, kako pošiljamo e-pošto.

## Dejavniki odločitve

* brez nevarnosti pošiljanja pravim prejemnikom med razvojem
* brez pravega poštnega računa
* enostaven prehod na pravo pošiljanje

## Obravnavane možnosti

* pravi SMTP račun (npr. Gmail) že med razvojem
* transakcijska storitev prek API (npr. SendGrid)
* Nodemailer s SMTP, med razvojem Mailpit

## Izid odločitve

Izbrana možnost: »Nodemailer s SMTP, med razvojem Mailpit«, ker je pošiljanje mogoče razvijati in prikazati brez pravega poštnega računa in brez nevarnosti, da sporočila dosežejo prave naslove. Ker Nodemailer uporablja standardni SMTP, za prehod na pravi strežnik zadošča sprememba nastavitev v `.env`.

### Posledice

* Dobro, ker je vsa poslana e-pošta vidna v spletnem vmesniku Mailpita.
* Dobro, ker koda ni vezana na določenega ponudnika.
* Slabo, ker je potreben dodaten kontejner.
* Slabo, ker Mailpit ne preveri dostavljivosti (filtri za neželeno pošto, SPF/DKIM), kar je treba preveriti šele ob produkcijski nastavitvi.

## Prednosti in slabosti možnosti

### Pravi SMTP račun

* Dobro, ker preveri pravo dostavo.
* Slabo, ker obstaja nevarnost pošiljanja na prave naslove in zahteva gesla računa.

### Transakcijska storitev prek API

* Dobro, ker nudi statistiko dostave.
* Slabo, ker zahteva zunanji račun in kodo, vezano na ponudnika.
