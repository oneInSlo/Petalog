# Uporabniške zgodbe

Uporabniške zgodbe pokrivajo vseh 15 funkcionalnosti iz `02-funkcionalnosti-in-obseg.md`. Funkcionalnosti, ki jih uporablja več vlog z različnimi cilji (1, 6, 8 in 10), so razdeljene na več manjših zgodb, da je vsaka zgodba samostojna in dovolj majhna za razvoj in testiranje (načelo INVEST). Skupaj je 19 zgodb.

Zgodbe so zapisane v obliki: *Kot [vloga] želim [dejanje/cilj], da [razlog/vrednost].*

## Pregled

| Oznaka | Naslov | Funkcionalnost | Vloga | MVP |
|---|---|---|---|---|
| US-01 | Registracija in prijava lastnika | 1 | Lastnik | **MVP** |
| US-02 | Upravljanje računov osebja | 1 | Administrator | **MVP** |
| US-03 | Dodajanje in urejanje živali | 2 | Lastnik | **MVP** |
| US-04 | Vnos cepljenja z izračunom roka | 3 | Veterinar | **MVP** |
| US-05 | Zdravstveni zapis z zaklepanjem | 4 | Veterinar | **MVP** |
| US-06 | Zdravstvena časovnica in alergije | 5 | Veterinar | **MVP** |
| US-07 | Nadzorna plošča veterinarja z iskanjem | 6 | Veterinar | **MVP** |
| US-08 | Nadzorna plošča lastnika | 6 | Lastnik | **MVP** |
| US-09 | Rezervacija termina | 7 | Lastnik | |
| US-10 | Statusni potek termina | 8 | Receptor | |
| US-11 | Odpoved in prestavitev termina | 8 | Lastnik | |
| US-12 | Delovni čas veterinarjev | 9 | Administrator | |
| US-13 | Upravljanje storitev in cepiv | 10 | Administrator | |
| US-14 | Ponovni izračun rokov cepljenj | 10 | Administrator | |
| US-15 | E-poštni opomniki | 11 | Lastnik | |
| US-16 | Izvoz terminov v koledar | 12 | Lastnik | |
| US-17 | Kampanja za cepljenje | 13 | Receptor | |
| US-18 | Sledenje teži in kalkulator odmerka | 14 | Veterinar | |
| US-19 | Statistika ambulante | 15 | Administrator, receptor | |

---

## US-01: Registracija in prijava lastnika

- **Funkcionalnost:** 1 – Registracija, prijava in upravljanje vlog
- **Vloga:** Lastnik živali
- **Zgodba:** Kot lastnik živali želim ustvariti račun in se prijaviti, da lahko upravljam podatke svojih živali in spremljam njihovo zdravje.

**Acceptance criteria:**
1. Registracijski obrazec zahteva ime, priimek, e-poštni naslov in geslo z najmanj 8 znaki. Ob manjkajočem ali neveljavnem podatku se pod poljem izpiše napaka, račun pa se ne ustvari.
2. Če e-poštni naslov že obstaja, sistem izpiše "Uporabnik s tem e-poštnim naslovom že obstaja" in računa ne ustvari.
3. Nov račun ima vedno vlogo lastnik. Po uspešni registraciji je uporabnik prijavljen in preusmerjen na nadzorno ploščo lastnika.
4. Ob napačnem e-poštnem naslovu ali geslu sistem izpiše "Napačen e-poštni naslov ali geslo", ne da bi razkril, kateri podatek je napačen.
5. Po odjavi uporabnik ne more odpreti nobene zaščitene strani in je ob poskusu preusmerjen na prijavo.

## US-02: Upravljanje računov osebja

- **Funkcionalnost:** 1 – Registracija, prijava in upravljanje vlog
- **Vloga:** Administrator
- **Zgodba:** Kot administrator želim ustvariti račune osebja in jim dodeliti vlogo, da receptorji in veterinarji v sistemu delajo s pravicami, ki ustrezajo njihovemu delu.

**Acceptance criteria:**
1. Administrator ustvari račun z imenom, priimkom, e-poštnim naslovom, začetnim geslom in vlogo receptor, veterinar ali administrator.
2. Seznam osebja prikazuje ime, e-poštni naslov, vlogo in stanje (aktiven / deaktiviran) in ga je mogoče filtrirati po vlogi.
3. Deaktiviran uporabnik se ne more več prijaviti, njegovi pretekli zapisi in cepljenja pa ostanejo vidni z njegovim imenom.
4. Administrator ne more deaktivirati svojega računa.
5. Uporabnik z drugo vlogo stran za upravljanje osebja ne more odpreti in prejme sporočilo o nezadostnih pravicah (HTTP 403).

## US-03: Dodajanje in urejanje živali

- **Funkcionalnost:** 2 – Profil živali
- **Vloga:** Lastnik živali
- **Zgodba:** Kot lastnik želim dodati svoje živali z osnovnimi podatki, da ima ambulanta pravilne podatke o mojem ljubljenčku že pred prvim obiskom.

**Acceptance criteria:**
1. Obrazec zahteva ime, vrsto (pes, mačka, zajec, hrček) in spol. Pasma, datum rojstva in številka čipa so neobvezni.
2. Datum rojstva ne sme biti v prihodnosti. Številka čipa mora imeti natanko 15 števk in mora biti v sistemu unikatna, sicer se izpiše napaka.
3. Lastnik vidi in ureja samo svoje živali. Zahteva za žival drugega lastnika je zavrnjena (HTTP 403).
4. Po shranjevanju se žival prikaže na nadzorni plošči lastnika s starostjo, izračunano iz datuma rojstva (npr. "3 leta").
5. Živali z zdravstvenimi zapisi ali cepljenji ni mogoče izbrisati. Gumb za brisanje je pri taki živali onemogočen.

## US-04: Vnos cepljenja z izračunom roka

- **Funkcionalnost:** 3 – Cepilni koledar s samodejnim izračunom rokov
- **Vloga:** Veterinar
- **Zgodba:** Kot veterinar želim zabeležiti opravljeno cepljenje, da sistem sam izračuna, kdaj mora žival priti na naslednje cepljenje.

**Acceptance criteria:**
1. Pri vnosu so na izbiro samo aktivna cepiva za vrsto izbrane živali.
2. Privzeti datum cepljenja je današnji, datum v prihodnosti pa ni dovoljen.
3. Ob shranjevanju sistem nastavi rok naslednjega cepljenja na datum cepljenja, povečan za interval cepiva (npr. steklina, 10. 3. 2026 + 12 mesecev = 10. 3. 2027), in pri cepljenju shrani uporabljeni interval.
4. Cepilni koledar za vsako cepivo prikazuje zadnje cepljenje, rok in barvno označeno stanje: *zapadlo* (rok je v preteklosti), *kmalu zapade* (rok je v naslednjih 30 dneh) ali *veljavno*.
5. Lastnik in receptor cepilni koledar vidita, ne moreta pa dodati ali spremeniti cepljenja.

## US-05: Zdravstveni zapis z zaklepanjem

- **Funkcionalnost:** 4 – Zdravstveni zapis z zaklepanjem
- **Vloga:** Veterinar
- **Zgodba:** Kot veterinar želim zapisati in zaključiti obravnavo, da je zdravstvena evidenca živali popolna in je po zaključku ni mogoče neopazno spreminjati.

**Acceptance criteria:**
1. Veterinar ustvari zapis z anamnezo in diagnozo (obvezni) ter terapijo (neobvezna). Do zaključka je zapis v stanju *osnutek* in ga je mogoče urejati.
2. Zapis lahko zaključi samo veterinar, ki ga je ustvaril. Ob zaključku se zabeleži čas zaključka.
3. Zaključenega zapisa ni mogoče urejati: vmesnik polj ne prikaže kot urejevalnih, zahteva za spremembo prek API pa je zavrnjena (HTTP 409).
4. Zaključenemu zapisu lahko veterinar doda dodatek, ki je prikazan pod zapisom z imenom avtorja in časom, prvotna vsebina zapisa pa ostane nespremenjena.
5. Zdravstvenega zapisa ni mogoče izbrisati v nobeni vlogi.

## US-06: Zdravstvena časovnica in alergije

- **Funkcionalnost:** 5 – Zdravstvena časovnica z opozorilom na alergije
- **Vloga:** Veterinar
- **Zgodba:** Kot veterinar želim na enem zaslonu videti celotno zgodovino živali in njene alergije, da med obravnavo ne spregledam pomembnih podatkov.

**Acceptance criteria:**
1. Časovnica prikazuje zdravstvene zapise in cepljenja od najnovejšega do najstarejšega, vsak vnos z datumom, vrsto vnosa in avtorjem.
2. Časovnico je mogoče filtrirati po vrsti vnosa (zapisi, cepljenja).
3. Veterinar doda alergijo z alergenom (obvezno) in opisom reakcije (neobvezno). Alergije so prikazane na vrhu kartona živali.
4. Pri vnosu terapije so vse alergije živali izpisane neposredno nad poljem za terapijo v opozorilnem okvirju. Če alergij ni, je izpisano "Ni zabeleženih alergij".
5. Lastnik vidi časovnico in alergije svoje živali samo za branje, brez zapisov v stanju *osnutek*.

## US-07: Nadzorna plošča veterinarja z iskanjem

- **Funkcionalnost:** 6 – Nadzorna plošča
- **Vloga:** Veterinar
- **Zgodba:** Kot veterinar želim hitro najti pacienta in videti živali z zapadlimi cepljenji, da lahko ukrepam, preden zaščita živali poteče.

**Acceptance criteria:**
1. Ko sta vnesena vsaj 2 znaka, iskanje vrne živali, pri katerih ime živali, ime ali priimek lastnika ali številka čipa vsebuje vneseni niz, ne glede na velike in male črke.
2. Vsak zadetek prikaže ime in vrsto živali, ime lastnika in številko čipa, klik nanj pa odpre karton živali.
3. Če ni zadetkov, se izpiše "Ni najdenih pacientov".
4. Plošča prikazuje seznam živali z zapadlimi ali kmalu zapadlimi cepljenji (rok v naslednjih 30 dneh), razvrščen od najstarejšega roka naprej, z imenom in telefonsko številko lastnika.

## US-08: Nadzorna plošča lastnika

- **Funkcionalnost:** 6 – Nadzorna plošča
- **Vloga:** Lastnik živali
- **Zgodba:** Kot lastnik želim na enem mestu videti svoje živali, roke njihovih cepljenj in prihodnje termine, da vem, kdaj moram v ambulanto.

**Acceptance criteria:**
1. Za vsako žival lastnika je prikazana kartica z imenom, vrsto, starostjo in najbližjim rokom cepljenja s stanjem.
2. Kartica živali z zapadlim cepljenjem ima vidno oznako "Cepljenje zapadlo".
3. Prikazani so samo prihodnji termini (datum, ura, žival, storitev, veterinar, status), razvrščeni po času.
4. Če lastnik še nima živali, se izpiše poziv "Dodajte svojo prvo žival" z gumbom za dodajanje.

## US-09: Rezervacija termina

- **Funkcionalnost:** 7 – Rezervacija termina glede na trajanje storitve
- **Vloga:** Lastnik živali
- **Zgodba:** Kot lastnik želim izbrati storitev in prost termin pri veterinarju, da se lahko naročim kadar koli, brez telefonskega klica.

**Acceptance criteria:**
1. Po izbiri živali, storitve, veterinarja in datuma sistem prikaže proste začetne čase v korakih po 15 minut, pri katerih celotno trajanje storitve leži znotraj delovnega časa veterinarja in se ne prekriva z nobenim njegovim terminom, razen odpovedanih in neprihodov.
2. Za dan, ko veterinar ne dela, se izpiše "Veterinar ta dan ne dela", prostih časov pa ni.
3. Časi v preteklosti niso ponujeni.
4. Ustvarjeni termin ima status *rezerviran*, njegov konec pa je enak začetku, povečanemu za trajanje storitve.
5. Če izbrani čas medtem zasede drug uporabnik, sistem rezervacijo zavrne s sporočilom "Termin ni več na voljo" in osveži seznam prostih časov.

## US-10: Statusni potek termina

- **Funkcionalnost:** 8 – Statusni potek termina s pravili odpovedi
- **Vloga:** Receptor
- **Zgodba:** Kot receptor želim voditi termine skozi statuse od potrditve do prihoda v čakalnico, da imata ambulanta in veterinar ves čas pregled nad tem, kdo je naročen in kdo že čaka.

**Acceptance criteria:**
1. Dovoljeni so samo prehodi *rezerviran → potrjen → v čakalnici → v obravnavi → zaključen*, *rezerviran ali potrjen → odpovedan* in *potrjen → ni prišel*. Drug prehod je zavrnjen (HTTP 409).
2. Receptor izvaja prehode v *potrjen*, *v čakalnici*, *odpovedan* in *ni prišel*, veterinar pa v *v obravnavi* in *zaključen*.
3. Ob prehodu v *v obravnavi* se ustvari nov zdravstveni zapis, povezan s terminom. Termin je mogoče zaključiti šele, ko je ta zapis zaključen.
4. Dnevni pregled prikazuje termine izbranega dne, razdeljene po veterinarjih, vsak termin z uro, živaljo, storitvijo in barvno oznako statusa.

## US-11: Odpoved in prestavitev termina

- **Funkcionalnost:** 8 – Statusni potek termina s pravili odpovedi
- **Vloga:** Lastnik živali
- **Zgodba:** Kot lastnik želim sam odpovedati ali prestaviti termin, da ambulanto pravočasno obvestim, če ne morem priti.

**Acceptance criteria:**
1. Gumba "Odpovej" in "Prestavi" sta na voljo samo pri terminih s statusom *rezerviran* ali *potrjen*, ki se začnejo čez več kot 24 ur.
2. Pri terminu, ki se začne čez 24 ur ali manj, je namesto gumbov izpisano "Za odpoved pokličite ambulanto", zahteva za odpoved prek API pa je zavrnjena (HTTP 403).
3. Odpoved zahteva potrditev v pogovornem oknu. Termin nato dobi status *odpovedan*, njegov čas pa je takoj spet na voljo za rezervacijo.
4. Prestavitev uporablja enak izbor prostih časov kot nova rezervacija. Termin dobi nov začetek in konec ter status *rezerviran*.
5. Receptor lahko termin odpove tudi manj kot 24 ur pred začetkom.

## US-12: Delovni čas veterinarjev

- **Funkcionalnost:** 9 – Urnik in razpoložljivost veterinarjev
- **Vloga:** Administrator
- **Zgodba:** Kot administrator želim določiti tedenski delovni čas vsakega veterinarja, da so lastnikom ponujeni samo termini, ko je veterinar v ambulanti.

**Acceptance criteria:**
1. Za vsakega veterinarja je mogoče za vsak dan v tednu dodati enega ali več delovnih blokov z začetkom in koncem (npr. ponedeljek 8.00–12.00 in 14.00–18.00).
2. Konec bloka mora biti za začetkom, bloki istega dne pa se ne smejo prekrivati. Ob kršitvi se izpiše napaka in blok se ne shrani.
3. Sprememba delovnega časa takoj vpliva na prikaz prostih terminov pri rezervaciji.
4. Če po spremembi obstoječi termini padejo izven delovnega časa, sistem izpiše njihov seznam, termini pa ostanejo veljavni.

## US-13: Upravljanje storitev in cepiv

- **Funkcionalnost:** 10 – Upravljanje storitev in pravil cepiv
- **Vloga:** Administrator
- **Zgodba:** Kot administrator želim urejati storitve in cepiva, da trajanja, cene in pravila cepljenja ustrezajo trenutnemu delovanju ambulante.

**Acceptance criteria:**
1. Storitev ima ime, trajanje v minutah (od 5 do 240, večkratnik 5) in ceno v EUR (0 ali več). Cepivo ima ime, vrsto živali in interval ponovnega cepljenja v mesecih (od 1 do 60).
2. Neaktivna storitev se ne ponuja pri rezervaciji, neaktivno cepivo pa ne pri vnosu cepljenja. Obstoječi termini in cepljenja ostanejo nespremenjeni.
3. Sprememba trajanja storitve velja samo za nove termine.
4. Sprememba intervala cepiva ne spremeni rokov že vnesenih cepljenj.

## US-14: Ponovni izračun rokov cepljenj

- **Funkcionalnost:** 10 – Upravljanje storitev in pravil cepiv
- **Vloga:** Administrator
- **Zgodba:** Kot administrator želim po spremembi pravilnika ponovno izračunati roke obstoječih cepljenj, da so roki usklajeni z novimi pravili, vsaka sprememba pa ostane sledljiva.

**Acceptance criteria:**
1. Pred izvedbo sistem prikaže število zajetih cepljenj (samo še nezapadla cepljenja izbranega cepiva) in zahteva vnos razloga.
2. Ponovni izračun nastavi nov rok na datum cepljenja, povečan za novi interval. Datum cepljenja, cepivo in veterinar ostanejo nespremenjeni.
3. Za vsako spremenjeno cepljenje se zabeležijo stari rok, novi rok, razlog, avtor in čas spremembe.
4. Že zapadla cepljenja ostanejo nespremenjena.
5. Zgodovina sprememb roka je vidna v podrobnostih cepljenja.

## US-15: E-poštni opomniki

- **Funkcionalnost:** 11 – E-poštni opomniki
- **Vloga:** Lastnik živali
- **Zgodba:** Kot lastnik želim prejeti e-poštni opomnik pred terminom in pred zapadlostjo cepljenja, da ne pozabim na obisk ambulante.

**Acceptance criteria:**
1. Opravilo se izvede vsak dan ob 7.00 po slovenskem času in pošlje opomnik za vse termine naslednjega dne s statusom *rezerviran* ali *potrjen*.
2. Opomnik za cepljenje se pošlje za cepljenja z rokom v naslednjih 14 dneh, za katera opomnik še ni bil poslan.
3. E-poštno sporočilo vsebuje ime živali, datum in uro termina oziroma rok cepljenja, storitev oziroma cepivo ter naslov ambulante.
4. Isti opomnik se ne pošlje dvakrat, tudi če se opravilo zažene večkrat (npr. ob ročnem zagonu s strani administratorja). Deaktivirani uporabniki opomnikov ne prejemajo.
5. Neuspešno pošiljanje se zabeleži z razlogom napake in se ob naslednjem zagonu opravila ponovno poskusi.

## US-16: Izvoz terminov v koledar

- **Funkcionalnost:** 12 – Izvoz terminov v koledar (iCal)
- **Vloga:** Lastnik živali
- **Zgodba:** Kot lastnik želim videti termine in roke cepljenj v svojem osebnem koledarju, da imam vse obveznosti na enem mestu.

**Acceptance criteria:**
1. V nastavitvah profila lastnik ustvari osebno povezavo do koledarja, ki jo lahko kopira z gumbom ali prenese kot datoteko `.ics`.
2. Koledar vsebuje vse prihodnje termine s statusom *rezerviran* ali *potrjen* (naslov s storitvijo in imenom živali, začetek in konec) ter roke cepljenj kot celodnevne dogodke.
3. Odpovedan termin pri naslednjem osveževanju koledarja izgine.
4. Ob ponovni ustvaritvi povezave stara povezava ne deluje več (HTTP 404).
5. Koledar vsebuje samo podatke živali lastnika, ki mu žeton pripada.

## US-17: Kampanja za cepljenje

- **Funkcionalnost:** 13 – Kampanja za cepljenje
- **Vloga:** Receptor
- **Zgodba:** Kot receptor želim povabiti lastnike živali, ki jim kmalu zapade cepljenje, da ambulanta pravočasno cepi čim več živali.

**Acceptance criteria:**
1. Receptor izbere cepivo in obdobje (od–do) ter pred pošiljanjem vidi seznam zajetih živali z imenom lastnika in rokom cepljenja.
2. Seznam vsebuje samo živali, katerih zadnje cepljenje z izbranim cepivom ima rok v izbranem obdobju in ki nimajo prihodnjega termina s statusom *rezerviran* ali *potrjen*.
3. Po potrditvi sistem vsakemu lastniku pošlje e-poštno vabilo s povezavo na rezervacijo termina, v kateri je žival že izbrana.
4. Ista žival vabila iste kampanje ne prejme dvakrat. Ponovno pošiljanje pošlje samo še neposlana ali neuspela vabila.
5. Seznam kampanj prikazuje cepivo, obdobje, datum pošiljanja ter število uspešno poslanih in neuspelih vabil.

## US-18: Sledenje teži in kalkulator odmerka

- **Funkcionalnost:** 14 – Sledenje teži in kalkulator odmerka
- **Vloga:** Veterinar
- **Zgodba:** Kot veterinar želim beležiti težo živali in na njeni podlagi izračunati odmerek zdravila, da je terapija pravilno odmerjena.

**Acceptance criteria:**
1. Veterinar vnese težo v kilogramih (več kot 0, največ dve decimalni mesti) z datumom meritve, ki ni v prihodnosti.
2. Karton živali prikazuje graf teže skozi čas ter zadnjo izmerjeno težo z datumom. Pri manj kot dveh meritvah je namesto grafa prikazana samo zadnja vrednost.
3. Ko veterinar v kalkulator vnese odmerek v mg/kg, sistem prikaže skupni odmerek kot zmnožek z zadnjo izmerjeno težo, zaokrožen na dve decimalki (npr. 10 mg/kg × 12,5 kg = 125 mg).
4. Če je zadnja meritev starejša od 30 dni, se izpiše opozorilo "Zadnja meritev teže je starejša od 30 dni". Če meritve ni, kalkulator ni na voljo in uporabnika pozove k vnosu teže.
5. Gumb "Vstavi v terapijo" doda izračunani odmerek v polje za terapijo.

## US-19: Statistika ambulante

- **Funkcionalnost:** 15 – Statistika in pregled dela ambulante
- **Vloga:** Administrator, receptor
- **Zgodba:** Kot administrator želim videti statistiko dela ambulante za izbrano obdobje, da lahko načrtujem delo osebja in ocenim, kako uspešno vabimo lastnike na cepljenja.

**Acceptance criteria:**
1. Pregled dneva prikazuje število današnjih terminov po statusih in zasedenost vsakega veterinarja v odstotkih (zasedene minute glede na minute delovnega časa).
2. Za izbrano obdobje (privzeto zadnjih 30 dni) so v stolpčnih grafih prikazane zaključene obravnave po storitvah in po veterinarjih.
3. Prikazan je delež pravočasnih cepljenj: ponovna cepljenja, opravljena najkasneje na dan roka prejšnjega cepljenja z istim cepivom, deljena z vsemi ponovnimi cepljenji v obdobju.
4. Prikazano je število odpovedanih terminov in neprihodov v obdobju.
5. Statistiko vidita samo administrator in receptor. Veterinar in lastnik do nje nimata dostopa (HTTP 403).
