import type { CustomLayoutInput } from "@/types/layout";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export type LayoutValidationResult = {
  isValid: boolean;
  errors: Partial<Record<keyof CustomLayoutInput, string>>;
  warnings: string[];
};

export const validateCustomLayout = (input: CustomLayoutInput): LayoutValidationResult => {
  const errors: LayoutValidationResult["errors"] = {};
  const warnings: string[] = [];

  const widthUsedMm =
    input.columns * input.labelWidthMm + Math.max(0, input.columns - 1) * input.hGapMm;
  const heightUsedMm =
    input.rows * input.labelHeightMm + Math.max(0, input.rows - 1) * input.vGapMm;

  if (widthUsedMm > A4_WIDTH_MM) {
    errors.columns = "Layout exceeds A4 width (210mm).";
  }
  if (heightUsedMm > A4_HEIGHT_MM) {
    errors.rows = "Layout exceeds A4 height (297mm).";
  }

  if (input.labelHeightMm < 10 || input.labelWidthMm < 20) {
    warnings.push("Labels this small may not be readable.");
  }

  if (input.rows < 1) errors.rows = "Rows must be at least 1.";
  if (input.columns < 1) errors.columns = "Columns must be at least 1.";
  if (input.labelWidthMm <= 0) errors.labelWidthMm = "Label width must be greater than 0.";
  if (input.labelHeightMm <= 0) errors.labelHeightMm = "Label height must be greater than 0.";
  if (input.hGapMm < 0) errors.hGapMm = "Horizontal gap cannot be negative.";
  if (input.vGapMm < 0) errors.vGapMm = "Vertical gap cannot be negative.";
  if (input.marginMmLeft < 0) errors.marginMmLeft = "Left margin cannot be negative.";
  if (input.marginMmRight < 0) errors.marginMmRight = "Right margin cannot be negative.";
  if (input.marginMmTop < 0) errors.marginMmTop = "Top margin cannot be negative.";
  if (input.marginMmBottom < 0) errors.marginMmBottom = "Bottom margin cannot be negative.";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
};
