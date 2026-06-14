"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

type Agendamento = {
  id: number;

  clienteId: number;

  cliente: string;

  tipoServico?: string;

  data?: string;

  hora: string;

  status: string;

  valor: string;

  cor: string;
};

type AgendaContextType = {
  agendamentos: Agendamento[];

  adicionarAgendamento: (
    novoAgendamento: Agendamento
  ) => void;

  atualizarStatus: (
    id: number,
    status: string
  ) => void;
};

const AgendaContext =
  createContext<AgendaContextType | null>(
    null
  );

export function AgendaProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [agendamentos, setAgendamentos] =
    useState<Agendamento[]>([
      {
        id: 1,

        clienteId: 1,

        cliente:
          "Amanda Souza",

        tipoServico:
          "Bronzeamento a Jato ( Studio )",

        data:
          "2026-05-13",

        hora: "09:00",

        status:
          "Confirmado",

        valor: "149",

        cor: "green",
      },

      {
        id: 2,

        clienteId: 2,

        cliente:
          "Fernanda Lima",

        tipoServico:
          "Bronzeamento a Jato ( Domicílio )",

        data:
          "2026-05-13",

        hora: "11:00",

        status:
          "Pendente",

        valor: "189",

        cor: "yellow",
      },
    ]);

  function adicionarAgendamento(
    novoAgendamento: Agendamento
  ) {

    setAgendamentos((prev) => [
      ...prev,
      novoAgendamento,
    ]);
  }

  function atualizarStatus(
    id: number,
    status: string
  ) {

    setAgendamentos((prev) =>
      prev.map((item) => {

        if (item.id !== id)
          return item;

        let cor = "yellow";

        if (
          status === "Confirmado"
        ) {
          cor = "green";
        }

        if (
          status ===
          "Em Atendimento"
        ) {
          cor = "blue";
        }

        if (
          status === "Finalizado"
        ) {
          cor = "purple";
        }

        if (
          status === "Cancelado"
        ) {
          cor = "red";
        }

        return {
          ...item,
          status,
          cor,
        };
      })
    );
  }

  return (

    <AgendaContext.Provider
      value={{
        agendamentos,
        adicionarAgendamento,
        atualizarStatus,
      }}
    >

      {children}

    </AgendaContext.Provider>

  );
}

export function useAgenda() {

  const context =
    useContext(AgendaContext);

  if (!context) {

    throw new Error(
      "useAgenda deve ser usado dentro do AgendaProvider"
    );
  }

  return context;
}