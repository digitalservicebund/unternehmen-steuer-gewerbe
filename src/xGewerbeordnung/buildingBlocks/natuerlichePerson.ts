import { createAnschrift, type Anschrift } from "./anschrift";
import { createKommunikation, type Kommunikation } from "./kommunikation";
import { createAufenthaltstitel, type Aufenthaltstitel } from "./aufenthaltstitel";
import { xml } from "../escapeXml";

export interface Name {
  /** Familienname einer natürlichen Person bestehend aus Nachname, Zuname bzw. Familienname. */
  familienname: string;
  /** Der Geburtsname entspricht dem Familiennamen einer natürlichen Person vor der Schließung der ersten Ehe bzw. vor dem Eingehen der ersten Lebenspartnerschaft. */
  geburtsname?: string;
  /** Vornamen einer natürlichen Person. */
  vornamen: string;
}

export interface Geburt {
  /** Datum der Vollendung der Geburt. */
  geburtsdatum: string;
  /** Der Ort der Geburt. */
  ort: string;
  /** Der Staat der Geburt. */
  staat: string;
}

export interface NatuerlichePerson {
  /** Innerhalb des jeweiligen Kontextes eindeutige ID dieser Instanz des Datentyps Natürliche Person. */
  id: string;
  /** Datenobjekt zur Darstellung des Namens einer natürlichen Person in lateinischer Schrift, entsprechend der Vorgaben aus dem Baukasten des Föderalen Informationsmanagements (FIM). */
  name: Name;
  /** Dieses Element ist gegenüber der Definition aus dem Kerndatenmodell wie folgt konkretisiert: Angabe zum Staat als Freitext statt Code. */
  geburt: Geburt;
  /** Als Geschlechtsangabe zulässig sind: "männlich", "weiblich", "divers", "keine Angabe". */
  geschlecht: string;
  /** Die Staatsangehörigkeit der natürlichen Person gemäß Codierung des statistischen Bundesamts. */
  staatsangehoerigkeit: string;
  /** Anschrift der natürlichen Person (privater Wohnsitz). */
  anschrift?: Anschrift;
  /** Private Kontaktdaten der natürlichen Person. */
  kommunikation?: Kommunikation;
  /** Mittels dieses Typs werden Angaben zum Aufenthaltstitel ausländischer Betriebsinhaber gemacht. */
  aufenthaltstitel?: Aufenthaltstitel;
}

export function createNatuerlichePerson(natuerlichePerson: NatuerlichePerson) {
  return `
    <xga:natuerlichePerson>
      <np:natuerlichePerson.id>${xml(natuerlichePerson.id)}</np:natuerlichePerson.id>
      <np:name>
        <np:familienname>${xml(natuerlichePerson.name.familienname)}</np:familienname>
        ${natuerlichePerson.name.geburtsname ? `<np:geburtsname>${xml(natuerlichePerson.name.geburtsname)}</np:geburtsname>` : ""}
        <np:vornamen>${xml(natuerlichePerson.name.vornamen)}</np:vornamen>
      </np:name>
      <bk:geburt>
        <np:geburtsdatum>
          <dat:datum>${xml(natuerlichePerson.geburt.geburtsdatum)}</dat:datum>
        </np:geburtsdatum>
        <adr:ort>${xml(natuerlichePerson.geburt.ort)}</adr:ort>
        <bk:staat>${xml(natuerlichePerson.geburt.staat)}</bk:staat>
      </bk:geburt>
      <np:geschlecht listVersionID="1">
        <code>${xml(natuerlichePerson.geschlecht)}</code>
      </np:geschlecht>
      <np:staatsangehoerigkeit listVersionID="2020-05-11">
        <code>${xml(natuerlichePerson.staatsangehoerigkeit)}</code>
      </np:staatsangehoerigkeit>
      ${createAnschrift(natuerlichePerson.anschrift)}
      ${createKommunikation(natuerlichePerson.kommunikation)}
      ${createAufenthaltstitel(natuerlichePerson.aufenthaltstitel)}
    </xga:natuerlichePerson>`;
}
