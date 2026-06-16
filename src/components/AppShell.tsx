"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

const ROTAS_COM_MENU = [
  "/dashboard",
  "/agenda",
  "/clientes",
  "/novo-cliente",
  "/novo-agendamento",
  "/editar-agendamento",
  "/novo-protocolo",
  "/protocolos",
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const abaAtual = searchParams.get("aba") || "agenda";

  const mostrarMenu = ROTAS_COM_MENU.some(
    (rota) => pathname === rota || pathname.startsWith(`${rota}/`)
  );

  async function sair() {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } finally {
      window.location.href = "/login";
    }
  }

  if (!mostrarMenu) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-black">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-80 border-r border-zinc-900 bg-black p-6 lg:block">
        <div className="mb-12">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="text-left"
          >
            <h1 className="text-4xl font-bold leading-tight text-yellow-400">
              Agenda
              <br />
              Bronze
            </h1>
          </button>

          <p className="mt-4 text-sm text-zinc-500">
            Sistema premium para studios
          </p>
        </div>

        <nav className="space-y-3">
          <MenuLink
            href="/dashboard"
            ativo={pathname === "/dashboard" && abaAtual === "agenda"}
          >
            <span className="text-xl">▦</span>
            Dashboard
          </MenuLink>

          <MenuLink
            href="/dashboard?aba=agenda"
            ativo={pathname === "/dashboard" && abaAtual === "agenda"}
          >
            <span className="text-xl">▣</span>
            Agenda
          </MenuLink>

          <MenuLink
            href="/dashboard?aba=clientes"
            ativo={pathname === "/dashboard" && abaAtual === "clientes"}
          >
            <span className="text-xl">◉</span>
            Clientes
          </MenuLink>

          <MenuLink
            href="/dashboard?aba=financeiro"
            ativo={pathname === "/dashboard" && abaAtual === "financeiro"}
          >
            <span className="text-xl">R$</span>
            Financeiro
          </MenuLink>

          <MenuLink href="/dashboard?acao=novo-cliente" ativo={false}>
            <span className="text-xl">＋</span>
            Novo Cliente
          </MenuLink>

          <MenuLink href="/dashboard?acao=novo-agendamento" ativo={false}>
            <span className="text-xl">▤</span>
            Novo Agendamento
          </MenuLink>

          <MenuLink
            href="/dashboard?aba=protocolos"
            ativo={pathname === "/dashboard" && abaAtual === "protocolos"}
          >
            <span className="text-xl">▧</span>
            Protocolos
          </MenuLink>
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

function MenuLink({
  href,
  ativo,
  children,
}: {
  href: string;
  ativo: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        ativo
          ? "flex items-center gap-4 rounded-2xl bg-yellow-400 px-5 py-4 font-semibold text-black transition hover:bg-yellow-300"
          : "flex items-center gap-4 rounded-2xl px-5 py-4 text-zinc-300 transition hover:bg-[#15100d] hover:text-white"
      }
    >
      {children}
    </Link>
  );
}