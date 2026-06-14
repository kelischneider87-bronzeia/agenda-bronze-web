"use client";

import { X } from "lucide-react";

interface Props {
  aberto: boolean;
  fechar: () => void;
  children: React.ReactNode;
  titulo: string;
}

export default function AgendaModal({
  aberto,
  fechar,
  children,
  titulo,
}: Props) {

  if (!aberto) return null;

  return (

    <div className="fixed inset-0 z-50 flex justify-end">

      {/* BACKDROP */}

      <div
        onClick={fechar}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* MODAL */}

      <div className="relative h-full w-full max-w-xl border-l border-zinc-800 bg-black shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-zinc-800 p-6">

          <h2 className="text-2xl font-bold text-white">
            {titulo}
          </h2>

          <button
            onClick={fechar}
            className="rounded-xl border border-zinc-800 p-2 text-zinc-400 transition-all hover:bg-zinc-900 hover:text-white"
          >

            <X size={20} />

          </button>

        </div>

        {/* CONTEÚDO */}

        <div className="h-[calc(100%-88px)] overflow-y-auto p-6">

          {children}

        </div>

      </div>

    </div>
  );
}