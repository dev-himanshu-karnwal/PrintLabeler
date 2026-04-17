"use client";

import { useEffect, useState } from "react";

import { CellRichTextEditor } from "@/components/editor/CellRichTextEditor";
import { useEditorStore } from "@/store/editorStore";
import type { LayoutPreset } from "@/types/layout";
import { BottomBar } from "./BottomBar";

type LayoutApiItem = LayoutPreset & { id: string };

type LeftPanelProps = {
  onPrint: () => void;
};

export const LeftPanel = ({ onPrint }: LeftPanelProps) => {
  const layout = useEditorStore((state) => state.layout);
  const setLayoutPreset = useEditorStore((state) => state.setLayoutPreset);
  const [layouts, setLayouts] = useState<LayoutApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadLayouts = async () => {
      setIsLoading(true);
      const response = await fetch("/api/sheet-layouts");
      const json = (await response.json()) as { layouts?: LayoutApiItem[] };

      if (ignore) return;
      const dbLayouts = json.layouts ?? [];
      setLayouts(dbLayouts);

      if (dbLayouts.length > 0 && layout.kind !== "preset") {
        setLayoutPreset(dbLayouts[0]);
      }
      setIsLoading(false);
    };

    void loadLayouts();
    return () => {
      ignore = true;
    };
  }, [layout.kind, setLayoutPreset]);

  const selectedCode = layout.kind === "preset" ? layout.preset.code : "";

  return (
    <aside className="flex h-full w-120 shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.55)]">
      <div className="space-y-4 p-4">
        <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <h2 className="text-sm font-semibold text-slate-900">Sheet Layout</h2>
        <select
          className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          value={selectedCode}
          onChange={(event) => {
            const selected = layouts.find((item) => item.code === event.target.value);
            if (!selected) return;
            setLayoutPreset(selected);
          }}
          disabled={isLoading || layouts.length === 0}
        >
          {layouts.map((preset) => (
            <option key={preset.code} value={preset.code}>
              {preset.code} - {preset.labelsPerSheet} labels ({preset.labelWidthMm}x{preset.labelHeightMm}mm)
            </option>
          ))}
        </select>
        {layouts.length === 0 && !isLoading && (
          <p className="text-xs text-slate-500">No layouts in DB yet. Add one in the Sheet Layouts page.</p>
        )}
        </section>

        <CellRichTextEditor />
      </div>
      <div className="mt-auto border-t border-slate-200">
        <BottomBar onPrint={onPrint} />
      </div>
    </aside>
  );
};
