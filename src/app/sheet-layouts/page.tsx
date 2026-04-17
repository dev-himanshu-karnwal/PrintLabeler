"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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
  marginMm: number;
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
  marginMm: {
    label: "Margin (mm)",
    description: "Outer page margin around all labels.",
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
  marginMm: 0,
};

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
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Sheet Layouts</h1>
        <p className="text-sm text-slate-600">Create, view, and update sheet layouts persisted in Supabase.</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">{actionLabel}</h2>
        <form className="grid grid-cols-2 gap-3 md:grid-cols-5" onSubmit={onSubmit}>
          {Object.entries(form).map(([key, value]) => {
            const field = key as keyof LayoutForm;
            const meta = FIELD_META[field];
            return (
            <label key={key} className="space-y-1 text-xs font-medium text-slate-700">
              <span>{meta.label}</span>
              <p className="text-[11px] font-normal text-slate-500">{meta.description}</p>
              <input
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                type={key === "code" ? "text" : "number"}
                value={value}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [key]: key === "code" ? event.target.value : Number(event.target.value),
                  }))
                }
                required
              />
            </label>
          )})}
          <div className="col-span-2 flex items-end gap-2 md:col-span-5">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              {actionLabel}
            </button>
            {editingId && (
              <button
                type="button"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
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
        {message && <p className="mt-3 text-sm text-slate-700">{message}</p>}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">All layouts</h2>
        {isLoading ? (
          <p className="text-sm text-slate-600">Loading layouts...</p>
        ) : layouts.length === 0 ? (
          <p className="text-sm text-slate-600">No layouts found in database.</p>
        ) : (
          <div className="space-y-2">
            {layouts.map((layout) => (
              <article
                key={layout.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
              >
                <p className="text-sm text-slate-800">
                  {layout.code}: {layout.labelsPerSheet} labels ({layout.labelWidthMm}x{layout.labelHeightMm}mm),{" "}
                  {layout.rows}x{layout.columns}
                </p>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs"
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
                      marginMm: layout.marginMm,
                    });
                  }}
                >
                  Edit
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
