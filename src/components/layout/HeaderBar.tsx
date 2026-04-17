"use client";

import type { User } from "@supabase/supabase-js";
import Image from "next/image";

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
    <header className="flex items-center justify-between border-b border-indigo-100 bg-white/95 px-5 py-3 shadow-sm backdrop-blur">
      <div className="text-lg font-semibold tracking-tight text-slate-900">PrintLabeler</div>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1">
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
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            onClick={onOpenAuth}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};
