"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserPlus,
  ClipboardList,
  FileText,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Agenda",
    href: "/agenda",
    icon: CalendarDays,
  },
  {
    name: "Clientes",
    href: "/clientes",
    icon: Users,
  },
  {
    name: "Novo Cliente",
    href: "/novo-cliente",
    icon: UserPlus,
  },
  {
    name: "Novo Agendamento",
    href: "/novo-agendamento",
    icon: ClipboardList,
  },
  {
    name: "Protocolos",
    href: "/protocolos",
    icon: FileText,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-zinc-900 bg-[#050505] p-6">

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-yellow-400">
          Agenda Bronze
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Sistema premium para studios
        </p>
      </div>

      <nav className="flex flex-col gap-2">

        {menuItems.map((item) => {
          const active = pathname === item.href;

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200
                ${
                  active
                    ? "bg-yellow-400 text-black"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }
              `}
            >
              <Icon size={20} />

              <span className="text-sm font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}

      </nav>

      <div className="mt-auto border-t border-zinc-900 pt-6">

        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-zinc-400 transition-all hover:bg-zinc-900 hover:text-white">

          <LogOut size={20} />

          <span className="text-sm font-medium">
            Sair
          </span>

        </button>

        <p className="mt-6 text-xs text-zinc-600">
          Divino Bronze © 2026
        </p>

      </div>

    </aside>
  );
}