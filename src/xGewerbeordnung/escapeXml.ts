export function xml(value: string | number | boolean) {
  return String(value).replaceAll(/&/g, "&amp;").replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");
}
