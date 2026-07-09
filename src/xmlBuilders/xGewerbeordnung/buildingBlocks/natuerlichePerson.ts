import { createAnschrift, type Anschrift } from "./anschrift";
import { createKommunikation, type Kommunikation } from "./kommunikation";
import { createAufenthaltstitel, type Aufenthaltstitel } from "./aufenthaltstitel";
import { optionalTag, optionalWrappedTag } from "../../../helpers/xmlTag";

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
      ${optionalTag("np:familienname", name.familienname)}
      ${optionalTag("np:geburtsname", name.geburtsname)}
      ${optionalTag("np:vornamen", name.vornamen)}
    </np:name>`;
}

function createGeburt(geburt: Geburt | undefined) {
  if (!geburt) return "";
  return `
    <bk:geburt>
      ${optionalWrappedTag("np:geburtsdatum", "dat:datum", geburt.geburtsdatum)}
      ${optionalTag("adr:ort", geburt.ort)}
      ${optionalTag("bk:staat", geburt.staat)}
    </bk:geburt>`;
}

export function createNatuerlichePerson(natuerlichePerson: NatuerlichePerson | undefined) {
  if (!natuerlichePerson) return "";
  return `
    <xga:natuerlichePerson>
      ${optionalTag("np:natuerlichePerson.id", natuerlichePerson.id)}
      ${createName(natuerlichePerson.name)}
      ${createGeburt(natuerlichePerson.geburt)}
      ${optionalWrappedTag("np:geschlecht", "code", natuerlichePerson.geschlecht, ' listVersionID="1"')}
      ${optionalWrappedTag("np:staatsangehoerigkeit", "code", natuerlichePerson.staatsangehoerigkeit, ' listVersionID="2020-05-11"')}
      ${createAnschrift(natuerlichePerson.anschrift)}
      ${createKommunikation(natuerlichePerson.kommunikation)}
      ${createAufenthaltstitel(natuerlichePerson.aufenthaltstitel)}
    </xga:natuerlichePerson>`;
}
