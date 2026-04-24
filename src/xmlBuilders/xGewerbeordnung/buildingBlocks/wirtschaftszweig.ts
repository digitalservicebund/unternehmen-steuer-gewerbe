import { escapeXml } from "../../../helpers/escapeXml";

export function createWirtschaftszweig(wirtschaftszweigschluessel: string) {
  return `
    <wt:wirtschaftszweig>
      <wt:wirtschaftszweigschluessel>${escapeXml(wirtschaftszweigschluessel)}</wt:wirtschaftszweigschluessel>
      <wt:versionWirtschaftszweigklassifikation listVersionID="1">
        <code>WZ-2008</code>
      </wt:versionWirtschaftszweigklassifikation>
    </wt:wirtschaftszweig>`;
}
