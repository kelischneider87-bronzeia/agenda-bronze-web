"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const destino = searchParams.get("from") || "/dashboard";

  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados?.erro || "Senha inválida.");
        return;
      }

      window.location.href = destino;
    } catch {
      setErro("Não foi possível entrar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0705] px-5 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-[#3a2a17] bg-[#15100d] p-8 shadow-2xl">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d7b56d]">
            Agenda Bronze
          </p>

          <h1 className="mt-4 text-3xl font-bold">Acesso administrativo</h1>

          <p className="mt-3 text-sm text-zinc-400">
            Entre com a senha da equipe para acessar o painel interno da Divino
            Bronze.
          </p>
        </div>

        <form onSubmit={entrar} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-300">
              Senha administrativa
            </label>

            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite a senha"
              className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-4 text-white outline-none transition focus:border-[#d7b56d]"
              autoFocus
            />
          </div>

          {erro && (
            <div className="rounded-2xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-100">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-2xl bg-[#d7b56d] px-6 py-4 font-bold text-black transition hover:bg-[#f1d58a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-[#3a2a17] bg-black/40 p-4 text-center text-xs text-zinc-500">
          O link público de agendamento continua aberto para clientes.
        </div>
      </section>
    </main>
  );
}