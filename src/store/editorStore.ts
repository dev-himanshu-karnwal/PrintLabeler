"use client";

import { create } from "zustand";

import type { LabelCell, LabelFormatting } from "@/types/cell";
import type { LayoutPreset, SheetLayout } from "@/types/layout";

const layoutColumns = (layout: SheetLayout): number => {
  const config = layout.kind === "preset" ? layout.preset : layout.custom;
  return config.columns;
};

const cellIdToIndex = (id: string): number => {
  const match = /^cell-(\d+)$/.exec(id);
  return match ? Number(match[1]) : -1;
};

const cellIdsInRectangularRange = (
  fromId: string,
  toId: string,
  columns: number,
  cellCount: number
): string[] => {
  const fromIdx = cellIdToIndex(fromId);
  const toIdx = cellIdToIndex(toId);
  if (fromIdx < 0 || toIdx < 0 || columns <= 0) return [toId];

  const fromRow = Math.floor(fromIdx / columns);
  const fromCol = fromIdx % columns;
  const toRow = Math.floor(toIdx / columns);
  const toCol = toIdx % columns;

  const r0 = Math.min(fromRow, toRow);
  const r1 = Math.max(fromRow, toRow);
  const c0 = Math.min(fromCol, toCol);
  const c1 = Math.max(fromCol, toCol);

  const ids: string[] = [];
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      const idx = r * columns + c;
      if (idx >= 0 && idx < cellCount) ids.push(`cell-${idx}`);
    }
  }
  return ids.length > 0 ? ids : [toId];
};

type EditorStore = {
  layout: SheetLayout;
  cells: LabelCell[];
  selectedCellIds: string[];
  /** Last plain-click cell; Cmd/Ctrl+click extends a rectangle from here. */
  selectionAnchorId: string | null;
  clipboardCell: LabelCell | null;
  selectCell: (id: string, rangeModifier?: boolean) => void;
  setLayoutPreset: (preset: LayoutPreset) => void;
  updateCellText: (id: string, value: string) => void;
  updateCellFontSize: (id: string, value: number) => void;
  updateCellLineHeight: (id: string, value: LabelFormatting["lineHeight"]) => void;
  copySelected: () => void;
  pasteToSelected: () => void;
};

const DEFAULT_FORMATTING: LabelFormatting = {
  fontFamily: "Arial",
  fontSize: 24,
  lineHeight: "normal",
  bold: false,
  italic: false,
  underline: false,
  align: "left",
  textColor: "#000000",
};

const createCells = (layout: SheetLayout): LabelCell[] => {
  const config = layout.kind === "preset" ? layout.preset : layout.custom;
  return Array.from({ length: config.rows * config.columns }, (_, idx) => ({
    id: `cell-${idx}`,
    richText: "",
    formatting: { ...DEFAULT_FORMATTING },
  }));
};

const seedLayout: SheetLayout = {
  kind: "custom",
  custom: {
    rows: 1,
    columns: 1,
    labelWidthMm: 210,
    labelHeightMm: 297,
    hGapMm: 0,
    vGapMm: 0,
    marginMmLeft: 0,
    marginMmRight: 0,
    marginMmTop: 0,
    marginMmBottom: 0,
  },
};

const applyTemplate = (source: LabelCell, target: LabelCell): LabelCell => {
  return {
    ...target,
    richText: source.richText,
    formatting: { ...source.formatting },
  };
};

export const useEditorStore = create<EditorStore>((set) => ({
  layout: seedLayout,
  cells: createCells(seedLayout),
  selectedCellIds: [],
  selectionAnchorId: null,
  clipboardCell: null,

  selectCell: (id, rangeModifier = false) =>
    set((state) => {
      const columns = layoutColumns(state.layout);
      const cellCount = state.cells.length;

      if (!rangeModifier) {
        return {
          selectionAnchorId: id,
          selectedCellIds: [id],
        };
      }

      const anchor =
        state.selectionAnchorId ?? state.selectedCellIds[0] ?? id;
      return {
        selectedCellIds: cellIdsInRectangularRange(anchor, id, columns, cellCount),
      };
    }),

  setLayoutPreset: (preset) =>
    set((state) => {
      const layout: SheetLayout = { kind: "preset", preset };
      return {
        ...state,
        layout,
        cells: createCells(layout),
        selectedCellIds: [],
        selectionAnchorId: null,
      };
    }),

  updateCellText: (id, value) =>
    set((state) => {
      const cells = state.cells.map((cell) => {
        if (cell.id !== id) return cell;
        return { ...cell, richText: value };
      });
      return { ...state, cells };
    }),

  updateCellFontSize: (id, value) =>
    set((state) => {
      const cells = state.cells.map((cell) => {
        if (cell.id !== id) return cell;
        return {
          ...cell,
          formatting: {
            ...cell.formatting,
            fontSize: value,
          },
        };
      });
      return { ...state, cells };
    }),

  updateCellLineHeight: (id, value) =>
    set((state) => {
      const cells = state.cells.map((cell) => {
        if (cell.id !== id) return cell;
        return {
          ...cell,
          formatting: {
            ...cell.formatting,
            lineHeight: value,
          },
        };
      });
      return { ...state, cells };
    }),

  copySelected: () =>
    set((state) => ({
      clipboardCell: state.cells.find((cell) => cell.id === state.selectedCellIds[0]) ?? null,
    })),

  pasteToSelected: () =>
    set((state) => {
      if (!state.clipboardCell || state.selectedCellIds.length === 0) return state;
      const cells = state.cells.map((cell) =>
        state.selectedCellIds.includes(cell.id) ? applyTemplate(state.clipboardCell as LabelCell, cell) : cell,
      );
      return { ...state, cells };
    }),
}));

export const useSelectedCell = (): LabelCell | undefined => {
  const selectedId = useEditorStore((state) => state.selectedCellIds[0]);
  return useEditorStore((state) => state.cells.find((cell) => cell.id === selectedId));
};
