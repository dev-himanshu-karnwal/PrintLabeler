export type PresetLayoutCode =
  | "01F"
  | "01"
  | "02"
  | "04"
  | "06"
  | "08"
  | "12"
  | "16"
  | "21"
  | "24"
  | "30"
  | "48"
  | "56"
  | "65"
  | "84";

export type LayoutPreset = {
  code: PresetLayoutCode;
  labelsPerSheet: number;
  labelWidthMm: number;
  labelHeightMm: number;
  rows: number;
  columns: number;
  hGapMm: number;
  vGapMm: number;
  marginMm: number;
};

export type CustomLayoutInput = {
  rows: number;
  columns: number;
  labelWidthMm: number;
  labelHeightMm: number;
  hGapMm: number;
  vGapMm: number;
  marginMm: number;
};

export type SheetLayout =
  | {
      kind: "preset";
      preset: LayoutPreset;
    }
  | {
      kind: "custom";
      custom: CustomLayoutInput;
    };
