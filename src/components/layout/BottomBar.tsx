"use client";

type BottomBarProps = {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onPreview: () => void;
  onPrint: () => void;
};

export const BottomBar = ({ zoom, onZoomChange, onPreview, onPrint }: BottomBarProps) => {
  return (
    <footer className="flex items-center justify-between border-t border-indigo-100 bg-white/95 px-4 py-2.5 shadow-[0_-1px_0_0_rgba(99,102,241,0.06)] backdrop-blur">
      <div className="flex items-center gap-2">
        {[0.5, 0.75, 1].map((value) => (
          <button
            key={value}
            className={`rounded-md border px-2.5 py-1.5 text-sm font-medium transition ${
              zoom === value
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-indigo-200 bg-white text-slate-700 hover:bg-indigo-50"
            }`}
            onClick={() => onZoomChange(value)}
          >
            {Math.round(value * 100)}%
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-md border border-indigo-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50"
          onClick={onPreview}
        >
          Preview
        </button>
        <button
          className="rounded-md border border-indigo-600 bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          onClick={onPrint}
        >
          Print
        </button>
      </div>
    </footer>
  );
};
