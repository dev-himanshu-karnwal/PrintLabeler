import { NextResponse } from "next/server";

import { supabaseServer } from "@/lib/supabaseServer";

type SheetLayoutRow = {
  id: string;
  code: string;
  labels_per_sheet: number;
  label_width_mm: number;
  label_height_mm: number;
  rows: number;
  columns: number;
  h_gap_mm: number;
  v_gap_mm: number;
  margin_mm: number;
  created_at: string;
  updated_at: string;
};

type SheetLayoutInput = {
  code: string;
  labelsPerSheet: number;
  labelWidthMm: number;
  labelHeightMm: number;
  rows: number;
  columns: number;
  hGapMm?: number;
  vGapMm?: number;
  marginMm?: number;
};

const mapRow = (row: SheetLayoutRow) => ({
  id: row.id,
  code: row.code,
  labelsPerSheet: row.labels_per_sheet,
  labelWidthMm: row.label_width_mm,
  labelHeightMm: row.label_height_mm,
  rows: row.rows,
  columns: row.columns,
  hGapMm: row.h_gap_mm,
  vGapMm: row.v_gap_mm,
  marginMm: row.margin_mm,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toDb = (input: SheetLayoutInput) => ({
  code: input.code.trim(),
  labels_per_sheet: input.labelsPerSheet,
  label_width_mm: input.labelWidthMm,
  label_height_mm: input.labelHeightMm,
  rows: input.rows,
  columns: input.columns,
  h_gap_mm: input.hGapMm ?? 0,
  v_gap_mm: input.vGapMm ?? 0,
  margin_mm: input.marginMm ?? 0,
});

const validate = (input: SheetLayoutInput): string | null => {
  if (!input.code.trim()) return "Code is required.";
  if (input.labelsPerSheet < 1) return "labelsPerSheet must be at least 1.";
  if (input.rows < 1 || input.columns < 1) return "rows and columns must be at least 1.";
  if (input.labelWidthMm <= 0 || input.labelHeightMm <= 0) return "Label dimensions must be greater than 0.";
  if ((input.hGapMm ?? 0) < 0 || (input.vGapMm ?? 0) < 0 || (input.marginMm ?? 0) < 0) {
    return "Gap and margin values cannot be negative.";
  }
  return null;
};

export async function GET() {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase environment variables are not configured." }, { status: 500 });
  }

  const { data, error } = await supabaseServer
    .from("sheet_layouts")
    .select("*")
    .order("labels_per_sheet", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ layouts: (data as SheetLayoutRow[]).map(mapRow) });
}

export async function POST(request: Request) {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase environment variables are not configured." }, { status: 500 });
  }

  const payload = (await request.json()) as SheetLayoutInput;
  const validationError = validate(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { data, error } = await supabaseServer.from("sheet_layouts").insert(toDb(payload)).select("*").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ layout: mapRow(data as SheetLayoutRow) }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!supabaseServer) {
    return NextResponse.json({ error: "Supabase environment variables are not configured." }, { status: 500 });
  }

  const payload = (await request.json()) as SheetLayoutInput & { id: string };
  if (!payload.id) {
    return NextResponse.json({ error: "id is required for update." }, { status: 400 });
  }

  const validationError = validate(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("sheet_layouts")
    .update(toDb(payload))
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ layout: mapRow(data as SheetLayoutRow) });
}
