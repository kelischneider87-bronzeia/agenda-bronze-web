"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Cliente {
  id: string;
  nome_completo: string;
  cpf: string;
  email: string;
  data_nascimento: string;
  instagram: string;
  endereco_completo: string;
  telefone: string;
  profissao?: string;
  uso_roacutan: string;
  uso_mounjaro: string;
  como_conheceu: string;
  ja_fez_bronze: string;
  ocasiao_especial: string;
  qual_ocasiao?: string;
  observacoes_internas?: string;
}

export default function NovoClientePage() {
  const router = useRouter();

  const [clientes, setClientes] = useState<Cliente[]>([]);

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

  useEffect(() => {
    const clientesSalvos = localStorage.getItem("agenda-bronze-clientes");

    if (clientesSalvos) {
      setClientes(JSON.parse(clientesSalvos));
    }
  }, []);

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

  function encontrarClienteDuplicada() {
    const nomeDigitado = normalizarTexto(nomeCompleto);
    const cpfDigitado = limparNumeros(cpf);
    const emailDigitado = normalizarTexto(email);
    const telefoneDigitado = limparNumeros(telefone);

    return clientes.find((cliente) => {
      const nomeExistente = normalizarTexto(cliente.nome_completo);
      const cpfExistente = limparNumeros(cliente.cpf);
      const emailExistente = normalizarTexto(cliente.email);
      const telefoneExistente = limparNumeros(cliente.telefone);

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

  function salvarCliente() {
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
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (ocasiaoEspecial === "Sim" && !qualOcasiao) {
      alert("Informe qual é a ocasião especial.");
      return;
    }

    const clienteDuplicada = encontrarClienteDuplicada();

    if (clienteDuplicada) {
      alert(
        `Cliente já cadastrada.\n\nNome: ${clienteDuplicada.nome_completo}\nCPF: ${clienteDuplicada.cpf}\nEmail: ${clienteDuplicada.email}\nTelefone: ${clienteDuplicada.telefone}`
      );

      router.push("/dashboard?aba=clientes");
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

    const novaLista = [...clientes, novaCliente];

    localStorage.setItem("agenda-bronze-clientes", JSON.stringify(novaLista));
    setClientes(novaLista);

    alert("Cliente cadastrada com sucesso.");
    router.push("/dashboard?aba=clientes");
  }

  return (
    <main className="min-h-screen bg-[#0b0705] p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d7b56d]">
            Agenda Bronze
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">Nova cliente</h1>

          <p className="mt-2 text-sm text-zinc-400">
            Cadastro completo da cliente para agendamentos, histórico e controle
            profissional.
          </p>
        </div>

        <section className="rounded-3xl border border-[#3a2a17] bg-[#15100d] p-6 shadow-xl">
          <div className="grid gap-4 md:grid-cols-2">
            <CampoTexto
              label="Nome completo *"
              valor={nomeCompleto}
              setValor={setNomeCompleto}
            />

            <CampoTexto label="CPF *" valor={cpf} setValor={setCpf} />

            <CampoTexto
              label="Email *"
              valor={email}
              setValor={setEmail}
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
              setValor={setTelefone}
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

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-end">
            <button
              onClick={() => router.push("/dashboard?aba=clientes")}
              className="rounded-2xl border border-zinc-700 px-6 py-3 font-semibold text-white hover:bg-zinc-800"
            >
              Cancelar
            </button>

            <button
              onClick={salvarCliente}
              className="rounded-2xl bg-[#d7b56d] px-6 py-3 font-semibold text-black hover:bg-[#f1d58a]"
            >
              Salvar cliente
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