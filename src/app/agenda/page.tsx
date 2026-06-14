"use client";

import { useEffect, useState } from "react";
import { DropResult } from "@hello-pangea/dnd";

import { supabase } from "@/lib/supabase";

import AgendaModal from "@/components/AgendaModal";
import AgendaHeader from "@/components/agenda/AgendaHeader";
import WeeklyCalendar from "@/components/agenda/WeeklyCalendar";
import AgendaModalForm from "@/components/agenda/AgendaModalForm";

interface Agendamento {
  id: string;
  cliente_nome: string;
  data: string;
  hora: string;
  valor: number;
  status: string;
  sinal?: number;
  sinal_pago?: boolean;
  forma_pagamento?: string;
  observacoes?: string;
}

export default function AgendaPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [agendamentoId, setAgendamentoId] = useState("");

  const [cliente, setCliente] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState("Confirmado");
  const [sinal, setSinal] = useState("");
  const [pago, setPago] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horaSelecionada, setHoraSelecionada] = useState("");

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  async function buscarAgendamentos() {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);

    inicioSemana.setDate(hoje.getDate() - hoje.getDay() + 1);

    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);

    const inicio = inicioSemana.toISOString().split("T")[0];
    const fim = fimSemana.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("agendamentos")
      .select("*")
      .gte("data", inicio)
      .lte("data", fim);

    if (error) {
      console.log(error);
      alert("Erro ao buscar agendamentos.");
      return;
    }

    setAgendamentos(data || []);
  }

  async function salvarAgendamento() {
    if (!cliente || !valor || !dataSelecionada || !horaSelecionada) {
      alert("Preencha cliente, data, hora e valor.");
      return;
    }

    if (modoEdicao) {
      const { error } = await supabase
        .from("agendamentos")
        .update({
          cliente_nome: cliente,
          data: dataSelecionada,
          hora: horaSelecionada,
          valor: Number(valor),
          status,
          sinal: Number(sinal || 0),
          sinal_pago: pago,
          forma_pagamento: formaPagamento,
          observacoes,
        })
        .eq("id", agendamentoId);

      if (error) {
        console.log(error);
        alert("Erro ao atualizar agendamento.");
        return;
      }
    } else {
      const { error } = await supabase
        .from("agendamentos")
        .insert([
          {
            cliente_nome: cliente,
            data: dataSelecionada,
            hora: horaSelecionada,
            valor: Number(valor),
            status,
            sinal: Number(sinal || 0),
            sinal_pago: pago,
            forma_pagamento: formaPagamento,
            observacoes,
          },
        ]);

      if (error) {
        console.log(error);
        alert("Erro ao salvar agendamento.");
        return;
      }
    }

    fecharModal();
    buscarAgendamentos();
  }

  async function excluirAgendamento() {
    if (!agendamentoId) return;

    const confirmar = confirm("Deseja excluir este agendamento?");

    if (!confirmar) return;

    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", agendamentoId);

    if (error) {
      console.log(error);
      alert("Erro ao excluir agendamento.");
      return;
    }

    fecharModal();
    buscarAgendamentos();
  }

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return;

    const destino = result.destination.droppableId;
    const [novaData, novaHora] = destino.split("|");
    const id = result.draggableId;

    const { error } = await supabase
      .from("agendamentos")
      .update({
        data: novaData,
        hora: novaHora,
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      alert("Erro ao mover agendamento.");
      return;
    }

    buscarAgendamentos();
  }

  function hojeISO() {
    return new Date().toISOString().split("T")[0];
  }

  function abrirNovoAgendamentoManual() {
    limparCampos();
    setModoEdicao(false);
    setDataSelecionada(hojeISO());
    setHoraSelecionada("09:00");
    setModalAberto(true);
  }

  function abrirNovoAgendamento(data: string, hora: string) {
    limparCampos();
    setModoEdicao(false);
    setDataSelecionada(data);
    setHoraSelecionada(hora);
    setModalAberto(true);
  }

  function abrirEdicaoAgendamento(agendamento: Agendamento) {
    setModoEdicao(true);
    setAgendamentoId(agendamento.id);
    setCliente(agendamento.cliente_nome || "");
    setValor(String(agendamento.valor || ""));
    setStatus(agendamento.status || "Confirmado");
    setSinal(String(agendamento.sinal || ""));
    setPago(Boolean(agendamento.sinal_pago));
    setFormaPagamento(agendamento.forma_pagamento || "");
    setObservacoes(agendamento.observacoes || "");
    setDataSelecionada(agendamento.data || "");
    setHoraSelecionada(agendamento.hora?.slice(0, 5) || "");
    setModalAberto(true);
  }

  function limparCampos() {
    setAgendamentoId("");
    setCliente("");
    setValor("");
    setStatus("Confirmado");
    setSinal("");
    setPago(false);
    setFormaPagamento("");
    setObservacoes("");
    setDataSelecionada("");
    setHoraSelecionada("");
  }

  function fecharModal() {
    setModalAberto(false);
    setModoEdicao(false);
    limparCampos();
  }

  const horarios = [
    "06:00","06:30",
    "07:00","07:30",
    "08:00","08:30",
    "09:00","09:30",
    "10:00","10:30",
    "11:00","11:30",
    "12:00","12:30",
    "13:00","13:30",
    "14:00","14:30",
    "15:00","15:30",
    "16:00","16:30",
    "17:00","17:30",
    "18:00","18:30",
    "19:00","19:30",
    "20:00","20:30",
    "21:00","21:30",
    "22:00","22:30",
    "23:00",
  ];

  function gerarDiasSemana() {
    const hoje = new Date();
    const inicioSemana = new Date(hoje);

    inicioSemana.setDate(hoje.getDate() - hoje.getDay() + 1);

    return Array.from({ length: 7 }).map((_, index) => {
      const data = new Date(inicioSemana);
      data.setDate(inicioSemana.getDate() + index);

      return {
        label: data.toLocaleDateString("pt-BR", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
        }),
        data: data.toISOString().split("T")[0],
      };
    });
  }

  const dias = gerarDiasSemana();

  return (
    <div className="text-white">
      <AgendaHeader
        titulo="Agenda Semanal"
        subtitulo="Visualização premium da semana."
        onNovoAgendamento={abrirNovoAgendamentoManual}
      />

      <WeeklyCalendar
        dias={dias}
        horarios={horarios}
        agendamentos={agendamentos}
        onNovoAgendamento={abrirNovoAgendamento}
        onEditarAgendamento={abrirEdicaoAgendamento}
        onDragEnd={onDragEnd}
      />

      <AgendaModal
        aberto={modalAberto}
        fechar={fecharModal}
        titulo={
          modoEdicao
            ? `Editar Agendamento • ${horaSelecionada || "Selecione a hora"}`
            : `Novo Agendamento • ${horaSelecionada || "Selecione a hora"}`
        }
      >
        <AgendaModalForm
          cliente={cliente}
          valor={valor}
          status={status}
          sinal={sinal}
          pago={pago}
          formaPagamento={formaPagamento}
          observacoes={observacoes}
          data={dataSelecionada}
          hora={horaSelecionada}
          onClienteChange={setCliente}
          onValorChange={setValor}
          onStatusChange={setStatus}
          onSinalChange={setSinal}
          onPagoChange={setPago}
          onFormaPagamentoChange={setFormaPagamento}
          onObservacoesChange={setObservacoes}
          onDataChange={setDataSelecionada}
          onHoraChange={setHoraSelecionada}
          onSalvar={salvarAgendamento}
          onExcluir={excluirAgendamento}
          modoEdicao={modoEdicao}
        />
      </AgendaModal>
    </div>
  );
}