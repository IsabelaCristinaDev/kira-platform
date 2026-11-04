// Conteúdo demonstrativo das telas ainda sem backend: todo texto e dado aqui é exemplo, nada é real · mock
import { mockProfessionals } from "./professionals";

// ---- Conversas (cliente e profissional) ----
export const demoMessages = [
  { id: "m1", from: "them", text: "Mensagem de exemplo recebida.", time: "09:30" },
  { id: "m2", from: "me", text: "Mensagem de exemplo enviada.", time: "09:32" },
  { id: "m3", from: "them", text: "Outra mensagem de exemplo recebida.", time: "09:35" },
];

const lastOf = demoMessages[demoMessages.length - 1];

// Lado do cliente: conversas com profissionais já existentes nos mocks
export const clientConversationsDemo = mockProfessionals.slice(0, 3).map((pro, i) => ({
  id: `pro-${pro.id}`,
  proId: pro.id,
  name: pro.name,
  subtitle: pro.role,
  photo: pro.photo,
  last: lastOf.text,
  time: i === 0 ? "09:35" : i === 1 ? "Ontem" : "12/07",
  unread: i === 0 ? 2 : 0,
}));

// Lado do profissional: clientes que já aparecem na agenda e no financeiro dos mocks
export const proConversationsDemo = ["Ana Souza", "Rafael Lima", "Beatriz Nunes"].map((name, i) => ({
  id: `cli-${i + 1}`,
  name,
  subtitle: "Cliente",
  photo: null,
  last: lastOf.text,
  time: i === 0 ? "09:35" : i === 1 ? "Ontem" : "12/07",
  unread: i === 0 ? 1 : 0,
}));

// ---- Notificações: usam só os avisos que o acompanhamento do agendamento já documenta ----
export const notificationsDemo = [
  {
    id: "n1",
    category: "Lembretes",
    title: "Quase na hora",
    text: "Exemplo de lembrete antes do atendimento.",
    time: "Hoje",
    read: false,
  },
  {
    id: "n2",
    category: "Agendamento",
    title: "Profissional confirmou",
    text: "Exemplo de aviso de confirmação do agendamento.",
    time: "Hoje",
    read: false,
  },
  {
    id: "n3",
    category: "Agendamento",
    title: "Pagamento confirmado",
    text: "Exemplo de aviso de pagamento conferido.",
    time: "Ontem",
    read: true,
  },
  {
    id: "n4",
    category: "Lembretes",
    title: "Lembrete de agendamento",
    text: "Exemplo de lembrete do dia anterior.",
    time: "12/07",
    read: true,
  },
];

// ---- Perguntas frequentes: só há resposta onde o comportamento já está documentado ----
export const clientFaqDemo = [
  {
    id: "c1",
    category: "Provador",
    question: "Como funciona o Provador virtual?",
    answer:
      "Você escolhe uma foto de referência, envia a sua foto e vê o resultado. Em Encontrar profissionais, a Home mostra as recomendadas para você e dali você abre o perfil e agenda.",
  },
  { id: "c2", category: "Agendamentos", question: "Como altero um agendamento?", answer: null },
  {
    id: "c3",
    category: "Pagamentos",
    question: "Como funciona o pagamento?",
    answer:
      "Depois de agendar, você acompanha o pedido. O pagamento é por Pix: você copia o código, avisa que pagou e a equipe do Kira confere.",
  },
];

export const proFaqDemo = [
  { id: "p1", category: "Recomendação", question: "Como funciona a recomendação por IA?", answer: null },
  { id: "p2", category: "Pagamentos", question: "Como recebo pelos meus atendimentos?", answer: null },
  {
    id: "p3",
    category: "Segurança",
    question: "Como funciona o Canal de Segurança?",
    answer:
      "É o canal para registrar um problema de segurança. Em risco imediato, ligue primeiro para o 190. A denúncia comum é anônima perante a outra parte.",
  },
];

// ---- Cartões: dados fictícios, só para mostrar o layout ----
export const cardsDemo = [
  { id: "k1", label: "Cartão de exemplo", last4: "0000", holder: "NOME DE EXEMPLO", expires: "00/00", main: true },
  {
    id: "k2",
    label: "Outro cartão de exemplo",
    last4: "0000",
    holder: "NOME DE EXEMPLO",
    expires: "00/00",
    main: false,
  },
];
