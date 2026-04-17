"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { A4Canvas } from "@/components/canvas/A4Canvas";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { HeaderBar } from "@/components/layout/HeaderBar";
import { LeftPanel } from "@/components/layout/LeftPanel";
import { PreviewMode } from "@/components/preview/PreviewMode";
import { usePrintSheet } from "@/lib/print";
import { supabase } from "@/lib/supabase";
import { useEditorStore } from "@/store/editorStore";
import { TEMPLATE_SCHEMA_VERSION } from "@/types/template";

export default function Home() {
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
    [layout, cells]
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
      localStorage.setItem(
        "printlabeler_autosave",
        JSON.stringify(templatePayload)
      );
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
    return <PreviewMode zoom={1} onBack={() => setIsPreview(false)} />;
  }

  return (
    <main className="flex h-screen flex-col bg-linear-to-b from-slate-50 via-indigo-50/40 to-slate-100 text-slate-900">
      <div className="px-4 py-3">
        <HeaderBar
          onOpenAuth={() => setShowAuth(true)}
          user={user}
          onLogout={() => {
            if (!supabase) return;
            void supabase.auth.signOut();
          }}
        />
      </div>
      <div className="flex min-h-0 flex-1 px-4 pb-4">
        <LeftPanel onPreview={() => setIsPreview(true)} onPrint={printSheet} />
        <section className="ml-4 flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            ref={printSheetRef}
            className="print-sheet-root h-full overflow-y-auto rounded-xl"
          >
            <A4Canvas zoom={1} />
          </div>
        </section>
      </div>
      {showAuth && (
        <AuthDialog
          onClose={() => setShowAuth(false)}
          onAuthSuccess={() => setShowAuth(false)}
        />
      )}
    </main>
  );
}
