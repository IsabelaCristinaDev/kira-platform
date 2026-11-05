# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado (camada visual, sem funcionalidade real)

- Telas de demonstração: conversas e conversa (cliente e profissional), central de notificações, perguntas frequentes,
  Plano Premium (R9), Buscar do profissional (substitui o "em breve"). Dados de exemplo identificados em `shared/data/demo.js`.
- Modais visuais: avaliar atendimento, cancelar agendamento, exportar dados (LGPD), adicionar cartão (campos
  desativados), criar Gift Card e assinar Premium. Nenhum deles executa a operação: mostram o aviso de demonstração.
- Formas de pagamento com cartões de exemplo e seleção do principal; cupom mostra o aviso ao aplicar.
- Componentes: `Sheet`, `DemoBanner`/`DemoNotice`, `ScreenFrame`, `StarRatingInput`, `ConversationList`,
  `NotificationCenter`, `FaqView`.

### Adicionado (telas do pitch, camada visual)

- Checkout do agendamento (Pix, cartão em até 3x e Gift Card) e tela separada de processamento com estados
  demonstrativos. Nada é cobrado nem validado.
- Resultado do provador com compatibilidade (reaproveita `recommendProfessionals`), antes/depois e acesso aos
  recomendados; tela "Recomendado pela IA" com ordenação, filtro, justificativa, perfil, conversa e agendar.
- Fidelidade Kira do cliente (valores de exemplo, regras a definir), histórico de clientes do profissional,
  jornada completa do cliente e certificados (exemplo, não verificados) no perfil público.
- Chat: busca de conversas, estados de envio e leitura, mensagem com imagem, anexo desativado, aviso sem conexão
  e atalhos para perfil, agendar e agendamento.

### Corrigido

- Quadro do celular com largura responsiva e altura definida (tela cheia em celulares), para a rolagem interna, a barra
  inferior e o botão Agendar ficarem sempre visíveis e sem estouro lateral de 320px a 1440px.
- Perfil da profissional: avatar inteiro sobre o cabeçalho, fotos enquadradas pelo rosto e portfólio proporcional.
- Busca: botão de filtro sem corte em telas estreitas, chips sem barra de rolagem clássica e scroll infinito ativo.
- Card de faturamento do painel profissional e corpo da home do cliente sem rolagem horizontal.
- Calendário com "Novembro de 2026" (antes "De"), overlay do filtro restrito ao quadro, chat sem altura fixa.
- Acessibilidade: área de toque de 44px no Voltar e nos botões, contraste AA na abertura, abas com `role` e
  `aria-selected`, `aria-pressed` nos chips, teclado numérico e autopreenchimento nos formulários e respeito a
  "reduzir movimento".

### Alterado

- Continuar e Salvar ficam fixos no rodapé dos formulários longos de cadastro e edição.

### Adicionado

- Tela de horário de funcionamento do profissional (dias e horas em que atende), com aviso no painel enquanto nenhum dia estiver aberto.
- Na agenda do profissional, concluir atendimento (depois do horário de início) e cancelar com confirmação.
- Avaliar atendimento concluído (nota de 1 a 5 e comentário) pelo detalhe do agendamento.
- Esqueci a senha: link no login, pedido por e-mail e tela de nova senha (abre pelo link do e-mail ou com o código).
- Remarcar horário pelo detalhe do agendamento: mesmo serviço e profissional, novo dia e horário livre.
- Chat entre cliente e estúdio no agendamento, em tempo real (WebSocket), com reconexão automática. Agendamento cancelado fica só para leitura.
- O profissional remarca pela agenda, sem o limite de 2 horas da cliente. Os horários oferecidos são os da funcionária do atendimento.
- Relatório do financeiro (Baixar relatório) em CSV com as transações listadas, a partir dos agendamentos concluídos.
- Confirmação "Configurações salvas" na tela de fidelidade.

- Chat de atendimento em `/cliente/atendimento` com dados simulados: respostas da nossa inteligência artificial,
  cartão de profissional, sugestão de horário, transferência para atendente, falha de envio e modo sem conexão.
- Contrato `api.chat` pronto para conectar ao n8n (mensagens, transferência e eventos).
- App React Native (Expo) em `mobile/` com abertura, login, início, busca, perfil da profissional, agendamento, ajuda e o
  chat de atendimento, reaproveitando a lógica do web pelo alias `@kira`.
- Provador virtual no app, com consentimento LGPD, prévia simulada, exclusão de fotos e revogação, e contrato
  `api.tryOn` pronto para a API real.
- Canal de segurança no app, com denúncia anônima, emergência com ligação ao 190 e registro sem anonimato, e contrato
  `api.reports` pronto para a API real.
- Acompanhamento do agendamento em `/cliente/agenda/acompanhar`, no estilo de acompanhar um pedido: status no topo,
  linha do tempo (pedido enviado, profissional confirmou, pagamento confirmado, quase na hora, em atendimento,
  concluído) e Pix com copiar código, aviso de pagamento e conferência. Contrato `api.bookings` pronto para a API real.
- Notificação do navegador: service worker, abrir a conversa ao tocar, sem repetir a conversa aberta, `api.notifications`
  pronta para o botão de permitir e remoção do navegador ao sair da conta. Sem as chaves no backend, fica desligada.
- Favoritas salvas na conta da cliente, em vez de só na sessão. `api.emergencyContacts` pronta para a tela de contatos
  de emergência.

### Alterado

- Os dados falsos saíram do app: telas do cliente e do profissional usam o kira-backend (`VITE_API_URL`).
- Login, cadastro de cliente e de profissional, agendamento e cancelamento chamam a API de verdade, com renovação do token.
- Busca, Home, ranking e perfil do profissional usam os estúdios, serviços e avaliações do backend.
- Painel, agenda, financeiro e analytics do profissional são calculados a partir dos agendamentos reais.
- CEP consultado no ViaCEP.

### Removido

- Adaptador de mock e dados de exemplo no web (ficam só para o app Expo e os recursos ainda simulados), arquivos `data/mocks.js` e o mapa ilustrativo da Home.
- Saldo, próximo repasse e gift cards de exemplo, que não têm backend.

## [0.6.0] - 2026-10-14

### Adicionado

- Camada de serviços em `src/shared/api/` com adaptador de mock e contrato pronto para API real.
- TanStack Query para carregando, erro e nova tentativa em horários, busca, recomendações, CEP e perfil.
- Regras de validação em zod e react-hook-form na edição de perfil.
- Testes dos serviços, da busca e das regras de formulário.

### Alterado

- O estado global foi dividido por assunto: sessão, cadastro, busca, agendamento, Provador e painel profissional.
- Estado que só vale para uma tela (modais, abas, carregando) passou a ficar na própria tela e volta ao início ao sair dela.
- `KiraContext` e o hook `useKira` foram substituídos pelos contextos por assunto.

## [0.5.0] - 2026-10-14

### Adicionado

- React Router com rotas `/cliente/*` e `/profissional/*` e telas compartilhadas na raiz.
- Layouts ClientLayout e ProLayout, com proteção por tipo de conta.
- Botão voltar e avançar do navegador, e links diretos para cada tela.
- Testes da tabela de rotas.

### Alterado

- A tela atual vem da URL. `setScreen(chave)` continua igual e navega para a rota.
- Os atalhos do protótipo agora também definem o tipo de conta da área.

## [0.4.0] - 2026-10-14

### Adicionado

- Caixa de seleção real (teclado e leitor de tela) nos termos e na fidelidade.
- Fechar modais com a tecla Esc.
- Regras de acessibilidade do lint agora são erros.

### Alterado

- Textos rosa e vermelhos ficam um pouco mais escuros, para contraste AA.
- Divs e spans clicáveis viraram botões, sem mudar o visual.
- Chaves de listas usam dados estáveis, não o índice.

### Corrigido

- Campos sem rótulo ligado (nascimento, sexo, termos, sliders de fidelidade).
- Botões de ver senha, adicionar especialidade e remover foto sem nome.
- Card de faturamento do painel tinha botões dentro de botão.
- axe: de 11 erros críticos e 75 sérios para 0 nas 52 telas.

## [0.3.0] - 2026-10-14

### Adicionado

- Tokens em variáveis CSS: cor, espaço, raio, sombra e tipografia.
- Primitivos de interface: Heading, Text, Card, Stack, Button, Chip, Badge, ListRow e ScreenHeader.
- Foco visível e hover em botões, links e campos.
- Regra de lint que barra cor, fonte e raio fixos.

### Alterado

- Componentes base usam os primitivos.
- Barra inferior do cliente e do profissional agora é um componente só (NavBar).
- Escala de fontes única, com mínimo de 12px (textos de 9, 10 e 11px subiram para 12px).
- Campos mostram o anel de foco ao receber foco por teclado.

## [0.2.0] - 2026-10-14

### Adicionado

- Lint com ESLint (hooks e acessibilidade).
- Formatação com Prettier.
- 23 testes dos utilitários com Vitest.
- CI no GitHub: commits, lint, formatação, testes e build.
- Commitlint e Husky para validar mensagens de commit.

### Alterado

- Código formatado com Prettier, sem mudar comportamento nem visual.
- Moldura e atalhos de tela ganham `data-testid` para testes.

## [0.1.0] - 2026-10-14

### Alterado

- Protótipo em arquivo único migrado para projeto Vite + React organizado por feature (`client`, `professional`, `shared`).
- Estado e ações movidos para `KiraContext`; cada tela virou um componente.
- Telas, fluxos e visual preservados (52 telas conferidas por captura de tela contra o original).

### Adicionado

- Legenda de uma linha em cada arquivo de `src/` (função, dados e API).
- Documentação: `docs/ARQUITETURA.md`, `CONTRIBUTING.md`, template de PR.

### Movido

- `kira_front.jsx` para `legacy/kira_front.jsx`.
