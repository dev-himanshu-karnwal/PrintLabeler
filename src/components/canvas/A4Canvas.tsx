"use client";

import { mmToPx } from "@/lib/units";
import { useEditorStore } from "@/store/editorStore";

import { LabelCell } from "./LabelCell";

type A4CanvasProps = {
  zoom: number;
};

export const A4Canvas = ({ zoom }: A4CanvasProps) => {
  const layout = useEditorStore((state) => state.layout);
  const cells = useEditorStore((state) => state.cells);
  const selectedCellIds = useEditorStore((state) => state.selectedCellIds);
  const selectCell = useEditorStore((state) => state.selectCell);

  const cfg = layout.kind === "preset" ? layout.preset : layout.custom;
  const widthPx = mmToPx(210) * zoom;
  const heightPx = mmToPx(297) * zoom;
  const labelWidthPx = mmToPx(cfg.labelWidthMm) * zoom;
  const labelHeightPx = mmToPx(cfg.labelHeightMm) * zoom;
  const hGapPx = mmToPx(cfg.hGapMm) * zoom;
  const vGapPx = mmToPx(cfg.vGapMm) * zoom;

  return (
    <div className="min-h-0 flex-1 overflow-auto py-4">
      <div
        className="mx-auto overflow-hidden rounded-xl border border-indigo-100 bg-white p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.45)]"
        style={{ width: widthPx, height: heightPx }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cfg.columns}, ${labelWidthPx}px)`,
            gridAutoRows: `${labelHeightPx}px`,
            gap: `${vGapPx}px ${hGapPx}px`,
          }}
        >
          {cells.map((cell) => (
            <LabelCell
              key={cell.id}
              cell={cell}
              isSelected={selectedCellIds.includes(cell.id)}
              widthPx={labelWidthPx}
              heightPx={labelHeightPx}
              onClick={(multi) => selectCell(cell.id, multi)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
