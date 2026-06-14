export const clientes = [

  {
    id: 1,
    nome: "Amanda Souza",
    telefone: "(51) 99999-1111",
    profissao: "Advogada",
    fototipo: "3",
    subtom: "Quente",
  },

  {
    id: 2,
    nome: "Fernanda Lima",
    telefone: "(51) 99999-2222",
    profissao: "Dentista",
    fototipo: "2",
    subtom: "Neutro",
  },

]

export const protocolos = [

  {
    id: 1,
    nome: "Bronze Médio",
    valor: "149",
    intensidade: "Média",
    tempo: "2hrs",
  },

  {
    id: 2,
    nome: "Bronze Intenso",
    valor: "189",
    intensidade: "Alta",
    tempo: "8hrs",
  },

]

export const agendamentos = [

  {
    id: 1,
    clienteId: 1,
    protocoloId: 1,
    data: "13/05/2026",
    hora: "09:00",
    status: "Confirmado",
    tipo: "Studio",
    valor: "149",
  },

  {
    id: 2,
    clienteId: 2,
    protocoloId: 2,
    data: "13/05/2026",
    hora: "11:30",
    status: "Agendado",
    tipo: "Domicílio",
    valor: "189",
  },

]