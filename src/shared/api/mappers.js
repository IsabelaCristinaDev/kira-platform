// Conversão entre o formato do kira-backend e o das telas (e de volta, no cadastro) · funções puras
import { onlyDigits } from "../utils/format";

const pad = (n) => String(n).padStart(2, "0");

// LocalDateTime do backend ("2026-10-15T14:30:00") é horário local, sem fuso
export const parseLocalDateTime = (value) => (value ? new Date(value) : null);
export const toLocalDateTime = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
export const toLocalDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const formatTime = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const formatRelativeDay = (date, now = new Date()) => {
  const day = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((day(date) - day(now)) / 86400000);
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  if (diff === -1) return "Ontem";
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
};

export const paymentLabels = {
  PIX: "Pix",
  CARTAO_CREDITO: "Cartão de crédito",
  CARTAO_DEBITO: "Cartão de débito",
  DINHEIRO: "Dinheiro",
};

const establishmentLabels = { ESTABELECIMENTO: "Estúdio", AUTONOMA: "Profissional autônoma" };

const statusTab = {
  PENDENTE: "proximo",
  CONFIRMADO: "proximo",
  REAGENDADO: "proximo",
  CONCLUIDO: "concluido",
  CANCELADO: "cancelado",
};

export const toService = (s) => ({
  id: s.id,
  name: s.nome,
  description: s.descricao ?? "",
  durationMinutes: s.duracaoMinutos,
  price: Number(s.preco),
});

export const formatAddress = (e) => {
  if (!e) return "";
  const street = [e.logradouro, e.numero].filter(Boolean).join(", ");
  const city = [e.cidade, e.estado].filter(Boolean).join(" - ");
  return [street, e.bairro, city].filter(Boolean).join(", ");
};

/** @returns {import("./contract").Professional} */
export const toProfessional = (studio, services = [], reviews = null) => {
  const active = services.filter((s) => s.ativo !== false).map(toService);
  const prices = active.map((s) => s.price);
  return {
    id: studio.id,
    name: studio.nome,
    role: establishmentLabels[studio.tipoEstabelecimento] ?? "Profissional",
    description: studio.descricao ?? "",
    photo: studio.fotoUrl || null,
    phone: studio.telefone ?? "",
    address: formatAddress(studio.endereco),
    city: studio.endereco?.cidade ?? "",
    rating: studio.mediaAvaliacoes != null ? Math.round(studio.mediaAvaliacoes * 10) / 10 : null,
    reviews: reviews ? reviews.length : null,
    price: prices.length > 0 ? Math.min(...prices) : null,
    distance: null,
    services: active,
  };
};

/** @returns {import("./contract").Appointment} */
export const toAppointment = (a, now = new Date()) => {
  const start = parseLocalDateTime(a.dataHoraInicio);
  return {
    id: a.id,
    status: statusTab[a.status] ?? "proximo",
    rawStatus: a.status,
    proId: a.empresaId,
    proName: a.nomeEmpresa,
    staffId: a.funcionariaId ?? null,
    staffName: a.nomeFuncionaria ?? null,
    clientId: a.clienteId,
    clientName: a.nomeCliente,
    serviceId: a.servicoId,
    service: a.nomeServico,
    durationMinutes: a.duracaoMinutos,
    start,
    end: parseLocalDateTime(a.dataHoraFim),
    date: formatRelativeDay(start, now),
    time: formatTime(start),
    payment: paymentLabels[a.formaPagamento] ?? "",
    notes: a.observacoes ?? "",
  };
};

/** @returns {import("./contract").Review} */
export const toReview = (r) => ({
  id: r.id,
  appointmentId: r.agendamentoId,
  proId: r.empresaId,
  proName: r.nomeEmpresa,
  clientName: r.nomeCliente,
  author: r.tipoAvaliador,
  rating: r.nota,
  text: r.comentario ?? "",
  createdAt: parseLocalDateTime(r.dataCriacao),
});

export const toSlotTime = (slot) => formatTime(parseLocalDateTime(slot.dataHoraInicio));

// ---------- Gestão do estúdio: serviços, funcionárias, bloqueios, mensagens e painel ----------

// Serviço do próprio estúdio: inclui os desativados, com a flag `active`
export const toBusinessService = (s) => ({ ...toService(s), active: s.ativo !== false });

export const toServiceRequest = (s) => ({
  nome: s.name.trim(),
  descricao: s.description?.trim() || null,
  duracaoMinutos: Number(s.durationMinutes),
  preco: Number(s.price),
});

export const toStaff = (f) => ({
  id: f.id,
  name: f.nome,
  photo: f.fotoUrl || null,
  specialties: f.especialidades ?? "",
  active: f.ativo !== false,
  commissionPercent: f.comissaoPercentual != null ? Number(f.comissaoPercentual) : null,
});

export const toStaffRequest = (f) => ({
  nome: f.name.trim(),
  fotoUrl: f.photo || null,
  especialidades: f.specialties?.trim() || null,
  comissaoPercentual: f.commissionPercent === "" || f.commissionPercent == null ? null : Number(f.commissionPercent),
});

export const toTimeBlock = (b) => ({
  id: b.id,
  staffId: b.funcionariaId,
  staffName: b.nomeFuncionaria,
  start: parseLocalDateTime(b.dataHoraInicio),
  end: parseLocalDateTime(b.dataHoraFim),
  reason: b.motivo ?? "",
});

export const toTimeBlockRequest = ({ start, end, reason }) => ({
  dataHoraInicio: toLocalDateTime(start),
  dataHoraFim: toLocalDateTime(end),
  motivo: reason?.trim() || null,
});

// `mine`: a mensagem foi enviada pelo usuário logado (lado da bolha no chat)
export const toMessage = (m, myId = null) => ({
  id: m.id,
  appointmentId: m.agendamentoId,
  senderId: m.remetenteId,
  senderName: m.nomeRemetente,
  text: m.conteudo,
  read: Boolean(m.lida),
  createdAt: parseLocalDateTime(m.dataEnvio),
  mine: myId != null && m.remetenteId === myId,
});

// Linha da lista de conversas: `unread` é o que a pessoa recebeu e ainda não leu
export const toConversation = (c) => ({
  appointmentId: c.agendamentoId,
  otherName: c.nomeOutraParte,
  otherPhoto: c.fotoOutraParte ?? null,
  service: c.nomeServico,
  appointmentStart: parseLocalDateTime(c.dataHoraInicio),
  appointmentStatus: c.statusAgendamento,
  lastMessage: c.ultimaMensagem,
  lastMessageMine: Boolean(c.ultimaMensagemMinha),
  lastMessageAt: parseLocalDateTime(c.dataUltimaMensagem),
  unread: c.naoLidas,
});

// O painel usa java.time.DayOfWeek ("MONDAY"); a tela usa as chaves de `weekDays`
const dayOfWeekToKey = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERCA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SABADO",
  SUNDAY: "DOMINGO",
};

// Painel: só atendimentos concluídos no período; funcionária nula = atendido pelo próprio estúdio
export const toDashboard = (d) => ({
  revenue: Number(d.faturamentoTotal ?? 0),
  appointments: d.totalAtendimentos,
  uniqueClients: d.totalClientesUnicos,
  returningClients: d.totalClientesRecorrentes,
  returningPercent: d.percentualRecorrencia,
  byStaff: (d.desempenhoPorFuncionaria ?? []).map((f) => ({
    staffId: f.funcionariaId,
    name: f.nome,
    revenue: Number(f.faturamento ?? 0),
    appointments: f.totalAtendimentos,
  })),
  topClients: (d.clientesRecorrentes ?? []).map((c) => ({
    clientId: c.clienteId,
    name: c.nome,
    appointments: c.totalAtendimentos,
    revenue: Number(c.faturamentoGerado ?? 0),
  })),
  byHour: (d.movimentoPorHora ?? []).map((h) => ({ hour: h.hora, appointments: h.totalAtendimentos })),
  byWeekday: (d.movimentoPorDiaSemana ?? []).map((w) => ({
    day: dayOfWeekToKey[w.diaSemana] ?? w.diaSemana,
    appointments: w.totalAtendimentos,
  })),
});

// ---------- Horário de funcionamento: DisponibilidadeResponse[] ↔ semana da tela ----------

// Ordem da tela (segunda primeiro); `key` é o enum DiaSemana do backend
export const weekDays = [
  { key: "SEGUNDA", label: "Segunda" },
  { key: "TERCA", label: "Terça" },
  { key: "QUARTA", label: "Quarta" },
  { key: "QUINTA", label: "Quinta" },
  { key: "SEXTA", label: "Sexta" },
  { key: "SABADO", label: "Sábado" },
  { key: "DOMINGO", label: "Domingo" },
];

const DEFAULT_HOURS = { start: "09:00", end: "18:00" };

// LocalTime vem como "09:00:00"; o <input type="time"> usa "09:00"
export const toBusinessHours = (list) => {
  const byDay = new Map(list.map((d) => [d.diaSemana, d]));
  return weekDays.map(({ key }) => {
    const d = byDay.get(key);
    return d
      ? { day: key, open: true, start: d.horaInicio.slice(0, 5), end: d.horaFim.slice(0, 5) }
      : { day: key, open: false, ...DEFAULT_HOURS };
  });
};

export const toBusinessHoursRequest = (week) => ({
  dias: week
    .filter((d) => d.open)
    .map((d) => ({ diaSemana: d.day, horaInicio: `${d.start}:00`, horaFim: `${d.end}:00` })),
});

// ---------- Cadastro: formulário das telas → request do backend ----------

const genderToApi = {
  feminino: "FEMININO",
  masculino: "MASCULINO",
  nao_binario: "NAO_BINARIO",
  prefiro_nao_informar: "PREFIRO_NAO_INFORMAR",
};

const toAddressRequest = (f) => ({
  cep: onlyDigits(f.cep ?? ""),
  logradouro: f.street,
  numero: f.number,
  complemento: f.complement || null,
  bairro: f.neighborhood,
  cidade: f.city,
  estado: f.state,
});

const genderFromApi = Object.fromEntries(Object.entries(genderToApi).map(([key, value]) => [value, key]));

const toProfileAddress = (e) =>
  e && {
    cep: e.cep ?? "",
    street: e.logradouro ?? "",
    number: e.numero ?? "",
    complement: e.complemento ?? "",
    neighborhood: e.bairro ?? "",
    city: e.cidade ?? "",
    state: e.estado ?? "",
  };

// Perfil da conta logada. E-mail e documentos vêm só para leitura: o backend não os troca por aqui.
const toProfileBase = (p) => ({
  id: p.id,
  name: p.nome,
  email: p.email,
  phone: p.telefone,
  birth: p.dataNascimento ?? "",
  address: toProfileAddress(p.endereco),
  latitude: p.latitude ?? null,
  longitude: p.longitude ?? null,
  photo: p.fotoUrl ?? null,
});

/** @returns {import("./contract").ClientProfile} */
export const toClientProfile = (p) => ({
  ...toProfileBase(p),
  cpf: p.cpf,
  gender: genderFromApi[p.genero] ?? "",
});

/** @returns {import("./contract").BusinessProfile} */
export const toBusinessProfile = (p) => ({
  ...toProfileBase(p),
  cnpj: p.cnpj ?? null,
  cpf: p.cpf ?? null,
  description: p.descricao ?? "",
  specialties: p.especialidades ?? [],
  establishmentType: p.tipoEstabelecimento,
});

// O PUT troca todos os campos: o que não vier aqui é apagado no backend
const toProfileRequestBase = (p) => ({
  nome: p.name.trim(),
  telefone: onlyDigits(p.phone),
  endereco: p.address ? toAddressRequest(p.address) : null,
  latitude: p.latitude ?? null,
  longitude: p.longitude ?? null,
});

export const toClientProfileRequest = (p) => ({
  ...toProfileRequestBase(p),
  dataNascimento: p.birth,
  genero: genderToApi[p.gender],
});

export const toBusinessProfileRequest = (p) => ({
  ...toProfileRequestBase(p),
  dataNascimento: p.birth || null,
  descricao: p.description || null,
  especialidades: p.specialties,
  tipoEstabelecimento: p.establishmentType,
});

export const toClientRegistration = (f) => ({
  nome: f.name.trim(),
  email: f.email.trim(),
  senha: f.password,
  telefone: onlyDigits(f.phone),
  cpf: onlyDigits(f.cpf),
  dataNascimento: f.birth,
  genero: genderToApi[f.gender],
  endereco: toAddressRequest(f),
  latitude: f.latitude ?? null,
  longitude: f.longitude ?? null,
});

export const toProfessionalRegistration = (f) => {
  const document = onlyDigits(f.document);
  const isCompany = f.documentType === "cnpj";
  return {
    nome: f.name.trim(),
    email: f.email.trim(),
    senha: f.password,
    telefone: onlyDigits(f.phone),
    cnpj: isCompany ? document : null,
    cpf: isCompany ? null : document,
    dataNascimento: f.birth || null,
    endereco: toAddressRequest(f),
    latitude: f.latitude ?? null,
    longitude: f.longitude ?? null,
    especialidades: f.specialties,
    servicos: f.services.map((s) => ({ nome: s.name, preco: s.price, duracao: s.duration })),
    tipoEstabelecimento: isCompany ? "ESTABELECIMENTO" : "AUTONOMA",
  };
};
