"use client";

import type { Editor } from "@tiptap/react";

type FormattingToolbarProps = {
  editor: Editor | null;
  fontSize: number;
  onDecreaseFontSize: () => void;
  onIncreaseFontSize: () => void;
  lineHeightPreset: string;
  onToggleLineHeight: () => void;
};

export const FormattingToolbar = ({
  editor,
  fontSize,
  onDecreaseFontSize,
  onIncreaseFontSize,
  lineHeightPreset,
  onToggleLineHeight,
}: FormattingToolbarProps) => {
  if (!editor) return null;

  const baseButtonClass =
    "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-100";
  const textButtonClass =
    "inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100";
  const activeButtonClass = "border-indigo-300 bg-indigo-50 text-indigo-700";

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
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 p-2 text-xs">
      <button
        aria-label="Decrease font size"
        className={baseButtonClass}
        onClick={onDecreaseFontSize}
        type="button"
      >
        A-
      </button>
      <span className="text-center text-[11px] font-medium text-slate-600">{fontSize}px</span>
      <button
        aria-label="Increase font size"
        className={baseButtonClass}
        onClick={onIncreaseFontSize}
        type="button"
      >
        A+
      </button>
      <button
        aria-label={`Line height ${lineHeightPreset}. Click to toggle next option.`}
        className={textButtonClass}
        onClick={onToggleLineHeight}
        type="button"
      >
        LH: {lineHeightPreset}
      </button>
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
