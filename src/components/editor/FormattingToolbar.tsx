"use client";

import type { Editor } from "@tiptap/react";

type FormattingToolbarProps = {
  editor: Editor | null;
};

export const FormattingToolbar = ({ editor }: FormattingToolbarProps) => {
  if (!editor) return null;

  const baseButtonClass =
    "flex h-8 w-8 items-center justify-center rounded-md border border-indigo-200 bg-white text-slate-700 transition hover:bg-indigo-50";
  const activeButtonClass = "border-indigo-400 bg-indigo-100 text-indigo-700";

  const currentAlignment = editor.isActive({ textAlign: "center" })
    ? "center"
    : editor.isActive({ textAlign: "right" })
      ? "right"
      : "left";

  const nextAlignment = currentAlignment === "left" ? "center" : currentAlignment === "center" ? "right" : "left";

  const alignmentIcon =
    currentAlignment === "left" ? (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4 6h16M4 10h10M4 14h16M4 18h10" strokeLinecap="round" />
      </svg>
    ) : currentAlignment === "center" ? (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4 6h16M7 10h10M4 14h16M7 18h10" strokeLinecap="round" />
      </svg>
    ) : (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4 6h16M10 10h10M4 14h16M10 18h10" strokeLinecap="round" />
      </svg>
    );

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-indigo-100 bg-indigo-50/60 p-2 text-xs">
      <button
        aria-label="Toggle bold"
        className={`${baseButtonClass} ${editor.isActive("bold") ? activeButtonClass : ""}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        type="button"
      >
        <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M8 5h6a3 3 0 0 1 0 6H8zm0 6h7a3 3 0 1 1 0 6H8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        aria-label="Toggle italic"
        className={`${baseButtonClass} ${editor.isActive("italic") ? activeButtonClass : ""}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        type="button"
      >
        <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M14 5h-4m4 14h-4m2-14-2 14" strokeLinecap="round" />
        </svg>
      </button>
      <button
        aria-label="Toggle underline"
        className={`${baseButtonClass} ${editor.isActive("underline") ? activeButtonClass : ""}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        type="button"
      >
        <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M8 5v5a4 4 0 1 0 8 0V5M6 19h12" strokeLinecap="round" />
        </svg>
      </button>
      <button
        aria-label={`Alignment ${currentAlignment}. Click to set ${nextAlignment}.`}
        className={`${baseButtonClass} ${currentAlignment !== "left" ? activeButtonClass : ""}`}
        onClick={() => editor.chain().focus().setTextAlign(nextAlignment).run()}
        type="button"
      >
        {alignmentIcon}
      </button>
    </div>
  );
};
