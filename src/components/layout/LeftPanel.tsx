"use client";

import { LAYOUT_PRESETS } from "@/lib/layoutPresets";
import { useEditorStore } from "@/store/editorStore";

export const LeftPanel = () => {
  const layout = useEditorStore((state) => state.layout);
  const setLayoutPreset = useEditorStore((state) => state.setLayoutPreset);

  return (
    <aside className="w-80 shrink-0 space-y-4 border-r border-indigo-100 bg-white/95 p-4 shadow-sm">
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-900">Sheet Layout</h2>
        <select
          className="w-full rounded-md border border-indigo-100 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          value={layout.kind === "preset" ? layout.preset.code : ""}
          onChange={(event) => setLayoutPreset(event.target.value)}
        >
          {LAYOUT_PRESETS.map((preset) => (
            <option key={preset.code} value={preset.code}>
              {preset.code} - {preset.labelsPerSheet} labels ({preset.labelWidthMm}x{preset.labelHeightMm}mm)
            </option>
          ))}
        </select>
      </section>

    </aside>
  );
};
