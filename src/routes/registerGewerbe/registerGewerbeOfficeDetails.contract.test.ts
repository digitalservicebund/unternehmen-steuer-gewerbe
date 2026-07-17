import { describe, it, expect } from "vitest";
import app from "../../app";
import { registerGewerbeSampleRequestAllFieldsFilled } from "./testHelpers";
import { ErrorTypeSchema } from "./registerGewerbeInterfaces";

function postRegisterGewerbe(data = registerGewerbeSampleRequestAllFieldsFilled) {
  return app.request("/api/v1/register-gewerbe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

describe(
  "Route /api/v1/register-gewerbe (full Kombiantrag) — Finanzamt and Gewerbeamt details",
  { timeout: 15_000 },
  () => {
    it("returns Finanzamt details for adresseAbweichend in unternehmensDaten (with Prinzessinnenstraße 8-14, 10969 Berlin)", async () => {
      const dataWithPostleitZahl = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);

      dataWithPostleitZahl.unternehmensDaten.adresseAbweichend = {
        postleitzahl: "10969",
        ort: "Berlin",
        strasseUndHausnummer: "Prinzessinnenstraße 8-14",
      };

      const response = await postRegisterGewerbe(dataWithPostleitZahl);

      const json = await response.json();

      expect(json.fseÜbermittlung.officeDetails).toEqual({
        name: "Finanzamt Friedrichshain-Kreuzberg",
        strasseUndHausnummer: "Mehringdamm 22",
        postleitzahl: "10961",
        ort: "Berlin",
        telefon: "030 9024-14 0",
      });
    });

    it("returns Finanzamt details for persönlicheDaten  (Musterstraße 1, 03046 Cottbus)", async () => {
      const dataWithoutAdresseAbweichend = structuredClone(
        registerGewerbeSampleRequestAllFieldsFilled,
      );

      dataWithoutAdresseAbweichend.unternehmensDaten.adresseAbweichend = undefined;

      const response = await postRegisterGewerbe(dataWithoutAdresseAbweichend);
      const json = await response.json();

      expect(json.fseÜbermittlung.officeDetails).toEqual({
        name: "Finanzamt Cottbus",
        strasseUndHausnummer: "Vom-Stein-Straße 29",
        postleitzahl: "03050",
        ort: "Cottbus",
        telefon: "0355 4991-4100",
      });
    });

    it("returns the appropriate Gewerbeamt details for Fulda", async () => {
      const dataWithFulda = structuredClone(registerGewerbeSampleRequestAllFieldsFilled);
      dataWithFulda.unternehmensDaten.adresseAbweichend = {
        strasseUndHausnummer: "Schlossstraße 2",
        postleitzahl: "36037",
        ort: "Fulda",
      };

      const response = await postRegisterGewerbe(dataWithFulda);
      const json = await response.json();

      expect(json.gewerbeanmeldung.officeDetails).toEqual({
        name: "Stadt Fulda",
        strasseUndHausnummer: "Schlossstraße 1",
        postleitzahl: "36037",
        ort: "Fulda",
        telefon: "0661 102-0",
        email: "buergerbuero@fulda.de",
        onlineServices: [
          {
            title: "Gewerbeanzeige",
            description:
              "Sie können auf diesem Wege Gewerbeanzeigen zum Beginn, zur Änderung oder zur Schließung eines Gewerbes (Hauptniederlassung oder Zweigstelle) für die folgenden Rechtsformen erfassen.\nBeachten Sie bitte, dass für die Rechtsformen GbR, eGbR und OHG der Meldevorgang nur für natürliche Personen als Gesellschafter möglich ist. Die Erfassung juristischer Personen als Gesellschafter nehmen Sie bitte direkt im Gewerbeamt vor.\n\nEingetragenes Einzelunternehmen\nNicht eingetragenes Einzelunternehmen\nGesellschaft des bürgerlichen Rechts (GbR)\nEingetragene Gesellschaft bürgerlichen Rechts (eGbR)\nGesellschaft mit beschränkter Haftung (GmbH, auch gemeinnützige gGmbH)\nUnternehmergesellschaft (UG auch haftungsbeschränkt)\nOffene Handelsgesellschaft (OHG)\nKommanditgesellschaft (KG)\nGesellschaft mit beschränkter Haftung & Compagnie Kommanditgesellschaft (GmbH & Co. KG)\nGesellschaft mit beschränkter Haftung & Compagnie Offene Handelsgesellschaft (GmbH & Co. OHG)\nAktiengesellschaft (AG)\nEuropäische Aktiengesellschaft (SE) nur mit Eintragung in Handelsregister B\nGemäß § 14 Abs. 1 GewO muss der Beginn eines Gewerbes oder einer Zweigstelle sowie deren Umzug oder Schließung oder eine wesentliche Änderung der Tätigkeit der zuständigen Behörde angezeigt werden.\nSie können die Daten für diese Anzeige hier direkt erfassen und an Ihr Gewerbeamt übermitteln.\n\nSie benötigen ggf. folgende Unterlagen, welche am Ende der Erfassung hochgeladen werden müssen.\n\nRegisterauszug\nvorliegende Erlaubnisse\nvorliegende Handwerkskarten\nvorliegende Aufenthaltstitel\nvorliegende Vertretungsvollmacht\nKopie Personaldokument\n\nFür eine Gewerbeanzeige entstehen Gebühren gemäß Verwaltungskostenverzeichnis der Hessischen Verwaltungskostenordnung für den Geschäftsbereich des Ministeriums für Wirtschaft, Energie, Verkehr und Wohnen (VwKostO-MWEVW). Diese werden am Ende der Erfassung erhoben und betragen je nach Grund der Anzeige.",
            uri: "https://gewerbeanzeige.ekom21.de/webclient/app/m/06631009/gewerbeanzeige",
          },
        ],
      });
    });

    it("returns fseÜbermittlung success=false and 'invalid_data' if no Finanzamt found", async () => {
      const requestDataWithNonExistentAddress = structuredClone(
        registerGewerbeSampleRequestAllFieldsFilled,
      );

      requestDataWithNonExistentAddress.unternehmensDaten.adresseAbweichend = undefined;

      requestDataWithNonExistentAddress.persönlicheDaten.adresse = {
        postleitzahl: "00000",
        ort: "Nonexistent Ort",
        strasseUndHausnummer: "Nonexistent Street 1",
      };

      const response = await postRegisterGewerbe(requestDataWithNonExistentAddress);
      const json = await response.json();

      expect(json.fseÜbermittlung).toEqual({
        success: false,
        errorType: ErrorTypeSchema.enum.invalid_data,
        info: "No Finanzamt found for address",
      });
    });
  },
);
