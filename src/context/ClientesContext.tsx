"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

type Cliente = {
  id: number;

  nome: string;

  telefone?: string;

  email?: string;

  profissao?: string;

  instagram?: string;

  cpf?: string;

  nascimento?: string;

  genero?: string;

  endereco?: string;

  comoConheceu?: string;

  fototipo?: string;

  subtom?: string;

  observacoes?: string;
};

type ClientesContextType = {
  clientes: Cliente[];

  adicionarCliente: (
    cliente: Cliente
  ) => void;
};

const ClientesContext =
  createContext<ClientesContextType | null>(
    null
  );

export function ClientesProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [clientes, setClientes] =
    useState<Cliente[]>([
      {
        id: 1,

        nome: "Amanda Souza",

        telefone:
          "(51) 99999-1111",

        profissao:
          "Advogada",

        instagram:
          "@amandasouza",

        fototipo: "3",

        subtom: "Quente",
      },

      {
        id: 2,

        nome:
          "Fernanda Lima",

        telefone:
          "(51) 99999-2222",

        profissao:
          "Dentista",

        instagram:
          "@fernandalima",

        fototipo: "2",

        subtom: "Frio",
      },
    ]);

  function adicionarCliente(
    cliente: Cliente
  ) {

    setClientes((prev) => [
      ...prev,
      cliente,
    ]);
  }

  return (

    <ClientesContext.Provider
      value={{
        clientes,
        adicionarCliente,
      }}
    >

      {children}

    </ClientesContext.Provider>

  );
}

export function useClientes() {

  const context =
    useContext(ClientesContext);

  if (!context) {

    throw new Error(
      "useClientes deve ser usado dentro do ClientesProvider"
    );
  }

  return context;
}