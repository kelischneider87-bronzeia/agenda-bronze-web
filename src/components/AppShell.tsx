"use client";

import { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

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

  const abaAtual = searchParams.get("aba") || "agenda";
  const acaoAtual = searchParams.get("acao") || "";

  const mostrarMenu = ROTAS_COM_MENU.some(
    (rota) => pathname === rota || pathname.startsWith(`${rota}/`)
  );

  function irPara(url: string) {
    window.location.href = url;
  }

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
            onClick={() => irPara("/dashboard?aba=agenda")}
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
          <MenuButton
            ativo={
              pathname === "/dashboard" &&
              abaAtual === "agenda" &&
              !acaoAtual
            }
            onClick={() => irPara("/dashboard?aba=agenda")}
          >
            <span className="text-xl">▦</span>
            Dashboard
          </MenuButton>

          <MenuButton
            ativo={
              pathname === "/dashboard" &&
              abaAtual === "agenda" &&
              !acaoAtual
            }
            onClick={() => irPara("/dashboard?aba=agenda")}
          >
            <span className="text-xl">▣</span>
            Agenda
          </MenuButton>

          <MenuButton
            ativo={pathname === "/dashboard" && abaAtual === "clientes"}
            onClick={() => irPara("/dashboard?aba=clientes")}
          >
            <span className="text-xl">◉</span>
            Clientes
          </MenuButton>

          <MenuButton
            ativo={pathname === "/dashboard" && abaAtual === "financeiro"}
            onClick={() => irPara("/dashboard?aba=financeiro")}
          >
            <span className="text-xl">R$</span>
            Financeiro
          </MenuButton>

          <MenuButton
            ativo={pathname === "/dashboard" && abaAtual === "empresa"}
            onClick={() => irPara("/dashboard?aba=empresa")}
          >
            <span className="text-xl">✦</span>
            Empresa
          </MenuButton>

          <div className="my-6 border-t border-zinc-900" />

          <MenuButton
            ativo={acaoAtual === "novo-cliente"}
            onClick={() => irPara("/dashboard?aba=clientes&acao=novo-cliente")}
          >
            <span className="text-xl">＋</span>
            Novo Cliente
          </MenuButton>

          <MenuButton
            ativo={acaoAtual === "novo-agendamento"}
            onClick={() =>
              irPara("/dashboard?aba=agenda&acao=novo-agendamento")
            }
          >
            <span className="text-xl">▤</span>
            Novo Agendamento
          </MenuButton>

          <MenuButton
            ativo={pathname === "/dashboard" && abaAtual === "protocolos"}
            onClick={() => irPara("/dashboard?aba=protocolos")}
          >
            <span className="text-xl">▧</span>
            Protocolos
          </MenuButton>
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

function MenuButton({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        ativo
          ? "flex w-full items-center gap-4 rounded-2xl bg-yellow-400 px-5 py-4 text-left font-semibold text-black transition hover:bg-yellow-300"
          : "flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-zinc-300 transition hover:bg-[#15100d] hover:text-white"
      }
    >
      {children}
    </button>
  );
}