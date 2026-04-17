"use client";

import type { Editor } from "@tiptap/react";

type FormattingToolbarProps = {
  editor: Editor | null;
};

export const FormattingToolbar = ({ editor }: FormattingToolbarProps) => {
  if (!editor) return null;

  const baseButtonClass =
    "rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-indigo-50";
  const currentFontSize = Number.parseInt((editor.getAttributes("textStyle").fontSize as string | undefined) ?? "14", 10);

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-indigo-100 bg-indigo-50/60 p-2 text-xs">
      <select
        className="rounded-md border border-indigo-200 bg-white px-2 py-1 text-xs text-slate-700"
        onChange={(event) => editor.chain().focus().setMark("textStyle", { fontSize: `${event.target.value}px` }).run()}
        value={Number.isNaN(currentFontSize) ? 14 : currentFontSize}
      >
        {Array.from({ length: 23 }, (_, index) => index + 10).map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <button className={baseButtonClass} onClick={() => editor.chain().focus().toggleBold().run()} type="button">
        Bold
      </button>
      <button className={baseButtonClass} onClick={() => editor.chain().focus().toggleItalic().run()} type="button">
        Italic
      </button>
      <button className={baseButtonClass} onClick={() => editor.chain().focus().toggleUnderline().run()} type="button">
        Underline
      </button>
      <button className={baseButtonClass} onClick={() => editor.chain().focus().setTextAlign("left").run()} type="button">
        Left
      </button>
      <button className={baseButtonClass} onClick={() => editor.chain().focus().setTextAlign("center").run()} type="button">
        Center
      </button>
      <button className={baseButtonClass} onClick={() => editor.chain().focus().setTextAlign("right").run()} type="button">
        Right
      </button>
    </div>
  );
};
