export type HorizontalAlign = "left" | "center" | "right";

export type LabelFormatting = {
  fontFamily: "Arial" | "Helvetica" | "Times New Roman" | "Courier New" | "Roboto";
  fontSizePt: number;
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
