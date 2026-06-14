"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const paginasPublicas = ["/agendar-meu-bronze", "/login"];

  const paginaPublica = paginasPublicas.some((rota) =>
    pathname.startsWith(rota)
  );

  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  if (paginaPublica) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-black">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-80 border-r border-zinc-900 bg-black p-6 lg:block">
        <div className="mb-12">
          <h1 className="text-4xl font-bold leading-tight text-yellow-400">
            Agenda
            <br />
            Bronze
          </h1>

          <p className="mt-4 text-sm text-zinc-500">
            Sistema premium para studios
          </p>
        </div>

        <nav className="space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-4 rounded-2xl bg-yellow-400 px-5 py-4 font-semibold text-black transition hover:bg-yellow-300"
          >
            <span className="text-xl">▦</span>
            Dashboard
          </Link>

          <Link
            href="/dashboard?aba=agenda"
            className="flex items-center gap-4 rounded-2xl px-5 py-4 text-zinc-300 transition hover:bg-[#15100d] hover:text-white"
          >
            <span className="text-xl">▣</span>
            Agenda
          </Link>

          <Link
            href="/dashboard?aba=clientes"
            className="flex items-center gap-4 rounded-2xl px-5 py-4 text-zinc-300 transition hover:bg-[#15100d] hover:text-white"
          >
            <span className="text-xl">◉</span>
            Clientes
          </Link>

          <Link
            href="/dashboard?aba=financeiro"
            className="flex items-center gap-4 rounded-2xl px-5 py-4 text-zinc-300 transition hover:bg-[#15100d] hover:text-white"
          >
            <span className="text-xl">R$</span>
            Financeiro
          </Link>

          <Link
            href="/novo-cliente"
            className="flex items-center gap-4 rounded-2xl px-5 py-4 text-zinc-300 transition hover:bg-[#15100d] hover:text-white"
          >
            <span className="text-xl">＋</span>
            Novo Cliente
          </Link>

          <Link
            href="/novo-agendamento"
            className="flex items-center gap-4 rounded-2xl px-5 py-4 text-zinc-300 transition hover:bg-[#15100d] hover:text-white"
          >
            <span className="text-xl">▤</span>
            Novo Agendamento
          </Link>

          <Link
            href="/protocolos"
            className="flex items-center gap-4 rounded-2xl px-5 py-4 text-zinc-300 transition hover:bg-[#15100d] hover:text-white"
          >
            <span className="text-xl">▧</span>
            Protocolos
          </Link>
        </nav>

        <div className="absolute bottom-8 left-6 right-6 border-t border-zinc-900 pt-8">
          <button
            type="button"
            onClick={sair}
            className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-zinc-300 transition hover:bg-[#15100d] hover:text-white"
          >
            <span className="text-xl">↪</span>
            Sair
          </button>

          <p className="mt-8 text-xs text-zinc-700">Agenda Bronze © 2026</p>
        </div>
      </aside>

      <main className="min-h-screen flex-1 lg:ml-80">{children}</main>
    </div>
  );
}