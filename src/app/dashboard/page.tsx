"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Aba = "agenda" | "clientes" | "financeiro" | "empresa";
type StatusAgendamento = "Agendado" | "Confirmado" | "Atendido" | "Cancelado";

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
  status: StatusAgendamento;
  observacoes: string;
  origem: "Painel interno" | "Agendamento público";
}

const DIAS = [
  { id: "0", nome: "Domingo", curto: "Dom" },
  { id: "1", nome: "Segunda", curto: "Seg" },
  { id: "2", nome: "Terça", curto: "Ter" },
  { id: "3", nome: "Quarta", curto: "Qua" },
  { id: "4", nome: "Quinta", curto: "Qui" },
  { id: "5", nome: "Sexta", curto: "Sex" },
  { id: "6", nome: "Sábado", curto: "Sáb" },
];

const EMPRESA_PADRAO: Empresa = {
  id: "",
  slug: "principal",
  nome: "Agenda Bronze",
  responsavel: "",
  telefone: "",
  whatsapp: "",
  instagram: "",
  email: "",
  endereco: "",
  abertura: "08:00",
  fechamento: "20:00",
  intervalo: 30,
  dias_funcionamento: ["1", "2", "3", "4", "5", "6"],
  observacoes: "",
  ativo: true,
};

function hojeISO() {
  return new Date().toISOString().split("T")[0];
}

function cortarHora(valor: string) {
  return String(valor || "").slice(0, 5);
}

function normalizarTexto(texto: string | null | undefined) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function limparNumeros(texto: string | null | undefined) {
  return (texto || "").replace(/\D/g, "");
}

function formatarData(dataISO: string | null | undefined) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  if (!ano || !mes || !dia) return dataISO;
  return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor: number) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function minutos(hora: string) {
  const [h, m] = cortarHora(hora || "08:00").split(":").map(Number);
  return h * 60 + m;
}

function horaPorMinutos(total: number) {
  const h = Math.floor(total / 60).toString().padStart(2, "0");
  const m = (total % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function gerarHorarios(inicio: string, fim: string, intervalo: number) {
  const lista: string[] = [];
  const ini = minutos(inicio || "08:00");
  const end = minutos(fim || "20:00");
  const passo = Number(intervalo || 30);
  for (let atual = ini; atual <= end; atual += passo) {
    lista.push(horaPorMinutos(atual));
  }
  return lista;
}

function diaSemana(dataISO: string) {
  return String(new Date(`${dataISO}T12:00:00`).getDay());
}

function nomesDias(ids: string[]) {
  if (!ids || ids.length === 0) return "Nenhum dia selecionado";
  return DIAS.filter((dia) => ids.includes(dia.id))
    .map((dia) => dia.curto)
    .join(", ");
}

export default function DashboardPage() {
  const [aba, setAba] = useState<Aba>("agenda");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [empresa, setEmpresa] = useState<Empresa>(EMPRESA_PADRAO);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  const [dataAgenda, setDataAgenda] = useState(hojeISO());
  const [filtroProfissional, setFiltroProfissional] = useState("");
  const [buscaAgenda, setBuscaAgenda] = useState("");
  const [buscaClientes, setBuscaClientes] = useState("");
  const [clienteAberta, setClienteAberta] = useState("");
  const [mesFinanceiro, setMesFinanceiro] = useState(new Date().toISOString().slice(0, 7));

  const [modalCliente, setModalCliente] = useState(false);
  const [modalAgendamento, setModalAgendamento] = useState(false);
  const [editClienteId, setEditClienteId] = useState("");
  const [editAgendamentoId, setEditAgendamentoId] = useState("");

  const [clienteForm, setClienteForm] = useState({
    nome_completo: "",
    cpf: "",
    email: "",
    data_nascimento: "",
    instagram: "",
    endereco_completo: "",
    telefone: "",
    profissao: "",
    uso_roacutan: "",
    uso_mounjaro: "",
    como_conheceu: "",
    ja_fez_bronze: "",
    ocasiao_especial: "",
    qual_ocasiao: "",
    observacoes_internas: "",
  });

  const [agendamentoForm, setAgendamentoForm] = useState({
    cliente_id: "",
    servico_id: "",
    profissional_id: "",
    data: hojeISO(),
    hora: "",
    valor: "0",
    sinal: "0",
    sinal_pago: false,
    forma_pagamento: "A definir",
    status: "Agendado" as StatusAgendamento,
    observacoes: "",
    origem: "Painel interno" as "Painel interno" | "Agendamento público",
  });

  const [servicoForm, setServicoForm] = useState({
    id: "",
    nome: "",
    descricao: "",
    duracao: "30",
    valor: "150",
    sinal: "50",
    observacoes: "",
    fotos_resultado: "",
  });

  const [profissionalForm, setProfissionalForm] = useState({
    id: "",
    nome: "",
    telefone: "",
    email: "",
    funcao: "",
    inicio: "08:00",
    fim: "20:00",
    dias_atendimento: ["1", "2", "3", "4", "5", "6"] as string[],
    observacoes: "",
  });

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    setCarregando(true);
    setErro("");
    try {
      const { data: empresaData, error: empresaError } = await supabase
        .from("empresas")
        .select("*")
        .eq("slug", "principal")
        .single();

      if (empresaError || !empresaData) {
        throw new Error("Empresa principal não encontrada no Supabase.");
      }

      const empresaNormalizada = normalizarEmpresa(empresaData);
      setEmpresa(empresaNormalizada);

      const [clientesRes, servicosRes, profissionaisRes, agendamentosRes] = await Promise.all([
        supabase.from("clientes").select("*").eq("empresa_id", empresaNormalizada.id).order("created_at", { ascending: false }),
        supabase.from("servicos").select("*").eq("empresa_id", empresaNormalizada.id).order("created_at", { ascending: false }),
        supabase.from("profissionais").select("*").eq("empresa_id", empresaNormalizada.id).order("created_at", { ascending: false }),
        supabase.from("agendamentos").select("*").eq("empresa_id", empresaNormalizada.id).order("data", { ascending: true }).order("hora", { ascending: true }),
      ]);

      if (clientesRes.error) throw clientesRes.error;
      if (servicosRes.error) throw servicosRes.error;
      if (profissionaisRes.error) throw profissionaisRes.error;
      if (agendamentosRes.error) throw agendamentosRes.error;

      setClientes((clientesRes.data || []).map(normalizarCliente));
      setServicos((servicosRes.data || []).map(normalizarServico));
      setProfissionais((profissionaisRes.data || []).map(normalizarProfissional));
      setAgendamentos((agendamentosRes.data || []).map(normalizarAgendamento));
    } catch (error: any) {
      setErro(error?.message || "Erro ao carregar dados do Supabase.");
    } finally {
      setCarregando(false);
    }
  }

  function normalizarEmpresa(item: any): Empresa {
    return {
      id: item.id || "",
      slug: item.slug || "principal",
      nome: item.nome || "Agenda Bronze",
      responsavel: item.responsavel || "",
      telefone: item.telefone || "",
      whatsapp: item.whatsapp || "",
      instagram: item.instagram || "",
      email: item.email || "",
      endereco: item.endereco || "",
      abertura: cortarHora(item.abertura || "08:00"),
      fechamento: cortarHora(item.fechamento || "20:00"),
      intervalo: Number(item.intervalo || 30),
      dias_funcionamento: Array.isArray(item.dias_funcionamento) ? item.dias_funcionamento : ["1", "2", "3", "4", "5", "6"],
      observacoes: item.observacoes || "",
      ativo: item.ativo !== false,
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
      origem_cadastro: item.origem_cadastro || "Painel interno",
    };
  }

  function normalizarServico(item: any): Servico {
    return {
      id: item.id,
      empresa_id: item.empresa_id,
      nome: item.nome || "Serviço sem nome",
      descricao: item.descricao || "",
      duracao: Number(item.duracao || 30),
      valor: Number(item.valor || 0),
      sinal: Number(item.sinal || 0),
      ativo: item.ativo !== false,
      observacoes: item.observacoes || "",
      fotos_resultado: Array.isArray(item.fotos_resultado) ? item.fotos_resultado : [],
    };
  }

  function normalizarProfissional(item: any): Profissional {
    return {
      id: item.id,
      empresa_id: item.empresa_id,
      nome: item.nome || "Profissional sem nome",
      telefone: item.telefone || "",
      email: item.email || "",
      funcao: item.funcao || "",
      inicio: cortarHora(item.inicio || "08:00"),
      fim: cortarHora(item.fim || "20:00"),
      dias_atendimento: Array.isArray(item.dias_atendimento) ? item.dias_atendimento : ["1", "2", "3", "4", "5", "6"],
      ativo: item.ativo !== false,
      observacoes: item.observacoes || "",
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
      origem: item.origem || "Painel interno",
    };
  }

  const servicosAtivos = useMemo(() => servicos.filter((s) => s.ativo), [servicos]);
  const profissionaisAtivos = useMemo(() => profissionais.filter((p) => p.ativo), [profissionais]);

  const profissionalFiltro = useMemo(
    () => profissionaisAtivos.find((p) => p.id === filtroProfissional),
    [profissionaisAtivos, filtroProfissional]
  );

  const horariosDia = useMemo(() => {
    const dia = diaSemana(dataAgenda);
    if (profissionalFiltro) {
      if (!profissionalFiltro.dias_atendimento.includes(dia)) return [];
      return gerarHorarios(profissionalFiltro.inicio, profissionalFiltro.fim, empresa.intervalo);
    }
    if (!empresa.dias_funcionamento.includes(dia)) return [];
    return gerarHorarios(empresa.abertura, empresa.fechamento, empresa.intervalo);
  }, [dataAgenda, profissionalFiltro, empresa]);

  const agendamentosDia = useMemo(() => {
    return agendamentos
      .filter((a) => a.data === dataAgenda && a.status !== "Cancelado")
      .filter((a) => !filtroProfissional || a.profissional_id === filtroProfissional)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }, [agendamentos, dataAgenda, filtroProfissional]);

  const solicitacoesSite = useMemo(() => {
    return agendamentos
      .filter((a) => a.origem === "Agendamento público" && a.status === "Agendado")
      .sort((a, b) => `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`));
  }, [agendamentos]);

  const agendamentosBusca = useMemo(() => {
    const termo = normalizarTexto(buscaAgenda);
    if (!termo) return agendamentosDia;
    return agendamentos.filter((a) => {
      const cliente = clientePorId(a.cliente_id);
      return (
        normalizarTexto(cliente?.nome_completo).includes(termo) ||
        limparNumeros(cliente?.telefone).includes(limparNumeros(termo)) ||
        normalizarTexto(a.servico).includes(termo) ||
        normalizarTexto(a.profissional_nome).includes(termo) ||
        normalizarTexto(a.status).includes(termo) ||
        normalizarTexto(a.origem).includes(termo)
      );
    });
  }, [buscaAgenda, agendamentos, agendamentosDia, clientes]);

  const clientesFiltradas = useMemo(() => {
    const termo = normalizarTexto(buscaClientes);
    return clientes
      .filter((c) => {
        if (!termo) return true;
        return (
          normalizarTexto(c.nome_completo).includes(termo) ||
          normalizarTexto(c.email).includes(termo) ||
          limparNumeros(c.telefone).includes(limparNumeros(termo)) ||
          limparNumeros(c.cpf).includes(limparNumeros(termo)) ||
          normalizarTexto(c.instagram).includes(termo)
        );
      })
      .sort((a, b) => a.nome_completo.localeCompare(b.nome_completo));
  }, [clientes, buscaClientes]);

  const financeiro = useMemo(() => {
    const doMes = agendamentos.filter((a) => a.data.startsWith(mesFinanceiro) && a.status !== "Cancelado");
    const hoje = agendamentos.filter((a) => a.data === hojeISO() && a.status !== "Cancelado");
    const recebido = (lista: Agendamento[]) =>
      lista.reduce((total, a) => {
        const sinal = a.sinal_pago ? a.sinal : 0;
        const restante = a.status === "Atendido" ? Math.max(a.valor - a.sinal, 0) : 0;
        return total + sinal + restante;
      }, 0);
    const previsto = (lista: Agendamento[]) => lista.reduce((total, a) => total + a.valor, 0);
    return {
      previstoHoje: previsto(hoje),
      recebidoHoje: recebido(hoje),
      previstoMes: previsto(doMes),
      recebidoMes: recebido(doMes),
      sinaisPendentes: agendamentos.filter((a) => a.status !== "Cancelado" && a.sinal > 0 && !a.sinal_pago),
    };
  }, [agendamentos, mesFinanceiro]);

  function clientePorId(id: string) {
    return clientes.find((c) => c.id === id);
  }

  function historicoCliente(id: string) {
    return agendamentos
      .filter((a) => a.cliente_id === id)
      .sort((a, b) => `${b.data} ${b.hora}`.localeCompare(`${a.data} ${a.hora}`));
  }

  function horarioOcupado(hora: string) {
    return agendamentosDia.find((a) => cortarHora(a.hora) === hora);
  }

  function limparClienteForm() {
    setEditClienteId("");
    setClienteForm({
      nome_completo: "",
      cpf: "",
      email: "",
      data_nascimento: "",
      instagram: "",
      endereco_completo: "",
      telefone: "",
      profissao: "",
      uso_roacutan: "",
      uso_mounjaro: "",
      como_conheceu: "",
      ja_fez_bronze: "",
      ocasiao_especial: "",
      qual_ocasiao: "",
      observacoes_internas: "",
    });
  }

  function limparAgendamentoForm() {
    setEditAgendamentoId("");
    setAgendamentoForm({
      cliente_id: "",
      servico_id: "",
      profissional_id: "",
      data: dataAgenda || hojeISO(),
      hora: "",
      valor: "0",
      sinal: "0",
      sinal_pago: false,
      forma_pagamento: "A definir",
      status: "Agendado",
      observacoes: "",
      origem: "Painel interno",
    });
  }

  function abrirNovoAgendamento(hora?: string) {
    limparAgendamentoForm();
    setAgendamentoForm((atual) => ({ ...atual, data: dataAgenda, hora: hora || "", profissional_id: filtroProfissional }));
    setModalAgendamento(true);
  }

  function editarCliente(cliente: Cliente) {
    setEditClienteId(cliente.id);
    setClienteForm({
      nome_completo: cliente.nome_completo,
      cpf: cliente.cpf,
      email: cliente.email,
      data_nascimento: cliente.data_nascimento || "",
      instagram: cliente.instagram,
      endereco_completo: cliente.endereco_completo,
      telefone: cliente.telefone,
      profissao: cliente.profissao,
      uso_roacutan: cliente.uso_roacutan,
      uso_mounjaro: cliente.uso_mounjaro,
      como_conheceu: cliente.como_conheceu,
      ja_fez_bronze: cliente.ja_fez_bronze,
      ocasiao_especial: cliente.ocasiao_especial,
      qual_ocasiao: cliente.qual_ocasiao,
      observacoes_internas: cliente.observacoes_internas,
    });
    setModalCliente(true);
  }

  async function salvarCliente() {
    if (!empresa.id) return alert("Empresa não carregada.");
    if (!clienteForm.nome_completo || !clienteForm.telefone) return alert("Preencha nome e telefone da cliente.");
    setSalvando(true);
    try {
      const payload = {
        empresa_id: empresa.id,
        nome_completo: clienteForm.nome_completo,
        cpf: clienteForm.cpf,
        email: clienteForm.email,
        data_nascimento: clienteForm.data_nascimento || null,
        instagram: clienteForm.instagram,
        endereco_completo: clienteForm.endereco_completo,
        telefone: clienteForm.telefone,
        profissao: clienteForm.profissao,
        uso_roacutan: clienteForm.uso_roacutan,
        uso_mounjaro: clienteForm.uso_mounjaro,
        como_conheceu: clienteForm.como_conheceu,
        ja_fez_bronze: clienteForm.ja_fez_bronze,
        ocasiao_especial: clienteForm.ocasiao_especial,
        qual_ocasiao: clienteForm.qual_ocasiao,
        observacoes_internas: clienteForm.observacoes_internas,
        origem_cadastro: "Painel interno",
      };
      if (editClienteId) {
        const { data, error } = await supabase.from("clientes").update(payload).eq("id", editClienteId).select("*").single();
        if (error) throw error;
        setClientes((lista) => lista.map((c) => (c.id === editClienteId ? normalizarCliente(data) : c)));
      } else {
        const { data, error } = await supabase.from("clientes").insert(payload).select("*").single();
        if (error) throw error;
        setClientes((lista) => [normalizarCliente(data), ...lista]);
      }
      limparClienteForm();
      setModalCliente(false);
    } catch (error: any) {
      alert(error?.message || "Erro ao salvar cliente.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirCliente(id: string) {
    if (agendamentos.some((a) => a.cliente_id === id)) return alert("Esta cliente possui agendamentos vinculados.");
    if (!confirm("Deseja excluir esta cliente?")) return;
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) return alert(error.message);
    setClientes((lista) => lista.filter((c) => c.id !== id));
  }

  function editarAgendamento(a: Agendamento) {
    setEditAgendamentoId(a.id);
    setAgendamentoForm({
      cliente_id: a.cliente_id,
      servico_id: a.servico_id || "",
      profissional_id: a.profissional_id || "",
      data: a.data,
      hora: a.hora,
      valor: String(a.valor),
      sinal: String(a.sinal),
      sinal_pago: a.sinal_pago,
      forma_pagamento: a.forma_pagamento,
      status: a.status,
      observacoes: a.observacoes,
      origem: a.origem,
    });
    setModalAgendamento(true);
  }

  async function salvarAgendamento() {
    if (!empresa.id) return alert("Empresa não carregada.");
    if (!agendamentoForm.cliente_id || !agendamentoForm.data || !agendamentoForm.hora) return alert("Selecione cliente, data e horário.");
    setSalvando(true);
    try {
      const servico = servicos.find((s) => s.id === agendamentoForm.servico_id);
      const profissional = profissionais.find((p) => p.id === agendamentoForm.profissional_id);
      const payload = {
        empresa_id: empresa.id,
        cliente_id: agendamentoForm.cliente_id,
        servico_id: agendamentoForm.servico_id || null,
        profissional_id: agendamentoForm.profissional_id || null,
        servico: servico?.nome || "Serviço",
        profissional_nome: profissional?.nome || "",
        data: agendamentoForm.data,
        hora: agendamentoForm.hora,
        valor: Number(agendamentoForm.valor || 0),
        sinal: Number(agendamentoForm.sinal || 0),
        sinal_pago: agendamentoForm.sinal_pago,
        forma_pagamento: agendamentoForm.forma_pagamento,
        status: agendamentoForm.status,
        observacoes: agendamentoForm.observacoes,
        origem: agendamentoForm.origem,
      };
      if (editAgendamentoId) {
        const { data, error } = await supabase.from("agendamentos").update(payload).eq("id", editAgendamentoId).select("*").single();
        if (error) throw error;
        setAgendamentos((lista) => lista.map((a) => (a.id === editAgendamentoId ? normalizarAgendamento(data) : a)));
      } else {
        const { data, error } = await supabase.from("agendamentos").insert(payload).select("*").single();
        if (error) throw error;
        setAgendamentos((lista) => [...lista, normalizarAgendamento(data)]);
      }
      limparAgendamentoForm();
      setModalAgendamento(false);
    } catch (error: any) {
      alert(error?.message || "Erro ao salvar agendamento.");
    } finally {
      setSalvando(false);
    }
  }

  async function atualizarAgendamento(id: string, patch: Partial<Agendamento>) {
    const { data, error } = await supabase.from("agendamentos").update(patch).eq("id", id).select("*").single();
    if (error) return alert(error.message);
    setAgendamentos((lista) => lista.map((a) => (a.id === id ? normalizarAgendamento(data) : a)));
  }

  async function excluirAgendamento(id: string) {
    if (!confirm("Deseja excluir este agendamento?")) return;
    const { error } = await supabase.from("agendamentos").delete().eq("id", id);
    if (error) return alert(error.message);
    setAgendamentos((lista) => lista.filter((a) => a.id !== id));
  }

  async function salvarEmpresa() {
    if (!empresa.id) return alert("Empresa não carregada.");
    setSalvando(true);
    try {
      const { data, error } = await supabase
        .from("empresas")
        .update({
          nome: empresa.nome,
          responsavel: empresa.responsavel,
          telefone: empresa.telefone,
          whatsapp: empresa.whatsapp,
          instagram: empresa.instagram,
          email: empresa.email,
          endereco: empresa.endereco,
          abertura: empresa.abertura,
          fechamento: empresa.fechamento,
          intervalo: Number(empresa.intervalo || 30),
          dias_funcionamento: empresa.dias_funcionamento,
          observacoes: empresa.observacoes,
          ativo: empresa.ativo,
        })
        .eq("id", empresa.id)
        .select("*")
        .single();
      if (error) throw error;
      setEmpresa(normalizarEmpresa(data));
      alert("Empresa salva no Supabase.");
    } catch (error: any) {
      alert(error?.message || "Erro ao salvar empresa.");
    } finally {
      setSalvando(false);
    }
  }

  async function salvarServico() {
    if (!empresa.id) return alert("Empresa não carregada.");
    if (!servicoForm.nome) return alert("Preencha o nome do serviço.");
    setSalvando(true);
    try {
      const payload = {
        empresa_id: empresa.id,
        nome: servicoForm.nome,
        descricao: servicoForm.descricao,
        duracao: Number(servicoForm.duracao || 30),
        valor: Number(servicoForm.valor || 0),
        sinal: Number(servicoForm.sinal || 0),
        ativo: true,
        observacoes: servicoForm.observacoes,
        fotos_resultado: servicoForm.fotos_resultado.split("\n").map((x) => x.trim()).filter(Boolean),
      };
      if (servicoForm.id) {
        const { data, error } = await supabase.from("servicos").update(payload).eq("id", servicoForm.id).select("*").single();
        if (error) throw error;
        setServicos((lista) => lista.map((s) => (s.id === servicoForm.id ? normalizarServico(data) : s)));
      } else {
        const { data, error } = await supabase.from("servicos").insert(payload).select("*").single();
        if (error) throw error;
        setServicos((lista) => [normalizarServico(data), ...lista]);
      }
      setServicoForm({ id: "", nome: "", descricao: "", duracao: "30", valor: "150", sinal: "50", observacoes: "", fotos_resultado: "" });
    } catch (error: any) {
      alert(error?.message || "Erro ao salvar serviço.");
    } finally {
      setSalvando(false);
    }
  }

  function editarServico(s: Servico) {
    setServicoForm({
      id: s.id,
      nome: s.nome,
      descricao: s.descricao,
      duracao: String(s.duracao),
      valor: String(s.valor),
      sinal: String(s.sinal),
      observacoes: s.observacoes,
      fotos_resultado: s.fotos_resultado.join("\n"),
    });
  }

  async function alternarServico(s: Servico) {
    const { data, error } = await supabase.from("servicos").update({ ativo: !s.ativo }).eq("id", s.id).select("*").single();
    if (error) return alert(error.message);
    setServicos((lista) => lista.map((item) => (item.id === s.id ? normalizarServico(data) : item)));
  }

  async function salvarProfissional() {
    if (!empresa.id) return alert("Empresa não carregada.");
    if (!profissionalForm.nome) return alert("Preencha o nome da profissional.");
    setSalvando(true);
    try {
      const payload = {
        empresa_id: empresa.id,
        nome: profissionalForm.nome,
        telefone: profissionalForm.telefone,
        email: profissionalForm.email,
        funcao: profissionalForm.funcao,
        inicio: profissionalForm.inicio,
        fim: profissionalForm.fim,
        dias_atendimento: profissionalForm.dias_atendimento,
        ativo: true,
        observacoes: profissionalForm.observacoes,
      };
      if (profissionalForm.id) {
        const { data, error } = await supabase.from("profissionais").update(payload).eq("id", profissionalForm.id).select("*").single();
        if (error) throw error;
        setProfissionais((lista) => lista.map((p) => (p.id === profissionalForm.id ? normalizarProfissional(data) : p)));
      } else {
        const { data, error } = await supabase.from("profissionais").insert(payload).select("*").single();
        if (error) throw error;
        setProfissionais((lista) => [normalizarProfissional(data), ...lista]);
      }
      setProfissionalForm({ id: "", nome: "", telefone: "", email: "", funcao: "", inicio: empresa.abertura, fim: empresa.fechamento, dias_atendimento: empresa.dias_funcionamento, observacoes: "" });
    } catch (error: any) {
      alert(error?.message || "Erro ao salvar profissional.");
    } finally {
      setSalvando(false);
    }
  }

  function editarProfissional(p: Profissional) {
    setProfissionalForm({
      id: p.id,
      nome: p.nome,
      telefone: p.telefone,
      email: p.email,
      funcao: p.funcao,
      inicio: p.inicio,
      fim: p.fim,
      dias_atendimento: p.dias_atendimento,
      observacoes: p.observacoes,
    });
  }

  async function alternarProfissional(p: Profissional) {
    const { data, error } = await supabase.from("profissionais").update({ ativo: !p.ativo }).eq("id", p.id).select("*").single();
    if (error) return alert(error.message);
    setProfissionais((lista) => lista.map((item) => (item.id === p.id ? normalizarProfissional(data) : item)));
  }

  function toggleDiaEmpresa(id: string) {
    setEmpresa((atual) => ({
      ...atual,
      dias_funcionamento: atual.dias_funcionamento.includes(id)
        ? atual.dias_funcionamento.filter((d) => d !== id)
        : [...atual.dias_funcionamento, id],
    }));
  }

  function toggleDiaProfissional(id: string) {
    setProfissionalForm((atual) => ({
      ...atual,
      dias_atendimento: atual.dias_atendimento.includes(id)
        ? atual.dias_atendimento.filter((d) => d !== id)
        : [...atual.dias_atendimento, id],
    }));
  }

  function linkWhatsapp(a: Agendamento) {
    const cliente = clientePorId(a.cliente_id);
    const saudacao = cliente?.nome_completo ? `Olá, ${cliente.nome_completo}!` : "Olá!";
    const statusTexto = a.status === "Confirmado" ? "está confirmado" : "foi recebido e está aguardando confirmação";
    const sinalTexto = a.sinal > 0
      ? a.sinal_pago
        ? `O sinal de ${formatarMoeda(a.sinal)} já consta como recebido.`
        : `O sinal para reserva do horário é de ${formatarMoeda(a.sinal)}.`
      : "";
    const msg = `${saudacao} Seu agendamento na Divino Bronze para ${a.servico} ${statusTexto} para ${formatarData(a.data)} às ${a.hora}. Valor do atendimento: ${formatarMoeda(a.valor)}. ${sinalTexto} Qualquer dúvida, estou à disposição.`;
    return `https://wa.me/55${limparNumeros(cliente?.telefone)}?text=${encodeURIComponent(msg)}`;
  }

  if (carregando) {
    return <TelaCentro titulo="Carregando painel..." texto="Buscando dados no Supabase." />;
  }

  if (erro && !empresa.id) {
    return <TelaCentro titulo="Erro de conexão" texto={erro} botao="Tentar novamente" onClick={carregarTudo} />;
  }

  return (
    <main className="min-h-screen bg-[#0b0705] p-5 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#d7b56d]">Agenda Bronze</p>
            <h1 className="mt-2 text-3xl font-bold">Painel operacional Divino Bronze</h1>
            <p className="mt-1 text-sm text-zinc-400">Empresa ativa: {empresa.nome} • dados em tempo real no Supabase</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={carregarTudo} className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300">Atualizar painel</button>
            {aba === "agenda" && (
              <>
                <button onClick={() => { limparClienteForm(); setModalCliente(true); }} className="rounded-xl border border-[#d7b56d] px-4 py-3 text-sm font-semibold text-[#d7b56d]">+ Nova cliente</button>
                <button onClick={() => abrirNovoAgendamento()} className="rounded-xl bg-[#d7b56d] px-4 py-3 text-sm font-semibold text-black">+ Novo agendamento</button>
              </>
            )}
          </div>
        </header>

        <nav className="mb-6 flex flex-wrap gap-3">
          <BotaoAba aba="agenda" atual={aba} setAba={setAba}>Agenda</BotaoAba>
          <BotaoAba aba="clientes" atual={aba} setAba={setAba}>Clientes</BotaoAba>
          <BotaoAba aba="financeiro" atual={aba} setAba={setAba}>Financeiro</BotaoAba>
          <BotaoAba aba="empresa" atual={aba} setAba={setAba}>Empresa</BotaoAba>
        </nav>

        <section className="mb-6 grid gap-4 md:grid-cols-5">
          <Card titulo="Clientes" valor={String(clientes.length)} />
          <Card titulo="Serviços" valor={String(servicos.length)} />
          <Card titulo="Profissionais" valor={String(profissionais.length)} />
          <Card titulo="Solicitações do site" valor={String(solicitacoesSite.length)} destaque />
          <Card titulo="Agendamentos" valor={String(agendamentos.length)} />
        </section>

        {aba === "agenda" && (
          <section className="space-y-6">
            {solicitacoesSite.length > 0 && (
              <Painel titulo="Solicitações recebidas pelo site" subtitulo="Solicitações feitas pela cliente no link público. Confirme o horário, marque o sinal recebido ou chame no WhatsApp.">
                <ListaAgendamentos agendamentos={solicitacoesSite} clientePorId={clientePorId} editar={editarAgendamento} excluir={excluirAgendamento} atualizar={atualizarAgendamento} linkWhatsapp={linkWhatsapp} />
              </Painel>
            )}

            <Painel titulo="Agenda do dia" subtitulo="Escolha a data e a profissional; os horários ocupados ficam bloqueados automaticamente.">
              <div className="mb-5 grid gap-4 md:grid-cols-3">
                <CampoTexto label="Data" valor={dataAgenda} setValor={setDataAgenda} tipo="date" />
                <CampoSelectManual label="Profissional" valor={filtroProfissional} setValor={setFiltroProfissional} textoInicial="Todas" opcoes={profissionaisAtivos.map((p) => ({ value: p.id, label: p.nome }))} />
                <div className="rounded-xl border border-[#3a2a17] bg-black/40 p-4 text-sm">
                  <p className="font-semibold text-[#d7b56d]">Funcionamento</p>
                  <p>{profissionalFiltro ? nomesDias(profissionalFiltro.dias_atendimento) : nomesDias(empresa.dias_funcionamento)}</p>
                  <p>{profissionalFiltro ? `${profissionalFiltro.inicio} às ${profissionalFiltro.fim}` : `${empresa.abertura} às ${empresa.fechamento}`}</p>
                </div>
              </div>

              {horariosDia.length === 0 ? (
                <Vazio texto="Nenhum horário disponível nesta data. Verifique se a empresa/profissional atende nesse dia ou escolha outra data." />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                  {horariosDia.map((hora) => {
                    const ag = horarioOcupado(hora);
                    const cliente = ag ? clientePorId(ag.cliente_id) : undefined;
                    return (
                      <button key={hora} disabled={Boolean(ag)} onClick={() => abrirNovoAgendamento(hora)} className={`rounded-2xl border p-4 text-left ${ag ? "cursor-not-allowed border-red-900 bg-red-950/40 text-red-100" : "border-[#d7b56d] bg-black hover:bg-[#d7b56d] hover:text-black"}`}>
                        <p className="text-lg font-bold">{hora}</p>
                        {ag ? <p className="mt-1 text-xs">{cliente?.nome_completo || "Ocupado"}</p> : <p className="mt-1 text-xs opacity-80">Disponível</p>}
                      </button>
                    );
                  })}
                </div>
              )}
            </Painel>

            <Painel titulo="Agendamentos" subtitulo="Busca geral por cliente, serviço, profissional, origem ou status.">
              <div className="mb-5">
                <CampoTexto label="Buscar" valor={buscaAgenda} setValor={setBuscaAgenda} placeholder="Digite para buscar" />
              </div>
              <ListaAgendamentos agendamentos={agendamentosBusca} clientePorId={clientePorId} editar={editarAgendamento} excluir={excluirAgendamento} atualizar={atualizarAgendamento} linkWhatsapp={linkWhatsapp} />
            </Painel>
          </section>
        )}

        {aba === "clientes" && (
          <Painel titulo="Clientes" subtitulo="Ficha, histórico e dados técnicos das clientes.">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div className="flex-1"><CampoTexto label="Buscar cliente" valor={buscaClientes} setValor={setBuscaClientes} placeholder="Nome, telefone, CPF, email ou Instagram" /></div>
              <button onClick={() => { limparClienteForm(); setModalCliente(true); }} className="rounded-xl bg-[#d7b56d] px-5 py-3 font-semibold text-black">+ Nova cliente</button>
            </div>

            {clientesFiltradas.length === 0 ? <Vazio texto="Nenhuma cliente cadastrada." /> : (
              <div className="space-y-3">
                {clientesFiltradas.map((cliente) => {
                  const historico = historicoCliente(cliente.id);
                  const aberta = clienteAberta === cliente.id;
                  return (
                    <div key={cliente.id} className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <button onClick={() => setClienteAberta(aberta ? "" : cliente.id)} className="text-left">
                          <p className="text-xs uppercase tracking-[0.2em] text-[#d7b56d]">Cliente</p>
                          <h3 className="text-lg font-bold">{cliente.nome_completo}</h3>
                          <p className="text-sm text-zinc-400">{cliente.telefone} {cliente.email ? `• ${cliente.email}` : ""}</p>
                        </button>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => setClienteAberta(aberta ? "" : cliente.id)} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm">{aberta ? "Ocultar" : "Ver ficha"}</button>
                          <button onClick={() => { limparAgendamentoForm(); setAgendamentoForm((a) => ({ ...a, cliente_id: cliente.id })); setModalAgendamento(true); }} className="rounded-xl bg-green-800 px-4 py-2 text-sm font-semibold">Agendar</button>
                          <button onClick={() => editarCliente(cliente)} className="rounded-xl bg-[#d7b56d] px-4 py-2 text-sm font-semibold text-black">Editar</button>
                          <button onClick={() => excluirCliente(cliente.id)} className="rounded-xl bg-red-900 px-4 py-2 text-sm font-semibold">Excluir</button>
                        </div>
                      </div>
                      {aberta && (
                        <div className="mt-4 border-t border-zinc-800 pt-4">
                          <div className="grid gap-4 md:grid-cols-4">
                            <Mini titulo="CPF" valor={cliente.cpf || "Não informado"} />
                            <Mini titulo="Nascimento" valor={formatarData(cliente.data_nascimento) || "Não informado"} />
                            <Mini titulo="Instagram" valor={cliente.instagram || "Não informado"} />
                            <Mini titulo="Origem" valor={cliente.origem_cadastro || "Não informado"} />
                          </div>
                          <div className="mt-4 rounded-xl border border-zinc-800 bg-[#15100d] p-4 text-sm text-zinc-300">
                            <p>Roacutan: {cliente.uso_roacutan || "Não informado"}</p>
                            <p>Mounjaro: {cliente.uso_mounjaro || "Não informado"}</p>
                            <p>Já fez bronze: {cliente.ja_fez_bronze || "Não informado"}</p>
                            <p>Ocasião especial: {cliente.ocasiao_especial === "Sim" ? cliente.qual_ocasiao || "Sim" : "Não"}</p>
                            <p>Observações: {cliente.observacoes_internas || "Nenhuma"}</p>
                          </div>
                          <h4 className="mt-5 font-bold text-[#d7b56d]">Histórico</h4>
                          {historico.length === 0 ? <p className="mt-2 text-sm text-zinc-500">Sem histórico.</p> : historico.map((a) => (
                            <div key={a.id} className="mt-2 rounded-xl border border-zinc-800 bg-black/40 p-3 text-sm">
                              {formatarData(a.data)} às {a.hora} • {a.servico} • {a.status} • {formatarMoeda(a.valor)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Painel>
        )}

        {aba === "financeiro" && (
          <Painel titulo="Financeiro" subtitulo="Resumo de previsão, recebidos e sinais pendentes.">
            <div className="mb-5 max-w-xs"><CampoTexto label="Mês" valor={mesFinanceiro} setValor={setMesFinanceiro} tipo="month" /></div>
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <Card titulo="Previsto hoje" valor={formatarMoeda(financeiro.previstoHoje)} />
              <Card titulo="Recebido hoje" valor={formatarMoeda(financeiro.recebidoHoje)} destaque />
              <Card titulo="Previsto no mês" valor={formatarMoeda(financeiro.previstoMes)} />
              <Card titulo="Recebido no mês" valor={formatarMoeda(financeiro.recebidoMes)} destaque />
            </div>
            <h3 className="mb-3 text-lg font-bold text-[#d7b56d]">Sinais pendentes</h3>
            {financeiro.sinaisPendentes.length === 0 ? <Vazio texto="Nenhum sinal pendente." /> : (
              <div className="space-y-3">
                {financeiro.sinaisPendentes.map((a) => (
                  <div key={a.id} className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                    <p className="font-bold">{clientePorId(a.cliente_id)?.nome_completo || "Cliente não encontrada"}</p>
                    <p className="text-sm text-zinc-400">{formatarData(a.data)} às {a.hora} • {a.servico} • Sinal {formatarMoeda(a.sinal)}</p>
                    <button onClick={() => atualizarAgendamento(a.id, { sinal_pago: true })} className="mt-3 rounded-xl bg-[#d7b56d] px-4 py-2 text-sm font-semibold text-black">Marcar sinal como pago</button>
                  </div>
                ))}
              </div>
            )}
          </Painel>
        )}

        {aba === "empresa" && (
          <section className="space-y-6">
            <Painel titulo="Dados da empresa" subtitulo="Essas informações alimentam a agenda e a página pública.">
              <div className="grid gap-4 md:grid-cols-2">
                <CampoTexto label="Nome da empresa" valor={empresa.nome} setValor={(v) => setEmpresa((e) => ({ ...e, nome: v }))} />
                <CampoTexto label="Responsável" valor={empresa.responsavel} setValor={(v) => setEmpresa((e) => ({ ...e, responsavel: v }))} />
                <CampoTexto label="Telefone" valor={empresa.telefone} setValor={(v) => setEmpresa((e) => ({ ...e, telefone: v }))} />
                <CampoTexto label="WhatsApp" valor={empresa.whatsapp} setValor={(v) => setEmpresa((e) => ({ ...e, whatsapp: v }))} />
                <CampoTexto label="Instagram" valor={empresa.instagram} setValor={(v) => setEmpresa((e) => ({ ...e, instagram: v }))} />
                <CampoTexto label="Email" valor={empresa.email} setValor={(v) => setEmpresa((e) => ({ ...e, email: v }))} />
                <div className="md:col-span-2"><CampoArea label="Endereço" valor={empresa.endereco} setValor={(v) => setEmpresa((e) => ({ ...e, endereco: v }))} /></div>
                <CampoTexto label="Abertura" valor={empresa.abertura} setValor={(v) => setEmpresa((e) => ({ ...e, abertura: v }))} tipo="time" />
                <CampoTexto label="Fechamento" valor={empresa.fechamento} setValor={(v) => setEmpresa((e) => ({ ...e, fechamento: v }))} tipo="time" />
                <CampoSelect label="Intervalo" valor={String(empresa.intervalo)} setValor={(v) => setEmpresa((e) => ({ ...e, intervalo: Number(v) }))} opcoes={["15", "20", "30", "45", "60"]} />
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">Dias de funcionamento</label>
                  <div className="flex flex-wrap gap-2">{DIAS.map((d) => <button key={d.id} onClick={() => toggleDiaEmpresa(d.id)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${empresa.dias_funcionamento.includes(d.id) ? "bg-[#d7b56d] text-black" : "border border-zinc-700 bg-black"}`}>{d.curto}</button>)}</div>
                </div>
                <div className="md:col-span-2"><CampoArea label="Observações" valor={empresa.observacoes} setValor={(v) => setEmpresa((e) => ({ ...e, observacoes: v }))} /></div>
              </div>
              <button disabled={salvando} onClick={salvarEmpresa} className="mt-5 rounded-xl bg-[#d7b56d] px-5 py-3 font-semibold text-black disabled:opacity-60">Salvar empresa</button>
              {empresa.endereco && <iframe src={`https://www.google.com/maps?q=${encodeURIComponent(empresa.endereco)}&output=embed`} className="mt-5 h-72 w-full rounded-2xl border border-zinc-800" loading="lazy" />}
            </Painel>

            <Painel titulo="Serviços" subtitulo="Cadastre os serviços que aparecerão na página pública.">
              <div className="grid gap-4 md:grid-cols-2">
                <CampoTexto label="Nome" valor={servicoForm.nome} setValor={(v) => setServicoForm((s) => ({ ...s, nome: v }))} />
                <CampoTexto label="Duração" valor={servicoForm.duracao} setValor={(v) => setServicoForm((s) => ({ ...s, duracao: v }))} tipo="number" />
                <CampoTexto label="Valor" valor={servicoForm.valor} setValor={(v) => setServicoForm((s) => ({ ...s, valor: v }))} tipo="number" />
                <CampoTexto label="Sinal" valor={servicoForm.sinal} setValor={(v) => setServicoForm((s) => ({ ...s, sinal: v }))} tipo="number" />
                <div className="md:col-span-2"><CampoArea label="Descrição" valor={servicoForm.descricao} setValor={(v) => setServicoForm((s) => ({ ...s, descricao: v }))} /></div>
                <div className="md:col-span-2"><CampoArea label="Fotos de resultado — um link por linha" valor={servicoForm.fotos_resultado} setValor={(v) => setServicoForm((s) => ({ ...s, fotos_resultado: v }))} /></div>
              </div>
              <button disabled={salvando} onClick={salvarServico} className="mt-5 rounded-xl bg-[#d7b56d] px-5 py-3 font-semibold text-black disabled:opacity-60">{servicoForm.id ? "Salvar serviço" : "Adicionar serviço"}</button>
              <ListaServicos servicos={servicos} editar={editarServico} alternar={alternarServico} />
            </Painel>

            <Painel titulo="Profissionais" subtitulo="Cadastre a equipe que aparecerá na agenda pública.">
              <div className="grid gap-4 md:grid-cols-2">
                <CampoTexto label="Nome" valor={profissionalForm.nome} setValor={(v) => setProfissionalForm((p) => ({ ...p, nome: v }))} />
                <CampoTexto label="Função" valor={profissionalForm.funcao} setValor={(v) => setProfissionalForm((p) => ({ ...p, funcao: v }))} />
                <CampoTexto label="Telefone" valor={profissionalForm.telefone} setValor={(v) => setProfissionalForm((p) => ({ ...p, telefone: v }))} />
                <CampoTexto label="Email" valor={profissionalForm.email} setValor={(v) => setProfissionalForm((p) => ({ ...p, email: v }))} />
                <CampoTexto label="Início" valor={profissionalForm.inicio} setValor={(v) => setProfissionalForm((p) => ({ ...p, inicio: v }))} tipo="time" />
                <CampoTexto label="Fim" valor={profissionalForm.fim} setValor={(v) => setProfissionalForm((p) => ({ ...p, fim: v }))} tipo="time" />
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-zinc-300">Dias de atendimento</label>
                  <div className="flex flex-wrap gap-2">{DIAS.map((d) => <button key={d.id} onClick={() => toggleDiaProfissional(d.id)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${profissionalForm.dias_atendimento.includes(d.id) ? "bg-[#d7b56d] text-black" : "border border-zinc-700 bg-black"}`}>{d.curto}</button>)}</div>
                </div>
                <div className="md:col-span-2"><CampoArea label="Observações" valor={profissionalForm.observacoes} setValor={(v) => setProfissionalForm((p) => ({ ...p, observacoes: v }))} /></div>
              </div>
              <button disabled={salvando} onClick={salvarProfissional} className="mt-5 rounded-xl bg-[#d7b56d] px-5 py-3 font-semibold text-black disabled:opacity-60">{profissionalForm.id ? "Salvar profissional" : "Adicionar profissional"}</button>
              <ListaProfissionais profissionais={profissionais} editar={editarProfissional} alternar={alternarProfissional} />
            </Painel>
          </section>
        )}
      </div>

      {modalCliente && (
        <Modal titulo={editClienteId ? "Editar cliente" : "Nova cliente"} fechar={() => { limparClienteForm(); setModalCliente(false); }}>
          <ClienteForm form={clienteForm} setForm={setClienteForm} />
          <ModalActions salvando={salvando} cancelar={() => { limparClienteForm(); setModalCliente(false); }} salvar={salvarCliente} texto="Salvar cliente" />
        </Modal>
      )}

      {modalAgendamento && (
        <Modal titulo={editAgendamentoId ? "Editar agendamento" : "Novo agendamento"} fechar={() => { limparAgendamentoForm(); setModalAgendamento(false); }}>
          <AgendamentoForm form={agendamentoForm} setForm={setAgendamentoForm} clientes={clientes} servicos={servicosAtivos} profissionais={profissionaisAtivos} />
          <ModalActions salvando={salvando} cancelar={() => { limparAgendamentoForm(); setModalAgendamento(false); }} salvar={salvarAgendamento} texto="Salvar agendamento" />
        </Modal>
      )}
    </main>
  );
}

function TelaCentro({ titulo, texto, botao, onClick }: { titulo: string; texto: string; botao?: string; onClick?: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0705] px-5 text-white">
      <div className="max-w-xl rounded-[2rem] border border-[#3a2a17] bg-[#15100d] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-[#d7b56d]">Agenda Bronze</p>
        <h1 className="mt-4 text-2xl font-bold">{titulo}</h1>
        <p className="mt-2 text-sm text-zinc-400">{texto}</p>
        {botao && <button onClick={onClick} className="mt-6 rounded-2xl bg-[#d7b56d] px-6 py-3 font-semibold text-black">{botao}</button>}
      </div>
    </main>
  );
}

function BotaoAba({ aba, atual, setAba, children }: { aba: Aba; atual: Aba; setAba: (aba: Aba) => void; children: React.ReactNode }) {
  return <button onClick={() => setAba(aba)} className={`rounded-2xl px-5 py-3 font-semibold ${atual === aba ? "bg-[#d7b56d] text-black" : "bg-[#15100d] text-zinc-300"}`}>{children}</button>;
}

function Painel({ titulo, subtitulo, children }: { titulo: string; subtitulo?: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-[#3a2a17] bg-[#15100d] p-5"><h2 className="text-xl font-bold text-[#d7b56d]">{titulo}</h2>{subtitulo && <p className="mt-1 mb-5 text-sm text-zinc-400">{subtitulo}</p>}{children}</section>;
}

function Card({ titulo, valor, destaque = false }: { titulo: string; valor: string; destaque?: boolean }) {
  return <div className="rounded-2xl border border-[#3a2a17] bg-[#15100d] p-5"><p className="text-sm text-zinc-400">{titulo}</p><h2 className={`mt-2 text-2xl font-bold ${destaque ? "text-[#d7b56d]" : ""}`}>{valor}</h2></div>;
}

function Vazio({ texto }: { texto: string }) {
  return <div className="rounded-2xl border border-dashed border-zinc-700 p-8 text-center text-zinc-400">{texto}</div>;
}

function Mini({ titulo, valor }: { titulo: string; valor: string }) {
  return <div><p className="text-xs text-zinc-500">{titulo}</p><p className="text-sm font-semibold">{valor}</p></div>;
}

function CampoTexto({ label, valor, setValor, tipo = "text", placeholder = "" }: { label: string; valor: string; setValor: (valor: string) => void; tipo?: string; placeholder?: string }) {
  return <div><label className="mb-1 block text-sm text-zinc-300">{label}</label><input type={tipo} value={valor} onChange={(e) => setValor(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d7b56d]" /></div>;
}

function CampoArea({ label, valor, setValor }: { label: string; valor: string; setValor: (valor: string) => void }) {
  return <div><label className="mb-1 block text-sm text-zinc-300">{label}</label><textarea value={valor} onChange={(e) => setValor(e.target.value)} className="min-h-24 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d7b56d]" /></div>;
}

function CampoSelect({ label, valor, setValor, opcoes, textoInicial = "Selecione" }: { label: string; valor: string; setValor: (valor: string) => void; opcoes: string[]; textoInicial?: string }) {
  return <div><label className="mb-1 block text-sm text-zinc-300">{label}</label><select value={valor} onChange={(e) => setValor(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d7b56d]"><option value="">{textoInicial}</option>{opcoes.map((opcao) => <option key={opcao} value={opcao}>{opcao}</option>)}</select></div>;
}

function CampoSelectManual({ label, valor, setValor, opcoes, textoInicial = "Selecione" }: { label: string; valor: string; setValor: (valor: string) => void; opcoes: { value: string; label: string }[]; textoInicial?: string }) {
  return <div><label className="mb-1 block text-sm text-zinc-300">{label}</label><select value={valor} onChange={(e) => setValor(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-[#d7b56d]"><option value="">{textoInicial}</option>{opcoes.map((opcao) => <option key={opcao.value} value={opcao.value}>{opcao.label}</option>)}</select></div>;
}

function ListaAgendamentos({ agendamentos, clientePorId, editar, excluir, atualizar, linkWhatsapp }: any) {
  if (agendamentos.length === 0) return <Vazio texto="Nenhum agendamento encontrado." />;
  return <div className="space-y-3">{agendamentos.map((a: Agendamento) => {
    const cliente = clientePorId(a.cliente_id);
    return <div key={a.id} className={`rounded-2xl border p-4 ${a.origem === "Agendamento público" ? "border-[#d7b56d] bg-[#1c140b]" : "border-zinc-800 bg-black/40"}`}>
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <div className="mb-2 flex flex-wrap gap-2"><span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold">{a.status}</span><span className="rounded-full bg-[#d7b56d] px-3 py-1 text-xs font-bold text-black">{a.origem}</span>{!a.sinal_pago && a.sinal > 0 && <span className="rounded-full bg-red-900 px-3 py-1 text-xs font-bold">Sinal pendente</span>}</div>
          <h3 className="text-lg font-bold">{cliente?.nome_completo || "Cliente não encontrada"}</h3>
          <p className="text-sm text-zinc-400">{formatarData(a.data)} às {a.hora} • {a.servico} • {a.profissional_nome || "Sem profissional"}</p>
          <p className="text-sm text-zinc-400">{formatarMoeda(a.valor)} • Sinal {formatarMoeda(a.sinal)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {a.status === "Agendado" && <button onClick={() => atualizar(a.id, { status: "Confirmado" })} className="rounded-xl bg-green-800 px-3 py-2 text-sm font-semibold">Confirmar</button>}
          <button onClick={() => atualizar(a.id, { sinal_pago: !a.sinal_pago })} className="rounded-xl border border-zinc-700 px-3 py-2 text-sm">{a.sinal_pago ? "Sinal pago" : "Marcar sinal recebido"}</button>
          <a href={linkWhatsapp(a)} target="_blank" className="rounded-xl bg-green-700 px-3 py-2 text-sm font-semibold">WhatsApp</a>
          <button onClick={() => editar(a)} className="rounded-xl bg-[#d7b56d] px-3 py-2 text-sm font-semibold text-black">Editar</button>
          <button onClick={() => excluir(a.id)} className="rounded-xl bg-red-900 px-3 py-2 text-sm font-semibold">Excluir</button>
        </div>
      </div>
    </div>;
  })}</div>;
}

function ListaServicos({ servicos, editar, alternar }: any) {
  if (servicos.length === 0) return <Vazio texto="Nenhum serviço cadastrado." />;
  return <div className="mt-5 space-y-3">{servicos.map((s: Servico) => <div key={s.id} className="rounded-2xl border border-zinc-800 bg-black/40 p-4"><div className="flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h3 className="font-bold">{s.nome}</h3><p className="text-sm text-zinc-400">{s.duracao} min • {formatarMoeda(s.valor)} • sinal {formatarMoeda(s.sinal)} • {s.ativo ? "ativo" : "inativo"}</p></div><div className="flex gap-2"><button onClick={() => editar(s)} className="rounded-xl bg-[#d7b56d] px-3 py-2 text-sm font-semibold text-black">Editar</button><button onClick={() => alternar(s)} className="rounded-xl border border-zinc-700 px-3 py-2 text-sm">{s.ativo ? "Desativar" : "Ativar"}</button></div></div></div>)}</div>;
}

function ListaProfissionais({ profissionais, editar, alternar }: any) {
  if (profissionais.length === 0) return <Vazio texto="Nenhuma profissional cadastrada." />;
  return <div className="mt-5 space-y-3">{profissionais.map((p: Profissional) => <div key={p.id} className="rounded-2xl border border-zinc-800 bg-black/40 p-4"><div className="flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h3 className="font-bold">{p.nome}</h3><p className="text-sm text-zinc-400">{p.funcao || "Sem função"} • {p.inicio} às {p.fim} • {nomesDias(p.dias_atendimento)} • {p.ativo ? "ativa" : "inativa"}</p></div><div className="flex gap-2"><button onClick={() => editar(p)} className="rounded-xl bg-[#d7b56d] px-3 py-2 text-sm font-semibold text-black">Editar</button><button onClick={() => alternar(p)} className="rounded-xl border border-zinc-700 px-3 py-2 text-sm">{p.ativo ? "Desativar" : "Ativar"}</button></div></div></div>)}</div>;
}

function Modal({ titulo, fechar, children }: { titulo: string; fechar: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-[#3a2a17] bg-[#15100d] p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold">{titulo}</h2><button onClick={fechar} className="rounded-xl bg-zinc-800 px-4 py-2 text-sm">Fechar</button></div>{children}</div></div>;
}

function ModalActions({ salvando, cancelar, salvar, texto }: { salvando: boolean; cancelar: () => void; salvar: () => void; texto: string }) {
  return <div className="mt-6 flex justify-end gap-3"><button onClick={cancelar} className="rounded-2xl border border-zinc-700 px-6 py-3 font-semibold">Cancelar</button><button disabled={salvando} onClick={salvar} className="rounded-2xl bg-[#d7b56d] px-6 py-3 font-semibold text-black disabled:opacity-60">{salvando ? "Salvando..." : texto}</button></div>;
}

function ClienteForm({ form, setForm }: any) {
  const upd = (campo: string, valor: string) => setForm((f: any) => ({ ...f, [campo]: valor }));
  return <div className="grid gap-4 md:grid-cols-2"><CampoTexto label="Nome completo *" valor={form.nome_completo} setValor={(v) => upd("nome_completo", v)} /><CampoTexto label="CPF" valor={form.cpf} setValor={(v) => upd("cpf", v)} /><CampoTexto label="Email" valor={form.email} setValor={(v) => upd("email", v)} /><CampoTexto label="Nascimento" valor={form.data_nascimento} setValor={(v) => upd("data_nascimento", v)} tipo="date" /><CampoTexto label="Instagram" valor={form.instagram} setValor={(v) => upd("instagram", v)} /><CampoTexto label="Telefone *" valor={form.telefone} setValor={(v) => upd("telefone", v)} /><CampoTexto label="Profissão" valor={form.profissao} setValor={(v) => upd("profissao", v)} /><CampoSelect label="Roacutan" valor={form.uso_roacutan} setValor={(v) => upd("uso_roacutan", v)} opcoes={["Sim", "Não"]} /><CampoSelect label="Mounjaro" valor={form.uso_mounjaro} setValor={(v) => upd("uso_mounjaro", v)} opcoes={["Sim", "Não"]} /><CampoSelect label="Como conheceu" valor={form.como_conheceu} setValor={(v) => upd("como_conheceu", v)} opcoes={["Instagram", "Google", "Indicação", "Cliente antiga", "WhatsApp", "Outro", "Web"]} /><CampoSelect label="Já fez bronze?" valor={form.ja_fez_bronze} setValor={(v) => upd("ja_fez_bronze", v)} opcoes={["Sim", "Não"]} /><CampoSelect label="Ocasião especial?" valor={form.ocasiao_especial} setValor={(v) => upd("ocasiao_especial", v)} opcoes={["Sim", "Não"]} /><CampoTexto label="Qual ocasião?" valor={form.qual_ocasiao} setValor={(v) => upd("qual_ocasiao", v)} /><div className="md:col-span-2"><CampoArea label="Endereço" valor={form.endereco_completo} setValor={(v) => upd("endereco_completo", v)} /></div><div className="md:col-span-2"><CampoArea label="Observações" valor={form.observacoes_internas} setValor={(v) => upd("observacoes_internas", v)} /></div></div>;
}

function AgendamentoForm({ form, setForm, clientes, servicos, profissionais }: any) {
  const upd = (campo: string, valor: any) => setForm((f: any) => ({ ...f, [campo]: valor }));
  function escolherServico(id: string) {
    const s = servicos.find((x: Servico) => x.id === id);
    setForm((f: any) => ({ ...f, servico_id: id, valor: s ? String(s.valor) : f.valor, sinal: s ? String(s.sinal) : f.sinal }));
  }
  return <div className="grid gap-4 md:grid-cols-2"><CampoSelectManual label="Cliente *" valor={form.cliente_id} setValor={(v) => upd("cliente_id", v)} textoInicial="Selecione" opcoes={clientes.map((c: Cliente) => ({ value: c.id, label: `${c.nome_completo} — ${c.telefone}` }))} /><CampoSelectManual label="Serviço" valor={form.servico_id} setValor={escolherServico} textoInicial="Selecione" opcoes={servicos.map((s: Servico) => ({ value: s.id, label: `${s.nome} — ${formatarMoeda(s.valor)}` }))} /><CampoSelectManual label="Profissional" valor={form.profissional_id} setValor={(v) => upd("profissional_id", v)} textoInicial="Selecione" opcoes={profissionais.map((p: Profissional) => ({ value: p.id, label: p.nome }))} /><CampoTexto label="Data *" valor={form.data} setValor={(v) => upd("data", v)} tipo="date" /><CampoTexto label="Hora *" valor={form.hora} setValor={(v) => upd("hora", v)} tipo="time" /><CampoTexto label="Valor" valor={form.valor} setValor={(v) => upd("valor", v)} tipo="number" /><CampoTexto label="Sinal" valor={form.sinal} setValor={(v) => upd("sinal", v)} tipo="number" /><CampoSelect label="Forma de pagamento" valor={form.forma_pagamento} setValor={(v) => upd("forma_pagamento", v)} opcoes={["A definir", "PIX", "Dinheiro", "Cartão de crédito", "Cartão de débito"]} /><CampoSelect label="Status" valor={form.status} setValor={(v) => upd("status", v)} opcoes={["Agendado", "Confirmado", "Atendido", "Cancelado"]} /><CampoSelect label="Origem" valor={form.origem} setValor={(v) => upd("origem", v)} opcoes={["Painel interno", "Agendamento público"]} /><div className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-black px-4 py-3"><input type="checkbox" checked={form.sinal_pago} onChange={(e) => upd("sinal_pago", e.target.checked)} className="h-5 w-5" /><span className="text-sm">Sinal pago</span></div><div className="md:col-span-2"><CampoArea label="Observações" valor={form.observacoes} setValor={(v) => upd("observacoes", v)} /></div></div>;
}
