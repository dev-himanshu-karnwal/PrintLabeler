"use client";

import { create } from "zustand";

import type { LabelCell, LabelFormatting } from "@/types/cell";
import type { LayoutPreset, SheetLayout } from "@/types/layout";

type EditorStore = {
  layout: SheetLayout;
  cells: LabelCell[];
  selectedCellIds: string[];
  clipboardCell: LabelCell | null;
  selectCell: (id: string, multi?: boolean) => void;
  setLayoutPreset: (preset: LayoutPreset) => void;
  updateCellText: (id: string, value: string) => void;
  copySelected: () => void;
  pasteToSelected: () => void;
};

const DEFAULT_FORMATTING: LabelFormatting = {
  fontFamily: "Arial",
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
    marginMm: 0,
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
  clipboardCell: null,

  selectCell: (id, multi = false) =>
    set((state) => ({
      selectedCellIds: multi ? [...new Set([...state.selectedCellIds, id])] : [id],
    })),

  setLayoutPreset: (preset) =>
    set((state) => {
      const layout: SheetLayout = { kind: "preset", preset };
      return { ...state, layout, cells: createCells(layout), selectedCellIds: [] };
    }),

  updateCellText: (id, value) =>
    set((state) => {
      const cells = state.cells.map((cell) => {
        if (cell.id !== id) return cell;
        return { ...cell, richText: value };
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
