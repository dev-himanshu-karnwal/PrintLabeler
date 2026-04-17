"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type LayoutItem = {
  id: string;
  code: string;
  labelsPerSheet: number;
  labelWidthMm: number;
  labelHeightMm: number;
  rows: number;
  columns: number;
  hGapMm: number;
  vGapMm: number;
  marginMmLeft: number;
  marginMmRight: number;
  marginMmTop: number;
  marginMmBottom: number;
  createdAt: string;
  updatedAt: string;
};

type LayoutForm = Omit<LayoutItem, "id" | "createdAt" | "updatedAt">;

const FIELD_META: Record<keyof LayoutForm, { label: string; description: string }> = {
  code: {
    label: "Code",
    description: "Unique name for this layout (example: A4-24).",
  },
  labelsPerSheet: {
    label: "Labels per sheet",
    description: "Total labels printed from one full sheet.",
  },
  labelWidthMm: {
    label: "Label width (mm)",
    description: "Width of a single label in millimeters.",
  },
  labelHeightMm: {
    label: "Label height (mm)",
    description: "Height of a single label in millimeters.",
  },
  rows: {
    label: "Rows",
    description: "How many label rows are on the sheet.",
  },
  columns: {
    label: "Columns",
    description: "How many label columns are on the sheet.",
  },
  hGapMm: {
    label: "Horizontal gap (mm)",
    description: "Space between labels from left to right.",
  },
  vGapMm: {
    label: "Vertical gap (mm)",
    description: "Space between labels from top to bottom.",
  },
  marginMmLeft: {
    label: "Print margin left (mm)",
    description: "Extra space on the left when printing only; not shown on the editor canvas.",
  },
  marginMmRight: {
    label: "Print margin right (mm)",
    description: "Extra space on the right when printing only; not shown on the editor canvas.",
  },
  marginMmTop: {
    label: "Print margin top (mm)",
    description: "Extra space at the top when printing only; not shown on the editor canvas.",
  },
  marginMmBottom: {
    label: "Print margin bottom (mm)",
    description: "Extra space at the bottom when printing only; not shown on the editor canvas.",
  },
};

const EMPTY_FORM: LayoutForm = {
  code: "",
  labelsPerSheet: 1,
  labelWidthMm: 63,
  labelHeightMm: 34,
  rows: 6,
  columns: 4,
  hGapMm: 0,
  vGapMm: 0,
  marginMmLeft: 0,
  marginMmRight: 0,
  marginMmTop: 0,
  marginMmBottom: 0,
};

const FORM_SECTIONS: Array<{ title: string; fields: Array<keyof LayoutForm> }> = [
  { title: "Identity", fields: ["code", "labelsPerSheet"] },
  { title: "Label Size", fields: ["labelWidthMm", "labelHeightMm"] },
  { title: "Grid", fields: ["rows", "columns"] },
  { title: "Spacing", fields: ["hGapMm", "vGapMm"] },
  {
    title: "Print margins (print only)",
    fields: ["marginMmLeft", "marginMmRight", "marginMmTop", "marginMmBottom"],
  },
];

export default function SheetLayoutsPage() {
  const [layouts, setLayouts] = useState<LayoutItem[]>([]);
  const [form, setForm] = useState<LayoutForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const actionLabel = useMemo(() => (editingId ? "Update layout" : "Create layout"), [editingId]);

  const loadLayouts = async () => {
    setIsLoading(true);
    const response = await fetch("/api/sheet-layouts");
    const json = (await response.json()) as { layouts?: LayoutItem[]; error?: string };
    if (!response.ok) {
      setMessage(json.error ?? "Failed to fetch layouts.");
      setIsLoading(false);
      return;
    }
    setLayouts(json.layouts ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    const loadInitialLayouts = async () => {
      const response = await fetch("/api/sheet-layouts");
      const json = (await response.json()) as { layouts?: LayoutItem[]; error?: string };
      if (!response.ok) {
        setMessage(json.error ?? "Failed to fetch layouts.");
        setIsLoading(false);
        return;
      }
      setLayouts(json.layouts ?? []);
      setIsLoading(false);
    };

    void loadInitialLayouts();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const method = editingId ? "PUT" : "POST";
    const payload = editingId ? { ...form, id: editingId } : form;

    const response = await fetch("/api/sheet-layouts", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(json.error ?? "Could not save layout.");
      return;
    }

    const isEditing = Boolean(editingId);
    setMessage(isEditing ? "Layout updated." : "Layout created.");
    if (!isEditing) {
      setForm(EMPTY_FORM);
      setEditingId(null);
    }
    await loadLayouts();
  };

  return (
    <main className="h-screen overflow-hidden bg-linear-to-b from-slate-50 via-indigo-50/40 to-slate-100 px-4 py-4 md:px-8 md:py-5">
      <div className="mx-auto flex h-full max-w-6xl flex-col gap-4">
      <header className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.55)] backdrop-blur-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Admin</p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Sheet Layouts</h1>
            <p className="text-sm text-slate-600">Create, view, and update sheet layouts persisted in Supabase.</p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Back to editor
          </Link>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_320px]">
        <section className="min-h-0 overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/90 px-5 pt-5 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.55)]">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">{actionLabel}</h2>
          <form className="space-y-4" onSubmit={onSubmit}>
            {FORM_SECTIONS.map((section) => (
              <div key={section.title} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">{section.title}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {section.fields.map((field) => {
                    const value = form[field];
                    const meta = FIELD_META[field];
                    const isCodeField = field === "code";
                    return (
                      <label
                        key={field}
                        className={`space-y-1.5 rounded-lg border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-700 ${
                          isCodeField ? "sm:col-span-2 lg:col-span-2" : ""
                        }`}
                      >
                        <span>{meta.label}</span>
                        <p className="text-[11px] font-normal text-slate-500">{meta.description}</p>
                        <input
                          className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                          type={field === "code" ? "text" : "number"}
                          value={value}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              [field]: field === "code" ? event.target.value : Number(event.target.value),
                            }))
                          }
                          required
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="sticky bottom-0 z-10 mt-2 flex flex-wrap items-center gap-2 border-t border-slate-200 bg-white/95 pb-1 pt-2 backdrop-blur-sm">
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                {actionLabel}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  onClick={() => {
                    setEditingId(null);
                    setForm(EMPTY_FORM);
                  }}
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
          {message && <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{message}</p>}
        </section>

        <aside className="min-h-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.55)]">
          <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <h2 className="text-sm font-semibold text-slate-900">Layouts</h2>
            <button
              type="button"
              className="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY_FORM);
              }}
            >
              + Create new
            </button>
          </div>
          <div className="h-[calc(100%-3.25rem)] space-y-2 overflow-y-auto pr-1">
            {isLoading ? (
              <p className="text-sm text-slate-600">Loading layouts...</p>
            ) : layouts.length === 0 ? (
              <p className="text-sm text-slate-600">No layouts found in database.</p>
            ) : (
              layouts.map((layout) => {
                const isActive = editingId === layout.id;
                return (
                  <button
                    key={layout.id}
                    type="button"
                    className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                      isActive
                        ? "border-indigo-300 bg-indigo-50 text-indigo-900 shadow-[0_0_0_1px_rgba(99,102,241,0.25)]"
                        : "border-slate-200 bg-slate-50/70 text-slate-800 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                    onClick={() => {
                      setEditingId(layout.id);
                      setForm({
                        code: layout.code,
                        labelsPerSheet: layout.labelsPerSheet,
                        labelWidthMm: layout.labelWidthMm,
                        labelHeightMm: layout.labelHeightMm,
                        rows: layout.rows,
                        columns: layout.columns,
                        hGapMm: layout.hGapMm,
                        vGapMm: layout.vGapMm,
                        marginMmLeft: layout.marginMmLeft,
                        marginMmRight: layout.marginMmRight,
                        marginMmTop: layout.marginMmTop,
                        marginMmBottom: layout.marginMmBottom,
                      });
                    }}
                  >
                    <p className="text-sm font-semibold">{layout.code}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      {layout.labelsPerSheet} labels • {layout.labelWidthMm}x{layout.labelHeightMm}mm
                    </p>
                    <p className="text-xs text-slate-500">
                      Grid {layout.rows}x{layout.columns} • Gap {layout.hGapMm}/{layout.vGapMm}mm
                    </p>
                    <p className="text-xs text-slate-500">
                      {`Print margins L/R/T/B: ${layout.marginMmLeft ?? 0}/${layout.marginMmRight ?? 0}/${layout.marginMmTop ?? 0}/${layout.marginMmBottom ?? 0} mm`}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </aside>
      </div>
      </div>
    </main>
  );
}
