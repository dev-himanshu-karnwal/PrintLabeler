"use client";

type BottomBarProps = {
  onPreview: () => void;
  onPrint: () => void;
};

export const BottomBar = ({ onPreview, onPrint }: BottomBarProps) => {
  return (
    <footer className="flex w-full items-center justify-between gap-2 border-t border-slate-200 bg-slate-50/90 px-4 py-3">
      <div className="flex items-center w-full gap-2 justify-center">
        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          onClick={onPreview}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Preview
        </button>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          onClick={onPrint}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 9V3h10v6" />
            <rect x="5" y="9" width="14" height="8" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 14h10v7H7z" />
          </svg>
          Print
        </button>
      </div>
    </footer>
  );
};
