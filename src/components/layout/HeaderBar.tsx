"use client";

import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";

type HeaderBarProps = {
  onOpenAuth: () => void;
  user: User | null;
  onLogout: () => void;
};

export const HeaderBar = ({ onOpenAuth, user, onLogout }: HeaderBarProps) => {
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? (user?.user_metadata?.name as string | undefined) ?? user?.email ?? "User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <header className="rounded-2xl border border-slate-200/80 flex items-center justify-between bg-white/85 px-2 py-1">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">PL</div>
        <div>
          <p className="text-base font-semibold tracking-tight text-slate-900">PrintLabeler</p>
          <p className="text-xs text-slate-500">Design and print product labels</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/sheet-layouts"
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Sheet Layouts
        </Link>
        {user ? (
          <>
            <div className="flex items-center gap-2 rounded-xl px-2.5">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={displayName} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-xs font-semibold text-white">{initials || "U"}</div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{displayName}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <button
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            onClick={onOpenAuth}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};
