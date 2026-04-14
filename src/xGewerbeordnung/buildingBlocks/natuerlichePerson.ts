import { createAnschrift, type StrassenanschriftInland } from "./anschrift";
import { createKommunikation, type Kommunikation } from "./kommunikation";
import { createAufenthaltstitel, type Aufenthaltstitel } from "./aufenthaltstitel";
import { xml } from "../escapeXml";

export interface Name {
  familienname: string;
  /** Geburtsname, falls abweichend vom Familiennamen. */
  geburtsname?: string;
  vornamen: string;
}

export interface Geburt {
  geburtsdatum: string;
  ort: string;
  staat: string;
}

export interface NatuerlichePerson {
  /** ID-Querverweis (z.B. "np-1") für wirtschaftlichTaetiger.id und gewerbetreibender.id. */
  id: string;
  name: Name;
  geburt: Geburt;
  /** Geschlecht als Code, listVersionID="1" (m/w/d/x). */
  geschlecht: string;
  /** Staatsangehörigkeit als Code gem. Staatsangehörigkeitscode, listVersionID="2020-05-11". */
  staatsangehoerigkeit: string;
  /** Anschrift der natürlichen Person (privater Wohnsitz). */
  anschrift?: StrassenanschriftInland;
  /** Private Kontaktdaten der natürlichen Person. */
  kommunikation?: Kommunikation;
  /** Aufenthaltstitel – nur bei ausländischen Betriebsinhabern relevant. */
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
