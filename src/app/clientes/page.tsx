"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";

interface Cliente {
  [key: string]: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    fetch("/clientes.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          delimiter: ";",
          encoding: "latin1",
          skipEmptyLines: true,
          preview: 500,

          beforeFirstChunk: (chunk) => {
  const linhas = chunk.split("\n");

  const inicioCabecalho = linhas.findIndex((linha) =>
    linha.includes("Nome")
  );

  return linhas.slice(inicioCabecalho).join("\n");
},

          complete: (result) => {
            console.log(result.data);
            setClientes(result.data as Cliente[]);
          },
        });
      });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex">
      {/* MENU */}
      <aside className="w-72 bg-zinc-950 border-r border-yellow-500/20 p-6">
        <h1 className="text-4xl font-bold text-yellow-500 mb-10">
          Agenda Bronze
        </h1>

        <nav className="flex flex-col gap-4">
          <button className="bg-zinc-900 hover:bg-yellow-500 hover:text-black transition-all rounded-2xl py-4 text-xl font-semibold">
            Dashboard
          </button>

          <button className="bg-yellow-500 text-black rounded-2xl py-4 text-xl font-semibold">
            Clientes
          </button>

          <button className="bg-zinc-900 hover:bg-yellow-500 hover:text-black transition-all rounded-2xl py-4 text-xl font-semibold">
            Agenda
          </button>

          <button className="bg-zinc-900 hover:bg-yellow-500 hover:text-black transition-all rounded-2xl py-4 text-xl font-semibold">
            Financeiro
          </button>

          <button className="bg-zinc-900 hover:bg-yellow-500 hover:text-black transition-all rounded-2xl py-4 text-xl font-semibold">
            Protocolos
          </button>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <section className="flex-1 p-10">

        {/* DEBUG */}
        

        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-6xl font-bold">Clientes</h2>
            <p className="text-zinc-400 mt-2">
              Gerencie suas clientes premium.
            </p>
          </div>

          <button className="bg-yellow-500 hover:scale-105 transition-all text-black px-8 py-4 rounded-2xl text-xl font-bold">
            <a
  href="/novo-cliente"
  className="bg-yellow-500 text-black font-bold px-8 py-4 rounded-2xl hover:bg-yellow-400 transition"
>
  + Nova Cliente
</a>
          </button>
        </div>

        <div className="bg-zinc-950 border border-yellow-500/10 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-2 bg-zinc-900 p-6 text-zinc-400 text-lg font-semibold">
            <span>Nome</span>
            <span>Telefone</span>
          </div>

          {clientes.slice(0, 50).map((cliente: any, index: number) => (
            <div
              key={index}
              className="grid grid-cols-2 p-6 border-t border-zinc-800 hover:bg-zinc-900 transition-all"
            >
              <span className="text-xl font-semibold">
                {cliente["Nome"]}
              </span>

              <span className="text-zinc-300">
                {cliente["Telefone 1"]}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}