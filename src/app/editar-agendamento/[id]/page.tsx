"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function EditarAgendamentoPage() {

  const params = useParams();

  const router = useRouter();

  const [cliente, setCliente] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState("Confirmado");

  useEffect(() => {
    buscarAgendamento();
  }, []);

  async function buscarAgendamento() {

    const { data, error } = await supabase
      .from("agendamentos")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      console.log(error);

      alert("Agendamento não encontrado.");

      return;
    }

    setCliente(data.cliente_nome || "");
    setData(data.data || "");
    setHora(data.hora || "");
    setValor(data.valor || "");
    setStatus(data.status || "Confirmado");
  }

  async function atualizarAgendamento() {

    if (!cliente || !data || !hora || !valor) {
      alert("Preencha todos os campos.");
      return;
    }

    const { error } = await supabase
      .from("agendamentos")
      .update({
        cliente_nome: cliente,
        data,
        hora,
        valor: Number(valor),
        status,
      })
      .eq("id", params.id);

    if (error) {
      console.log(error);

      alert("Erro ao atualizar agendamento.");

      return;
    }

    router.push("/agenda");
  }

  return (
    <div className="text-white">

      <div className="mb-10">

        <h1 className="text-4xl font-bold text-yellow-400">
          Editar Agendamento
        </h1>

        <p className="mt-2 text-zinc-500">
          Atualize as informações do atendimento.
        </p>

      </div>

      <div className="max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8">

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* CLIENTE */}
          <div className="md:col-span-2">

            <label className="mb-2 block text-sm text-zinc-400">
              Nome da Cliente
            </label>

            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none focus:border-yellow-400"
            />

          </div>

          {/* DATA */}
          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              Data
            </label>

            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none focus:border-yellow-400"
            />

          </div>

          {/* HORA */}
          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              Hora
            </label>

            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none focus:border-yellow-400"
            />

          </div>

          {/* VALOR */}
          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              Valor
            </label>

            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none focus:border-yellow-400"
            />

          </div>

          {/* STATUS */}
          <div>

            <label className="mb-2 block text-sm text-zinc-400">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-white outline-none focus:border-yellow-400"
            >
              <option>Confirmado</option>
              <option>Pendente</option>
              <option>Cancelado</option>
              <option>Finalizado</option>
            </select>

          </div>

        </div>

        <div className="mt-8 flex items-center gap-4">

          <button
            onClick={atualizarAgendamento}
            className="rounded-2xl bg-yellow-400 px-8 py-4 font-semibold text-black transition-all hover:opacity-90"
          >
            Salvar Alterações
          </button>

          <button
            onClick={() => router.push("/agenda")}
            className="rounded-2xl border border-zinc-700 px-8 py-4 font-semibold text-zinc-300 transition-all hover:bg-zinc-900"
          >
            Cancelar
          </button>

        </div>

      </div>

    </div>
  );
}