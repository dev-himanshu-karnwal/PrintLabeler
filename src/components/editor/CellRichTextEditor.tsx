"use client";

import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import { useEditorStore, useSelectedCell } from "@/store/editorStore";

import { FormattingToolbar } from "./FormattingToolbar";

export const CellRichTextEditor = () => {
  const selectedCell = useSelectedCell();
  const selectedCellId = useEditorStore((state) => state.selectedCellIds[0]);
  const updateCellText = useEditorStore((state) => state.updateCellText);
  const updateCellFontSize = useEditorStore((state) => state.updateCellFontSize);

  const selectedFontSize = selectedCell?.formatting.fontSize ?? 24;
  const increaseFontSize = () => {
    if (!selectedCellId) return;
    updateCellFontSize(selectedCellId, Math.min(72, selectedFontSize + 1));
  };
  const decreaseFontSize = () => {
    if (!selectedCellId) return;
    updateCellFontSize(selectedCellId, Math.max(8, selectedFontSize - 1));
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

  useEffect(() => {
    if (!editor || !selectedCellId) return;

    // Move focus into the rich-text editor whenever a cell is selected.
    editor.commands.focus("end");
  }, [editor, selectedCellId]);

  if (!selectedCell) {
    return (
      <div className="rounded-md border border-dashed border-indigo-200 bg-indigo-50/50 p-4 text-sm text-indigo-700">
        Select a label to edit rich text.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-indigo-100 bg-white shadow-sm">
      <FormattingToolbar
        editor={editor}
        fontSize={selectedFontSize}
        onDecreaseFontSize={decreaseFontSize}
        onIncreaseFontSize={increaseFontSize}
      />
      <EditorContent
        className="cell-richtext-content min-h-28 p-3 text-slate-800 outline-none"
        style={{ fontSize: `${selectedFontSize}px`, lineHeight: 1 }}
        editor={editor}
      />
    </div>
  );
};
