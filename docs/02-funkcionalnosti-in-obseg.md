# Funkcionalnosti in obseg

## Uporabniške vloge

### Lastnik živali
Zunanji uporabnik, ki se sam registrira v sistem.
- **Lahko:** ureja svoj profil, dodaja in ureja osnovne podatke svojih živali, rezervira termin ter ga odpove ali prestavi do 24 ur pred začetkom, pregleda zdravstveno časovnico, cepilni koledar in graf teže svojih živali, ustvari ali osveži osebno povezavo do koledarja terminov, prejema e-poštne opomnike in vabila na cepljenje.
- **Nima pravic:** vpogleda v podatke drugih lastnikov in njihovih živali, vnosa ali spreminjanja zdravstvenih podatkov (zapisi, alergije, cepljenja, teža), potrjevanja terminov, odpovedi termina manj kot 24 ur pred začetkom, dostopa do statistike ambulante.

### Receptor
Administrativno osebje ambulante.
- **Lahko:** pregleduje urnik vseh veterinarjev, potrjuje, prestavlja in odpoveduje termine (tudi manj kot 24 ur pred začetkom), sprejme pacienta v čakalnico, označi neprihod, išče paciente po imenu, lastniku ali številki čipa, pripravi in pošlje kampanjo za cepljenje, pregleduje pregled dela ambulante in statistiko.
- **Nima pravic:** vnosa ali urejanja zdravstvenih podatkov (zapisi, alergije, cepljenja, teža), odpiranja in zaključevanja obravnav, upravljanja uporabniških računov, storitev, cepiv in delovnega časa veterinarjev.

### Veterinar
Strokovno osebje, ki izvaja obravnave.
- **Lahko:** pregleduje svoj dnevni urnik, odpre obravnavo pacienta iz čakalnice, pregleda celotno zdravstveno časovnico živali, vnese anamnezo, diagnozo, terapijo, alergije, težo in opravljena cepljenja, uporabi kalkulator odmerka, zaključi zdravstveni zapis in zaključenemu zapisu doda dodatek.
- **Nima pravic:** urejanja že zaključenih zapisov (dovoljen je le dodatek z zapisom avtorja in časa), upravljanja uporabniških računov, storitev, cepiv in delovnega časa, pošiljanja kampanj.

### Administrator (upravitelj ambulante)
- **Lahko:** ustvarja in deaktivira račune osebja ter jim dodeljuje vloge, ureja seznam storitev (ime, trajanje, cena), ureja cepiva z intervali ponovnega cepljenja in sproži ponovni izračun rokov, določa tedenski delovni čas veterinarjev, pregleduje statistiko ambulante, ročno sproži pošiljanje opomnikov.
- **Nima pravic:** vnosa ali spreminjanja zdravstvenih podatkov (ni veterinar), brisanja zdravstvene evidence (medicinska evidenca se ne briše).

## Predvidene funkcionalnosti

Funkcionalnosti so razdeljene na **domenske** (značilne za veterinarsko ambulanto, vsebujejo poslovna pravila ali delovne procese) in **osnovne** (splošne funkcije, potrebne za delovanje sistema).

| # | Funkcionalnost | Opis | Tip | MVP |
|---|---|---|---|---|
| 1 | Registracija, prijava in upravljanje vlog | Lastnik se registrira, vsi uporabniki se prijavijo in po prijavi vidijo začetno stran glede na svojo vlogo. Administrator ustvari račune osebja, jim dodeli vlogo in jih lahko deaktivira. | osnovna | **MVP** |
| 2 | Profil živali | Lastnik doda in ureja svoje živali (ime, vrsta, pasma, spol, datum rojstva, številka čipa). | osnovna | **MVP** |
| 3 | Cepilni koledar s samodejnim izračunom rokov | Veterinar vnese opravljeno cepljenje, sistem po intervalu cepiva izračuna datum naslednjega cepljenja in stanje (*veljavno*, *kmalu zapade*, *zapadlo*). | domenska | **MVP** |
| 4 | Zdravstveni zapis z zaklepanjem | Veterinar v karton živali doda zapis (anamneza, diagnoza, terapija) in ga zaključi. Zaključenega zapisa ni več mogoče urejati, popravki se shranijo kot ločen dodatek z avtorjem in časom. | domenska | **MVP** |
| 5 | Zdravstvena časovnica z opozorilom na alergije | Kronološki prikaz vseh zapisov, cepljenj in alergij živali na enem zaslonu. Veterinar zabeleži alergije, pri vnosu terapije pa so alergije živali vidno izpisane neposredno nad poljem za terapijo. | domenska | **MVP** |
| 6 | Nadzorna plošča | Veterinar vidi seznam pacientov z iskanjem po imenu živali, lastniku ali številki čipa ter živali z zapadlimi ali kmalu zapadlimi cepljenji. Lastnik vidi svoje živali, njihove roke cepljenj in prihodnje termine. | domenska | **MVP** |
| 7 | Rezervacija termina glede na trajanje storitve | Lastnik izbere žival, storitev in veterinarja. Sistem ponudi samo proste reže v delovnem času veterinarja, v katere storitev v celoti pade (npr. pregled 20 min, kastracija 90 min), in prepreči prekrivanje. | domenska | |
| 8 | Statusni potek termina s pravili odpovedi | Termin gre skozi stanja *rezerviran → potrjen → v čakalnici → v obravnavi → zaključen* (ali *odpovedan* / *ni prišel*). Prehode lahko izvede le pristojna vloga. Lastnik lahko termin odpove ali prestavi do 24 ur pred začetkom, po tem roku samo receptor. Iz termina v obravnavi veterinar odpre zdravstveni zapis (funkcionalnost 4). | domenska | |
| 9 | Urnik in razpoložljivost veterinarjev | Administrator določi tedenski delovni čas posameznih veterinarjev (dnevi in ure), ki neposredno določa proste termine. | domenska | |
| 10 | Upravljanje storitev in pravil cepiv | Administrator ureja seznam storitev (trajanje, cena) in cepiva z intervali ponovnega cepljenja. Ob spremembi intervala lahko sproži ponovni izračun rokov še nezapadlih cepljenj, pri čemer se vsaka sprememba zabeleži v zgodovino. | osnovna | |
| 11 | E-poštni opomniki | Časovno opravilo vsak dan samodejno pošlje lastnikom opomnik dan pred terminom in 14 dni pred zapadlostjo cepljenja. Vsako poslano obvestilo se zabeleži, zato se isti opomnik ne pošlje dvakrat. Administrator lahko pošiljanje sproži tudi ročno. | domenska | |
| 12 | Izvoz terminov v koledar (iCal) | Lastnik dobi osebno, skrivno povezavo do koledarja v formatu `.ics`, ki vsebuje prihodnje termine in roke cepljenj vseh njegovih živali. Koledar doda v Google Calendar, Outlook ali Apple Calendar, kjer se samodejno posodablja. Ob ponovni ustvaritvi povezave stara preneha delovati. | domenska | |
| 13 | Kampanja za cepljenje | Receptor izbere cepivo in časovno obdobje, sistem pripravi seznam živali, ki jim v tem obdobju zapade cepljenje in še nimajo rezerviranega termina. Vsem lastnikom pošlje e-poštno vabilo s povezavo za rezervacijo. Kampanja in prejemniki se zabeležijo, zato ista žival vabila iste kampanje ne prejme dvakrat. | domenska | |
| 14 | Sledenje teži in kalkulator odmerka | Veterinar ob obravnavi vpiše težo živali, ki je v kartonu prikazana kot graf skozi čas. Pri vnosu terapije lahko vpiše odmerek v mg/kg, sistem pa izračuna skupni odmerek glede na zadnjo izmerjeno težo in opozori, če je meritev starejša od 30 dni. | domenska | |
| 15 | Statistika in pregled dela ambulante | Administrator in receptor vidita današnje termine po statusih in zasedenost veterinarjev, za izbrano obdobje pa statistiko z grafi: število obravnav po storitvah in veterinarjih, delež pravočasno opravljenih cepljenj ter število odpovedi in neprihodov. | domenska | |

Skupaj je **15 funkcionalnosti, od tega 12 domenskih**. V MVP je 6 funkcionalnosti, od tega 4 domenske (3–6).

### Utemeljitev izbire MVP

Prva različica je zgrajena okoli **kartona živali**, ne okoli naročanja. Veterinar vnaša zapise in cepljenja neposredno v karton, zato MVP deluje brez storitev, urnikov in terminov.

Seznam cepiv z intervali in računi osebja (veterinar, administrator) se v MVP naložijo z **začetnimi (seed) podatki** ob zagonu. Administratorski del funkcionalnosti 1 in funkcionalnost 10 zato nista pogoj za delovanje prve različice.

Naročanje (funkcionalnosti 7–9) se razvije kot celota in se priklopi na obstoječi karton: obravnava iz termina ustvari zdravstveni zapis iz funkcionalnosti 4. Obveščanje in integracije (11–13) ter statistika (15) gradijo na podatkih o terminih in cepljenjih, sledenje teži (14) pa razširja obstoječi zdravstveni zapis.

## Kasnejše nadgradnje

- **Računi in obračun storitev:** izdelava računa v PDF na podlagi opravljenih storitev in porabljenih zdravil.
- **Zaloga cepiv in zdravil:** zmanjšanje zaloge ob vnosu cepljenja ali terapije, sledenje serijam in rokom uporabe ter opozorilo ob nizki zalogi.
- **Nalaganje izvidov in slik:** prilaganje rentgenskih slik, laboratorijskih izvidov in fotografij k zdravstvenemu zapisu.
- **Cepilna knjižica v PDF s QR kodo:** natisljiva knjižica s kodo, ki vodi na javno stran za preverjanje veljavnosti cepljenj (npr. za pansion ali potovanje).
- **Čakalna vrsta za termine:** ob odpovedi termina sistem prost termin samodejno ponudi prvemu lastniku na čakalni listi, ki ima omejen čas za potrditev.

## Izven obsega (Out of scope)

- Spletno plačevanje storitev in povezava s plačilnimi sistemi.
- Davčno potrjevanje računov (FURS) in računovodsko poslovanje ambulante.
- Povezava z uradnimi registri (npr. Centralni register psov) ali z laboratorijskimi napravami.
- Neposredna povezava z API-ji posameznih koledarjev (npr. Google Calendar API). Koledar je na voljo prek standardnega formata iCal.
- Obveščanje prek SMS ali potisnih obvestil (obveščanje poteka samo po e-pošti).
- Video posveti in klepet v realnem času med lastnikom in veterinarjem.
- Nativna mobilna aplikacija (rešitev bo odzivna spletna aplikacija).
- Samodejno diagnosticiranje ali svetovanje o zdravljenju. Petalog je evidenčni sistem, ne medicinski pripomoček.
