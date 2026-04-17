import type { LayoutPreset } from "@/types/layout";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

const deriveGrid = (
  labelsPerSheet: number,
  labelWidthMm: number,
  labelHeightMm: number,
): { rows: number; columns: number } => {
  const candidates: Array<{ rows: number; columns: number; areaScore: number; ratioScore: number }> = [];
  const targetRatio = A4_HEIGHT_MM / A4_WIDTH_MM;

  for (let columns = 1; columns <= labelsPerSheet; columns += 1) {
    if (labelsPerSheet % columns !== 0) continue;
    const rows = labelsPerSheet / columns;
    const usedWidth = columns * labelWidthMm;
    const usedHeight = rows * labelHeightMm;
    if (usedWidth > A4_WIDTH_MM || usedHeight > A4_HEIGHT_MM) continue;

    const areaScore = usedWidth * usedHeight;
    const ratioScore = Math.abs(usedHeight / usedWidth - targetRatio);
    candidates.push({ rows, columns, areaScore, ratioScore });
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => {
      if (b.areaScore !== a.areaScore) return b.areaScore - a.areaScore;
      if (a.ratioScore !== b.ratioScore) return a.ratioScore - b.ratioScore;
      return b.columns - a.columns;
    });
    const best = candidates[0];
    return { rows: best.rows, columns: best.columns };
  }

  // Fallback for unusual dimensions: keep all labels in a single row.
  return { rows: 1, columns: labelsPerSheet };
};

const preset = (
  code: LayoutPreset["code"],
  labelsPerSheet: number,
  labelWidthMm: number,
  labelHeightMm: number,
): LayoutPreset => {
  const { rows, columns } = deriveGrid(labelsPerSheet, labelWidthMm, labelHeightMm);
  return {
    code,
    labelsPerSheet,
    labelWidthMm,
    labelHeightMm,
    rows,
    columns,
    hGapMm: 0,
    vGapMm: 0,
    marginMm: 0,
  };
};

export const LAYOUT_PRESETS: LayoutPreset[] = [
  preset("01F", 1, 210, 297),
  preset("01", 1, 210, 290),
  preset("02", 2, 199, 145),
  preset("04", 4, 99, 146),
  preset("06", 6, 100, 94),
  preset("08", 8, 100, 72),
  preset("12", 12, 99, 45),
  preset("16", 16, 100, 35),
  preset("21", 21, 64, 38),
  preset("24", 24, 63, 34),
  preset("30", 30, 67, 27),
  preset("48", 48, 49, 24),
  preset("56", 56, 48, 19),
  preset("65", 65, 39, 21),
  preset("84", 84, 45, 11),
];
