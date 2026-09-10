import { describe, it, expect } from "vitest";
import { buildReceipt, type ReceiptRow } from "./receiptFields";
import { gewerbeanmeldungFixture, gewerbeRoutingInfoFixture } from "./testHelpers";

function rowsOf(anmeldung = gewerbeanmeldungFixture(), routingInfo = gewerbeRoutingInfoFixture()) {
  return buildReceipt(anmeldung, routingInfo).sections.flatMap((section) => section.rows);
}

function rowFor(label: string, rows: ReceiptRow[] = rowsOf()): ReceiptRow {
  const row = rows.find((candidate) => candidate.label === label);
  if (row === undefined) throw new Error(`no row labelled "${label}"`);
  return row;
}

describe("buildReceipt", () => {
  it("takes Behördenname and Gemeindekennzahl from the routing info", () => {
    const receipt = buildReceipt(gewerbeanmeldungFixture(), gewerbeRoutingInfoFixture());

    expect(receipt.behoerdenName).toBe("Ordnungsamt Musterstadt");
    expect(receipt.gemeindekennzahl).toBe("11000000");
    expect(receipt.submittedBy).toBe("Einfach Gründen");
  });

  it("uses the uuid of the Gewerbeanzeige as document id", () => {
    const receipt = buildReceipt(gewerbeanmeldungFixture(), gewerbeRoutingInfoFixture());

    expect(receipt.anzeigeId).toBe("dcfb0861-396d-4551-a995-9fedbed0e68b");
  });

  it("lists the sections of the design in order", () => {
    const receipt = buildReceipt(gewerbeanmeldungFixture(), gewerbeRoutingInfoFixture());

    expect(receipt.sections.map((section) => section.title)).toEqual([
      "Angaben zur Gewerbeanmeldung",
      "Angaben zur Person",
      "Angaben zum Betrieb",
      "Erlaubnisse und Nachweise",
      "Weitere Felder der Gewerbeanmeldung",
    ]);
  });

  it("covers every GewA 1 field number from 1 to 32", () => {
    const numbers = new Set(
      rowsOf()
        .map((row) => row.gewaNumber)
        .filter((number) => number !== undefined),
    );

    expect(numbers).toEqual(new Set(Array.from({ length: 32 }, (_, index) => String(index + 1))));
  });

  it("renders dates in long German form, from datumMeldung and gueltigAb respectively", () => {
    expect(rowFor("Datum der Anmeldung").value).toBe("26. August 2020");
    expect(rowFor("Datum des Beginns der Tätigkeit").value).toBe("1. Januar 2026");
    expect(rowFor("Geburtsdatum").value).toBe("12. Januar 1980");
  });

  it("resolves XGewerbeordnung codes to German labels", () => {
    const rows = rowsOf();

    expect(rowFor("Grund der Neuerrichtung / Übernahme", rows).value).toBe("Neugründung");
    expect(rowFor("Die Anmeldung wird erstattet für", rows).value).toBe("eine Hauptniederlassung");
    expect(rowFor("Rechtsform", rows).value).toBe("Einzelunternehmen");
    expect(rowFor("Staatsangehörigkeit", rows).value).toBe("deutsch");
    expect(rowFor("Beteiligung der öffentlichen Hand", rows).value).toBe("nein");
  });

  it("renders booleans as Ja / Nein", () => {
    expect(rowFor("Tätigkeit im Nebenerwerb?").value).toBe("Nein");

    const anmeldung = gewerbeanmeldungFixture();
    anmeldung.gewerbebetrieb!.istNebenerwerb = true;
    anmeldung.gewerbebetrieb!.istReisegewerbe = true;
    const rows = rowsOf(anmeldung);

    expect(rowFor("Tätigkeit im Nebenerwerb?", rows).value).toBe("Ja");
    expect(rowFor("Reisegewerbe", rows).value).toBe("Ja");
  });

  it("joins Anschrift, Geburtsort and Beschäftigtenzahlen into one value each", () => {
    const rows = rowsOf();

    expect(rowFor("Anschrift der Wohnung", rows).value).toBe("Musterstraße 1, 12345 Musterstadt");
    expect(rowFor("Anschrift der Betriebsstätte", rows).value).toBe(
      "Betriebsweg 2, 12345 Musterstadt",
    );
    expect(rowFor("Geburtsort und -land", rows).value).toBe("Musterstadt, Deutschland");
    expect(rowFor("Zahl der beschäftigten Personen (Vollzeit / Teilzeit)", rows).value).toBe(
      "1 / 0",
    );
  });

  it("renders a Hausnummernbereich as von-bis", () => {
    const anmeldung = gewerbeanmeldungFixture();
    anmeldung.gewerbebetrieb!.betriebsstaette!.anschrift!.hausnummerBis = "4";

    expect(rowFor("Anschrift der Betriebsstätte", rowsOf(anmeldung)).value).toBe(
      "Betriebsweg 2-4, 12345 Musterstadt",
    );
  });

  it("lists every Art des angemeldeten Betriebes", () => {
    expect(rowFor("Art des angemeldeten Betriebes").value).toBe("Handel");

    const anmeldung = gewerbeanmeldungFixture();
    anmeldung.gewerbebetrieb!.betriebArt = {
      industrie: true,
      handwerk: false,
      handel: true,
      sonstiges: false,
    };

    expect(rowFor("Art des angemeldeten Betriebes", rowsOf(anmeldung)).value).toBe(
      "Industrie, Handel",
    );
  });

  it("leaves fields we do not transmit empty", () => {
    const rows = rowsOf();

    expect(rowFor("Geschlecht", rows).value).toBeUndefined();
    expect(rowFor("Im Register eingetragener Name mit Rechtsform", rows).value).toBeUndefined();
    expect(rowFor("Liegt eine Erlaubnis vor?", rows).value).toBeUndefined();
    expect(rowFor("Bisheriger Unfallversicherungsträger", rows).value).toBeUndefined();
  });
});
