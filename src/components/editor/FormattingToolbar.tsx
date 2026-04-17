"use client";

import type { Editor } from "@tiptap/react";

type FormattingToolbarProps = {
  editor: Editor | null;
};

export const FormattingToolbar = ({ editor }: FormattingToolbarProps) => {
  if (!editor) return null;

  const baseButtonClass =
    "rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-indigo-50";

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-indigo-100 bg-indigo-50/60 p-2 text-xs">
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
