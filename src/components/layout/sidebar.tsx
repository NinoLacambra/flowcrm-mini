"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Handshake,
  KanbanSquare,
  Activity,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Contacts", href: "/contacts", icon: Users },
  { label: "Deals", href: "/deals", icon: Handshake },
  { label: "Pipeline", href: "/pipeline", icon: KanbanSquare },
  { label: "Activity", href: "/activity", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <div className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 text-zinc-100 lg:hidden">
        <div>
          <h1 className="font-semibold">FlowCRM</h1>
          <p className="text-xs text-zinc-500">Sales workspace</p>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-black/60"
          />

          <aside className="relative flex h-full w-72 flex-col border-r border-zinc-800 bg-zinc-950 p-4 text-zinc-100 shadow-2xl">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold">FlowCRM</h1>
                <p className="text-sm text-zinc-500">
                  Sales workspace
                </p>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-zinc-800 pt-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 p-4 text-zinc-100 lg:flex">
        <div className="mb-8">
          <h1 className="text-xl font-semibold">FlowCRM</h1>
          <p className="text-sm text-zinc-500">
            Sales workspace
          </p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-zinc-800 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}