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

| Integração                                             | Onde roda                                            | Endpoint                                                                                            |
| ------------------------------------------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Login, refresh e logout                                | `LoginScreen`, `SessionContext`, `http.js`           | `POST /api/auth/login`, `/refresh`, `/logout`                                                       |
| Esqueci a senha                                        | `ForgotPasswordScreen`, `ResetPasswordScreen`        | `POST /api/auth/recuperar-senha`, `/redefinir-senha`                                                |
| Cadastro                                               | `ClientTermsScreen`, `ProTermsScreen`                | `POST /api/auth/registro/cliente`, `/registro/empresa`                                              |
| Busca, Home e ranking                                  | `useProfessionals`, `useSearchScreen`, `useRanking`  | `GET /api/studios` + `GET /api/studios/{id}/servicos` (um por estúdio)                              |
| Perfil do profissional                                 | `ClientProfessionalProfileScreen`                    | `GET /api/studios/{id}`, `/servicos`, `/avaliacoes`                                                 |
| Horários livres                                        | `ClientSchedulingScreen`                             | `GET /api/empresas/{id}/disponibilidade/slots?servicoId&data`                                       |
| Agendar e cancelar                                     | `ClientSchedulingScreen`, `ClientAgendaDetailScreen` | `POST /api/agendamentos/cliente/{id}`, `PATCH /api/agendamentos/{id}/cancelar`                      |
| Remarcar                                               | `ClientRescheduleScreen`                             | `PATCH /api/agendamentos/{id}/reagendar/cliente`                                                    |
| Agenda, histórico, pagamentos                          | telas da agenda e do perfil do cliente               | `GET /api/agendamentos/cliente/{id}`                                                                |
| Avaliações da cliente                                  | `ClientReviewsScreen`, detalhe do agendamento        | `GET /api/avaliacoes/cliente/{id}`, `POST /api/avaliacoes/cliente` (`ReviewForm`)                   |
| Painel, agenda, financeiro e analytics do profissional | `useBusinessData` + `professional/utils/metrics.js`  | `GET /api/agendamentos/empresa/{id}`, `/api/empresas/{id}/servicos`, `/api/avaliacoes/empresa/{id}` |
| Concluir e cancelar (profissional)                     | `ProAgendaDashScreen`                                | `PATCH /api/agendamentos/{id}/concluir`, `/cancelar/empresa`                                        |
| Horário de funcionamento                               | `ProBusinessHoursScreen`, aviso no `ProHomeScreen`   | `GET` e `PUT /api/empresas/{id}/disponibilidade`                                                    |
| CEP                                                    | `useCepLookup`                                       | ViaCEP (`viacep.com.br`)                                                                            |
| Geolocalização                                         | `useLocationActivation`                              | API do navegador                                                                                    |
| Câmera da selfie                                       | `useSelfieCamera`                                    | API do navegador                                                                                    |
| Chat de IA (atendimento)                               | `ClientChatScreen`, `useChat`                        | Mock (`api.chat`, futuro n8n). É outro chat, diferente do cliente–empresa (`api.messages`)          |
| Acompanhar agendamento                                 | `ClientBookingTrackingScreen`, `useBookingTracking`  | Agendamento real do backend; etapas e Pix em mock (`api.bookings`)                                  |
| Fontes                                                 | `App.jsx`                                            | Google Fonts                                                                                        |

### Ainda sem backend ou sem tela

| Recurso                                             | Situação no app                                                                                                             |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Edição do perfil                                    | Salva só na sessão atual; o backend já tem o `PUT` (PR #13), falta a tela usar                                              |
| Fotos (perfil, documentos, portfólio)               | Ficam no navegador; o cadastro não envia imagens                                                                            |
| Categoria e distância do estúdio                    | O backend já devolve a categoria do serviço e as coordenadas (PR #14); o app ainda usa as palavras e não mostra a distância |
| Favoritas                                           | Guardadas só na sessão atual                                                                                                |
| Denúncia e emergência                               | Só a interface (futura `POST /api/denuncias`)                                                                               |
| Verificação facial                                  | Só a interface, nenhum dado biométrico é salvo                                                                              |
| Gift cards, fidelidade, cupons, formas de pagamento | Telas sem dados                                                                                                             |
| Saldo e repasse                                     | Dependem de gateway de pagamento                                                                                            |
| Similaridade visual do Provador                     | O ranking usa procedimento e avaliação; não há análise de imagem                                                            |

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

### 6. Canal de segurança (adiado; detalhes em `CANAL-SEGURANCA.md`)

- [ ] **Login de conta suspensa:** mensagem própria em vez de "Usuário inexistente ou senha inválida".
- [ ] **Primeiro admin:** criar ao subir a aplicação, a partir de variáveis do `.env`. Sem admin, ninguém analisa denúncias nem recebe o e-mail de risco imediato.
- [ ] **Juntar a `feat/canal-seguranca`:** em 01/11 estava 51 commits atrás da `main`. Refazer o merge com a `main` atual, rodar os testes, commit, push e PR.
- [ ] **Acompanhar a própria denúncia:** rota para quem denunciou ver o andamento.
- [ ] **Suspensão separada do `ativo`:** campo próprio, para revogar a suspensão não reativar uma conta desativada por outro motivo.

### 7. Operação

- [ ] **E-mail:** testar a troca de senha do começo ao fim (pedir o link, abrir o e-mail, criar a senha e entrar).
- [ ] **Teste `contextLoads`:** rodar sem depender de um banco local (por exemplo, Testcontainers).

## O que falta no frontend

Telas e ajustes do app para usar o que o backend já tem. Por enquanto só anotados aqui; nada disso foi feito.

### Painel do profissional (backend pronto no PR #12)

- [ ] **Conversão:** acrescentar ao `toDashboard` (`mappers.js`) os campos novos (`ticketMedio`, `totalCancelados`, `taxaConclusao`, `faturamentoPeriodoAnterior`, `variacaoFaturamento`, `faturamentoPorDia`, `rankingServicos`, `avaliacoes`), com teste.
- [ ] **Início, Analytics e Financeiro:** trocar os cálculos de `professional/utils/metrics.js` pelo `api.dashboard.getMine({ from, to })`:
  - `weeklyRevenue` e `monthlyRevenue` → `faturamentoPorDia`
  - `revenueDelta` → `variacaoFaturamento` (o backend compara com o período anterior de mesmo tamanho, não com a semana anterior fixa)
  - `analyticsSummary` → `ticketMedio`, `percentualRecorrencia` e `taxaConclusao`
  - `appointmentsByWeekday` → `movimentoPorDiaSemana`
  - `serviceRanking` e `serviceClientBreakdown` → `rankingServicos`
  - `averageRating` e `ratingBreakdown` → `avaliacoes` (o backend manda a quantidade por nota; a porcentagem sai da quantidade dividida pelo total)
- [ ] **Continua com a lista de agendamentos:** a agenda do dia (`appointmentsOn`) e os próximos atendimentos (`upcoming`), porque mostram cada atendimento.

### Funcionárias (backend pronto nos PRs #8, #9 e #10)

- [ ] **Tela de funcionárias** no perfil do profissional: listar, criar, editar e desativar (`api.staff.*`), com a agenda do dia e da semana, os bloqueios de horário e o total de comissões.
- [ ] **Escolher a funcionária no agendamento:** mostrar `professionals.listStaff` e mandar o `staffId` no `appointments.create`.
- [ ] **Horários livres da funcionária escolhida:** `api.availability.get` precisa mandar `funcionariaId` para `/disponibilidade/slots`. Sem ele, a tela mostra os horários em que alguma funcionária está livre.

### Outras telas com a chamada já pronta

- [ ] **Chat cliente–empresa (do agendamento):** ligar o botão "Conversar com…" a `api.messages.*`. Chamar `markRead` só nas mensagens com `mine: false`.
- [ ] **Gerenciar serviços** depois do cadastro: criar, editar e desativar (`api.services.*`).
- [ ] **Profissional remarcar:** botão na agenda do profissional com `appointments.rescheduleAsBusiness`.

### Perfil (backend pronto no PR #13)

- [ ] **Chamadas de perfil:** criar em `httpAdapter.js`, com conversão e teste. Ainda não existem.
- [ ] **Editar perfil da cliente** (`ClientProfileEditScreen`): carregar com `GET /api/clientes/{id}/perfil` e salvar com `PUT`. Hoje salva só na sessão. O `PUT` exige nome, telefone, data de nascimento e gênero, e troca todos os campos: mandar de volta o endereço e as coordenadas que vieram no `GET`, senão eles são apagados.
- [ ] **E-mail na edição da cliente:** a tela tem o campo, mas o backend não troca o e-mail. Deixar só leitura ou tirar o campo.
- [ ] **Editar perfil do profissional:** não há tela. Usar `GET` e `PUT /api/empresas/{id}/perfil` (nome, telefone, descrição, especialidades, endereço, coordenadas e tipo de estabelecimento).
- [ ] **Nome na sessão:** depois de salvar, atualizar o `nome` guardado no `authStore`, que vem do login.

### Categoria e distância (backend pronto no PR #14)

- [ ] **Conversão:** ler `categoria` em cada serviço e `latitude`/`longitude` no estúdio (`mappers.js`), com teste.
- [ ] **Filtro por categoria:** trocar as palavras de `client/utils/categories.js` pela `categoria` dos serviços. Valores do backend: `CABELO`, `BARBA`, `UNHAS`, `ESTETICA`, `MASSAGEM`, `CILIOS`, `SOBRANCELHAS`, `MAQUIAGEM` e `OUTRO`. As chaves `barbearia`, `pedicure` e `makeup` do app viram `BARBA`, `UNHAS` e `MAQUIAGEM`.
- [ ] **Distância:** calcular a partir das coordenadas da cliente e do estúdio e mostrar na lista e no perfil. Estúdio sem coordenadas fica sem distância.
- [ ] **Escolher a categoria no cadastro de serviços** (cadastro do profissional e, depois, a tela de gerenciar serviços): mandar `categoria` em cada serviço. Sem ela, o backend deduz pelo nome.

### Depende do backend

- [ ] **Fotos, favoritas, emergência, busca no servidor e pagamentos:** cada um quando o passo correspondente de "O que falta no backend" estiver pronto.
- [ ] **Denúncia (adiada com o canal de segurança):** `api.reports.submit` real no web (hoje só existe o mock do Expo), com a tradução dos motivos, ligar os botões de `Safety.jsx` e corrigir as mensagens (ver `CANAL-SEGURANCA.md`).

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
