"use client";

import { A4Canvas } from "@/components/canvas/A4Canvas";

type PreviewModeProps = {
  zoom: number;
  onBack: () => void;
};

export const PreviewMode = ({ zoom, onBack }: PreviewModeProps) => {
  return (
    <div className="flex h-screen flex-col bg-linear-to-br from-indigo-50 via-slate-50 to-indigo-100">
      <div className="flex items-center justify-between border-b border-indigo-100 bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur">
        <button
          className="rounded-md border border-indigo-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50"
          onClick={onBack}
        >
          Back to editor
        </button>
      </div>
      <A4Canvas zoom={zoom} />
    </div>
  );
};
