"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserType } from "@/lib/types";

interface Props {
  user: UserType;
  onLogout: () => void;
}

export default function NavBar({ user, onLogout }: Props) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Queue", icon: "📋" },
    { href: "/history", label: "History", icon: "📜" },
    { href: "/stats", label: "Stats", icon: "📊" },
  ];

  return (
    <header className="bg-surface-light border-b border-surface-lighter sticky top-0 z-30">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🖨️</span>
          <h1 className="font-bold text-lg">PrintQueue</h1>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex gap-1 mr-2">
            {links.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  pathname === href
                    ? "bg-primary text-white"
                    : "text-text-muted hover:bg-surface-lighter"
                }`}
              >
                <span className="sm:hidden">{icon}</span>
                <span className="hidden sm:inline">
                  {icon} {label}
                </span>
              </Link>
            ))}
          </nav>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-lg text-sm hover:bg-surface-lighter transition-colors"
            title="Switch user"
          >
            <span>{user.avatar}</span>
            <span className="hidden sm:inline">{user.name}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
