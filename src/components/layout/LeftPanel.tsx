"use client";

import { useEffect, useState } from "react";

import { useEditorStore } from "@/store/editorStore";
import type { LayoutPreset } from "@/types/layout";

type LayoutApiItem = LayoutPreset & { id: string };

export const LeftPanel = () => {
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
    <aside className="w-80 shrink-0 space-y-4 border-r border-indigo-100 bg-white/95 p-4 shadow-sm">
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-900">Sheet Layout</h2>
        <select
          className="w-full rounded-md border border-indigo-100 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
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

    </aside>
  );
};
