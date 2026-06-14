"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Cliente {
  id: string;
  nome_completo?: string;
  nome?: string;
  cpf?: string;
  email?: string;
  data_nascimento?: string;
  instagram?: string;
  endereco_completo?: string;
  telefone?: string;
  profissao?: string;
  uso_roacutan?: string;
  uso_mounjaro?: string;
  como_conheceu?: string;
  ja_fez_bronze?: string;
  ocasiao_especial?: string;
  qual_ocasiao?: string;
  observacoes_internas?: string;
}

interface Agendamento {
  id: string;
  cliente_id: string;
  servico: string;
  data: string;
  hora: string;
  valor: number;
  sinal: number;
  sinal_pago: boolean;
  forma_pagamento: string;
  status: "Agendado" | "Confirmado" | "Atendido" | "Cancelado";
  observacoes?: string;
}

const horariosPadrao = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

export default function NovoAgendamentoPage() {
  const router = useRouter();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  const [clienteSelecionadaId, setClienteSelecionadaId] = useState("");
  const [buscaCliente, setBuscaCliente] = useState("");
  const [mostrarCadastroCliente, setMostrarCadastroCliente] = useState(false);

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [instagram, setInstagram] = useState("");
  const [enderecoCompleto, setEnderecoCompleto] = useState("");
  const [telefone, setTelefone] = useState("");
  const [profissao, setProfissao] = useState("");
  const [usoRoacutan, setUsoRoacutan] = useState("");
  const [usoMounjaro, setUsoMounjaro] = useState("");
  const [comoConheceu, setComoConheceu] = useState("");
  const [jaFezBronze, setJaFezBronze] = useState("");
  const [ocasiaoEspecial, setOcasiaoEspecial] = useState("");
  const [qualOcasiao, setQualOcasiao] = useState("");
  const [observacoesInternasCliente, setObservacoesInternasCliente] =
    useState("");

  const [servico, setServico] = useState("Bronzeamento a jato");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [valor, setValor] = useState("150");
  const [sinal, setSinal] = useState("50");
  const [sinalPago, setSinalPago] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("PIX");
  const [status, setStatus] = useState<Agendamento["status"]>("Agendado");
  const [observacoesAgendamento, setObservacoesAgendamento] = useState("");

  useEffect(() => {
    const clientesSalvos = localStorage.getItem("agenda-bronze-clientes");
    const agendamentosSalvos = localStorage.getItem(
      "agenda-bronze-agendamentos"
    );

    if (clientesSalvos) setClientes(JSON.parse(clientesSalvos));
    if (agendamentosSalvos) setAgendamentos(JSON.parse(agendamentosSalvos));
  }, []);

  function obterNomeCliente(cliente: Cliente) {
    return cliente.nome_completo || cliente.nome || "";
  }

  function obterTelefoneCliente(cliente: Cliente) {
    return cliente.telefone || "";
  }

  function obterCpfCliente(cliente: Cliente) {
    return cliente.cpf || "";
  }

  function obterEmailCliente(cliente: Cliente) {
    return cliente.email || "";
  }

  const clientesOrdenadas = useMemo(() => {
    return [...clientes].sort((a, b) =>
      obterNomeCliente(a).localeCompare(obterNomeCliente(b))
    );
  }, [clientes]);

  const clientesFiltradas = useMemo(() => {
    const termo = buscaCliente.toLowerCase().trim();

    if (!termo) return clientesOrdenadas;

    return clientesOrdenadas.filter((cliente) => {
      const nome = obterNomeCliente(cliente).toLowerCase();
      const telefone = obterTelefoneCliente(cliente).toLowerCase();
      const cpfCliente = obterCpfCliente(cliente).toLowerCase();
      const emailCliente = obterEmailCliente(cliente).toLowerCase();

      return (
        nome.includes(termo) ||
        telefone.includes(termo) ||
        cpfCliente.includes(termo) ||
        emailCliente.includes(termo)
      );
    });
  }, [buscaCliente, clientesOrdenadas]);

  const clienteSelecionada = useMemo(() => {
    return clientes.find((cliente) => cliente.id === clienteSelecionadaId);
  }, [clientes, clienteSelecionadaId]);

  function normalizarTexto(texto: string) {
    return texto
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function limparNumeros(texto: string) {
    return texto.replace(/\D/g, "");
  }

  function encontrarClienteDuplicada(dados: {
    nome?: string;
    cpf?: string;
    email?: string;
    telefone?: string;
  }) {
    const nomeDigitado = normalizarTexto(dados.nome || "");
    const cpfDigitado = limparNumeros(dados.cpf || "");
    const emailDigitado = normalizarTexto(dados.email || "");
    const telefoneDigitado = limparNumeros(dados.telefone || "");

    return clientes.find((cliente) => {
      const nomeExistente = normalizarTexto(obterNomeCliente(cliente));
      const cpfExistente = limparNumeros(obterCpfCliente(cliente));
      const emailExistente = normalizarTexto(obterEmailCliente(cliente));
      const telefoneExistente = limparNumeros(obterTelefoneCliente(cliente));

      const nomeConfere =
        nomeDigitado.length >= 6 && nomeExistente === nomeDigitado;

      const cpfConfere =
        cpfDigitado.length >= 11 && cpfExistente === cpfDigitado;

      const emailConfere =
        emailDigitado.includes("@") && emailExistente === emailDigitado;

      const telefoneConfere =
        telefoneDigitado.length >= 10 && telefoneExistente === telefoneDigitado;

      return nomeConfere || cpfConfere || emailConfere || telefoneConfere;
    });
  }

  function limparCadastroCliente() {
    setNomeCompleto("");
    setCpf("");
    setEmail("");
    setDataNascimento("");
    setInstagram("");
    setEnderecoCompleto("");
    setTelefone("");
    setProfissao("");
    setUsoRoacutan("");
    setUsoMounjaro("");
    setComoConheceu("");
    setJaFezBronze("");
    setOcasiaoEspecial("");
    setQualOcasiao("");
    setObservacoesInternasCliente("");
  }

  function verificarClienteAoDigitar(dados: {
    nome?: string;
    cpf?: string;
    email?: string;
    telefone?: string;
  }) {
    const clienteDuplicada = encontrarClienteDuplicada(dados);

    if (clienteDuplicada) {
      setClienteSelecionadaId(clienteDuplicada.id);
      setBuscaCliente(obterNomeCliente(clienteDuplicada));
      setMostrarCadastroCliente(false);
      limparCadastroCliente();

      alert(
        `Cliente já cadastrada. O cadastro existente foi selecionado automaticamente.\n\nNome: ${obterNomeCliente(
          clienteDuplicada
        )}\nTelefone: ${obterTelefoneCliente(clienteDuplicada)}`
      );

      return true;
    }

    return false;
  }

  function salvarClienteDentroAgendamento() {
    if (
      !nomeCompleto ||
      !cpf ||
      !email ||
      !dataNascimento ||
      !telefone ||
      !usoRoacutan ||
      !usoMounjaro ||
      !comoConheceu ||
      !jaFezBronze ||
      !ocasiaoEspecial
    ) {
      alert("Preencha todos os campos obrigatórios da cliente.");
      return;
    }

    if (ocasiaoEspecial === "Sim" && !qualOcasiao) {
      alert("Informe qual é a ocasião especial.");
      return;
    }

    const clienteDuplicada = encontrarClienteDuplicada({
      nome: nomeCompleto,
      cpf,
      email,
      telefone,
    });

    if (clienteDuplicada) {
      setClienteSelecionadaId(clienteDuplicada.id);
      setBuscaCliente(obterNomeCliente(clienteDuplicada));
      setMostrarCadastroCliente(false);
      limparCadastroCliente();

      alert(
        `Cliente já cadastrada. O cadastro existente foi selecionado para este agendamento.\n\nNome: ${obterNomeCliente(
          clienteDuplicada
        )}`
      );

      return;
    }

    const novaCliente: Cliente = {
      id: crypto.randomUUID(),
      nome_completo: nomeCompleto,
      cpf,
      email,
      data_nascimento: dataNascimento,
      instagram,
      endereco_completo: enderecoCompleto,
      telefone,
      profissao,
      uso_roacutan: usoRoacutan,
      uso_mounjaro: usoMounjaro,
      como_conheceu: comoConheceu,
      ja_fez_bronze: jaFezBronze,
      ocasiao_especial: ocasiaoEspecial,
      qual_ocasiao: qualOcasiao,
      observacoes_internas: observacoesInternasCliente,
    };

    const novaListaClientes = [...clientes, novaCliente];

    localStorage.setItem(
      "agenda-bronze-clientes",
      JSON.stringify(novaListaClientes)
    );

    setClientes(novaListaClientes);
    setClienteSelecionadaId(novaCliente.id);
    setBuscaCliente(obterNomeCliente(novaCliente));
    setMostrarCadastroCliente(false);
    limparCadastroCliente();
  }

  function salvarAgendamento() {
    if (!clienteSelecionadaId || !data || !hora || !valor) {
      alert("Selecione uma cliente e preencha data, horário e valor.");
      return;
    }

    const horarioOcupado = agendamentos.some(
      (item) =>
        item.data === data &&
        item.hora === hora &&
        item.status !== "Cancelado"
    );

    if (horarioOcupado) {
      alert("Este horário já possui agendamento cadastrado.");
      return;
    }

    const novoAgendamento: Agendamento = {
      id: crypto.randomUUID(),
      cliente_id: clienteSelecionadaId,
      servico,
      data,
      hora,
      valor: Number(valor),
      sinal: Number(sinal || 0),
      sinal_pago: sinalPago,
      forma_pagamento: formaPagamento,
      status,
      observacoes: observacoesAgendamento,
    };

    const novaListaAgendamentos = [...agendamentos, novoAgendamento];

    localStorage.setItem(
      "agenda-bronze-agendamentos",
      JSON.stringify(novaListaAgendamentos)
    );

    setAgendamentos(novaListaAgendamentos);

    alert("Agendamento cadastrado com sucesso.");
    router.push("/dashboard?aba=agenda");
  }

  function alterarNome(valor: string) {
    setNomeCompleto(valor);

    verificarClienteAoDigitar({
      nome: valor,
      cpf,
      email,
      telefone,
    });
  }

  function alterarCpf(valor: string) {
    setCpf(valor);

    verificarClienteAoDigitar({
      nome: nomeCompleto,
      cpf: valor,
      email,
      telefone,
    });
  }

  function alterarEmail(valor: string) {
    setEmail(valor);

    verificarClienteAoDigitar({
      nome: nomeCompleto,
      cpf,
      email: valor,
      telefone,
    });
  }

  function alterarTelefone(valor: string) {
    setTelefone(valor);

    verificarClienteAoDigitar({
      nome: nomeCompleto,
      cpf,
      email,
      telefone: valor,
    });
  }

  return (
    <main className="min-h-screen bg-[#0b0705] p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d7b56d]">
            Agenda Bronze
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Novo agendamento
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Selecione uma cliente cadastrada ou cadastre uma nova cliente neste
            mesmo fluxo.
          </p>
        </div>

        <section className="mb-6 rounded-3xl border border-[#3a2a17] bg-[#15100d] p-6 shadow-xl">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#d7b56d]">
                Cliente do agendamento
              </h2>
              <p className="text-sm text-zinc-400">
                Busque por nome, telefone, CPF ou email.
              </p>
            </div>

            <button
              onClick={() => setMostrarCadastroCliente(!mostrarCadastroCliente)}
              className="rounded-2xl border border-[#d7b56d] px-6 py-3 font-semibold text-[#d7b56d] hover:bg-[#d7b56d] hover:text-black"
            >
              {mostrarCadastroCliente
                ? "Ocultar cadastro"
                : "+ Cadastrar nova cliente"}
            </button>
          </div>

          {!mostrarCadastroCliente && (
            <div className="grid gap-4 md:grid-cols-2">
              <CampoTexto
                label="Buscar cliente"
                valor={buscaCliente}
                setValor={setBuscaCliente}
                placeholder="Digite nome, telefone, CPF ou email"
              />

              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Cliente selecionada *
                </label>

                <select
                  value={clienteSelecionadaId}
                  onChange={(event) =>
                    setClienteSelecionadaId(event.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d7b56d]"
                >
                  <option value="">Selecione uma cliente</option>
                  {clientesFiltradas.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {obterNomeCliente(cliente)} —{" "}
                      {obterTelefoneCliente(cliente)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {clienteSelecionada && !mostrarCadastroCliente && (
            <div className="mt-5 rounded-2xl border border-[#d7b56d] bg-[#d7b56d]/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d7b56d]">
                Cliente selecionada
              </p>
              <h3 className="mt-2 text-xl font-bold">
                {obterNomeCliente(clienteSelecionada)}
              </h3>
              <p className="mt-1 text-sm text-zinc-300">
                {obterTelefoneCliente(clienteSelecionada)} •{" "}
                {obterEmailCliente(clienteSelecionada)} • CPF:{" "}
                {obterCpfCliente(clienteSelecionada)}
              </p>
            </div>
          )}

          {mostrarCadastroCliente && (
            <div className="mt-5 rounded-2xl border border-zinc-800 bg-black/30 p-5">
              <h3 className="mb-4 text-lg font-bold text-[#d7b56d]">
                Cadastro completo da cliente
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <CampoTexto
                  label="Nome completo *"
                  valor={nomeCompleto}
                  setValor={alterarNome}
                />

                <CampoTexto label="CPF *" valor={cpf} setValor={alterarCpf} />

                <CampoTexto
                  label="Email *"
                  valor={email}
                  setValor={alterarEmail}
                  tipo="email"
                />

                <CampoTexto
                  label="Data de nascimento *"
                  valor={dataNascimento}
                  setValor={setDataNascimento}
                  tipo="date"
                />

                <CampoTexto
                  label="Instagram"
                  valor={instagram}
                  setValor={setInstagram}
                  placeholder="@cliente"
                />

                <CampoTexto
                  label="Telefone para contato *"
                  valor={telefone}
                  setValor={alterarTelefone}
                  placeholder="51999999999"
                />

                <div className="md:col-span-2">
                  <CampoArea
                    label="Endereço completo"
                    valor={enderecoCompleto}
                    setValor={setEnderecoCompleto}
                    placeholder="Endereço não obrigatório"
                  />
                </div>

                <CampoTexto
                  label="Profissão da cliente — campo interno da profissional"
                  valor={profissao}
                  setValor={setProfissao}
                />

                <CampoSelect
                  label="Está fazendo uso do Roacutan? *"
                  valor={usoRoacutan}
                  setValor={setUsoRoacutan}
                  opcoes={["Sim", "Não"]}
                />

                <CampoSelect
                  label="Está fazendo uso do Mounjaro? *"
                  valor={usoMounjaro}
                  setValor={setUsoMounjaro}
                  opcoes={["Sim", "Não"]}
                />

                <CampoSelect
                  label="Como conheceu nossa empresa? *"
                  valor={comoConheceu}
                  setValor={setComoConheceu}
                  opcoes={[
                    "Instagram",
                    "Google",
                    "Indicação",
                    "Cliente antiga",
                    "WhatsApp",
                    "Outro",
                  ]}
                />

                <CampoSelect
                  label="Já fez bronzeamento a jato? *"
                  valor={jaFezBronze}
                  setValor={setJaFezBronze}
                  opcoes={["Sim", "Não"]}
                />

                <CampoSelect
                  label="Está fazendo o bronze para alguma ocasião especial? *"
                  valor={ocasiaoEspecial}
                  setValor={setOcasiaoEspecial}
                  opcoes={["Sim", "Não"]}
                />

                <CampoTexto
                  label="Se sim, qual a ocasião?"
                  valor={qualOcasiao}
                  setValor={setQualOcasiao}
                  placeholder="Ex: casamento, formatura, viagem..."
                />

                <div className="md:col-span-2">
                  <CampoArea
                    label="Observações internas da cliente"
                    valor={observacoesInternasCliente}
                    setValor={setObservacoesInternasCliente}
                    placeholder="Ex: pele sensível, preferência de tom, restrições, histórico..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={salvarClienteDentroAgendamento}
                  className="rounded-2xl bg-[#d7b56d] px-6 py-3 font-semibold text-black hover:bg-[#f1d58a]"
                >
                  Salvar cliente e usar neste agendamento
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-[#3a2a17] bg-[#15100d] p-6 shadow-xl">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#d7b56d]">
              Dados do agendamento
            </h2>
            <p className="text-sm text-zinc-400">
              Defina data, horário, valor, sinal e forma de pagamento.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <CampoTexto
              label="Serviço"
              valor={servico}
              setValor={setServico}
            />

            <CampoTexto
              label="Data *"
              valor={data}
              setValor={setData}
              tipo="date"
            />

            <CampoSelect
              label="Horário *"
              valor={hora}
              setValor={setHora}
              opcoes={horariosPadrao}
            />

            <CampoTexto
              label="Valor total *"
              valor={valor}
              setValor={setValor}
              tipo="number"
            />

            <CampoTexto
              label="Valor do sinal"
              valor={sinal}
              setValor={setSinal}
              tipo="number"
            />

            <CampoSelect
              label="Forma de pagamento"
              valor={formaPagamento}
              setValor={setFormaPagamento}
              opcoes={[
                "PIX",
                "Dinheiro",
                "Cartão de crédito",
                "Cartão de débito",
              ]}
            />

            <CampoSelect
              label="Status"
              valor={status}
              setValor={(valor) => setStatus(valor as Agendamento["status"])}
              opcoes={["Agendado", "Confirmado", "Atendido", "Cancelado"]}
            />

            <div className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-black px-4 py-3">
              <input
                id="sinalPago"
                type="checkbox"
                checked={sinalPago}
                onChange={(event) => setSinalPago(event.target.checked)}
                className="h-5 w-5"
              />
              <label htmlFor="sinalPago" className="text-sm text-zinc-300">
                Sinal já foi pago
              </label>
            </div>

            <div className="md:col-span-2">
              <CampoArea
                label="Observações do agendamento"
                valor={observacoesAgendamento}
                setValor={setObservacoesAgendamento}
                placeholder="Ex: horário encaixado, preferência de tom, observação do atendimento..."
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-end">
            <button
              onClick={() => router.push("/dashboard?aba=agenda")}
              className="rounded-2xl border border-zinc-700 px-6 py-3 font-semibold text-white hover:bg-zinc-800"
            >
              Cancelar
            </button>

            <button
              onClick={salvarAgendamento}
              className="rounded-2xl bg-[#d7b56d] px-6 py-3 font-semibold text-black hover:bg-[#f1d58a]"
            >
              Salvar agendamento
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function CampoTexto({
  label,
  valor,
  setValor,
  tipo = "text",
  placeholder = "",
}: {
  label: string;
  valor: string;
  setValor: (valor: string) => void;
  tipo?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-zinc-300">{label}</label>
      <input
        type={tipo}
        value={valor}
        onChange={(event) => setValor(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d7b56d]"
      />
    </div>
  );
}

function CampoArea({
  label,
  valor,
  setValor,
  placeholder = "",
}: {
  label: string;
  valor: string;
  setValor: (valor: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-zinc-300">{label}</label>
      <textarea
        value={valor}
        onChange={(event) => setValor(event.target.value)}
        placeholder={placeholder}
        className="min-h-24 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d7b56d]"
      />
    </div>
  );
}

function CampoSelect({
  label,
  valor,
  setValor,
  opcoes,
}: {
  label: string;
  valor: string;
  setValor: (valor: string) => void;
  opcoes: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-zinc-300">{label}</label>
      <select
        value={valor}
        onChange={(event) => setValor(event.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d7b56d]"
      >
        <option value="">Selecione</option>
        {opcoes.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
    </div>
  );
}