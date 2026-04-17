"use client";

import { A4Canvas } from "@/components/canvas/A4Canvas";

type PreviewModeProps = {
  zoom: number;
  onBack: () => void;
};

export const PreviewMode = ({ zoom, onBack }: PreviewModeProps) => {
  return (
    <div className="flex h-screen flex-col bg-linear-to-b from-slate-50 via-indigo-50/40 to-slate-100">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white/85 px-4 py-3 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
        <button
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          onClick={onBack}
        >
          Back to editor
        </button>
      </div>
      <A4Canvas zoom={zoom} />
    </div>
  );
};
