// AGS: Bundesland (2 Stellen), Regierungsbezirk (1 Stelle), Kreis (2 Stellen) und Gemeinde (3 Stellen)
// => https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/Glossar/amtlicher-gemeindeschluessel.html
//
// ARS: Bundesland (2 Stellen), Regierungsbezirk (1 Stelle), Kreis (2 Stellen), Gemeindeverband (4 Stellen) und Gemeinde (3 Stellen).
// => https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/Glossar/regionalschluessel.html
//
// The ARS (12 digits) embeds the AGS (8 digits): ARS digits 1-5 (state + Regierungsbezirk + Kreis)
// map to AGS 1-5, ARS digits 10-12 (Gemeinde) to AGS 6-8.
export function getAGS(ars: string): string {
  if (!/^\d{12}$/.test(ars)) {
    throw new Error(`Cannot derive an AGS from invalid ARS "${ars}" (ARS not 12 digits)`);
  }

  return ars.slice(0, 5) + ars.slice(9);
}
