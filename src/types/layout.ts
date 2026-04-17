export type LayoutPreset = {
  code: string;
  labelsPerSheet: number;
  labelWidthMm: number;
  labelHeightMm: number;
  rows: number;
  columns: number;
  hGapMm: number;
  vGapMm: number;
  marginMmLeft: number;
  marginMmRight: number;
  marginMmTop: number;
  marginMmBottom: number;
};

export type CustomLayoutInput = {
  rows: number;
  columns: number;
  labelWidthMm: number;
  labelHeightMm: number;
  hGapMm: number;
  vGapMm: number;
  marginMmLeft: number;
  marginMmRight: number;
  marginMmTop: number;
  marginMmBottom: number;
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
