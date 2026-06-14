"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Empresa {
  id: string;
  slug: string;
  nome: string;
  responsavel: string;
  telefone: string;
  whatsapp: string;
  instagram: string;
  email: string;
  endereco: string;
  abertura: string;
  fechamento: string;
  intervalo: number;
  dias_funcionamento: string[];
  observacoes: string;
  ativo: boolean;
}

interface Cliente {
  id: string;
  empresa_id: string;
  nome_completo: string;
  cpf: string;
  email: string;
  data_nascimento: string | null;
  instagram: string;
  endereco_completo: string;
  telefone: string;
  profissao: string;
  uso_roacutan: string;
  uso_mounjaro: string;
  como_conheceu: string;
  ja_fez_bronze: string;
  ocasiao_especial: string;
  qual_ocasiao: string;
  observacoes_internas: string;
  origem_cadastro: string;
}

interface Servico {
  id: string;
  empresa_id: string;
  nome: string;
  descricao: string;
  duracao: number;
  valor: number;
  sinal: number;
  ativo: boolean;
  observacoes: string;
  fotos_resultado: string[];
}

interface Profissional {
  id: string;
  empresa_id: string;
  nome: string;
  telefone: string;
  email: string;
  funcao: string;
  inicio: string;
  fim: string;
  dias_atendimento: string[];
  ativo: boolean;
  observacoes: string;
}

interface Agendamento {
  id: string;
  empresa_id: string;
  cliente_id: string;
  servico_id: string | null;
  profissional_id: string | null;
  servico: string;
  profissional_nome: string;
  data: string;
  hora: string;
  valor: number;
  sinal: number;
  sinal_pago: boolean;
  forma_pagamento: string;
  status: "Agendado" | "Confirmado" | "Atendido" | "Cancelado";
  observacoes: string;
  origem: "Painel interno" | "Agendamento público";
}

const EMPRESA_PADRAO: Empresa = {
  id: "",
  slug: "principal",
  nome: "Divino Bronze",
  responsavel: "",
  telefone: "",
  whatsapp: "",
  instagram: "",
  email: "",
  endereco: "",
  abertura: "09:30",
  fechamento: "22:00",
  intervalo: 60,
  dias_funcionamento: ["1", "2", "3", "4", "5", "6"],
  observacoes: "",
  ativo: true,
};

const DIAS_NOMES: Record<string, string> = {
  "0": "Domingo",
  "1": "Segunda",
  "2": "Terça",
  "3": "Quarta",
  "4": "Quinta",
  "5": "Sexta",
  "6": "Sábado",
};

export default function AgendarMeuBronzePage() {
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [empresa, setEmpresa] = useState<Empresa>(EMPRESA_PADRAO);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  const [servicoId, setServicoId] = useState("");
  const [profissionalId, setProfissionalId] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [instagram, setInstagram] = useState("");
  const [enderecoCompleto, setEnderecoCompleto] = useState("");
  const [telefone, setTelefone] = useState("");
  const [usoRoacutan, setUsoRoacutan] = useState("");
  const [usoMounjaro, setUsoMounjaro] = useState("");
  const [comoConheceu, setComoConheceu] = useState("");
  const [jaFezBronze, setJaFezBronze] = useState("");
  const [ocasiaoEspecial, setOcasiaoEspecial] = useState("");
  const [qualOcasiao, setQualOcasiao] = useState("");
  const [observacoesCliente, setObservacoesCliente] = useState("");

  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const { data: empresaEncontrada, error: erroEmpresa } = await supabase
        .from("empresas")
        .select("*")
        .eq("slug", "principal")
        .eq("ativo", true)
        .single();

      if (erroEmpresa || !empresaEncontrada) {
        throw new Error("Empresa principal não encontrada no Supabase.");
      }

      const empresaFinal = normalizarEmpresa(empresaEncontrada);
      setEmpresa(empresaFinal);

      const [resServicos, resProfissionais, resClientes, resAgendamentos] =
        await Promise.all([
          supabase
            .from("servicos")
            .select("*")
            .eq("empresa_id", empresaFinal.id)
            .eq("ativo", true)
            .order("nome", { ascending: true }),
          supabase
            .from("profissionais")
            .select("*")
            .eq("empresa_id", empresaFinal.id)
            .eq("ativo", true)
            .order("nome", { ascending: true }),
          supabase
            .from("clientes")
            .select("*")
            .eq("empresa_id", empresaFinal.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("agendamentos")
            .select("*")
            .eq("empresa_id", empresaFinal.id)
            .neq("status", "Cancelado")
            .order("data", { ascending: true })
            .order("hora", { ascending: true }),
        ]);

      if (resServicos.error) throw resServicos.error;
      if (resProfissionais.error) throw resProfissionais.error;
      if (resClientes.error) throw resClientes.error;
      if (resAgendamentos.error) throw resAgendamentos.error;

      setServicos((resServicos.data || []).map(normalizarServico));
      setProfissionais((resProfissionais.data || []).map(normalizarProfissional));
      setClientes((resClientes.data || []).map(normalizarCliente));
      setAgendamentos((resAgendamentos.data || []).map(normalizarAgendamento));
    } catch (error: any) {
      setErro(error?.message || "Erro ao carregar a agenda.");
    } finally {
      setCarregando(false);
    }
  }

  function normalizarEmpresa(item: any): Empresa {
    return {
      id: item.id || "",
      slug: item.slug || "principal",
      nome: item.nome || "Divino Bronze",
      responsavel: item.responsavel || "",
      telefone: item.telefone || "",
      whatsapp: item.whatsapp || "",
      instagram: item.instagram || "",
      email: item.email || "",
      endereco: item.endereco || "",
      abertura: cortarHora(item.abertura || "09:30"),
      fechamento: cortarHora(item.fechamento || "22:00"),
      intervalo: Number(item.intervalo || 60),
      dias_funcionamento: Array.isArray(item.dias_funcionamento)
        ? item.dias_funcionamento
        : ["1", "2", "3", "4", "5", "6"],
      observacoes: item.observacoes || "",
      ativo: item.ativo !== false,
    };
  }

  function normalizarServico(item: any): Servico {
    return {
      id: item.id,
      empresa_id: item.empresa_id,
      nome: item.nome || "Serviço",
      descricao: item.descricao || "",
      duracao: Number(item.duracao || 30),
      valor: Number(item.valor || 0),
      sinal: Number(item.sinal || 0),
      ativo: item.ativo !== false,
      observacoes: item.observacoes || "",
      fotos_resultado: Array.isArray(item.fotos_resultado)
        ? item.fotos_resultado
        : [],
    };
  }

  function normalizarProfissional(item: any): Profissional {
    return {
      id: item.id,
      empresa_id: item.empresa_id,
      nome: item.nome || "Profissional",
      telefone: item.telefone || "",
      email: item.email || "",
      funcao: item.funcao || "",
      inicio: cortarHora(item.inicio || empresa.abertura || "09:30"),
      fim: cortarHora(item.fim || empresa.fechamento || "22:00"),
      dias_atendimento: Array.isArray(item.dias_atendimento)
        ? item.dias_atendimento
        : empresa.dias_funcionamento,
      ativo: item.ativo !== false,
      observacoes: item.observacoes || "",
    };
  }

  function normalizarCliente(item: any): Cliente {
    return {
      id: item.id,
      empresa_id: item.empresa_id,
      nome_completo: item.nome_completo || "",
      cpf: item.cpf || "",
      email: item.email || "",
      data_nascimento: item.data_nascimento || null,
      instagram: item.instagram || "",
      endereco_completo: item.endereco_completo || "",
      telefone: item.telefone || "",
      profissao: item.profissao || "",
      uso_roacutan: item.uso_roacutan || "",
      uso_mounjaro: item.uso_mounjaro || "",
      como_conheceu: item.como_conheceu || "",
      ja_fez_bronze: item.ja_fez_bronze || "",
      ocasiao_especial: item.ocasiao_especial || "",
      qual_ocasiao: item.qual_ocasiao || "",
      observacoes_internas: item.observacoes_internas || "",
      origem_cadastro: item.origem_cadastro || "Agendamento público",
    };
  }

  function normalizarAgendamento(item: any): Agendamento {
    return {
      id: item.id,
      empresa_id: item.empresa_id,
      cliente_id: item.cliente_id,
      servico_id: item.servico_id || null,
      profissional_id: item.profissional_id || null,
      servico: item.servico || "",
      profissional_nome: item.profissional_nome || "",
      data: item.data || "",
      hora: cortarHora(item.hora || ""),
      valor: Number(item.valor || 0),
      sinal: Number(item.sinal || 0),
      sinal_pago: Boolean(item.sinal_pago),
      forma_pagamento: item.forma_pagamento || "A definir",
      status: item.status || "Agendado",
      observacoes: item.observacoes || "",
      origem: item.origem || "Agendamento público",
    };
  }

  function cortarHora(valor: string) {
    return String(valor || "").slice(0, 5);
  }

  function normalizar(texto: string | null | undefined) {
    return (texto || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function limparNumeros(texto: string | null | undefined) {
    return (texto || "").replace(/\D/g, "");
  }

  function diaDaSemana(dataISO: string) {
    return String(new Date(`${dataISO}T12:00:00`).getDay());
  }

  function minutos(horario: string) {
    const [h, m] = horario.split(":").map(Number);
    return h * 60 + m;
  }

  function horarioPorMinutos(total: number) {
    const h = Math.floor(total / 60).toString().padStart(2, "0");
    const m = (total % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  function gerarHorarios(inicio: string, fim: string, intervalo: number) {
    const lista: string[] = [];
    const inicioMin = minutos(inicio || "09:30");
    const fimMin = minutos(fim || "22:00");
    const passo = Number(intervalo || 60);

    for (let atual = inicioMin; atual <= fimMin; atual += passo) {
      lista.push(horarioPorMinutos(atual));
    }

    return lista;
  }

  function formatarMoeda(valor: number) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(dataISO: string) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    if (!ano || !mes || !dia) return dataISO;
    return `${dia}/${mes}/${ano}`;
  }

  const servicosAtivos = useMemo(
    () => servicos.filter((servico) => servico.ativo),
    [servicos]
  );

  const profissionaisAtivos = useMemo(
    () => profissionais.filter((profissional) => profissional.ativo),
    [profissionais]
  );

  const servicoSelecionado = useMemo(() => {
    return servicosAtivos.find((servico) => servico.id === servicoId);
  }, [servicosAtivos, servicoId]);

  const profissionalSelecionada = useMemo(() => {
    return profissionaisAtivos.find(
      (profissional) => profissional.id === profissionalId
    );
  }, [profissionaisAtivos, profissionalId]);

  const diasFuncionamentoTexto = useMemo(() => {
    return empresa.dias_funcionamento
      .map((id) => DIAS_NOMES[id])
      .filter(Boolean)
      .join(", ");
  }, [empresa.dias_funcionamento]);

  const horariosDisponiveis = useMemo(() => {
    if (!data) return [];

    const dia = diaDaSemana(data);

    if (profissionalSelecionada) {
      if (!profissionalSelecionada.dias_atendimento.includes(dia)) return [];

      return gerarHorarios(
        profissionalSelecionada.inicio,
        profissionalSelecionada.fim,
        empresa.intervalo
      ).filter((horario) => !horarioOcupado(horario));
    }

    if (!empresa.dias_funcionamento.includes(dia)) return [];

    return gerarHorarios(
      empresa.abertura,
      empresa.fechamento,
      empresa.intervalo
    ).filter((horario) => !horarioOcupado(horario));
  }, [data, empresa, profissionalSelecionada, agendamentos, profissionalId]);

  function horarioOcupado(horario: string) {
    return agendamentos.some((agendamento) => {
      if (agendamento.status === "Cancelado") return false;
      if (agendamento.data !== data) return false;
      if (cortarHora(agendamento.hora) !== horario) return false;

      if (profissionalId) {
        return agendamento.profissional_id === profissionalId;
      }

      return true;
    });
  }

  function encontrarClienteExistente() {
    const nome = normalizar(nomeCompleto);
    const cpfLimpo = limparNumeros(cpf);
    const emailNormalizado = normalizar(email);
    const telefoneLimpo = limparNumeros(telefone);

    return clientes.find((cliente) => {
      const nomeConfere =
        nome.length >= 6 && normalizar(cliente.nome_completo) === nome;

      const cpfConfere =
        cpfLimpo.length >= 11 && limparNumeros(cliente.cpf) === cpfLimpo;

      const emailConfere =
        emailNormalizado.includes("@") &&
        normalizar(cliente.email) === emailNormalizado;

      const telefoneConfere =
        telefoneLimpo.length >= 10 &&
        limparNumeros(cliente.telefone) === telefoneLimpo;

      return nomeConfere || cpfConfere || emailConfere || telefoneConfere;
    });
  }

  function validarFormulario() {
    if (!empresa.id) {
      alert("Empresa não carregada. Atualize a página e tente novamente.");
      return false;
    }

    if (!servicoId) {
      alert("Selecione o serviço desejado.");
      return false;
    }

    if (!profissionalId) {
      alert("Selecione a profissional.");
      return false;
    }

    if (!data) {
      alert("Selecione a data.");
      return false;
    }

    if (!hora) {
      alert("Selecione o horário.");
      return false;
    }

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
      alert("Preencha todos os campos obrigatórios do cadastro.");
      return false;
    }

    if (ocasiaoEspecial === "Sim" && !qualOcasiao) {
      alert("Informe qual é a ocasião especial.");
      return false;
    }

    if (horarioOcupado(hora)) {
      alert("Este horário acabou de ser ocupado. Selecione outro horário.");
      return false;
    }

    return true;
  }

  async function confirmarAgendamento() {
    if (!validarFormulario()) return;

    setSalvando(true);
    setErro("");

    try {
      const clienteExistente = encontrarClienteExistente();
      let clienteId = clienteExistente?.id;

      if (!clienteId) {
        const { data: novoCliente, error: erroCliente } = await supabase
          .from("clientes")
          .insert({
            empresa_id: empresa.id,
            nome_completo: nomeCompleto,
            cpf,
            email,
            data_nascimento: dataNascimento || null,
            instagram,
            endereco_completo: enderecoCompleto,
            telefone,
            profissao: "",
            uso_roacutan: usoRoacutan,
            uso_mounjaro: usoMounjaro,
            como_conheceu: comoConheceu,
            ja_fez_bronze: jaFezBronze,
            ocasiao_especial: ocasiaoEspecial,
            qual_ocasiao: qualOcasiao,
            observacoes_internas: observacoesCliente,
            origem_cadastro: "Agendamento público",
          })
          .select("*")
          .single();

        if (erroCliente) throw erroCliente;
        clienteId = novoCliente.id;
      }

      const { data: novoAgendamento, error: erroAgendamento } = await supabase
        .from("agendamentos")
        .insert({
          empresa_id: empresa.id,
          cliente_id: clienteId,
          servico_id: servicoSelecionado?.id || null,
          profissional_id: profissionalSelecionada?.id || null,
          servico: servicoSelecionado?.nome || "Serviço",
          profissional_nome: profissionalSelecionada?.nome || "",
          data,
          hora,
          valor: servicoSelecionado?.valor || 0,
          sinal: servicoSelecionado?.sinal || 0,
          sinal_pago: false,
          forma_pagamento: "A definir",
          status: "Agendado",
          observacoes: observacoesCliente,
          origem: "Agendamento público",
        })
        .select("*")
        .single();

      if (erroAgendamento) throw erroAgendamento;

      setAgendamentos((lista) => [
        ...lista,
        normalizarAgendamento(novoAgendamento),
      ]);

      setConfirmado(true);
    } catch (error: any) {
      setErro(error?.message || "Erro ao confirmar agendamento.");
      alert(error?.message || "Erro ao confirmar agendamento.");
    } finally {
      setSalvando(false);
    }
  }

  function limparFormulario() {
    setConfirmado(false);
    setServicoId("");
    setProfissionalId("");
    setData("");
    setHora("");
    setNomeCompleto("");
    setCpf("");
    setEmail("");
    setDataNascimento("");
    setInstagram("");
    setEnderecoCompleto("");
    setTelefone("");
    setUsoRoacutan("");
    setUsoMounjaro("");
    setComoConheceu("");
    setJaFezBronze("");
    setOcasiaoEspecial("");
    setQualOcasiao("");
    setObservacoesCliente("");
    carregarDados();
  }

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090604] px-5 text-white">
        <div className="rounded-[2rem] border border-[#3a2a17] bg-[#15100d] p-8 text-center shadow-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d7b56d]">
            Divino Bronze
          </p>
          <h1 className="mt-4 text-2xl font-bold">Carregando agenda...</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Buscando os horários disponíveis.
          </p>
        </div>
      </main>
    );
  }

  if (erro && !empresa.id) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090604] px-5 text-white">
        <div className="max-w-xl rounded-[2rem] border border-red-900 bg-red-950/30 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-red-300">
            Erro de conexão
          </p>
          <h1 className="mt-4 text-2xl font-bold">
            Não foi possível carregar a agenda.
          </h1>
          <p className="mt-3 text-sm text-red-100">{erro}</p>
          <button
            onClick={carregarDados}
            className="mt-6 rounded-2xl bg-[#d7b56d] px-6 py-3 font-semibold text-black"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  if (confirmado) {
    return (
      <main className="min-h-screen bg-[#090604] px-5 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#3a2a17] bg-[#15100d] p-8 text-center shadow-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d7b56d]">
            Agendamento recebido
          </p>

          <h1 className="mt-4 text-3xl font-bold md:text-5xl">
            Seu bronze foi solicitado com sucesso.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-zinc-300">
            Recebemos seus dados e seu horário entrou na agenda como{" "}
            <strong>Agendado</strong>. Em breve a equipe poderá confirmar seu
            atendimento.
          </p>

          <div className="mt-8 rounded-3xl border border-[#3a2a17] bg-black/40 p-6 text-left">
            <ResumoConfirmacao titulo="Serviço" valor={servicoSelecionado?.nome || "Não informado"} />
            <ResumoConfirmacao titulo="Data e horário" valor={`${formatarData(data)} às ${hora}`} />
            <ResumoConfirmacao titulo="Profissional" valor={profissionalSelecionada?.nome || "Não informada"} />
            <ResumoConfirmacao titulo="Valor" valor={formatarMoeda(servicoSelecionado?.valor || 0)} />
            <ResumoConfirmacao titulo="Sinal" valor={formatarMoeda(servicoSelecionado?.sinal || 0)} />
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {empresa.whatsapp && (
              <a
                href={`https://wa.me/55${limparNumeros(empresa.whatsapp)}`}
                target="_blank"
                className="inline-flex justify-center rounded-2xl bg-[#d7b56d] px-6 py-3 font-semibold text-black hover:bg-[#f1d58a]"
              >
                Falar com a equipe
              </a>
            )}

            <button
              onClick={limparFormulario}
              className="rounded-2xl border border-zinc-700 px-6 py-3 font-semibold text-zinc-200"
            >
              Fazer novo agendamento
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#090604] text-white">
      <section className="relative px-5 py-10 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#5a3e36_0%,transparent_32%),radial-gradient(circle_at_bottom_right,#3a2a17_0%,transparent_30%)] opacity-50" />

        <div className="relative mx-auto max-w-6xl">
          <header className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.55em] text-[#d7b56d]">
              {empresa.nome}
            </p>

            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Agende seu bronze premium
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg">
              Bronzeamento a jato profissional para realçar sua beleza com
              acabamento natural, pele iluminada e resultado sofisticado, sem
              aparência artificial.
            </p>

            <div className="mx-auto mt-7 flex max-w-4xl flex-wrap justify-center gap-3 text-sm text-zinc-300">
              <Selo texto="Resultado natural" />
              <Selo texto="Atendimento personalizado" />
              <Selo texto="Sem tons alaranjados" />
              <Selo texto="Acabamento premium" />
            </div>

            <div className="mx-auto mt-7 flex max-w-4xl flex-wrap justify-center gap-3 text-sm">
              {empresa.whatsapp && (
                <a
                  href={`https://wa.me/55${limparNumeros(empresa.whatsapp)}`}
                  target="_blank"
                  className="rounded-full border border-[#d7b56d] bg-[#d7b56d] px-5 py-3 font-semibold text-black hover:bg-[#f1d58a]"
                >
                  Chamar no WhatsApp
                </a>
              )}

              {empresa.instagram && (
                <span className="rounded-full border border-[#3a2a17] bg-black/40 px-5 py-3 text-zinc-300">
                  {empresa.instagram}
                </span>
              )}

              {empresa.endereco && (
                <span className="rounded-full border border-[#3a2a17] bg-black/40 px-5 py-3 text-zinc-300">
                  {empresa.endereco}
                </span>
              )}
            </div>
          </header>

          <section className="mb-8 grid gap-4 md:grid-cols-3">
            <BlocoConfianca
              titulo="Avaliação antes da aplicação"
              texto="O atendimento considera seu objetivo, ocasião e histórico para orientar o melhor resultado."
            />

            <BlocoConfianca
              titulo="Visual elegante e natural"
              texto="A proposta é realçar a pele com sofisticação, evitando aspecto carregado ou artificial."
            />

            <BlocoConfianca
              titulo="Agendamento com confirmação"
              texto="Sua solicitação entra na agenda e a equipe poderá confirmar os detalhes do atendimento."
            />
          </section>

          {erro && (
            <div className="mb-6 rounded-2xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-100">
              {erro}
            </div>
          )}

          <section className="rounded-[2rem] border border-[#3a2a17] bg-[#15100d]/95 p-5 shadow-2xl backdrop-blur md:p-8">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.25em] text-[#d7b56d]">
                Etapa 1
              </p>
              <h2 className="mt-2 text-2xl font-bold">Escolha seu serviço</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Selecione o procedimento desejado para visualizar valor, sinal,
                duração e disponibilidade.
              </p>
            </div>

            {servicosAtivos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-700 p-8 text-center text-zinc-400">
                Nenhum serviço ativo foi cadastrado ainda.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {servicosAtivos.map((servico) => (
                  <button
                    key={servico.id}
                    onClick={() => {
                      setServicoId(servico.id);
                      setHora("");
                    }}
                    className={`overflow-hidden rounded-3xl border text-left transition ${
                      servicoId === servico.id
                        ? "border-[#d7b56d] bg-[#d7b56d] text-black"
                        : "border-zinc-800 bg-black/50 text-white hover:border-[#d7b56d]"
                    }`}
                  >
                    {servico.fotos_resultado.length > 0 ? (
                      <div className="grid grid-cols-2 gap-1 p-2">
                        {servico.fotos_resultado.slice(0, 4).map((foto) => (
                          <img
                            key={foto}
                            src={foto}
                            alt={`Resultado ${servico.nome}`}
                            className="h-44 w-full rounded-2xl object-cover md:h-52"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-[#0b0705] text-sm text-zinc-500 md:h-52">
                        Serviço sem fotos cadastradas
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold">{servico.nome}</h3>

                          {servico.descricao && (
                            <p className="mt-2 text-sm opacity-80">
                              {servico.descricao}
                            </p>
                          )}
                        </div>

                        {servicoId === servico.id && (
                          <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em]">
                            Selecionado
                          </span>
                        )}
                      </div>

                      <div className="mt-5 grid gap-3 text-sm font-semibold sm:grid-cols-3">
                        <InfoServico titulo="Duração" valor={`${servico.duracao} min`} />
                        <InfoServico titulo="Valor" valor={formatarMoeda(servico.valor)} />
                        <InfoServico titulo="Sinal" valor={formatarMoeda(servico.sinal)} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-12">
              <p className="text-sm uppercase tracking-[0.25em] text-[#d7b56d]">
                Etapa 2
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Escolha profissional, data e horário
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Os horários aparecem conforme a agenda disponível.
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Profissional *
                </label>

                <select
                  value={profissionalId}
                  onChange={(event) => {
                    setProfissionalId(event.target.value);
                    setHora("");
                  }}
                  className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d7b56d]"
                >
                  <option value="">Selecione</option>

                  {profissionaisAtivos.map((profissional) => (
                    <option key={profissional.id} value={profissional.id}>
                      {profissional.nome}
                    </option>
                  ))}
                </select>
              </div>

              <CampoTexto
                label="Data *"
                valor={data}
                setValor={(valor) => {
                  setData(valor);
                  setHora("");
                }}
                tipo="date"
              />

              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Horário *
                </label>

                <select
                  value={hora}
                  onChange={(event) => setHora(event.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d7b56d]"
                >
                  <option value="">Selecione</option>

                  {horariosDisponiveis.map((horario) => (
                    <option key={horario} value={horario}>
                      {horario}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#3a2a17] bg-black/40 p-4 text-sm text-zinc-300">
              <strong className="text-[#d7b56d]">Funcionamento:</strong>{" "}
              {diasFuncionamentoTexto || "Dias não cadastrados"} •{" "}
              {empresa.abertura} às {empresa.fechamento}
            </div>

            {data && horariosDisponiveis.length === 0 && (
              <div className="mt-4 rounded-2xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
                Não há horários disponíveis para esta data. Escolha outra data
                ou outra profissional.
              </div>
            )}

            <div className="mt-12">
              <p className="text-sm uppercase tracking-[0.25em] text-[#d7b56d]">
                Etapa 3
              </p>
              <h2 className="mt-2 text-2xl font-bold">Preencha seus dados</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Essas informações ajudam a equipe a preparar seu atendimento
                com mais segurança e personalização.
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <CampoTexto label="Nome completo *" valor={nomeCompleto} setValor={setNomeCompleto} />
              <CampoTexto label="CPF *" valor={cpf} setValor={setCpf} />
              <CampoTexto label="Email *" valor={email} setValor={setEmail} tipo="email" />
              <CampoTexto label="Data de nascimento *" valor={dataNascimento} setValor={setDataNascimento} tipo="date" />
              <CampoTexto label="Instagram" valor={instagram} setValor={setInstagram} placeholder="@seuinstagram" />
              <CampoTexto label="Telefone para contato *" valor={telefone} setValor={setTelefone} placeholder="51999999999" />

              <div className="md:col-span-2">
                <CampoArea
                  label="Endereço completo"
                  valor={enderecoCompleto}
                  setValor={setEnderecoCompleto}
                  placeholder="Endereço não obrigatório"
                />
              </div>

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
                opcoes={["Instagram", "Google", "Indicação", "Cliente antiga", "WhatsApp", "Outro", "Web"]}
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
                  label="Observações"
                  valor={observacoesCliente}
                  setValor={setObservacoesCliente}
                  placeholder="Conte algo importante para o seu atendimento."
                />
              </div>
            </div>

            {servicoSelecionado && (
              <div className="mt-8 rounded-3xl border border-[#3a2a17] bg-black/40 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-[#d7b56d]">
                  Resumo do agendamento
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-4">
                  <ResumoItem titulo="Serviço" valor={servicoSelecionado.nome} />
                  <ResumoItem titulo="Valor" valor={formatarMoeda(servicoSelecionado.valor)} />
                  <ResumoItem titulo="Sinal" valor={formatarMoeda(servicoSelecionado.sinal)} />
                  <ResumoItem
                    titulo="Horário"
                    valor={data && hora ? `${formatarData(data)} às ${hora}` : "Não selecionado"}
                  />
                </div>

                {profissionalSelecionada && (
                  <div className="mt-4 rounded-2xl border border-zinc-800 bg-[#15100d] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Profissional selecionada
                    </p>
                    <p className="mt-1 font-semibold">
                      {profissionalSelecionada.nome}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <p className="text-sm text-zinc-500">
                Ao confirmar, seu horário será registrado como solicitação de
                agendamento.
              </p>

              <button
                onClick={confirmarAgendamento}
                disabled={salvando}
                className="rounded-2xl bg-[#d7b56d] px-8 py-4 font-bold text-black transition hover:bg-[#f1d58a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvando ? "Enviando..." : "Solicitar meu bronze"}
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Selo({ texto }: { texto: string }) {
  return (
    <span className="rounded-full border border-[#3a2a17] bg-black/40 px-4 py-2">
      {texto}
    </span>
  );
}

function BlocoConfianca({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="rounded-3xl border border-[#3a2a17] bg-[#15100d]/90 p-5 shadow-xl">
      <p className="text-sm uppercase tracking-[0.25em] text-[#d7b56d]">
        Divino Bronze
      </p>
      <h3 className="mt-3 text-lg font-bold">{titulo}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{texto}</p>
    </div>
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

function InfoServico({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-2xl bg-black/20 p-3">
      <p className="text-xs uppercase tracking-[0.15em] opacity-60">{titulo}</p>
      <p className="mt-1 font-bold">{valor}</p>
    </div>
  );
}

function ResumoItem({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
        {titulo}
      </p>
      <p className="mt-1 font-semibold text-white">{valor}</p>
    </div>
  );
}

function ResumoConfirmacao({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="text-sm text-zinc-400">{titulo}</p>
      <p className="font-semibold">{valor}</p>
    </div>
  );
}
