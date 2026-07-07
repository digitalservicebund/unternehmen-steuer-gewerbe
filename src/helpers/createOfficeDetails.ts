import { type getFinanzamtDetailsById } from "@digitalservicebund/unternehmen-steuer-gewerbe-privat";
import { type Gewerbeamt, type OnlineServiceLink } from "../clients/pvogClient";
import { joinStrasseUndHausnummer } from "./formFieldTransformations";

export interface OfficeDetails {
  name: string;
  strasseUndHausnummer?: string;
  postleitzahl?: string;
  ort?: string;
  telefon?: string;
  email?: string;
  onlineServices?: OnlineServiceLink[];
}

type FinanzamtDetails = NonNullable<ReturnType<typeof getFinanzamtDetailsById>>;

export function createOfficeDetailsFromGewerbeamt(gewerbeamt: Gewerbeamt): OfficeDetails {
  const adresse = gewerbeamt.adresse;

  return {
    name: gewerbeamt.name,
    strasseUndHausnummer: joinStrasseUndHausnummer(adresse?.strasse, adresse?.hausnummer),
    postleitzahl: adresse?.postleitzahl,
    ort: adresse?.ort,
    telefon: gewerbeamt.telefon,
    email: gewerbeamt.email,
    onlineServices: gewerbeamt.onlineServices,
  };
}

export function createOfficeDetailsFromFinanzamt(finanzamt: FinanzamtDetails): OfficeDetails {
  const hausanschrift = finanzamt.hausanschrift;

  return {
    name: finanzamt.name,
    strasseUndHausnummer: joinStrasseUndHausnummer(
      hausanschrift?.strasse,
      hausanschrift?.hausnummer,
    ),
    postleitzahl: hausanschrift?.postleitzahl,
    ort: hausanschrift?.ort,
    telefon: finanzamt.telefonnummer,
  };
}
