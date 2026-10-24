---
status: sprejeto
date: 2026-10-24
---

# Lastna avtentikacija namesto zunanje storitve

## Kontekst in opis problema

Sistem ima štiri vloge s podrobnimi pravili dostopa (npr. lastnik vidi le svoje živali, račune osebja ustvari le administrator). Odločiti se moramo, ali avtentikacijo izvedemo sami ali uporabimo zunanjo storitev.

## Dejavniki odločitve

* logika vlog in pravic je jedro sistema
* projekt mora delovati v celoti lokalno
* brez zunanjih računov in stroškov

## Obravnavane možnosti

* Firebase Authentication
* Auth0
* lastna avtentikacija (bcrypt, JWT, lasten middleware za vloge)

## Izid odločitve

Izbrana možnost: »lastna avtentikacija«, ker je logika vlog in pravic jedro sistema in je bolje, da je v celoti pod nadzorom backenda. Projekt tako ne potrebuje zunanjih računov in deluje v celoti lokalno.

### Posledice

* Dobro, ker so uporabniki in vloge v isti bazi kot ostali podatki.
* Dobro, ker razvoj in testiranje ne potrebujeta internetne povezave ali zunanjega računa.
* Slabo, ker smo sami odgovorni za varnost (zgoščevanje gesel, veljavnost žetonov).
* Slabo, ker funkcije, kot sta ponastavitev gesla ali dvostopenjska prijava, ni na voljo brez dodatnega razvoja.

## Prednosti in slabosti možnosti

### Firebase Authentication / Auth0

* Dobro, ker nudita preverjeno varnost in dodatne funkcije (ponastavitev gesla, prijava z Googlom).
* Slabo, ker zahtevata zunanji račun in internetno povezavo.
* Slabo, ker bi bilo treba vloge vseeno usklajevati z lastno bazo.
