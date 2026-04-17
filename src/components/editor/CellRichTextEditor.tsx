"use client";

import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import { useEditorStore, useSelectedCell } from "@/store/editorStore";
import { LINE_HEIGHT_PRESET_ORDER, LINE_HEIGHT_PRESET_VALUES } from "@/types/cell";

import { FormattingToolbar } from "./FormattingToolbar";

export const CellRichTextEditor = () => {
  const selectedCell = useSelectedCell();
  const selectedCellId = useEditorStore((state) => state.selectedCellIds[0]);
  const updateCellText = useEditorStore((state) => state.updateCellText);
  const updateCellFontSize = useEditorStore((state) => state.updateCellFontSize);
  const updateCellLineHeight = useEditorStore((state) => state.updateCellLineHeight);

  const selectedFontSize = selectedCell?.formatting.fontSize ?? 24;
  const increaseFontSize = () => {
    if (!selectedCellId) return;
    updateCellFontSize(selectedCellId, Math.min(72, selectedFontSize + 1));
  };
  const decreaseFontSize = () => {
    if (!selectedCellId) return;
    updateCellFontSize(selectedCellId, Math.max(8, selectedFontSize - 1));
  };
  const selectedLineHeight = selectedCell?.formatting.lineHeight ?? "normal";
  const toggleLineHeight = () => {
    if (!selectedCellId) return;
    const currentIndex = LINE_HEIGHT_PRESET_ORDER.indexOf(selectedLineHeight);
    const nextIndex = (currentIndex + 1) % LINE_HEIGHT_PRESET_ORDER.length;
    updateCellLineHeight(selectedCellId, LINE_HEIGHT_PRESET_ORDER[nextIndex]);
  };

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, Underline, TextAlign.configure({ types: ["paragraph"] })],
    content: selectedCell?.richText ?? "",
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      const activeCellId = useEditorStore.getState().selectedCellIds[0];
      if (activeCellId) {
        updateCellText(activeCellId, current.getHTML());
      }
    },
  });

  useEffect(() => {
    if (!editor) return;

    const nextValue = selectedCell?.richText ?? "";
    if (editor.getHTML() !== nextValue) {
      // Keep editor view in sync when selection changes without re-triggering onUpdate.
      editor.commands.setContent(nextValue, { emitUpdate: false });
    }
  }, [editor, selectedCellId, selectedCell?.richText]);

  if (!selectedCell) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm text-slate-600">
        Select a label to edit rich text.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_14px_30px_-24px_rgba(15,23,42,0.55)]">
      <FormattingToolbar
        editor={editor}
        fontSize={selectedFontSize}
        onDecreaseFontSize={decreaseFontSize}
        onIncreaseFontSize={increaseFontSize}
        lineHeightPreset={selectedLineHeight}
        onToggleLineHeight={toggleLineHeight}
      />
      <EditorContent
        className="cell-richtext-content min-h-28 bg-white p-3 text-slate-800 outline-none"
        style={{
          fontSize: `${selectedFontSize}px`,
          lineHeight: LINE_HEIGHT_PRESET_VALUES[selectedLineHeight],
        }}
        editor={editor}
      />
    </div>
  );
};
