import "dotenv/config";
import { describe, it, expect } from "vitest";
import { getAkdbClient } from "./akdbClient";

const client = getAkdbClient();

describe("AkdbClient contract", () => {
  it("fetches a token from the real endpoint", async () => {
    const token = await client.fetchToken();

    expect(token.access_token).toBeTypeOf("string");
    expect(token.access_token.length).toBeGreaterThan(0);
    expect(token.token_type).toBe("Bearer");
  });

  it("sends a valid XöV message and gets an empty ok response", async () => {
    const { access_token } = await client.fetchToken();

    await expect(client.sendXoevMessage(okXml, access_token)).resolves.toBeUndefined();
  });

  it("throws when sending a message with an unknown sender kennung", async () => {
    const { access_token } = await client.fetchToken();

    await expect(client.sendXoevMessage(nokXml, access_token)).rejects.toThrow(
      `POST https://soaptest.akdb.de/okkomm/restapi/v3.0/messages/xoev:`,
    );
  });
});

// fixtures — verbatim payloads from the Bruno collection

const okXml = `<?xml version="1.0" encoding="UTF-8"?>
<xga:alg.gewerbemeldung.0300 xmlns:xga="http://www.xgewerbeordnung.de/spezifikation/xga/1.6"
                             xmlns:erl="http://www.xgewerbeordnung.de/spezifikation/erl/1.6"
                             xmlns:bk="http://www.xgewerbeordnung.de/spezifikation/baukasten/1.6"
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
                             produkt="XGA-Testsuite"
                             produkthersteller="KoSIT"
                             produktversion="2025"
                             standard="XGewerbeordnung"
                             version="1.6"
                             test="100">
   <bn-g2g:nachrichtenkopf.g2g>
      <bn-g2g:identifikation.nachricht>
         <bn-g2g:nachrichtenUUID>f0f264bb-1798-4046-937b-1956d1abc8a2</bn-g2g:nachrichtenUUID>
         <bn-g2g:nachrichtentyp listURI="urn:xoev-de:xgewerbeordnung:codeliste:nachrichtentypen"
                                listVersionID="1.6">
            <code>0300</code>
         </bn-g2g:nachrichtentyp>
         <bn-g2g:erstellungszeitpunkt>2026-09-01T11:58:01.385+02:00</bn-g2g:erstellungszeitpunkt>
      </bn-g2g:identifikation.nachricht>
      <bn-g2g:leser>
         <bn-beh:verzeichnisdienst listVersionID="1">
            <code>DVDV</code>
         </bn-beh:verzeichnisdienst>
         <bn-beh:kennung>MELDID:12052000</bn-beh:kennung>
         <bn-beh:name>Gewerbeamt Cottbus</bn-beh:name>
      </bn-g2g:leser>
      <bn-g2g:autor>
         <bn-beh:verzeichnisdienst listVersionID="1">
            <code>DVDV</code>
         </bn-beh:verzeichnisdienst>
         <bn-beh:kennung>xga:090010030000</bn-beh:kennung>
         <bn-beh:name>Phantasie-Verteilplattform</bn-beh:name>
      </bn-g2g:autor>
   </bn-g2g:nachrichtenkopf.g2g>
   <xga:satz>
      <xga:anmeldung>
         <xga:autor>
            <bn-beh:verzeichnisdienst listVersionID="1">
               <code>DVDV</code>
            </bn-beh:verzeichnisdienst>
            <bn-beh:kennung>MELDID:12052000</bn-beh:kennung>
            <bn-beh:name>Gewerbeamt Cottbus</bn-beh:name>
         </xga:autor>
         <xga:satzErstellung>2026-09-01T11:58:01.385+02:00</xga:satzErstellung>
         <xga:ereigniszeitpunkt>2026-08-29T10:52:01.385+02:00</xga:ereigniszeitpunkt>
         <xga:istStorno>false</xga:istStorno>
         <xga:gemeindeSchluessel listVersionID="2020-03-31">
            <code>12052000</code>
         </xga:gemeindeSchluessel>
         <xga:uuid>72531106-aa60-4ff3-b1e4-206f0ef0033a</xga:uuid>
         <xga:gueltigAb>2026-10-01</xga:gueltigAb>
         <xga:datumMeldung>2026-08-28</xga:datumMeldung>
         <bk:bisherigeUnfallversicherung>
            <bk:traeger listVersionID="1">
               <code>08</code>
            </bk:traeger>
            <bk:unternehmensnummer>394827495831235</bk:unternehmensnummer>
         </bk:bisherigeUnfallversicherung>
         <xga:gewerbebetrieb>
            <xga:gewerbebetriebID>3BE2A1FA-5466-4F4F-A06A-9260A02E3A35</xga:gewerbebetriebID>
            <xga:gemeindeMeldungNr>2015 1023</xga:gemeindeMeldungNr>
            <rf:rechtsform>
               <rf:rechtsformcode listVersionID="2.3">
                  <code>221100</code>
               </rf:rechtsformcode>
            </rf:rechtsform>
            <wt:wirtschaftlichTaetiger.id>jp-1</wt:wirtschaftlichTaetiger.id>
            <ename:eingetragenerName>m-a-c-r-o-c-o n gmbh</ename:eingetragenerName>
            <bk:eintragung>
               <eintr:artEintragung listVersionID="1">
                  <code>B</code>
               </eintr:artEintragung>
               <eintr:registergericht.code listVersionID="12">
                  <code>G1103</code>
               </eintr:registergericht.code>
               <eintr:eintragungsnummer>9235</eintr:eintragungsnummer>
            </bk:eintragung>
            <xga:betriebsstaette>
               <wt:artBetriebsstaette listVersionID="1">
                  <code>01</code>
               </wt:artBetriebsstaette>
               <bk:anschrift>
                  <bk:strassenanschriftInland>
                     <adr:strasse>Im Hain</adr:strasse>
                     <bk:strassenschluessel>0000000101</bk:strassenschluessel>
                     <bk:hausnummerVon>1</bk:hausnummerVon>
                     <adr:postleitzahl>03046</adr:postleitzahl>
                     <adr:ort>Cottbus</adr:ort>
                  </bk:strassenanschriftInland>
               </bk:anschrift>
               <bk:kommunikation>
                  <komm:telefon>+49 234 121314</komm:telefon>
               </bk:kommunikation>
            </xga:betriebsstaette>
            <xga:taetigkeitenGesamt>
               <xga:schwerpunkt>
                  <xga:taetigkeitSchwerpunkt>Erstellung von Software</xga:taetigkeitSchwerpunkt>
                  <wt:wirtschaftszweig>
                     <wt:wirtschaftszweigschluessel>62019</wt:wirtschaftszweigschluessel>
                     <wt:versionWirtschaftszweigklassifikation listVersionID="1">
                        <code>WZ-2008</code>
                     </wt:versionWirtschaftszweigklassifikation>
                  </wt:wirtschaftszweig>
                  <xga:stichwort>Branchenspezifische Software, Entwicklung</xga:stichwort>
               </xga:schwerpunkt>
            </xga:taetigkeitenGesamt>
            <xga:gewerbetreibender>
               <xga:gewerbetreibender.id>jp-1</xga:gewerbetreibender.id>
            </xga:gewerbetreibender>
            <xga:anzahlVollzeitBeschaeftigte>0</xga:anzahlVollzeitBeschaeftigte>
            <xga:anzahlTeilzeitBeschaeftigte>0</xga:anzahlTeilzeitBeschaeftigte>
            <xga:istReisegewerbe>false</xga:istReisegewerbe>
            <xga:beteiligungOeffentlicheHand>
               <code>0</code>
            </xga:beteiligungOeffentlicheHand>
            <xga:betriebArt>
               <xga:industrie>false</xga:industrie>
               <xga:handwerk>false</xga:handwerk>
               <xga:handel>false</xga:handel>
               <xga:sonstiges>true</xga:sonstiges>
            </xga:betriebArt>
         </xga:gewerbebetrieb>
         <xga:referenzierteSubjekte>
            <xga:natuerlichePerson>
               <np:natuerlichePerson.id>np-1</np:natuerlichePerson.id>
               <np:name>
                  <np:familienname>Glas</np:familienname>
                  <np:vornamen>Norbert</np:vornamen>
               </np:name>
               <bk:geburt>
                  <np:geburtsdatum>
                     <dat:datum>1958-06-13</dat:datum>
                  </np:geburtsdatum>
                  <adr:ort>Offenbach</adr:ort>
                  <bk:staat>Deutschland</bk:staat>
               </bk:geburt>
               <np:geschlecht listVersionID="1">
                  <code>m</code>
               </np:geschlecht>
               <np:staatsangehoerigkeit listVersionID="2020-05-11">
                  <code>000</code>
               </np:staatsangehoerigkeit>
               <bk:anschrift>
                  <bk:strassenanschriftInland>
                     <adr:strasse>Im Hain</adr:strasse>
                     <bk:strassenschluessel>0000000101</bk:strassenschluessel>
                     <bk:hausnummerVon>1</bk:hausnummerVon>
                     <adr:postleitzahl>03046</adr:postleitzahl>
                     <adr:ort>Cottbus</adr:ort>
                  </bk:strassenanschriftInland>
               </bk:anschrift>
               <bk:kommunikation>
                  <komm:telefon>+49 335 44789</komm:telefon>
               </bk:kommunikation>
            </xga:natuerlichePerson>
            <xga:juristischePerson>
               <jp:juristischePerson.id>jp-1</jp:juristischePerson.id>
               <rf:rechtsform>
                  <rf:rechtsformcode listVersionID="2.3">
                     <code>221100</code>
                  </rf:rechtsformcode>
               </rf:rechtsform>
               <ename:eingetragenerName>m-a-c-r-o-c-o n gmbh</ename:eingetragenerName>
               <bk:eintragung>
                  <eintr:artEintragung listVersionID="1">
                     <code>B</code>
                  </eintr:artEintragung>
                  <eintr:registergericht.code listVersionID="12">
                     <code>G1103</code>
                  </eintr:registergericht.code>
                  <eintr:eintragungsnummer>9235</eintr:eintragungsnummer>
               </bk:eintragung>
               <xga:gesetzlicherVertreter>
                  <gv:gesetzlicherVertreter.id>np-1</gv:gesetzlicherVertreter.id>
               </xga:gesetzlicherVertreter>
               <xga:anzahlGesetzlicheVertreter>1</xga:anzahlGesetzlicheVertreter>
            </xga:juristischePerson>
         </xga:referenzierteSubjekte>
         <xga:frueheresGewerbe>
            <bk:anschrift>
               <bk:strassenanschriftInland>
                  <adr:strasse>Am Tiergarten</adr:strasse>
                  <bk:hausnummerVon>21a</bk:hausnummerVon>
                  <adr:postleitzahl>65510</adr:postleitzahl>
                  <adr:ort>Idstein</adr:ort>
               </bk:strassenanschriftInland>
            </bk:anschrift>
         </xga:frueheresGewerbe>
         <xga:grundAnmeldungSchluessel>
            <code>02</code>
         </xga:grundAnmeldungSchluessel>
      </xga:anmeldung>
   </xga:satz>
</xga:alg.gewerbemeldung.0300>`;

// Same as okXml but with kennung xga:090010050000 which AKDB rejects
const nokXml = okXml.replace(
  "<bn-beh:kennung>xga:090010030000</bn-beh:kennung>",
  "<bn-beh:kennung>xga:090010050000</bn-beh:kennung>",
);
