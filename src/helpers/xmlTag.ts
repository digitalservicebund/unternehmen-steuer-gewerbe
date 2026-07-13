import { escapeXml } from "./escapeXml";
import { isDefinedInput } from "./isDefinedInput";

type XmlValue = string | number | boolean | undefined;

/** Renders `<tagName>escapedValue</tagName>`, or "" if value is undefined. */
export function optionalTag(tagName: string, value: XmlValue) {
  if (!isDefinedInput(value)) return "";
  return `<${tagName}>${escapeXml(value)}</${tagName}>`;
}

/** Renders `<outerTag attributes><innerTag>escapedValue</innerTag></outerTag>`, or "" if value is undefined. */
export function optionalWrappedTag(
  outerTag: string,
  innerTag: string,
  value: XmlValue,
  attributes = "",
) {
  if (!isDefinedInput(value)) return "";
  return `<${outerTag}${attributes}><${innerTag}>${escapeXml(value)}</${innerTag}></${outerTag}>`;
}
