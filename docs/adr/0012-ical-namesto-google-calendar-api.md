---
status: sprejeto
date: 2026-10-24
---

# Koledar v formatu iCal namesto Google Calendar API

## Kontekst in opis problema

Lastniki želijo termine in roke cepljenj videti v svojem osebnem koledarju (Google Calendar, Outlook, Apple Calendar). Odločiti se moramo, kako sistem podatke posreduje v koledarje.

## Dejavniki odločitve

* podpora za več koledarskih aplikacij
* brez OAuth prijave in zunanjih računov
* samodejno posodabljanje

## Obravnavane možnosti

* Google Calendar API (in API-ji drugih ponudnikov)
* enkraten prenos datoteke `.ics`
* naročnina na osebni koledar iCal (`/api/calendar/:token.ics`)

## Izid odločitve

Izbrana možnost: »naročnina na osebni koledar iCal«, ker standardni format `.ics` podpirajo vsi večji koledarji, ne zahteva OAuth prijave, Google Cloud projekta ali zunanjih računov in deluje tudi lokalno. Lastnik koledar doda enkrat, nato se samodejno osvežuje.

### Posledice

* Dobro, ker ena rešitev deluje za vse koledarske aplikacije.
* Dobro, ker lastnik lahko z zamenjavo `calendarToken` kadar koli prekliče staro povezavo.
* Slabo, ker je endpoint javen in ga varuje le skrivni žeton (kdor ima povezavo, vidi termine).
* Slabo, ker koledarske aplikacije osvežujejo naročnine z zamikom (lahko tudi več ur), spletni koledarji pa zahtevajo javno dostopen naslov.

## Prednosti in slabosti možnosti

### Google Calendar API

* Dobro, ker so spremembe vidne takoj.
* Slabo, ker zahteva OAuth, Google Cloud projekt in deluje le za en koledar.

### Enkraten prenos datoteke .ics

* Dobro, ker je najpreprostejši.
* Slabo, ker se ob spremembi termina koledar ne posodobi.
