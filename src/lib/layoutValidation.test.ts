import { describe, expect, it } from "vitest";

import { validateCustomLayout } from "@/lib/layoutValidation";

describe("validateCustomLayout", () => {
  it("accepts valid dimensions", () => {
    const result = validateCustomLayout({
      rows: 4,
      columns: 4,
      labelWidthMm: 40,
      labelHeightMm: 50,
      hGapMm: 2,
      vGapMm: 2,
      marginMm: 5,
    });
    expect(result.isValid).toBe(true);
  });

  it("fails when layout exceeds A4 width", () => {
    const result = validateCustomLayout({
      rows: 2,
      columns: 5,
      labelWidthMm: 50,
      labelHeightMm: 60,
      hGapMm: 2,
      vGapMm: 2,
      marginMm: 5,
    });
    expect(result.isValid).toBe(false);
  });
});
