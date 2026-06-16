"use client";

import { useRouter } from "next/navigation";

export default function AgendaModalForm() {
  const router = useRouter();

  return (
    <section className="rounded-[2rem] border border-[#3a2a17] bg-[#15100d] p-6 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-[#d7b56d]">
        Agenda Bronze
      </p>

      <h2 className="mt-3 text-2xl font-bold">Novo agendamento</h2>

      <p className="mt-2 text-sm text-zinc-400">
        O cadastro de agendamentos agora é feito pelo painel operacional.
      </p>

      <button
        type="button"
        onClick={() => router.push("/dashboard?aba=agenda")}
        className="mt-6 rounded-2xl bg-[#d7b56d] px-5 py-3 font-bold text-black transition hover:bg-[#f1d58a]"
      >
        Ir para a agenda
      </button>
    </section>
  );
}