"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

type AuthDialogProps = {
  onClose: () => void;
  onAuthSuccess?: () => void;
};

export const AuthDialog = ({ onClose, onAuthSuccess }: AuthDialogProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const signIn = async () => {
    if (!supabase) {
      setStatus("Supabase env vars are missing.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus(error.message);
      return;
    }
    setStatus("Signed in.");
    onAuthSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/35 px-4">
      <div className="w-full max-w-sm rounded-xl border border-indigo-100 bg-white p-5 shadow-xl">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Login</h2>
        <div className="space-y-2">
          <input
            className="w-full rounded-md border border-indigo-100 px-2.5 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
          />
          <input
            className="w-full rounded-md border border-indigo-100 px-2.5 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
          <div className="flex justify-end gap-2">
            <button
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="rounded-md border border-indigo-600 bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500"
              onClick={signIn}
            >
              Sign in
            </button>
          </div>
          {status && <p className="text-xs text-slate-600">{status}</p>}
        </div>
      </div>
    </div>
  );
};
