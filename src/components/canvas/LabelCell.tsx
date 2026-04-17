"use client";
import { LINE_HEIGHT_PRESET_VALUES } from "@/types/cell";
import type { LabelCell as LabelCellType } from "@/types/cell";

type LabelCellProps = {
  cell: LabelCellType;
  isSelected: boolean;
  widthPx: number;
  heightPx: number;
  onClick: (rangeModifier: boolean) => void;
};

export const LabelCell = ({ cell, isSelected, widthPx, heightPx, onClick }: LabelCellProps) => {
  return (
    <button
      type="button"
      className={`relative rounded-lg border p-1.5 text-left transition ${isSelected ? "border-indigo-300 bg-indigo-50/70 shadow-[0_0_0_1px_rgba(129,140,248,0.3)]" : "border-slate-200 bg-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] hover:border-indigo-200 hover:bg-slate-50"}`}
      style={{ width: `${widthPx}px`, height: `${heightPx}px` }}
      onClick={(event) => onClick(event.metaKey || event.ctrlKey)}
    >
      <div
        className="label-cell-content h-full overflow-hidden whitespace-pre-wrap wrap-break-word"
        style={{
          fontFamily: cell.formatting.fontFamily,
          fontSize: `${cell.formatting.fontSize}px`,
          lineHeight: LINE_HEIGHT_PRESET_VALUES[cell.formatting.lineHeight],
          fontWeight: cell.formatting.bold ? 700 : 400,
          fontStyle: cell.formatting.italic ? "italic" : "normal",
          textDecoration: cell.formatting.underline ? "underline" : "none",
          textAlign: cell.formatting.align,
          color: cell.formatting.textColor,
        }}
        dangerouslySetInnerHTML={{ __html: cell.richText }}
      />
    </button>
  );
};
