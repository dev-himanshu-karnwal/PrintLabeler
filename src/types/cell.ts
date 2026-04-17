export type HorizontalAlign = "left" | "center" | "right";
export type LineHeightPreset = "tight" | "tighter" | "normal" | "relaxed" | "loose";

export const LINE_HEIGHT_PRESET_ORDER: LineHeightPreset[] = ["tight", "tighter", "normal", "relaxed", "loose"];
export const LINE_HEIGHT_PRESET_VALUES: Record<LineHeightPreset, number> = {
  tight: 1,
  tighter: 1.15,
  normal: 1.3,
  relaxed: 1.5,
  loose: 1.8,
};

export type LabelFormatting = {
  fontFamily: "Arial" | "Helvetica" | "Times New Roman" | "Courier New" | "Roboto";
  fontSize: number;
  lineHeight: LineHeightPreset;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: HorizontalAlign;
  textColor: string;
};

export type LabelCell = {
  id: string;
  richText: string;
  formatting: LabelFormatting;
};
