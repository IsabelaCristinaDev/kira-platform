// Adaptador HTTP: cada função chama o kira-backend (e o ViaCEP) e devolve dados no formato das telas · API: kira-backend, ViaCEP
import { ApiError, SESSION_ENDED, SESSION_ENDED_MESSAGE } from "./contract";
import { authStore, request } from "./http";
import {
  toAppointment,
  toBusinessHours,
  toBusinessHoursRequest,
  toBusinessService,
  toClientRegistration,
  toDashboard,
  toLocalDate,
  toLocalDateTime,
  toBusinessProfile,
  toBusinessProfileRequest,
  toClientProfile,
  toClientProfileRequest,
  toConversation,
  toMessage,
  toProfessional,
  toProfessionalRegistration,
  toReview,
  toServiceRequest,
  toSlotTime,
  toStaff,
  toStaffRequest,
  toTimeBlock,
  toTimeBlockRequest,
} from "./mappers";
import { disableWebPush, enableWebPush, forgetWebPush, syncWebPush } from "../notifications/webPush";
import { onlyDigits } from "../utils/format";
import { subscribeToConversation, subscribeToUserChannel } from "./messageSocket";

// O backend recebe o id do usuário logado na URL (ex.: /api/agendamentos/cliente/{id})
const currentUserId = () => {
  const id = authStore.get()?.id;
  if (!id) {
    throw new ApiError(SESSION_ENDED, SESSION_ENDED_MESSAGE);
  }
  return id;
};

const listServices = (studioId) => request(`/api/studios/${studioId}/servicos`, { auth: false });

const availableSlots = async ({ proId, serviceId, staffId, date }) => {
  const slots = await request(`/api/empresas/${proId}/disponibilidade/slots`, {
    query: { servicoId: serviceId, data: toLocalDate(date), funcionariaId: staffId },
    auth: false,
  });
  return slots.map(toSlotTime);
};

const isBusinessRule = (e) => e instanceof ApiError && e.code === "REGRA_DE_NEGOCIO";

// Dia sem expediente volta como 400 (regra de negócio): para a tela é só um dia sem horários
const noSlotsOnBusinessRule = (e) => {
  if (isBusinessRule(e)) return [];
  throw e;
};

const sameAddress = (a, b) => JSON.stringify(toAddressKey(a)) === JSON.stringify(toAddressKey(b));
const toAddressKey = (a) =>
  a && {
    cep: onlyDigits(a.cep ?? ""),
    street: a.street ?? "",
    number: a.number ?? "",
    complement: a.complement ?? "",
    neighborhood: a.neighborhood ?? "",
    city: a.city ?? "",
    state: a.state ?? "",
  };

// As coordenadas apontam para o endereço antigo: sem novas, é melhor ficar sem distância do que mostrar uma errada
const withoutStaleCoordinates = (current, changes) => {
  const moved = "address" in changes && !sameAddress(current.address, changes.address);
  const hasNewCoordinates = "latitude" in changes || "longitude" in changes;
  return moved && !hasNewCoordinates ? { ...changes, latitude: null, longitude: null } : changes;
};

// A rota, a conversão e o formato de envio do perfil dependem do tipo da conta logada
const profileRoute = () =>
  authStore.get()?.tipo === "EMPRESA"
    ? { path: `/api/empresas/${currentUserId()}/perfil`, from: toBusinessProfile, to: toBusinessProfileRequest }
    : { path: `/api/clientes/${currentUserId()}/perfil`, from: toClientProfile, to: toClientProfileRequest };

const DEVICES_PATH = "/api/notificacoes/dispositivos/web";

const pushCalls = {
  // Nula com as notificações desligadas no servidor
  getPublicKey: async () => (await request("/api/notificacoes/chave-publica")).chavePublica,
  registerDevice: (device) => request(DEVICES_PATH, { method: "POST", body: device }),
  removeDevice: (endpoint) => request(DEVICES_PATH, { method: "DELETE", body: { endpoint } }),
};

export const httpAdapter = {
  auth: {
    // LoginResponse: { token, refreshToken, tipo, nome, email, id? }
    login: async ({ email, password }) => {
      const data = await request("/api/auth/login", {
        method: "POST",
        body: { email: email.trim(), senha: password },
        auth: false,
      });
      authStore.set({ ...data, id: data.id ?? null });
      return authStore.get();
    },
    registerClient: (form) =>
      request("/api/auth/registro/cliente", { method: "POST", body: toClientRegistration(form), auth: false }),
    registerProfessional: (form) =>
      request("/api/auth/registro/empresa", { method: "POST", body: toProfessionalRegistration(form), auth: false }),
    // A resposta é a mesma exista ou não a conta: o backend não revela quais e-mails estão cadastrados
    requestPasswordReset: (email) =>
      request("/api/auth/recuperar-senha", { method: "POST", body: { email: email.trim() }, auth: false }),
    resetPassword: ({ token, password }) =>
      request("/api/auth/redefinir-senha", {
        method: "POST",
        body: { token: token.trim(), novaSenha: password },
        auth: false,
      }),
    logout: async () => {
      // Antes de apagar a sessão: tirar o navegador da conta precisa do token
      await disableWebPush(pushCalls);
      const refreshToken = authStore.get()?.refreshToken;
      authStore.set(null);
      if (refreshToken) {
        await request("/api/auth/logout", { method: "POST", body: { refreshToken }, auth: false }).catch(() => {});
      }
    },
  },
  professionals: {
    // A listagem de estúdios não traz serviços nem preço: busca os serviços de cada um em paralelo
    list: async () => {
      const studios = await request("/api/studios", { auth: false });
      const services = await Promise.all(studios.map((s) => listServices(s.id).catch(() => [])));
      return studios.map((s, i) => toProfessional(s, services[i]));
    },
    get: async (id) => {
      const [studio, services, reviews] = await Promise.all([
        request(`/api/studios/${id}`, { auth: false }),
        listServices(id),
        request(`/api/studios/${id}/avaliacoes`, { auth: false }),
      ]);
      const pro = toProfessional(studio, services, reviews);
      const clientReviews = reviews.map(toReview).filter((r) => r.author === "CLIENTE");
      return { ...pro, reviewList: clientReviews };
    },
    // Só as ativas: a cliente escolhe quem vai atender
    listStaff: async (id) => {
      const list = await request(`/api/studios/${id}/funcionarias`, { auth: false });
      return list.map(toStaff);
    },
  },
  availability: {
    // Com `staffId`, só os horários em que aquela funcionária está livre
    get: ({ proId, serviceId, staffId, date }) =>
      availableSlots({ proId, serviceId, staffId, date }).catch(noSlotsOnBusinessRule),
    // Para remarcar: a funcionária continua a mesma. Se ela foi desativada, o backend recusa os horários dela,
    // mas remarca com quem estiver livre, então a lista passa a ser a do estúdio.
    forAppointment: ({ appointment: { proId, serviceId, staffId }, date }) =>
      availableSlots({ proId, serviceId, staffId, date })
        .catch((e) => {
          if (staffId && isBusinessRule(e)) return availableSlots({ proId, serviceId, date });
          throw e;
        })
        .catch(noSlotsOnBusinessRule),
  },
  appointments: {
    listMine: async () => {
      const list = await request(`/api/agendamentos/cliente/${currentUserId()}`);
      return list.map((a) => toAppointment(a)).sort((a, b) => b.start - a.start);
    },
    listForMyBusiness: async () => {
      const list = await request(`/api/agendamentos/empresa/${currentUserId()}`);
      return list.map((a) => toAppointment(a)).sort((a, b) => a.start - b.start);
    },
    // Sem `staffId`, o estúdio decide quem atende
    create: async ({ proId, serviceId, staffId = null, start, payment = null, notes = null }) =>
      toAppointment(
        await request(`/api/agendamentos/cliente/${currentUserId()}`, {
          method: "POST",
          body: {
            empresaId: proId,
            funcionariaId: staffId,
            servicoId: serviceId,
            dataHoraInicio: toLocalDateTime(start),
            formaPagamento: payment,
            observacoes: notes,
          },
        }),
      ),
    cancel: async (id) => toAppointment(await request(`/api/agendamentos/${id}/cancelar`, { method: "PATCH" })),
    // Mesmo serviço e profissional, novo início; o backend confere expediente e conflito de horário
    reschedule: async ({ id, start }) =>
      toAppointment(
        await request(`/api/agendamentos/${id}/reagendar/cliente`, {
          method: "PATCH",
          body: { novaDataHoraInicio: toLocalDateTime(start) },
        }),
      ),
    // Ações do estúdio: o backend confere se o atendimento é do estúdio logado
    complete: async (id) => toAppointment(await request(`/api/agendamentos/${id}/concluir`, { method: "PATCH" })),
    cancelAsBusiness: async (id) =>
      toAppointment(await request(`/api/agendamentos/${id}/cancelar/empresa`, { method: "PATCH" })),
    // Sem o limite de 2 horas da cliente
    rescheduleAsBusiness: async ({ id, start }) =>
      toAppointment(
        await request(`/api/agendamentos/${id}/reagendar/empresa`, {
          method: "PATCH",
          body: { novaDataHoraInicio: toLocalDateTime(start) },
        }),
      ),
  },
  reviews: {
    // Só atendimento concluído e ainda não avaliado (o backend confere e devolve a mensagem)
    create: async ({ appointmentId, rating, text }) =>
      toReview(
        await request("/api/avaliacoes/cliente", {
          method: "POST",
          body: { agendamentoId: appointmentId, nota: rating, comentario: text.trim() || null },
        }),
      ),
    listMine: async () => (await request("/api/avaliacoes/minhas")).map(toReview),
    listForMyBusiness: async () => {
      const list = await request(`/api/avaliacoes/empresa/${currentUserId()}`, { auth: false });
      return list.map(toReview).filter((r) => r.author === "CLIENTE");
    },
  },
  services: {
    // Inclui os desativados (active: false): o agendamento antigo ainda aponta para eles
    listForMyBusiness: async () => {
      const list = await request(`/api/empresas/${currentUserId()}/servicos`);
      return list.map(toBusinessService);
    },
    create: async (service) =>
      toBusinessService(
        await request(`/api/empresas/${currentUserId()}/servicos`, { method: "POST", body: toServiceRequest(service) }),
      ),
    update: async ({ id, ...service }) =>
      toBusinessService(
        await request(`/api/empresas/${currentUserId()}/servicos/${id}`, {
          method: "PUT",
          body: toServiceRequest(service),
        }),
      ),
    // DELETE só desativa: o serviço some da busca, mas continua no histórico
    deactivate: (id) => request(`/api/empresas/${currentUserId()}/servicos/${id}`, { method: "DELETE" }),
  },
  // Funcionárias do estúdio logado; agenda, bloqueios e comissão conferem se a funcionária é do estúdio
  staff: {
    listForMyBusiness: async () => {
      const list = await request(`/api/empresas/${currentUserId()}/funcionarias`);
      return list.map(toStaff);
    },
    create: async (staff) =>
      toStaff(
        await request(`/api/empresas/${currentUserId()}/funcionarias`, { method: "POST", body: toStaffRequest(staff) }),
      ),
    update: async ({ id, ...staff }) =>
      toStaff(
        await request(`/api/empresas/${currentUserId()}/funcionarias/${id}`, {
          method: "PUT",
          body: toStaffRequest(staff),
        }),
      ),
    deactivate: (id) => request(`/api/empresas/${currentUserId()}/funcionarias/${id}`, { method: "DELETE" }),
    agendaDay: async ({ staffId, date }) => {
      const list = await request(`/api/funcionarias/${staffId}/agenda/dia`, { query: { data: toLocalDate(date) } });
      return list.map((a) => toAppointment(a)).sort((a, b) => a.start - b.start);
    },
    // Sete dias a partir de `start`
    agendaWeek: async ({ staffId, start }) => {
      const list = await request(`/api/funcionarias/${staffId}/agenda/semana`, {
        query: { dataInicio: toLocalDate(start) },
      });
      return list.map((a) => toAppointment(a)).sort((a, b) => a.start - b.start);
    },
    listBlocks: async (staffId) => {
      const list = await request(`/api/funcionarias/${staffId}/bloqueios`);
      return list.map(toTimeBlock).sort((a, b) => a.start - b.start);
    },
    createBlock: async ({ staffId, ...block }) =>
      toTimeBlock(
        await request(`/api/funcionarias/${staffId}/bloqueios`, { method: "POST", body: toTimeBlockRequest(block) }),
      ),
    removeBlock: ({ staffId, id }) => request(`/api/funcionarias/${staffId}/bloqueios/${id}`, { method: "DELETE" }),
    commissionTotal: async (staffId) => Number(await request(`/api/comissoes/funcionaria/${staffId}/total`)),
  },
  // Chat do agendamento (cliente e estúdio)
  messages: {
    listByAppointment: async (appointmentId) => {
      const myId = authStore.get()?.id ?? null;
      const list = await request(`/api/mensagens/agendamento/${appointmentId}`);
      return list.map((m) => toMessage(m, myId));
    },
    send: async ({ appointmentId, text }) => {
      const myId = currentUserId();
      return toMessage(
        await request(`/api/mensagens/remetente/${myId}`, {
          method: "POST",
          body: { agendamentoId: appointmentId, conteudo: text.trim() },
        }),
        myId,
      );
    },
    markRead: (id) => request(`/api/mensagens/${id}/lida`, { method: "PATCH" }),
    listConversations: async () => (await request("/api/mensagens/conversas")).map(toConversation),
    // Aviso de que a lista mudou: `message` é a mensagem nova; sem ela, uma conversa foi lida
    subscribeToChanges: ({ onChange, onStatus }) => {
      const myId = currentUserId();
      return subscribeToUserChannel(myId, {
        onNotice: (aviso) => onChange({ message: aviso.mensagem ? toMessage(aviso.mensagem, myId) : null }),
        onStatus,
      });
    },
    // Marca de uma vez o que o usuário logado recebeu na conversa
    markAllRead: (appointmentId) => request(`/api/mensagens/agendamento/${appointmentId}/lidas`, { method: "PATCH" }),
    subscribe: (appointmentId, { onMessage, onStatus }) =>
      subscribeToConversation(appointmentId, {
        onMessage: (m) => onMessage(toMessage(m, authStore.get()?.id ?? null)),
        onStatus,
      }),
  },
  // Notificação do navegador. A tela chama `enable` no toque do botão e mostra o resultado (PUSH_STATUS).
  notifications: {
    ...pushCalls,
    enable: () => enableWebPush(pushCalls),
    sync: () => syncWebPush(pushCalls),
    disable: () => disableWebPush(pushCalls),
    forget: forgetWebPush,
  },
  // Painel pronto do backend; sem período, vale do dia 1º do mês até hoje
  dashboard: {
    getMine: async ({ from = null, to = null } = {}) =>
      toDashboard(
        await request(`/api/empresas/${currentUserId()}/dashboard`, {
          query: { dataInicio: from && toLocalDate(from), dataFim: to && toLocalDate(to) },
        }),
      ),
  },
  businessHours: {
    // Dia que não vem na lista está fechado
    getMine: async () => toBusinessHours(await request(`/api/empresas/${currentUserId()}/disponibilidade`)),
    get: async (proId) => toBusinessHours(await request(`/api/empresas/${proId}/disponibilidade`, { auth: false })),
    // PUT troca a semana inteira de uma vez
    saveMine: async (week) =>
      toBusinessHours(
        await request(`/api/empresas/${currentUserId()}/disponibilidade`, {
          method: "PUT",
          body: toBusinessHoursRequest(week),
        }),
      ),
  },
  profile: {
    getMine: async () => {
      const { path, from } = profileRoute();
      return from(await request(path));
    },
    // Recebe só o que mudou: o restante vem do perfil atual, para o PUT não apagar endereço e coordenadas
    saveMine: async (changes) => {
      const { path, from, to } = profileRoute();
      const current = from(await request(path));
      const body = to({ ...current, ...withoutStaleCoordinates(current, changes) });
      const saved = from(await request(path, { method: "PUT", body }));
      // O nome da sessão vem do login: sem isso, o app mostraria o nome antigo até entrar de novo
      const auth = authStore.get();
      if (auth && auth.nome !== saved.name) authStore.set({ ...auth, nome: saved.name });
      return saved;
    },
  },
  address: {
    // ViaCEP: serviço público de CEP, sem chave
    lookupCep: async (cep) => {
      let data;
      try {
        const res = await fetch(`https://viacep.com.br/ws/${onlyDigits(cep)}/json/`);
        data = await res.json();
      } catch (e) {
        throw new ApiError("cep_indisponivel", "Não foi possível consultar o CEP agora.", 0, e);
      }
      if (data.erro) throw new ApiError("cep_nao_encontrado", "CEP não encontrado.", 404);
      return { street: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf };
    },
  },
};
