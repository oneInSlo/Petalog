# Zasnova rešitve

## Ime rešitve

**Petalog** (angl. *pet* + *catalog*): spletni informacijski sistem za manjšo veterinarsko ambulanto.

## Namen rešitve in problem

Manjše veterinarske ambulante pogosto vodijo podatke o pacientih razpršeno: termine v papirnati rokovnici ali v skupnem koledarju, zdravstvene zapise v Wordu ali Excelu, cepljenja pa v cepilni knjižici, ki jo ima lastnik pri sebi. Posledice so:

- veterinar med pregledom nima hitrega vpogleda v celotno zgodovino živali (pretekle diagnoze, alergije, terapije),
- roke za ponovna cepljenja je treba spremljati ročno, zato jih ambulanta in lastniki pogosto spregledajo,
- naročanje poteka izključno po telefonu, kar obremenjuje osebje in povzroča prekrivanje terminov,
- lastnik nima pregleda nad zdravstvenim stanjem svoje živali.

**Petalog** združi naročanje, zdravstveni karton živali in cepilni koledar v enotno spletno aplikacijo. Osebje ima vse podatke o pacientu na enem mestu, lastniki pa lahko sami rezervirajo termin in spremljajo zdravstvene podatke svojih živali.

## Ciljni uporabniki

- **Veterinarji**: med pregledom pregledajo zgodovino živali in vnesejo diagnozo, terapijo ter cepljenja.
- **Receptorji (administrativno osebje)**: upravljajo urnik, potrjujejo rezervacije, sprejemajo paciente v čakalnico in lastnike vabijo na cepljenje.
- **Lastniki živali**: doma ali na telefonu rezervirajo termin, pregledajo karton svoje živali in vidijo, kdaj zapade naslednje cepljenje. Po e-pošti prejemajo opomnike, termine pa imajo lahko tudi v svojem osebnem koledarju.
- **Upravitelj ambulante (administrator)**: upravlja uporabniške račune osebja, storitve, cepiva in delovni čas veterinarjev ter spremlja statistiko dela ambulante.

## Kratek opis delovanja

1. **Lastnik** se registrira, doda svojo žival (vrsta, pasma, datum rojstva, številka čipa) in izbere storitev, na primer *cepljenje* ali *splošni pregled*. Sistem mu ponudi le proste termine, v katere izbrana storitev časovno pade.
2. **Receptor** rezervacijo potrdi. Ko lastnik pride v ambulanto, receptor pacienta označi kot *v čakalnici*.
3. **Veterinar** odpre obravnavo in na enem zaslonu vidi časovnico živali: pretekle obravnave, alergije, terapije, gibanje teže in stanje cepljenj. Vnese ugotovitve, diagnozo, terapijo, trenutno težo in opravljena cepljenja, odmerek zdravila pa si lahko izračuna glede na težo živali.
4. Ob **zaključku obravnave** se zapis zaklene, sistem pa glede na pravila cepiva (npr. steklina vsakih 12 mesecev) samodejno izračuna datum naslednjega cepljenja.
5. **Nadzorna plošča ambulante** prikazuje današnje termine po statusih in seznam živali z zapadlimi ali kmalu zapadlimi cepljenji. Lastnik na svoji plošči vidi prihodnje termine in roke cepljenj za svoje živali.
6. **Sistem samodejno obvešča lastnike**: dan pred terminom in 14 dni pred zapadlostjo cepljenja pošlje e-poštni opomnik. Receptor lahko za izbrano cepivo pošlje vabilo vsem lastnikom, katerih živalim cepljenje kmalu zapade. Lastnik si lahko termine in roke cepljenj doda v svoj koledar (Google Calendar, Outlook, Apple Calendar).

Rešitev je namenjena eni ambulanti z več veterinarji. Zasnovana je tako, da jo je mogoče kasneje razširiti z računi, vodenjem zaloge cepiv in zdravil, cepilno knjižico v PDF in čakalno vrsto za termine.
