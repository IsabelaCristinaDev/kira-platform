// Testes da conversão entre o formato do kira-backend e o das telas
import { describe, expect, it } from "vitest";
import {
  formatRelativeDay,
  toAppointment,
  toBusinessHours,
  toBusinessHoursRequest,
  toBusinessService,
  toClientRegistration,
  toDashboard,
  toLocalDateTime,
  toBusinessProfile,
  toBusinessProfileRequest,
  toClientProfile,
  toClientProfileRequest,
  toConversation,
  toMessage,
  toProfessional,
  toProfessionalRegistration,
  toServiceRequest,
  toSlotTime,
  toStaff,
  toStaffRequest,
  toTimeBlock,
  toTimeBlockRequest,
} from "./mappers";

const studio = {
  id: "s1",
  nome: "Studio Bella",
  descricao: "Cortes e cor",
  endereco: { logradouro: "Av. T-4", numero: "100", bairro: "Setor Bueno", cidade: "Goiânia", estado: "GO" },
  telefone: "62999990000",
  fotoUrl: null,
  tipoEstabelecimento: "AUTONOMA",
  mediaAvaliacoes: 4.666,
};

describe("toProfessional", () => {
  it("usa o menor preço dos serviços ativos e arredonda a nota", () => {
    const pro = toProfessional(studio, [
      { id: "x", nome: "Corte", duracaoMinutos: 45, preco: 80, ativo: true },
      { id: "y", nome: "Escova", duracaoMinutos: 30, preco: "50.00", ativo: true },
      { id: "z", nome: "Antigo", duracaoMinutos: 30, preco: 10, ativo: false },
    ]);
    expect(pro.price).toBe(50);
    expect(pro.rating).toBe(4.7);
    expect(pro.role).toBe("Profissional autônoma");
    expect(pro.services.map((s) => s.name)).toEqual(["Corte", "Escova"]);
    expect(pro.address).toBe("Av. T-4, 100, Setor Bueno, Goiânia - GO");
  });
  it("sem serviços nem avaliações, preço e nota ficam nulos", () => {
    const pro = toProfessional({ ...studio, mediaAvaliacoes: null, endereco: null });
    expect(pro.price).toBeNull();
    expect(pro.rating).toBeNull();
    expect(pro.address).toBe("");
  });
});

describe("toAppointment", () => {
  const now = new Date(2026, 9, 15, 9, 0);
  const base = {
    id: "ag1",
    clienteId: "c1",
    nomeCliente: "Ana",
    empresaId: "s1",
    nomeEmpresa: "Studio Bella",
    servicoId: "x",
    nomeServico: "Corte",
    duracaoMinutos: 45,
    dataHoraInicio: "2026-10-16T14:30:00",
    dataHoraFim: "2026-10-16T15:15:00",
    status: "CONFIRMADO",
    formaPagamento: "PIX",
  };
  it("converte data, hora, status e pagamento", () => {
    const a = toAppointment(base, now);
    expect(a.date).toBe("Amanhã");
    expect(a.time).toBe("14:30");
    expect(a.status).toBe("proximo");
    expect(a.payment).toBe("Pix");
  });
  it("concluído e cancelado vão para as abas certas", () => {
    expect(toAppointment({ ...base, status: "CONCLUIDO" }, now).status).toBe("concluido");
    expect(toAppointment({ ...base, status: "CANCELADO" }, now).status).toBe("cancelado");
  });
});

describe("datas", () => {
  it("formata o dia relativo", () => {
    const now = new Date(2026, 9, 15, 23, 0);
    expect(formatRelativeDay(new Date(2026, 9, 15, 1, 0), now)).toBe("Hoje");
    expect(formatRelativeDay(new Date(2026, 9, 14), now)).toBe("Ontem");
    expect(formatRelativeDay(new Date(2026, 10, 2), now)).toBe("02/11");
  });
  it("envia LocalDateTime sem fuso e lê o horário do slot", () => {
    expect(toLocalDateTime(new Date(2026, 0, 5, 9, 30))).toBe("2026-01-05T09:30:00");
    expect(toSlotTime({ dataHoraInicio: "2026-01-05T09:30:00" })).toBe("09:30");
  });
});

describe("cadastro", () => {
  const address = {
    cep: "74000-000",
    street: "Rua 1",
    number: "10",
    complement: "",
    neighborhood: "Centro",
    city: "Goiânia",
    state: "GO",
  };
  it("monta o cadastro da cliente", () => {
    const body = toClientRegistration({
      ...address,
      name: " Ana Souza ",
      email: "ana@x.com",
      password: "Senha123",
      phone: "(62) 99999-0000",
      cpf: "529.982.247-25",
      birth: "1990-05-01",
      gender: "feminino",
      latitude: null,
      longitude: null,
    });
    expect(body).toMatchObject({
      nome: "Ana Souza",
      telefone: "62999990000",
      cpf: "52998224725",
      genero: "FEMININO",
      dataNascimento: "1990-05-01",
      endereco: { cep: "74000000", logradouro: "Rua 1", complemento: null },
    });
  });
  it("monta o cadastro da profissional com CNPJ como estabelecimento", () => {
    const body = toProfessionalRegistration({
      ...address,
      name: "Studio Bella",
      email: "s@x.com",
      password: "Senha123",
      phone: "62999990000",
      documentType: "cnpj",
      document: "11.222.333/0001-81",
      birth: "",
      specialties: ["Cabelo"],
      services: [{ id: "1", name: "Corte", price: "80", duration: "45" }],
    });
    expect(body).toMatchObject({
      cnpj: "11222333000181",
      cpf: null,
      dataNascimento: null,
      tipoEstabelecimento: "ESTABELECIMENTO",
      servicos: [{ nome: "Corte", preco: "80", duracao: "45" }],
    });
  });
});

describe("horário de funcionamento", () => {
  it("monta a semana a partir da segunda, com os dias ausentes fechados", () => {
    const week = toBusinessHours([
      { id: "d1", diaSemana: "SABADO", horaInicio: "08:00:00", horaFim: "12:00:00" },
      { id: "d2", diaSemana: "SEGUNDA", horaInicio: "09:30:00", horaFim: "18:00:00" },
    ]);
    expect(week.map((d) => d.day)).toEqual(["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"]);
    expect(week[0]).toEqual({ day: "SEGUNDA", open: true, start: "09:30", end: "18:00" });
    expect(week[1]).toEqual({ day: "TERCA", open: false, start: "09:00", end: "18:00" });
    expect(week[5]).toEqual({ day: "SABADO", open: true, start: "08:00", end: "12:00" });
  });

  it("envia só os dias abertos, com segundos no horário", () => {
    const week = toBusinessHours([]).map((d) => (d.day === "QUARTA" ? { ...d, open: true, end: "17:30" } : d));
    expect(toBusinessHoursRequest(week)).toEqual({
      dias: [{ diaSemana: "QUARTA", horaInicio: "09:00:00", horaFim: "17:30:00" }],
    });
  });
});

describe("gestão do estúdio", () => {
  it("converte o serviço e mantém a flag de ativo", () => {
    const s = toBusinessService({
      id: "x",
      nome: "Corte",
      descricao: null,
      duracaoMinutos: 45,
      preco: "80.00",
      ativo: false,
    });
    expect(s).toEqual({ id: "x", name: "Corte", description: "", durationMinutes: 45, price: 80, active: false });
  });
  it("monta o request do serviço com números e descrição vazia como nula", () => {
    expect(toServiceRequest({ name: " Escova ", description: " ", durationMinutes: "30", price: "50" })).toEqual({
      nome: "Escova",
      descricao: null,
      duracaoMinutos: 30,
      preco: 50,
    });
  });
  it("converte a funcionária e o request sem comissão", () => {
    const f = toStaff({
      id: "f1",
      nome: "Bia",
      fotoUrl: "",
      especialidades: null,
      ativo: true,
      comissaoPercentual: "30.00",
    });
    expect(f).toEqual({ id: "f1", name: "Bia", photo: null, specialties: "", active: true, commissionPercent: 30 });
    expect(toStaffRequest({ name: "Bia ", specialties: "", commissionPercent: "" })).toEqual({
      nome: "Bia",
      fotoUrl: null,
      especialidades: null,
      comissaoPercentual: null,
    });
  });
  it("converte o bloqueio de horário nos dois sentidos", () => {
    const b = toTimeBlock({
      id: "b1",
      funcionariaId: "f1",
      nomeFuncionaria: "Bia",
      dataHoraInicio: "2026-10-20T12:00:00",
      dataHoraFim: "2026-10-20T13:00:00",
      motivo: null,
    });
    expect(b.start).toEqual(new Date(2026, 9, 20, 12, 0));
    expect(b.reason).toBe("");
    expect(toTimeBlockRequest({ start: b.start, end: b.end, reason: " Almoço " })).toEqual({
      dataHoraInicio: "2026-10-20T12:00:00",
      dataHoraFim: "2026-10-20T13:00:00",
      motivo: "Almoço",
    });
  });
  it("marca como minha a mensagem enviada pelo usuário logado", () => {
    const m = {
      id: "m1",
      agendamentoId: "ag1",
      remetenteId: "c1",
      nomeRemetente: "Ana",
      conteudo: "Oi",
      lida: null,
      dataEnvio: "2026-10-20T09:00:00",
    };
    expect(toMessage(m, "c1")).toMatchObject({ mine: true, read: false, text: "Oi", senderName: "Ana" });
    expect(toMessage(m, "s1").mine).toBe(false);
  });
  it("o perfil da cliente vai e volta sem perder dados", () => {
    const api = {
      id: "c1",
      nome: "Ana Lima",
      email: "ana@example.com",
      telefone: "62999990000",
      cpf: "52998224725",
      dataNascimento: "1995-01-01",
      genero: "NAO_BINARIO",
      endereco: {
        cep: "74000000",
        logradouro: "Rua A",
        numero: "1",
        complemento: null,
        bairro: "Centro",
        cidade: "Goiânia",
        estado: "GO",
      },
      latitude: -16.6,
      longitude: -49.2,
      fotoUrl: null,
    };
    const profile = toClientProfile(api);
    expect(profile).toMatchObject({ name: "Ana Lima", gender: "nao_binario", cpf: "52998224725" });
    expect(profile.address.street).toBe("Rua A");
    expect(toClientProfileRequest(profile)).toEqual({
      nome: "Ana Lima",
      telefone: "62999990000",
      dataNascimento: "1995-01-01",
      genero: "NAO_BINARIO",
      endereco: api.endereco,
      latitude: -16.6,
      longitude: -49.2,
    });
  });
  it("o perfil do estúdio vai e volta, sem endereço e sem data", () => {
    const profile = toBusinessProfile({
      id: "e1",
      nome: "Studio",
      email: "s@example.com",
      telefone: "62999990001",
      cnpj: "11222333000181",
      cpf: null,
      descricao: null,
      especialidades: ["Corte"],
      dataNascimento: null,
      endereco: null,
      latitude: null,
      longitude: null,
      tipoEstabelecimento: "AUTONOMA",
      fotoUrl: null,
    });
    expect(profile).toMatchObject({ address: null, description: "", specialties: ["Corte"] });
    expect(toBusinessProfileRequest({ ...profile, phone: "(62) 99999-0001" })).toEqual({
      nome: "Studio",
      telefone: "62999990001",
      dataNascimento: null,
      descricao: null,
      especialidades: ["Corte"],
      endereco: null,
      latitude: null,
      longitude: null,
      tipoEstabelecimento: "AUTONOMA",
    });
  });
  it("converte a linha da lista de conversas", () => {
    const c = toConversation({
      agendamentoId: "a1",
      nomeOutraParte: "Ana Lima",
      fotoOutraParte: null,
      nomeServico: "Corte",
      dataHoraInicio: "2026-11-04T12:00:00",
      statusAgendamento: "CANCELADO",
      ultimaMensagem: "Oi",
      ultimaMensagemMinha: true,
      dataUltimaMensagem: "2026-11-01T09:30:00",
      naoLidas: 2,
    });
    expect(c).toMatchObject({
      appointmentId: "a1",
      otherName: "Ana Lima",
      otherPhoto: null,
      service: "Corte",
      appointmentStatus: "CANCELADO",
      lastMessage: "Oi",
      lastMessageMine: true,
      unread: 2,
    });
    expect(c.lastMessageAt).toEqual(new Date(2026, 10, 1, 9, 30));
  });
  it("converte o painel e o dia da semana do java.time", () => {
    const d = toDashboard({
      faturamentoTotal: "150.50",
      totalAtendimentos: 2,
      desempenhoPorFuncionaria: [{ funcionariaId: null, nome: null, faturamento: "150.50", totalAtendimentos: 2 }],
      totalClientesUnicos: 1,
      totalClientesRecorrentes: 1,
      percentualRecorrencia: 100,
      clientesRecorrentes: [{ clienteId: "c1", nome: "Ana", totalAtendimentos: 2, faturamentoGerado: "150.50" }],
      movimentoPorHora: [{ hora: 14, totalAtendimentos: 2 }],
      movimentoPorDiaSemana: [{ diaSemana: "MONDAY", totalAtendimentos: 2 }],
    });
    expect(d.revenue).toBe(150.5);
    expect(d.byStaff[0]).toEqual({ staffId: null, name: null, revenue: 150.5, appointments: 2 });
    expect(d.topClients[0].revenue).toBe(150.5);
    expect(d.byHour).toEqual([{ hour: 14, appointments: 2 }]);
    expect(d.byWeekday).toEqual([{ day: "SEGUNDA", appointments: 2 }]);
  });
});
