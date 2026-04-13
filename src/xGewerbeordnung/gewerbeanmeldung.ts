import { createG2gNachrichtenkopf, type Nachrichtenkopf } from "./g2gNachrichtenkopf";

interface BetriebArt {
  industrie: boolean;
  handwerk: boolean;
  handel: boolean;
  sonstiges: boolean;
}

interface Betrieb {
  id: string;
  gemeindeMeldungNr: string;
  geschaeftsbezeichnung: string;
  strasse: string;
  strassenschluessel: string;
  hausnummer: string;
  plz: string;
  ort: string;
  taetigkeitSchwerpunkt: string;
  wirtschaftszweigschluessel: string;
  stichwort: string;
  anzahlVollzeit: number;
  anzahlTeilzeit: number;
  betriebArt: BetriebArt;
  istNebenerwerb: boolean;
}

interface Person {
  familienname: string;
  geburtsname?: string;
  vornamen: string;
  geburtsdatum: string;
  geschlecht: string;
  geburtsort: string;
  geburtsstaat: string;
  staatsangehoerigkeit: string;
}

export interface Anmeldung {
  nachrichtenkopf: Nachrichtenkopf;
  satzErstellung: string;
  ereigniszeitpunkt: string;
  gemeindeSchluessel: string;
  satzUUID: string;
  gueltigAb: string;
  datumMeldung: string;
  grundAnmeldung: string;
  betrieb: Betrieb;
  person: Person;
}

const xGewerbeanmeldung0300 = (anmeldung: Anmeldung) => `<?xml version="1.0" encoding="UTF-8"?>
<xga:alg.gewerbemeldung.0300
   xmlns:xga="http://www.xgewerbeordnung.de/spezifikation/xga/1.6"
   xmlns:erl="http://www.xgewerbeordnung.de/spezifikation/erl/1.6"
   xmlns:bk="http://www.xgewerbeordnung.de/spezifikation/baukasten/1.6"
   xmlns:nachr="urn:xoev-de:xunternehmen:standard:basismodul:nachrichtenstruktur_1.2"
   xmlns:np="urn:xoev-de:xunternehmen:standard:basismodul:natuerlicheperson_1.2"
   xmlns:jp="urn:xoev-de:xunternehmen:standard:basismodul:juristischeperson_1.2"
   xmlns:rpg="urn:xoev-de:xunternehmen:standard:basismodul:rechtsfaehigepersonengesellschaft_1.2"
   xmlns:eintr="urn:xoev-de:xunternehmen:standard:basismodul:eintragung_1.2"
   xmlns:rf="urn:xoev-de:xunternehmen:standard:basismodul:rechtsform_1.2"
   xmlns:bn-g2g="http://xoev.de/schemata/basisnachricht/g2g/1_1"
   xmlns:bn-beh="http://xoev.de/schemata/basisnachricht/behoerde/1_1"
   xmlns:bn-kom="http://xoev.de/schemata/basisnachricht/kommunikation/1_1"
   xmlns:komm="urn:xoev-de:xunternehmen:standard:basismodul:kommunikation_1.2"
   xmlns:wt="urn:xoev-de:xunternehmen:standard:basismodul:wirtschaftlichetaetigkeit_1.2"
   xmlns:ename="urn:xoev-de:xunternehmen:standard:basismodul:eingetragenername_1.2"
   xmlns:adr="urn:xoev-de:xunternehmen:standard:basismodul:adressen_1.2"
   xmlns:antr="urn:xoev-de:xunternehmen:standard:basismodul:antraege-anzeigen_1.2"
   xmlns:lc="urn:xoev-de:kosit:xoev:datentyp:din-91379_2022-08"
   xmlns:code="http://xoev.de/schemata/code/1_0"
   xmlns:dat="urn:xoev-de:xunternehmen:standard:basismodul:datumsangaben_1.2"
   xmlns:gv="urn:xoev-de:xunternehmen:standard:basismodul:gesetzlichervertreter_1.2"
   xmlns:ges="urn:xoev-de:xunternehmen:standard:basismodul:gesellschafter_1.2"
   xmlns:spv="urn:xoev-de:xunternehmen:standard:basismodul:sonstigepersonenvereinigung_1.2"
   xmlns:bspv="urn:xoev-de:xunternehmen:standard:basismodul:beteiligtersonstigepersonenvereinigung_1.2"
   produkt="XGA-App"
   produkthersteller="IhreFirma"
   produktversion="1.0"
   standard="XGewerbeordnung"
   version="1.6"
   test="100">
   ${createG2gNachrichtenkopf(anmeldung.nachrichtenkopf)}
   <xga:satz>
      <xga:anmeldung>
         <xga:autor>
            <bn-beh:verzeichnisdienst listVersionID="1">
               <code>DVDV</code>
            </bn-beh:verzeichnisdienst>
            <bn-beh:kennung>${anmeldung.nachrichtenkopf.autor.kennung}</bn-beh:kennung>
            <bn-beh:name>${anmeldung.nachrichtenkopf.autor.name}</bn-beh:name>
         </xga:autor>
         <xga:satzErstellung>${anmeldung.satzErstellung}</xga:satzErstellung>
         <xga:ereigniszeitpunkt>${anmeldung.ereigniszeitpunkt}</xga:ereigniszeitpunkt>
         <xga:istStorno>false</xga:istStorno>
         <xga:gemeindeSchluessel listVersionID="2020-03-31">
            <code>${anmeldung.gemeindeSchluessel}</code>
         </xga:gemeindeSchluessel>
         <xga:uuid>${anmeldung.satzUUID}</xga:uuid>
         <xga:gueltigAb>${anmeldung.gueltigAb}</xga:gueltigAb>
         <xga:datumMeldung>${anmeldung.datumMeldung}</xga:datumMeldung>
         <xga:gewerbebetrieb>
            <xga:gewerbebetriebID>${anmeldung.betrieb.id}</xga:gewerbebetriebID>
            <xga:gemeindeMeldungNr>${anmeldung.betrieb.gemeindeMeldungNr}</xga:gemeindeMeldungNr>
            <rf:rechtsform>
               <rf:rechtsformcode listVersionID="2.3">
                  <code>411000</code>
               </rf:rechtsformcode>
            </rf:rechtsform>
            <wt:wirtschaftlichTaetiger.id>np-1</wt:wirtschaftlichTaetiger.id>
            <ename:eingetragenerName>${anmeldung.betrieb.geschaeftsbezeichnung}</ename:eingetragenerName>
            <xga:betriebsstaette>
               <wt:artBetriebsstaette listVersionID="1">
                  <code>01</code>
               </wt:artBetriebsstaette>
               <bk:anschrift>
                  <bk:strassenanschriftInland>
                     <adr:strasse>${anmeldung.betrieb.strasse}</adr:strasse>
                     <bk:strassenschluessel>${anmeldung.betrieb.strassenschluessel}</bk:strassenschluessel>
                     <bk:hausnummerVon>${anmeldung.betrieb.hausnummer}</bk:hausnummerVon>
                     <adr:postleitzahl>${anmeldung.betrieb.plz}</adr:postleitzahl>
                     <adr:ort>${anmeldung.betrieb.ort}</adr:ort>
                  </bk:strassenanschriftInland>
               </bk:anschrift>
            </xga:betriebsstaette>
            <xga:taetigkeitenGesamt>
               <xga:schwerpunkt>
                  <xga:taetigkeitSchwerpunkt>${anmeldung.betrieb.taetigkeitSchwerpunkt}</xga:taetigkeitSchwerpunkt>
                  <wt:wirtschaftszweig>
                     <wt:wirtschaftszweigschluessel>${anmeldung.betrieb.wirtschaftszweigschluessel}</wt:wirtschaftszweigschluessel>
                     <wt:versionWirtschaftszweigklassifikation listVersionID="1">
                        <code>WZ-2008</code>
                     </wt:versionWirtschaftszweigklassifikation>
                  </wt:wirtschaftszweig>
                  <xga:stichwort>${anmeldung.betrieb.stichwort}</xga:stichwort>
               </xga:schwerpunkt>
            </xga:taetigkeitenGesamt>
            <xga:gewerbetreibender>
               <xga:gewerbetreibender.id>np-1</xga:gewerbetreibender.id>
               <xga:istNebenerwerb>${anmeldung.betrieb.istNebenerwerb}</xga:istNebenerwerb>
            </xga:gewerbetreibender>
            <xga:anzahlVollzeitBeschaeftigte>${anmeldung.betrieb.anzahlVollzeit}</xga:anzahlVollzeitBeschaeftigte>
            <xga:anzahlTeilzeitBeschaeftigte>${anmeldung.betrieb.anzahlTeilzeit}</xga:anzahlTeilzeitBeschaeftigte>
            <xga:istReisegewerbe>false</xga:istReisegewerbe>
            <xga:betriebArt>
               <xga:industrie>${anmeldung.betrieb.betriebArt.industrie}</xga:industrie>
               <xga:handwerk>${anmeldung.betrieb.betriebArt.handwerk}</xga:handwerk>
               <xga:handel>${anmeldung.betrieb.betriebArt.handel}</xga:handel>
               <xga:sonstiges>${anmeldung.betrieb.betriebArt.sonstiges}</xga:sonstiges>
            </xga:betriebArt>
         </xga:gewerbebetrieb>
         <xga:referenzierteSubjekte>
            <xga:natuerlichePerson>
               <np:natuerlichePerson.id>np-1</np:natuerlichePerson.id>
               <np:name>
                  <np:familienname>${anmeldung.person.familienname}</np:familienname>
                     ${anmeldung.person.geburtsname ? `<np:geburtsname>${anmeldung.person.geburtsname}</np:geburtsname>` : ""}
                  <np:vornamen>${anmeldung.person.vornamen}</np:vornamen>
               </np:name>
               <bk:geburt>
                  <np:geburtsdatum>
                     <dat:datum>${anmeldung.person.geburtsdatum}</dat:datum>
                  </np:geburtsdatum>
                  <adr:ort>${anmeldung.person.geburtsort}</adr:ort>
                  <bk:staat>${anmeldung.person.geburtsstaat}</bk:staat>
               </bk:geburt>
               <np:geschlecht listVersionID="1">
                  <code>${anmeldung.person.geschlecht}</code>
               </np:geschlecht>
               <np:staatsangehoerigkeit listVersionID="2020-05-11">
                  <code>${anmeldung.person.staatsangehoerigkeit}</code>
               </np:staatsangehoerigkeit>
            </xga:natuerlichePerson>
         </xga:referenzierteSubjekte>
         <xga:grundAnmeldungSchluessel>
            <code>${anmeldung.grundAnmeldung}</code>
         </xga:grundAnmeldungSchluessel>
      </xga:anmeldung>
   </xga:satz>
</xga:alg.gewerbemeldung.0300>`;

