"use client";
import type { LabelCell as LabelCellType } from "@/types/cell";

type LabelCellProps = {
  cell: LabelCellType;
  isSelected: boolean;
  widthPx: number;
  heightPx: number;
  onClick: (multi: boolean) => void;
};

  export const LabelCell = ({ cell, isSelected, widthPx, heightPx, onClick }: LabelCellProps) => {
  return (
    <button
      type="button"
      className={`relative rounded-md border border-slate-200 bg-white p-1.5 text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] transition ${isSelected ? "border-indigo-400 ring-2 ring-indigo-300" : "hover:border-indigo-200"}`}
      style={{ width: `${widthPx}px`, height: `${heightPx}px` }}
      onClick={(event) => onClick(event.shiftKey || event.metaKey || event.ctrlKey)}
    >
      <div
        className="h-full overflow-hidden whitespace-pre-wrap wrap-break-word"
        style={{
          fontFamily: cell.formatting.fontFamily,
          fontSize: `${cell.formatting.fontSizePt}pt`,
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
