"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { A4Canvas } from "@/components/canvas/A4Canvas";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { CellRichTextEditor } from "@/components/editor/CellRichTextEditor";
import { BottomBar } from "@/components/layout/BottomBar";
import { HeaderBar } from "@/components/layout/HeaderBar";
import { LeftPanel } from "@/components/layout/LeftPanel";
import { PreviewMode } from "@/components/preview/PreviewMode";
import { usePrintSheet } from "@/lib/print";
import { supabase } from "@/lib/supabase";
import { useEditorStore } from "@/store/editorStore";
import { TEMPLATE_SCHEMA_VERSION } from "@/types/template";

export default function Home() {
  const [zoom, setZoom] = useState(0.75);
  const [isPreview, setIsPreview] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const printSheetRef = useRef<HTMLDivElement>(null);

  const layout = useEditorStore((state) => state.layout);
  const cells = useEditorStore((state) => state.cells);
  const copySelected = useEditorStore((state) => state.copySelected);
  const pasteToSelected = useEditorStore((state) => state.pasteToSelected);

  const templatePayload = useMemo(
    () => ({
      id: "local-template",
      name: "my-product-label",
      version: TEMPLATE_SCHEMA_VERSION,
      layout,
      cells,
      updatedAt: new Date().toISOString(),
    }),
    [layout, cells],
  );
  const printSheet = usePrintSheet({ contentRef: printSheetRef });

  useEffect(() => {
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem("printlabeler_autosave", JSON.stringify(templatePayload));
    }, 30000);
    return () => window.clearTimeout(timer);
  }, [templatePayload]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") {
        copySelected();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") {
        pasteToSelected();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [copySelected, pasteToSelected]);

  if (isPreview) {
    return <PreviewMode zoom={zoom} onBack={() => setIsPreview(false)} />;
  }

  return (
    <main className="flex h-screen flex-col bg-linear-to-br from-indigo-50 via-slate-50 to-indigo-100">
      <HeaderBar
        onOpenAuth={() => setShowAuth(true)}
        user={user}
        onLogout={() => {
          if (!supabase) return;
          void supabase.auth.signOut();
        }}
      />
      <div className="flex min-h-0 flex-1">
        <LeftPanel />
        <section className="flex min-h-0 flex-1 flex-col p-4">
          <div className="rounded-xl border border-indigo-100 bg-white/90 p-4 shadow-sm backdrop-blur">
            <CellRichTextEditor />
          </div>
          <div ref={printSheetRef} className="print-sheet-root overflow-y-auto">
            <A4Canvas zoom={zoom} />
          </div>
        </section>
      </div>
      <BottomBar zoom={zoom} onZoomChange={setZoom} onPreview={() => setIsPreview(true)} onPrint={printSheet} />
      {showAuth && <AuthDialog onClose={() => setShowAuth(false)} onAuthSuccess={() => setShowAuth(false)} />}
    </main>
  );
}
