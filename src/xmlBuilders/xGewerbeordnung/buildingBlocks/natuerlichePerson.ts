import { createAnschrift, type Anschrift } from "./anschrift";
import { createKommunikation, type Kommunikation } from "./kommunikation";
import { createAufenthaltstitel, type Aufenthaltstitel } from "./aufenthaltstitel";
import { escapeXml } from "../../../helpers/escapeXml";
import { isDefinedInput } from "../../../helpers/isDefinedInput";

export interface Name {
  /** Familienname einer natürlichen Person bestehend aus Nachname, Zuname bzw. Familienname. */
  familienname?: string;
  /** Der Geburtsname entspricht dem Familiennamen einer natürlichen Person vor der Schließung der ersten Ehe bzw. vor dem Eingehen der ersten Lebenspartnerschaft. */
  geburtsname?: string;
  /** Vornamen einer natürlichen Person. */
  vornamen?: string;
}

export interface Geburt {
  /** Datum der Vollendung der Geburt. */
  geburtsdatum?: string;
  /** Der Ort der Geburt. */
  ort?: string;
  /** Der Staat der Geburt. */
  staat?: string;
}

export interface NatuerlichePerson {
  /** Innerhalb des jeweiligen Kontextes eindeutige ID dieser Instanz des Datentyps Natürliche Person. */
  id?: string;
  /** Datenobjekt zur Darstellung des Namens einer natürlichen Person in lateinischer Schrift, entsprechend der Vorgaben aus dem Baukasten des Föderalen Informationsmanagements (FIM). */
  name?: Name;
  /** Dieses Element ist gegenüber der Definition aus dem Kerndatenmodell wie folgt konkretisiert: Angabe zum Staat als Freitext statt Code. */
  geburt?: Geburt;
  /** Als Geschlechtsangabe zulässig sind: "x" (keine Angabe), "d" (divers), "w" (weiblich), "m" (männlich). */
  geschlecht?: "x" | "d" | "w" | "m";
  /** Die Staatsangehörigkeit der natürlichen Person gemäß Codierung des statistischen Bundesamts. */
  staatsangehoerigkeit?: string;
  /** Anschrift der natürlichen Person (privater Wohnsitz). */
  anschrift?: Anschrift;
  /** Private Kontaktdaten der natürlichen Person. */
  kommunikation?: Kommunikation;
  /** Mittels dieses Typs werden Angaben zum Aufenthaltstitel ausländischer Betriebsinhaber gemacht. */
  aufenthaltstitel?: Aufenthaltstitel;
}

function createName(name: Name | undefined) {
  if (!name) return "";
  return `
    <np:name>
      ${isDefinedInput(name.familienname) ? `<np:familienname>${escapeXml(name.familienname)}</np:familienname>` : ""}
      ${isDefinedInput(name.geburtsname) ? `<np:geburtsname>${escapeXml(name.geburtsname)}</np:geburtsname>` : ""}
      ${isDefinedInput(name.vornamen) ? `<np:vornamen>${escapeXml(name.vornamen)}</np:vornamen>` : ""}
    </np:name>`;
}

function createGeburt(geburt: Geburt | undefined) {
  if (!geburt) return "";
  return `
    <bk:geburt>
      ${isDefinedInput(geburt.geburtsdatum) ? `<np:geburtsdatum><dat:datum>${escapeXml(geburt.geburtsdatum)}</dat:datum></np:geburtsdatum>` : ""}
      ${isDefinedInput(geburt.ort) ? `<adr:ort>${escapeXml(geburt.ort)}</adr:ort>` : ""}
      ${isDefinedInput(geburt.staat) ? `<bk:staat>${escapeXml(geburt.staat)}</bk:staat>` : ""}
    </bk:geburt>`;
}

export function createNatuerlichePerson(natuerlichePerson: NatuerlichePerson | undefined) {
  if (!natuerlichePerson) return "";
  return `
    <xga:natuerlichePerson>
      ${isDefinedInput(natuerlichePerson.id) ? `<np:natuerlichePerson.id>${escapeXml(natuerlichePerson.id)}</np:natuerlichePerson.id>` : ""}
      ${createName(natuerlichePerson.name)}
      ${createGeburt(natuerlichePerson.geburt)}
      ${isDefinedInput(natuerlichePerson.geschlecht) ? `<np:geschlecht listVersionID="1"><code>${escapeXml(natuerlichePerson.geschlecht)}</code></np:geschlecht>` : ""}
      ${isDefinedInput(natuerlichePerson.staatsangehoerigkeit) ? `<np:staatsangehoerigkeit listVersionID="2020-05-11"><code>${escapeXml(natuerlichePerson.staatsangehoerigkeit)}</code></np:staatsangehoerigkeit>` : ""}
      ${createAnschrift(natuerlichePerson.anschrift)}
      ${createKommunikation(natuerlichePerson.kommunikation)}
      ${createAufenthaltstitel(natuerlichePerson.aufenthaltstitel)}
    </xga:natuerlichePerson>`;
}
