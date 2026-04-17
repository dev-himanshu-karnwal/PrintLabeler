"use client";

import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { useEditorStore, useSelectedCell } from "@/store/editorStore";

import { FontSize } from "./FontSize";
import { FormattingToolbar } from "./FormattingToolbar";

export const CellRichTextEditor = () => {
  const selectedCell = useSelectedCell();
  const updateCellText = useEditorStore((state) => state.updateCellText);

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, Underline, FontFamily, FontSize, TextAlign.configure({ types: ["paragraph"] })],
    content: selectedCell?.richText ?? "",
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      if (selectedCell) {
        updateCellText(selectedCell.id, current.getHTML());
      }
    },
  });

  if (!selectedCell) {
    return (
      <div className="rounded-md border border-dashed border-indigo-200 bg-indigo-50/50 p-4 text-sm text-indigo-700">
        Select a label to edit rich text.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-indigo-100 bg-white shadow-sm">
      <FormattingToolbar editor={editor} />
      <EditorContent className="min-h-28 p-3 text-sm text-slate-800 outline-none" editor={editor} />
    </div>
  );
};
