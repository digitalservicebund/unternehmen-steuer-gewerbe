import { escapeXml } from "../../../helpers/escapeXml";

export interface Behoerde {
  /** Dieses Element enthält die eindeutige Kennzeichnung der Behörde / öffentlichen Stelle innerhalb des angegebenen Verzeichnisdienstes. Die Behördenkennung des Autors muss das Präfix MELDID oder xga haben. */
  kennung?: string;
  /** Dieses Element enthält den Namen der Behörde / öffentlichen Stelle. */
  name?: string;
}

export function createBehoerde(behoerde: Behoerde | undefined) {
  if (!behoerde) return "";
  return `
    <bn-beh:verzeichnisdienst listVersionID="1">
      <code>DVDV</code>
    </bn-beh:verzeichnisdienst>
    ${behoerde.kennung ? `<bn-beh:kennung>${escapeXml(behoerde.kennung)}</bn-beh:kennung>` : ""}
    ${behoerde.name ? `<bn-beh:name>${escapeXml(behoerde.name)}</bn-beh:name>` : ""}`;
}
