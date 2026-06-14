"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

type Historico = {
  id: number;

  clienteId: number;

  cliente: string;

  data: string;

  protocolo: string;

  solucao?: string;

  tempoBanho?: string;

  resultado?: string;

  duracao?: string;

  observacoes?: string;

  avaliacao?: string;

  nota?: number;
};

type HistoricoContextType = {
  historicos: Historico[];

  adicionarHistorico: (
    historico: Historico
  ) => void;
};

const HistoricoContext =
  createContext<HistoricoContextType | null>(
    null
  );

export function HistoricoProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [historicos, setHistoricos] =
    useState<Historico[]>([
      {
        id: 1,

        clienteId: 1,

        cliente:
          "Amanda Souza",

        data:
          "10/05/2026",

        protocolo:
          "Bronze Médio",

        solucao:
          "Dark Bronze Gold",

        tempoBanho:
          "2hrs",

        resultado:
          "Bronze uniforme e excelente fixação.",

        duracao:
          "10 dias",

        observacoes:
          "Pele respondeu melhor com hidratação prévia.",

        avaliacao:
          "Amei o resultado, ficou perfeito.",

        nota: 5,
      },

      {
        id: 2,

        clienteId: 2,

        cliente:
          "Fernanda Lima",

        data:
          "09/05/2026",

        protocolo:
          "Bronze Intenso",

        solucao:
          "Ultra Dark",

        tempoBanho:
          "4hrs",

        resultado:
          "Bronze intenso uniforme.",

        duracao:
          "12 dias",

        observacoes:
          "Excelente resposta em pele hidratada.",

        avaliacao:
          "Melhor bronze que já fiz.",

        nota: 5,
      },
    ]);

  function adicionarHistorico(
    historico: Historico
  ) {

    setHistoricos((prev) => [
      ...prev,
      historico,
    ]);
  }

  return (

    <HistoricoContext.Provider
      value={{
        historicos,
        adicionarHistorico,
      }}
    >

      {children}

    </HistoricoContext.Provider>

  );
}

export function useHistorico() {

  const context =
    useContext(HistoricoContext);

  if (!context) {

    throw new Error(
      "useHistorico deve ser usado dentro do HistoricoProvider"
    );
  }

  return context;
}