# Arquitetura e integrações

## Visão geral

Front-end em Vite + React que consome o kira-backend (Spring Boot). Em desenvolvimento as chamadas vão para `/api` na origem do app e o proxy do Vite repassa ao backend (`VITE_API_PROXY`, padrão `http://localhost:8081`), sem CORS. No build, a URL vem de `VITE_API_URL`. Sem backend no ar, as telas mostram o estado de erro com "Tentar novamente". Só o chat de IA e as etapas do acompanhamento usam dados simulados no web (`shared/api/index.js`). O app Expo (`mobile/`) usa só mock por enquanto: o Metro carrega `shared/api/index.native.js` no lugar do `index.js`.

- **Navegação:** React Router. `src/routes.js` tem a tabela chave → URL, `src/screens.js` liga a chave ao componente e `src/AppRoutes.jsx` monta as rotas. `/cliente/*` e `/profissional/*` têm layout próprio (`ClientLayout`, `ProLayout`) que bloqueia o tipo de conta errado; sem conta escolhida, as duas áreas ficam livres (modo protótipo). `setScreen(chave)` do `useSession()` navega para a rota.
- **Estado:** `src/context/` tem um contexto por assunto (`useSession`, `useSignup`, `useSearch`, `useScheduling`, `useTryOn`, `useProDashboard`), reunidos em `AppProviders`. Só dado que sobrevive à troca de tela mora no contexto; estado de uma tela só (modal aberto, carregando, aba) fica na própria tela e volta ao início ao sair dela.
- **Serviços:** `src/shared/api/` tem o cliente HTTP (`http.js`: URL base, token Bearer, renovação do token no 401 e conversão do `ErroResponse` em `ApiError`), o adaptador (`httpAdapter.js`), a conversão de formatos (`mappers.js`) e o contrato em JSDoc (`contract.js`). As telas chamam `api.*` por TanStack Query.
- **Sessão:** o login guarda `{ token, refreshToken, tipo, nome, email, id }` no `localStorage` (`authStore`). `tipo` define a área (CLIENTE → `/cliente`, EMPRESA → `/profissional`). Os endpoints de agenda, avaliações e serviços do usuário recebem o `id` na URL.
- **Formulários:** regras em `src/shared/schemas/forms.js` (zod); a edição de perfil usa react-hook-form.
- **Design system:** valores visuais ficam em `src/shared/styles/tokens.css` (cor, espaço, raio, sombra, tipografia). `shared/theme.js` aponta para essas variáveis e `shared/components/primitives.jsx` traz os blocos de UI. Cor, fonte e raio fixos são barrados pelo lint.
- **Acessibilidade:** controles clicáveis são `<button>`; campos usam `Field` (rótulo, erro e id ligados); modais fecham com Esc; textos seguem contraste AA (`--color-primary-text`). As regras `jsx-a11y` do lint são erros.
- **Organização:** por feature (`client/`, `professional/`) e `shared/` para o que é comum. `shared/` nunca importa de uma feature.

## O que roda em cada integração

| Integração                                             | Onde roda                                                         | Endpoint                                                                                                                                     |
| ------------------------------------------------------ | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Login, refresh e logout                                | `LoginScreen`, `SessionContext`, `http.js`                        | `POST /api/auth/login`, `/refresh`, `/logout`                                                                                                |
| Esqueci a senha                                        | `ForgotPasswordScreen`, `ResetPasswordScreen`                     | `POST /api/auth/recuperar-senha`, `/redefinir-senha`                                                                                         |
| Cadastro                                               | `ClientTermsScreen`, `ProTermsScreen`                             | `POST /api/auth/registro/cliente`, `/registro/empresa`                                                                                       |
| Busca, Home e ranking                                  | `useProfessionals`, `useSearchScreen`, `useRanking`               | `GET /api/studios` + `GET /api/studios/{id}/servicos` (um por estúdio)                                                                       |
| Perfil do profissional                                 | `ClientProfessionalProfileScreen`                                 | `GET /api/studios/{id}`, `/servicos`, `/avaliacoes`                                                                                          |
| Horários livres                                        | `ClientSchedulingScreen`                                          | `GET /api/empresas/{id}/disponibilidade/slots?servicoId&data`                                                                                |
| Agendar e cancelar                                     | `ClientSchedulingScreen`, `ClientAgendaDetailScreen`              | `POST /api/agendamentos/cliente/{id}`, `PATCH /api/agendamentos/{id}/cancelar`                                                               |
| Remarcar                                               | `ClientRescheduleScreen`                                          | `PATCH /api/agendamentos/{id}/reagendar/cliente`                                                                                             |
| Chat cliente–empresa                                   | `AppointmentChatScreen`, `useAppointmentChat`, `messageSocket.js` | `GET` e `POST /api/mensagens/...`, `PATCH /agendamento/{id}/lidas`; tempo real em `/ws` (STOMP), tópico `/topic/agendamentos/{id}/mensagens` |
| Agenda, histórico, pagamentos                          | telas da agenda e do perfil do cliente                            | `GET /api/agendamentos/cliente/{id}`                                                                                                         |
| Avaliações da cliente                                  | `ClientReviewsScreen`, detalhe do agendamento                     | `GET /api/avaliacoes/minhas`, `POST /api/avaliacoes/cliente` (`ReviewForm`)                                                                  |
| Painel, agenda, financeiro e analytics do profissional | `useBusinessData` + `professional/utils/metrics.js`               | `GET /api/agendamentos/empresa/{id}`, `/api/empresas/{id}/servicos`, `/api/avaliacoes/empresa/{id}`                                          |
| Concluir e cancelar (profissional)                     | `ProAgendaDashScreen`                                             | `PATCH /api/agendamentos/{id}/concluir`, `/cancelar/empresa`                                                                                 |
| Remarcar (profissional)                                | `ProRescheduleScreen`                                             | `PATCH /api/agendamentos/{id}/reagendar/empresa`                                                                                             |
| Horário de funcionamento                               | `ProBusinessHoursScreen`, aviso no `ProHomeScreen`                | `GET` e `PUT /api/empresas/{id}/disponibilidade`                                                                                             |
| CEP                                                    | `useCepLookup`                                                    | ViaCEP (`viacep.com.br`)                                                                                                                     |
| Geolocalização                                         | `useLocationActivation`                                           | API do navegador                                                                                                                             |
| Câmera da selfie                                       | `useSelfieCamera`                                                 | API do navegador                                                                                                                             |
| Chat de IA (atendimento)                               | `ClientChatScreen`, `useChat`                                     | Mock (`api.chat`, futuro n8n). É outro chat, diferente do cliente–empresa (`api.messages`)                                                   |
| Acompanhar agendamento                                 | `ClientBookingTrackingScreen`, `useBookingTracking`               | Agendamento real do backend; etapas e Pix em mock (`api.bookings`)                                                                           |
| Fontes                                                 | `App.jsx`                                                         | Google Fonts                                                                                                                                 |

### Ainda sem backend ou sem tela

| Recurso                                             | Situação no app                                                                                                  |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Edição do perfil                                    | Salva só na sessão atual; `api.profile.saveMine` está pronta, falta a tela usar                                  |
| Fotos (perfil, documentos, portfólio)               | Ficam no navegador; o cadastro não envia imagens                                                                 |
| Categoria do serviço                                | O filtro e os cards de distância já usam os dados do backend; falta o campo de categoria no cadastro de serviços |
| Favoritas                                           | Guardadas só na sessão atual                                                                                     |
| Denúncia e emergência                               | Só a interface (futura `POST /api/denuncias`)                                                                    |
| Verificação facial                                  | Só a interface, nenhum dado biométrico é salvo                                                                   |
| Gift cards, fidelidade, cupons, formas de pagamento | Telas sem dados                                                                                                  |
| Saldo e repasse                                     | Dependem de gateway de pagamento                                                                                 |
| Similaridade visual do Provador                     | O ranking usa procedimento e avaliação; não há análise de imagem                                                 |

## O que falta no backend

Situação em 29/10/2026, na ordem em que vamos fazer. Cada item vira uma branch e um PR no kira-backend. Ao terminar, marcar o item aqui e atualizar o `STATUS-INTEGRACAO.md`.

### 1. Terminar o que já tem PR aberto (feito em 29/10)

- [x] **PR #11:** rota de admin protegida em todos os métodos; conta desativada perde o token e o refresh, some da vitrine e não recebe agendamento; serviços, funcionárias, horários e avaliações dela respondem 404.
- [x] **PR #8:** o agendamento só aceita funcionária ativa do próprio estúdio.
- [x] **PR #9:** a lista de comissões devolve DTO.
- [x] **PR #10:** conflito de horário e horários livres por funcionária.

### 2. Painel do profissional (feito em 29/10)

- [x] **PR #12, `/dashboard` completo:** ticket médio, cancelados, taxa de conclusão, faturamento por dia, comparação com o período anterior, ranking de serviços com os clientes de cada um e resumo das avaliações (média e quantidade por nota).

### 3. Perfil e fotos

- [x] **PR #13, editar perfil:** `GET` e `PUT /api/clientes/{id}/perfil` e `/api/empresas/{id}/perfil`, só para o dono. E-mail, CPF e CNPJ não mudam por aqui.
- [ ] **Upload de fotos:** perfil e portfólio, com armazenamento de arquivos e limite de tamanho e tipo.
- [ ] **Verificação de documento e selfie:** decidir antes entre serviço externo (guardar só o resultado), revisão manual ou esconder as telas por enquanto.
- [x] **PR #14, categoria no serviço e coordenadas na vitrine:** cada serviço tem `categoria` (deduzida pelo nome quando não vem), e o estúdio devolve `latitude` e `longitude`.
- [ ] **Coordenadas a partir do CEP:** hoje só valem as do celular no cadastro. Calcular pelo CEP precisa de um serviço externo de geocodificação.

### 4. Recursos da cliente

- [ ] **Favoritas:** salvar, listar e remover estúdios favoritos.
- [ ] **Contato de emergência:** cadastrar e listar.
- [ ] **Busca no banco:** filtrar por nome, cidade, tipo, serviço, preço e nota no banco, com paginação e já trazendo os serviços. Só então o app troca a busca local pela do servidor.

### 5. Pagamentos (depende de escolher o gateway)

- [ ] **Formas de pagamento, saldo e repasse.**
- [ ] **Cupons, gift cards e fidelidade.**

### 6. Canal de segurança (fica por último, depois das outras pendências; detalhes em `CANAL-SEGURANCA.md`)

- [ ] **Login de conta suspensa:** mensagem própria em vez de "Usuário inexistente ou senha inválida".
- [ ] **Primeiro admin:** criar ao subir a aplicação, a partir de variáveis do `.env`. Sem admin, ninguém analisa denúncias nem recebe o e-mail de risco imediato.
- [ ] **Juntar a `feat/canal-seguranca`:** em 03/11 estava 79 commits atrás da `main`. A pasta `kira-backend-canal-seguranca` tem um merge sem commit, com os conflitos resolvidos: conferir se ainda serve ou refazer com a `main` atual, rodar os testes, commit, push e PR.
- [ ] **Acompanhar a própria denúncia:** rota para quem denunciou ver o andamento.
- [ ] **Suspensão separada do `ativo`:** campo próprio, para revogar a suspensão não reativar uma conta desativada por outro motivo.

### 7. Operação

- [x] **Painel com atendimentos concluídos:** PR #18.
- [ ] **Teste com banco de verdade:** `RotasComBancoRealTest` já está na `main` (PR #21) e percorre as rotas com um Postgres descartável (precisa de Docker; sem ele, o teste é ignorado). O chat já tem enviar, listar e marcar uma mensagem como lida. Falta acrescentar a lista de conversas, marcar todas como lidas e as rotas das notificações.
- [x] **Respostas de erro:** mensagens genéricas e o código certo para cada caso, PR #19.
- [ ] **E-mail:** testar a troca de senha do começo ao fim (pedir o link, abrir o e-mail, criar a senha e entrar).
- [ ] **Teste `contextLoads`:** rodar sem depender de um banco local (por exemplo, Testcontainers).
- [x] **SonarCloud do PR #17:** análise aprovada em 02/11.
- [x] **Horário do estabelecimento só pelo dono:** PR #16.
- [x] **CI do backend:** PR #24, em 03/11. Roda todos os testes nos PRs e na `main`, inclusive o teste com banco.
- [ ] **Exigir o CI na `main`:** a branch não tem proteção, então um PR com teste falhando ainda pode entrar. Definir a verificação `testes` como obrigatória (o PR #24 já entrou).
- [ ] **Branch `feat/provador-cloudflare` do backend:** tem o provador virtual com consentimento LGPD e geração via Cloudflare, em 1 commit, 2 atrás da `main` e sem PR. Decidir se entra e como o app passa a usar.
- [ ] **Versões das actions do CI:** o GitHub avisa que `setup-java@v4` e `checkout@v4` estão ficando desatualizadas. Não impede nada hoje.

## Ajustes da revisão dos PRs (02/11/2026)

**Backend**

- [x] **Avaliações da cliente:** `GET /api/avaliacoes/minhas` lista as feitas pela conta logada (PR #22).
- [x] **Lista de avaliações recebidas:** exige login e responde só para a própria conta (PR #23).
- [x] **PR #16:** responder com o erro certo quando a conta não for de empresa.
- [x] **PR #15:** heartbeat de 10 s ligado. Falta testar com uma queda real de conexão.
- [ ] **Conexão ao vivo:** o servidor encerra a conexão quando o token vence ou a conta é desativada, e o app renova e reconecta. PR #25 na `main` do backend e `messageSocket.js` no PR #13 do app. Falta testar a reconexão no navegador.
- [x] **PR #17:** `VAPID_SUBJECT` vazio usa o valor padrão. Falta testar a notificação no Safari e no iPhone.

**App (PR #13)**

- [x] **Minhas avaliações:** `reviews.listMine` usa `GET /api/avaliacoes/minhas`.
- [x] **Agenda do profissional:** abre dias e meses passados, para ver e concluir atendimentos antigos.
- [x] **Domingo no calendário:** ao agendar e remarcar, o calendário segue o horário de funcionamento do estúdio, em qualquer dia da semana. Na agenda do profissional, nenhum dia fica bloqueado.
- [x] **Renovação da sessão:** limpa a sessão só quando o backend recusa o token, não em erro temporário. Com duas abas, uma renova por vez, e sair ou renovar em uma vale para as outras.
- [x] **Sessão perdida:** limpa o cache e leva ao login, e as telas mostram "Sua sessão terminou" em vez de "E-mail ou senha incorretos". Falta testar no navegador (ver "Testes que faltam").
- [x] **Chat:** mensagem recebida ao vivo durante uma atualização da lista não se perde.

## O que falta no frontend

Telas e ajustes do app para usar o que o backend já tem.

### Telas que faltam

A integração (chamadas e hooks) fica pronta para a tela usar. Quem faz a tela só precisa cuidar do visual.

| Tela                                                | O que precisa mostrar                                                                                                                                      | Integração                                                                                  |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Lista de conversas** (cliente e profissional)     | Nome e foto da outra parte, serviço, última mensagem, horário e quantidade de não lidas. Tocar abre a conversa (`clientConversation` ou `proConversation`) | Pronta: `useConversations()` traz `conversations`                                           |
| **Número de não lidas no menu**                     | Total de mensagens não lidas                                                                                                                               | Pronta: `useConversations()` traz `totalUnread`, ao vivo                                    |
| **Permitir notificações**                           | Botão para a pessoa autorizar as notificações do navegador                                                                                                 | Backend pronto; falta a integração (ver "Notificação do navegador")                         |
| **Funcionárias** (profissional)                     | Listar, criar, editar e desativar, com agenda, bloqueios e comissões                                                                                       | Chamadas prontas (`api.staff.*`)                                                            |
| **Escolher a funcionária no agendamento** (cliente) | Lista de funcionárias e os horários livres da escolhida                                                                                                    | Pronta: `professionals.listStaff`, `availability.get` e `appointments.create` com `staffId` |
| **Gerenciar serviços** (profissional)               | Criar, editar e desativar serviços depois do cadastro                                                                                                      | Chamadas prontas (`api.services.*`)                                                         |
| **Editar perfil do profissional**                   | Nome, telefone, descrição, especialidades, endereço e tipo de estabelecimento                                                                              | Pronta: `api.profile.getMine()` e `saveMine()`                                              |
| **Editar perfil da cliente** (ajuste)               | A tela existe, mas salva só na sessão, e o e-mail deve ficar só leitura                                                                                    | Pronta: a tela precisa trocar o salvamento por `api.profile.saveMine()`                     |
| **Filtro por categoria e distância**                | Feito na integração: o filtro usa a categoria, e os cards já mostram a distância                                                                           | Pronta                                                                                      |
| **Escolher a categoria do serviço** (ajuste)        | Campo de categoria no cadastro de serviços                                                                                                                 | Pronta: enviar `category` em cada serviço                                                   |
| **Painel, Analytics e Financeiro** (ajuste)         | Ticket médio, comparação com o período anterior, ranking e avaliações                                                                                      | Pronta: `useDashboard({ from, to })`                                                        |
| **Denúncia** (por último)                           | Envio real, ligado ao backend                                                                                                                              | Depende do canal de segurança                                                               |

**Telas já feitas, para revisar o visual:** remarcar (cliente e profissional), conversa do agendamento (cliente e profissional), botões "Remarcar" e "Conversar com…" na agenda do profissional e aviso de "Demonstração" no chat com IA e no acompanhamento.

### Notificação do navegador (backend pronto no PR #17)

Para a notificação chegar com o app fechado, como no Instagram.

**Integração**

- [ ] **Service worker:** recebe a notificação do navegador e a mostra com o nome de quem enviou e o texto. Campos recebidos: `titulo`, `corpo` e `agendamentoId`.
- [ ] **Abrir a conversa:** ao tocar na notificação, abrir o app na conversa daquele agendamento.
- [ ] **Não repetir:** não mostrar a notificação se a conversa já estiver aberta na tela.
- [ ] **Chamadas:** `GET /api/notificacoes/chave-publica`, `POST` e `DELETE /api/notificacoes/dispositivos/web`, com uma função pronta para a tela pedir a permissão e registrar o navegador.
- [ ] **Sair da conta:** remover o navegador, para a pessoa não receber notificações de uma conta que saiu.

**Tela**

- [ ] **Botão "Permitir notificações":** chama a função acima e mostra o resultado (permitido ou bloqueado).

**Testes**

- [ ] Notificação chegando de verdade no Chrome e no Firefox, com o app fechado.

**Decisão pendente**

- [ ] A notificação mostra o texto da mensagem (até 120 caracteres) ou só "Nova mensagem"? Hoje o backend envia o texto.

### Painel do profissional (backend pronto no PR #12)

- [x] **Conversão:** `toDashboard` traz os campos novos (`averageTicket`, `cancelled`, `completionRate`, `previousRevenue`, `revenueChange`, `revenueByDay`, `serviceRanking`, `ratings`), e o hook `useDashboard({ from, to })` está pronto.
- [ ] **Início, Analytics e Financeiro (telas):** trocar os cálculos de `professional/utils/metrics.js` por `useDashboard({ from, to })`:
  - `weeklyRevenue` e `monthlyRevenue` → `revenueByDay`
  - `revenueDelta` → `revenueChange` (o backend compara com o período anterior de mesmo tamanho, não com a semana anterior fixa)
  - `analyticsSummary` → `averageTicket`, `returningPercent` e `completionRate`
  - `appointmentsByWeekday` → `byWeekday`
  - `serviceRanking` e `serviceClientBreakdown` → `serviceRanking`
  - `averageRating` e `ratingBreakdown` → `ratings` (já traz a porcentagem por nota)
- [ ] **Continua com a lista de agendamentos:** a agenda do dia (`appointmentsOn`) e os próximos atendimentos (`upcoming`), porque mostram cada atendimento.

### Funcionárias (backend pronto nos PRs #8, #9 e #10)

- [ ] **Tela de funcionárias** no perfil do profissional: listar, criar, editar e desativar (`api.staff.*`), com a agenda do dia e da semana, os bloqueios de horário e o total de comissões.
- [ ] **Escolher a funcionária no agendamento:** mostrar `professionals.listStaff` e mandar o `staffId` no `appointments.create`.
- [x] **Horários livres da funcionária escolhida:** `api.availability.get({ proId, serviceId, staffId, date })`. A tela precisa incluir a funcionária na chave da consulta.

### Outras telas com a chamada já pronta

- [x] **Chat cliente–empresa (do agendamento):** feito, com WebSocket. Sem a conexão, a conversa atualiza por consulta a cada 10 segundos.
- [ ] **Áudio no chat:** gravar, enviar e ouvir mensagens de voz. Depende do armazenamento de arquivos do backend (o mesmo do upload de fotos).
- [ ] **Notificação de mensagem nova, como no Instagram:** lista de conversas, contador ao vivo e notificação com o app fechado (web push no web; push do celular quando o mobile chegar). E-mail não faz parte do chat.
- [ ] **Conversa de agendamento cancelado no profissional:** a agenda do dia esconde os cancelados, então o estúdio não abre esse histórico.
- [ ] **Gerenciar serviços** depois do cadastro: criar, editar e desativar (`api.services.*`).
- [ ] **PR #12 do app (`feat/tela-processamento-pagamento`):** aberto desde 26/10 e 34 commits atrás desta branch. Decidir se entra agora ou espera o gateway de pagamento.
- [x] **Profissional remarcar:** botão na agenda abre `ProRescheduleScreen`, que divide o fluxo com a cliente (`shared/components/RescheduleScreen.jsx`).

### Perfil (backend pronto no PR #13)

- [x] **Chamadas de perfil:** `api.profile.getMine()` e `api.profile.saveMine(mudancas)`, pela conta logada. Salvar recebe só o que mudou, e o restante vem do perfil atual, então endereço e coordenadas não são apagados. O nome da sessão é atualizado junto.
- [ ] **Editar perfil da cliente** (`ClientProfileEditScreen`): carregar com `GET /api/clientes/{id}/perfil` e salvar com `PUT`. Hoje salva só na sessão. O `PUT` exige nome, telefone, data de nascimento e gênero, e troca todos os campos: mandar de volta o endereço e as coordenadas que vieram no `GET`, senão eles são apagados.
- [ ] **E-mail na edição da cliente:** a tela tem o campo, mas o backend não troca o e-mail. Deixar só leitura ou tirar o campo.
- [ ] **Editar perfil do profissional:** não há tela. Usar `GET` e `PUT /api/empresas/{id}/perfil` (nome, telefone, descrição, especialidades, endereço, coordenadas e tipo de estabelecimento).
- [x] **Nome na sessão:** `saveMine` atualiza o `nome` do `authStore`.
- [ ] **Trocar o endereço:** a tela deve mandar o endereço completo (o CEP preenche rua, bairro, cidade e estado), porque `saveMine` não confere se os campos combinam.
- [ ] **Aviso em vermelho ao mudar a cidade:** na tela de editar perfil, mostrar uma mensagem em vermelho avisando a pessoa para atualizar o restante do endereço depois de mudar a cidade.
- [x] **Coordenadas ao mudar o endereço:** `saveMine` apaga as antigas se o endereço mudar e não vierem novas. A pessoa ou o estúdio fica sem distância até atualizar a localização.
- [ ] **Futuro, calcular as coordenadas pelo CEP:** usar um serviço de geocodificação para a distância continuar certa depois de mudar o endereço, sem depender do celular. Ver "Coordenadas a partir do CEP" em "O que falta no backend".

### Categoria e distância (backend pronto no PR #14)

- [x] **Conversão:** `category` em cada serviço e `latitude`/`longitude` no estúdio (`mappers.js`).
- [x] **Filtro por categoria:** usa a categoria dos serviços (`client/utils/categories.js`). Serviços sem categoria continuam reconhecidos por palavras.
- [x] **Distância:** `useProfessionals` calcula em linha reta entre a cliente (perfil) e o estúdio, e os cards já mostram. Sem coordenadas, fica sem distância.
- [ ] **Escolher a categoria no cadastro de serviços** (tela): a integração já envia `category` no cadastro e em `api.services.*`; falta o campo na tela. Sem ela, o backend deduz pelo nome.
- [ ] **Atualizar a distância depois de editar o perfil:** a tela que chamar `saveMine` deve invalidar a consulta `["profile", id]`.
- [ ] **Formato da distância:** os cards mostram `1.6 km`, com ponto; no Brasil o certo é `1,6 km` (ajuste de tela).
- [ ] **Distância por trajeto:** hoje é em linha reta, então a real costuma ser maior.
- [ ] **Filtro de 30 km:** agora vale de verdade; estúdios mais longe somem da lista por padrão. Avaliar esse valor com dados reais.

### Depende do backend

- [ ] **Fotos, favoritas, emergência, busca no servidor e pagamentos:** cada um quando o passo correspondente de "O que falta no backend" estiver pronto.
- [ ] **Denúncia (por último, com o canal de segurança):** `api.reports.submit` real no web (hoje só existe o mock do Expo), com a tradução dos motivos, ligar os botões de `Safety.jsx` e corrigir as mensagens (ver `CANAL-SEGURANCA.md`).

## Pendências do chat

Situação em 01/11/2026.

**Integração**

- [x] **Notificação com o app fechado, backend:** registro de navegadores e envio (`/api/notificacoes`), PR #17.
- [ ] **Notificação com o app fechado, integração:** ver "Notificação do navegador" em "O que falta no frontend".
- [ ] **Áudio no chat:** depende do armazenamento de arquivos do backend. Fazer junto com o upload de fotos.

**Testes que faltam**

- [ ] Sessão renovando sozinha depois de 1 hora real (cenário 1.5 do `CENARIOS-DE-TESTE.md`).
- [ ] Chat aberto por mais de 1 hora: a conexão é encerrada quando o token vence, o app reconecta sozinho, e as mensagens continuam chegando.
- [ ] Calendário no navegador: estúdio aberto no domingo e fechado em outro dia, ao agendar e ao remarcar; na agenda do profissional, abrir um mês passado e concluir um atendimento antigo.
- [ ] Sessão no navegador: token recusado leva ao login; backend fora do ar mantém a sessão; duas abas abertas renovando juntas; sair em uma aba leva a outra ao login. Só há teste automático do cliente HTTP, porque o projeto não tem como testar componentes React.
- [ ] Encerrar a conexão ao vivo quando a pessoa sai da conta.
- [ ] Notificação chegando de verdade em um navegador real. O envio só foi testado com um servidor local.
- [ ] Notificação no iPhone: só funciona com o site adicionado à tela inicial.
- [ ] `useConversations()` em uma tela de verdade, quando a lista de conversas e o número do menu existirem.
- [ ] Chat com contas reais no banco local (seção 7 do `CENARIOS-DE-TESTE.md`).

**Limitações conhecidas**

- [ ] Notificação no celular: fica para quando o app mobile for ligado ao backend.
- [ ] Broker em memória: funciona com uma instância do backend.
- [ ] O `lastReceived` também recebe mensagens da conversa aberta: a tela decide se mostra o aviso.

**Antes de publicar**

- [x] Merge dos PRs do backend, em 02/11 (#15 a #19 e #21 a #23).
- [ ] Merge do PR #13 do app.
- [ ] Colocar o domínio do site nas origens permitidas do backend e em `FRONTEND_URL`.
- [ ] Trocar as chaves de notificação do `.env` local (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`), seguindo os passos passados à Isabela.
- [ ] Gerar novas chaves de notificação para produção (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`) e definir `VAPID_SUBJECT` com um contato real.
- [ ] Fazer uma revisão de segurança completa.

## Mobile (depois do web)

O sistema será web e mobile. A prioridade é terminar o web; o app Expo (`mobile/`) será ligado ao backend quando o web estiver funcionando. Enquanto isso, ele roda todo em mock (`shared/api/index.native.js` e `mockAdapter.js`).

**Ao mexer no web:**

- Colocar chamadas de API, conversões e regras em `src/shared` ou em funções puras, sem prender a lógica ao navegador (`window`, `localStorage`, DOM).
- Não quebrar os imports de `@kira/*` usados pelo Expo. O CI não testa o `mobile/`.

**Para ligar o app ao backend, quando chegar a hora:**

- [ ] **Cliente HTTP:** `http.js` usa `import.meta.env` e `localStorage`, que não funcionam no React Native. Trocar por configuração e armazenamento próprios de cada plataforma, e fazer o `index.native.js` usar o `httpAdapter`.
- [ ] **Backend hospedado com HTTPS:** o celular não acessa `localhost`, e o Android bloqueia `http://` por padrão.
- [ ] **Telas:** cadastro, agenda e área da profissional, e trocar os dados de exemplo das telas existentes.
- [ ] **Publicação:** ícone e imagem de abertura (`mobile/assets`), `eas.json`, build de teste e Play Console.

## Fluxo principal do Provador

Home → Provador (referência) → Provador (foto) → Resultado → "Encontrar profissionais" → Home com "Recomendadas para você" → Perfil → Agendamento.

## Ligando uma tela a um endpoint novo

1. Adicionar a função em `httpAdapter.js` e, se o formato mudar, a conversão em `mappers.js` (com teste).
2. Chamar `api.*` na tela por `useQuery`/`useMutation`, com carregando e erro.
3. Atualizar as tabelas acima e a legenda do arquivo alterado.
