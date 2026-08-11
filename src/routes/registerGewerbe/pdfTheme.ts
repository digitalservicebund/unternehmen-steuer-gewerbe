// Values taken from the Figma design, interpolated from its 813x1142pt page to A4.
// These should eventually be replaced with a proper design system.

export const PAGE_MARGIN = 49;
export const PAGE_WIDTH = 595.28;
export const PAGE_HEIGHT = 841.89;
export const CONTENT_WIDTH = PAGE_WIDTH - 2 * PAGE_MARGIN;
export const CONTENT_TOP_FOLLOWING_PAGES = 60;

export const COLORS = {
  accent: "#2044AA", // Kern color-action-default
  label: "#51577A", // Kern color-neutral-600
  text: "#131525", // Kern color-neutral-900
  rule: "#C0C3D5", // Kern color-neutral-300
  noticeBackground: "#F3F4F7", // Kern color-neutral-100
} as const;

export const FONT_SIZES = {
  title: 14,
  sectionHeading: 9.5,
  body: 9,
  gewaNumber: 7.5,
  metaLabel: 7,
  metaValue: 8,
  footer: 8,
} as const;

export const LINE_GAP = 2;

export const HEADER = {
  labelBaseline: 53.6,
  valueBaseline: 64.4,
  ruleFromTop: 74.6,
  gemeindekennzahlOffset: 145,
  columnWidth: 140,
  uebermitteltColumnWidth: 150,
} as const;

export const NOTICE = {
  top: 88,
  paddingVertical: 14,
  paddingHorizontal: 18,
  accentBarWidth: 3,
  spaceAfter: 20,
} as const;

export const TITLE = {
  sublineSpace: 6,
  spaceAfter: 8,
} as const;

export const SECTION = {
  spaceBefore: 11,
  underlineOffset: 9,
  underlineWidth: 1.5,
  spaceAfterHeading: 12,
} as const;

export const ROW = {
  gewaNumberWidth: 13.5,
  labelOffset: 22,
  labelWidth: 180,
  valueOffset: 210,
  gap: 3.2,
} as const;
export const ROW_VALUE_WIDTH = CONTENT_WIDTH - ROW.valueOffset;

export const FOOTER = {
  ruleFromBottom: 77,
  baselineFromBottom: 58,
  ruleWidth: 1,
} as const;

export const EMPTY_VALUE = "—";
