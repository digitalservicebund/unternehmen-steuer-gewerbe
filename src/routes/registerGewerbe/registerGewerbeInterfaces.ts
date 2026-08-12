import { z } from "@hono/zod-openapi";
import { OfficeDetailsSchema } from "../region/regionInterfaces";
import {
  UNFALLVERSICHERUNGSTRAEGER,
  UNFALLVERSICHERUNGSTRAEGER_KEYS,
  VERTRAUENSNIVEAU_KEYS,
  STAATSANGEHOERIGKEIT_KEYS,
  STAATSANGEHOERIGKEIT_ICAO_KEYS,
  RECHTSFORM_KEYS,
  GRUNDANMELDUNGSSCHLUESSEL_KEYS,
  ART_BETRIEBSSTAETTE_KEYS,
} from "./requestDataTransformer/xGewerbeordnungCodes";
import {
  RELIGIONSSCHLUESSEL_KEYS,
  GEWINN_ERMITTLUNG_KEYS,
  SOLL_IST_VERSTEUERUNG_KEYS,
  IST_VERSTEUERUNG_GRUND_KEYS,
  ZAHLLAST_UEBERSCHUSS_KEYS,
} from "./requestDataTransformer/fsECodes";

const AdresseSchema = z.object({
  strasseUndHausnummer: z
    .string()
    .regex(/^\D.*\d/)
    .openapi({
      example: "Musterstraße 1",
      description:
        "Street name followed by street number; must start with letters and contain a digit",
    }),
  postleitzahl: z
    .string()
    .regex(/^\d{5}$/)
    .openapi({ example: "36037", description: "5-digit German postal code" }),
  ort: z.string().openapi({ example: "Fulda" }),
});

const PersönlicheDatenSchema = z.object({
  vorname: z.string().openapi({ example: "Erika" }),
  nachname: z.string().openapi({ example: "Mustermann" }),
  geburtsname: z.string().openapi({ example: "Muster" }).optional(),
  geburtsdatum: z.iso.date().openapi({ example: "1988-09-10" }),
  geburtsort: z.string().openapi({ example: "Musterstadt" }),
  geburtsland: z.string().openapi({ example: "Deutschland" }),
  staatsangehörigkeitIcao: z.enum(STAATSANGEHOERIGKEIT_ICAO_KEYS).optional().openapi({
    example: "D",
    description:
      "Citizenship of the person as an ICAO Doc 9303 nationality code (e.g. 'D' for Germany). Takes precedence over the deprecated `staatsangehörigkeit`.",
  }),
  staatsangehörigkeit: z.enum(STAATSANGEHOERIGKEIT_KEYS).default("deutsch").openapi({
    deprecated: true,
    example: "deutsch",
    description:
      "Citizenship of the person according to the code list of the German Federal Statistical Office. Defaults to 'deutsch' (code 000). Deprecated: still transmitted to the Gewerbeamt, but will stop being read in a future version.",
  }),
  adresse: AdresseSchema,
  telefon: z
    .string()
    .regex(/^\+\d{1,5}\s\d{1,5}\s\d{1,13}(-\d{1,5})?$/)
    .openapi({
      example: "+49 234 121314",
      description:
        "Phone numbers are encoded according to the DIN 5008 standard as follows: +[Country code] (up to 5 digits) [Area code] (up to 5 digits) [Phone number] (up to 13 digits) [-Extension] (optional, up to 5 digits).",
    }),
  email: z.email().openapi({ example: "e.mustermann@example.org" }),
  steuerId: z
    .string()
    .regex(/^\d{11}$/)
    .openapi({
      example: "06646829576",
      description:
        "Steuerliche Identifikationsnummer (IdNr) der Person, 11 Ziffern. ELSTER prüft zusätzlich die Prüfziffer; Nummern mit führender 0 sind Test-IdNr und nur im Testbetrieb zugelassen.",
    }),
  steuernummer: z
    .string()
    .regex(/^\d{4}0\d{8}$/)
    .optional()
    .openapi({
      example: "2695002219428",
      description:
        "Bestehende Einkommensteuernummer der Person, falls bereits vorhanden (z.B. durch frühere Steuererklärungen als Arbeitnehmer). ELSTER-Format: 4 Ziffern, gefolgt von einer festen 0, gefolgt von 8 Ziffern (13 Zeichen gesamt).",
    }),
  religion: z.enum(RELIGIONSSCHLUESSEL_KEYS).openapi({
    example: "nichtKirchensteuerpflichtig",
  }),
  vertrauensniveau: z.enum(VERTRAUENSNIVEAU_KEYS).openapi({
    example: "substantiell",
    description: "Vertrauensniveau des verwendeten Identifizierungsmittels gemäß eIDAS-Verordnung",
  }),
  geschlecht: z.enum(["x", "d", "w", "m"]).openapi({
    example: "x",
    description:
      "Geschlecht der Person. 'x' = keine Angabe (Pflichtfeld gemäß SCH-EXISTS in xGewerbeordnung).",
  }),
});

const UnternehmensDatenSchema = z
  .object({
    adresseAbweichend: AdresseSchema.optional().openapi({
      example: {
        strasseUndHausnummer: "Musterstraße 2",
        postleitzahl: "36037",
        ort: "Fulda",
      },
    }),
    geschäftsbezeichnung: z.string().max(120).optional().openapi({
      example: "Musterhandel",
      description:
        "Bezeichnung des Unternehmens, falls abweichend vom Namen des Gewerbetreibenden.",
    }),
    tätigkeitsbeschreibung: z.string().openapi({ example: "Vertrieb von Vertriebsmustern" }),
    tätigkeitsbereich: z
      .enum(["industrie", "handwerk", "handel", "sonstiges"])
      .openapi({ example: "handwerk" }),
    anmeldedatumFinanzamt: z.iso.date().openapi({
      example: "2026-04-17",
      description: "Date reported to the Finanzamt as the start of business activity.",
    }),
    anmeldedatumGewerbeamt: z.iso.date().openapi({
      example: "2026-04-17",
      description: "Date reported to the Gewerbeamt as the business's founding date.",
    }),
    gewerbeart: z.enum(["hauptgewerbe", "nebengewerbe"]).openapi({ example: "hauptgewerbe" }),
    istReisegewerbe: z.boolean().openapi({
      example: false,
      description: "Handelt es sich um ein Reisegewerbe?",
    }),
    rechtsform: z.enum(RECHTSFORM_KEYS).openapi({
      example: "nichtEingetragenesEinzelunternehmen",
      description: "Rechtsform des Unternehmens.",
    }),
    grundAnmeldungSchluessel: z.enum(GRUNDANMELDUNGSSCHLUESSEL_KEYS).openapi({
      example: "neugründung",
      description:
        "Grund für die Gewerbeanmeldung. Entspricht dem Codelisten-Schlüssel gemäß urn:xoev-de:xgewerbeordnung:codeliste:grundfueranmeldung_3.",
    }),
    artBetriebsstaette: z.enum(ART_BETRIEBSSTAETTE_KEYS).openapi({
      example: "hauptniederlassung",
      description: "Art der Betriebsstätte (SCH-0256: nur 01/02/03 ab 2024-05-01).",
    }),
    beteiligungOeffentlicheHand: z.enum([
      "0",
      // "1", Not supported
      // "2", Not supported
    ]).openapi({
      example: "0",
      description:
        "Beteiligung der öffentlichen Hand: '0' = keine, '1' = vorhanden, '2' = unbekannt.",
    }),
    anzahlVollzeitBeschaeftigte: z.number().int().min(0).default(0).openapi({
      example: 0,
      description:
        "Anzahl der Vollzeitbeschäftigten (inklusive Ehe- oder Lebenspartner, Aushilfen, jedoch stets ohne den Inhaber selbst), die zum Zeitpunkt der Gewerbemeldung in der Betriebsstätte tätig sind.",
    }),
    anzahlTeilzeitBeschaeftigte: z.number().int().min(0).default(0).openapi({
      example: 0,
      description:
        "Anzahl der Teilzeitbeschäftigten (inklusive Ehe- oder Lebenspartner, Aushilfen, jedoch stets ohne den Inhaber selbst), die zum Zeitpunkt der Gewerbemeldung in der Betriebsstätte tätig sind.",
    }),
    gewinnErmittlung: z.enum(GEWINN_ERMITTLUNG_KEYS).openapi({
      example: "einnahmenüberschussrechnung",
    }),
    kleinunternehmerRegelung: z.boolean().default(false).openapi({
      example: false,
      description: "Wird die Kleinunternehmer-Regelung (§ 19 UStG) in Anspruch genommen?",
    }),
    umsatzGruendungsjahr: z.number().int().min(0).openapi({
      example: 25000,
      description: "Voraussichtlicher Gesamtumsatz (in Euro) im Jahr der Betriebseröffnung.",
    }),
    umsatzFolgejahr: z.number().int().min(0).openapi({
      example: 26000,
      description: "Voraussichtlicher Gesamtumsatz (in Euro) im Folgejahr.",
    }),
    umsatzsteuerIdMitbeantragen: z.boolean().openapi({
      example: false,
      description: "Soll mit dem FsE auch eine UmsatzsteuerId mitbeantragt werden?",
    }),
    gewinnGründungsjahr: z.number().int().openapi({
      example: 25000,
      description:
        "Voraussichtlicher Gewinn (in Euro) im Jahr der Betriebseröffnung. Negativ bei Verlust.",
    }),
    gewinnFolgejahr: z.number().int().openapi({
      example: 26000,
      description: "Voraussichtlicher Gewinn (in Euro) im Folgejahr. Negativ bei Verlust.",
    }),
    sollIstVersteuerung: z.enum(SOLL_IST_VERSTEUERUNG_KEYS).openapi({
      example: "istVersteuerung",
      description: "Art der Umsatzbesteuerung gemäß § 16 bzw. § 20 UStG.",
    }),
    istVersteuerungGrund: z.enum(IST_VERSTEUERUNG_GRUND_KEYS).optional().openapi({
      example: "unterschreitungUmsatzgrenze",
      description:
        "Begründung für die beantragte Istversteuerung. Verpflichtend, wenn `sollIstVersteuerung` auf `istVersteuerung` gesetzt ist; andernfalls weglassen.",
    }),
    zahllastUeberschussAuswahl: z.enum(ZAHLLAST_UEBERSCHUSS_KEYS).default("zahllast").openapi({
      example: "zahllast",
      description: "Ob voraussichtlich eine Zahllast oder ein Überschuss erwartet wird.",
    }),
    zahllastUeberschussBetrag: z.number().int().min(0).default(0).openapi({
      example: 0,
      description: "Voraussichtliche Zahllast oder Überschuss in Euro.",
    }),
    umsatzsteuerImErstenJahr: z.int().optional().openapi({
      example: 100,
      description:
        "Deprecated. Use 'zahllastUeberschussAuswahl'/'zahllastUeberschussBetrag' instead. (Voraussichtliche Umsatzsteuer im ersten Jahr. Größer als 0 => Nutzer hat 'Zahllast' => muss was bezahlen; kleiner oder gleich 0 => 'Überschuss' => Rückzahlung vom / Guthaben beim Finanzamt.)",
      deprecated: true,
    }),
  })
  .refine(
    (data) => {
      return (
        data.sollIstVersteuerung !== "istVersteuerung" || data.istVersteuerungGrund !== undefined
      );
    },
    {
      error:
        "istVersteuerungGrund is required when sollIstVersteuerung is set to 'istVersteuerung'.",
      path: ["istVersteuerungGrund"],
    },
  )
  .refine(
    (data) => {
      return (
        data.sollIstVersteuerung === "istVersteuerung" || data.istVersteuerungGrund === undefined
      );
    },
    {
      error: "istVersteuerungGrund must only be set when sollIstVersteuerung is 'istVersteuerung'.",
      path: ["istVersteuerungGrund"],
    },
  );

const unfallversicherungstraegerCodesDescription = Object.entries(UNFALLVERSICHERUNGSTRAEGER)
  .map(([name, code]) => `- \`${name}\` (${code})`)
  .join("\n");

// Not used as long as we only support 'grundAnmeldungSchluessel: "01"' ("Neugründung")
const _BisherigeUnfallversicherungSchema = z
  .object({
    traeger: z.enum(UNFALLVERSICHERUNGSTRAEGER_KEYS).openapi({
      example: "verwaltungsBerufsgenossenschaft",
      description: `Schlüssel des Trägers der bisherigen gesetzlichen Unfallversicherung. Mögliche Werte: ${unfallversicherungstraegerCodesDescription},`,
    }),
    unternehmensnummer: z.string().length(15).optional().openapi({
      example: "123456789012345",
      description:
        "Company number from the previous 'Unfallversicherung' (formerly membership number). Must be exactly 15 characters long.",
    }),
  })
  .openapi("BisherigeUnfallversicherung");

export const ErrorTypeSchema = z.enum(["validation_error", "upstream_error", "invalid_data"]);

export const RegisterGewerbeRequestSchema = z
  .object({
    persönlicheDaten: PersönlicheDatenSchema,
    unternehmensDaten: UnternehmensDatenSchema,
  })
  .openapi("RegisterGewerbeRequest");

export type RegisterGewerbeRequest = z.infer<typeof RegisterGewerbeRequestSchema>;

const RegisterGewerbeResponseItemSchema = z.object({
  success: z.boolean(),
  submissionId: z.string().optional(),
  // Routing context for the events endpoint, echoed back to the client 1:1.
  // ars is always set for the gewerbeanmeldung item; fitConnectDestinationId only
  // when the submission was sent via FIT-Connect (its absence marks OSCI).
  ars: z.string().optional(),
  fitConnectDestinationId: z.string().optional(),
  info: z.string().optional(),
  errorType: ErrorTypeSchema.optional(),
  pdfReceiptBase64: z.base64().optional(),
  officeDetails: OfficeDetailsSchema.optional(),
});

export type RegisterGewerbeResponseItem = z.infer<typeof RegisterGewerbeResponseItemSchema>;

export const RegisterGewerbeResponseSchema = z
  .object({
    gewerbeanmeldung: RegisterGewerbeResponseItemSchema.optional(),
    fseÜbermittlung: RegisterGewerbeResponseItemSchema.optional(),
  })
  .openapi("RegisterGewerbeResponse");
