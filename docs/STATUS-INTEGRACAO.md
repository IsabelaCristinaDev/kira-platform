# Integração do Kira: frontend e backend

Situação em 02/11/2026. Lista do que o app web (kira-platform) já usa do backend (kira-backend). O sistema será web e mobile: a prioridade agora é terminar o web, e o app Expo (`mobile/`) será ligado ao backend depois (ver "Mobile" no `ARQUITETURA.md`).

## Funcionando: frontend ligado ao backend

### Conta

| Função                                                           | Onde fica no app                             |
| ---------------------------------------------------------------- | -------------------------------------------- |
| Entrar, continuar logada (renovação automática da sessão) e sair | Login, todas as telas                        |
| Criar conta de cliente                                           | Cadastro da cliente (última etapa, "Termos") |
| Criar conta de profissional, já com os serviços                  | Cadastro do profissional (última etapa)      |
| Esqueci a senha: pedir o link e criar nova senha                 | Login → "Esqueci minha senha"                |

### Cliente

| Função                                              | Onde fica no app                            |
| --------------------------------------------------- | ------------------------------------------- |
| Lista de estúdios, busca e ranking                  | Início e Buscar                             |
| Perfil do estúdio com serviços, preços e avaliações | Perfil do profissional                      |
| Ver horários livres de um dia                       | Agendamento                                 |
| Agendar                                             | Agendamento                                 |
| Ver a agenda: próximos, concluídos e cancelados     | Agenda                                      |
| Cancelar (até 2 horas antes)                        | Detalhe do agendamento                      |
| Remarcar (até 2 horas antes)                        | Detalhe do agendamento → "Remarcar horário" |
| Chat com o estúdio, em tempo real                   | Detalhe do agendamento → "Conversar com…"   |
| Avaliar atendimento concluído                       | Detalhe do agendamento / Minhas avaliações  |
| Histórico e pagamentos                              | Perfil                                      |

### Profissional

| Função                                                        | Onde fica no app                    |
| ------------------------------------------------------------- | ----------------------------------- |
| Painel: clientes do dia, receita da semana e nota             | Início                              |
| Agenda com calendário                                         | Agenda                              |
| Concluir, remarcar e cancelar atendimento                     | Agenda                              |
| Chat com a cliente, em tempo real                             | Agenda → "Conversar com…"           |
| Horário de funcionamento (dias e horas em que atende)         | Perfil → "Horário de funcionamento" |
| Financeiro e analytics (calculados a partir dos agendamentos) | Financeiro / Analytics              |
| Avaliações recebidas                                          | Painel                              |

### Serviços de fora (não são do kira-backend)

- **ViaCEP:** preenche o endereço pelo CEP.
- **Navegador:** localização e câmera da selfie.

## Integrado na API, mas ainda sem tela

As chamadas e as conversões já existem em `src/shared/api/httpAdapter.js` e `mappers.js`. Falta a tela usar.

| Função                                | Chamadas (`api.…`)                                                                                                                                    | Situação na tela                                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Gerenciar serviços depois do cadastro | `services.create`, `update`, `deactivate`                                                                                                             | Os serviços só são definidos no cadastro do profissional                                                          |
| Funcionárias                          | `staff.listForMyBusiness`, `create`, `update`, `deactivate`, `agendaDay`, `agendaWeek`, `listBlocks`, `createBlock`, `removeBlock`, `commissionTotal` | Não há tela de funcionárias                                                                                       |
| Escolher a funcionária                | `professionals.listStaff`, `appointments.create({ staffId })`                                                                                         | O agendamento não mostra a escolha; os horários livres já aceitam a funcionária (`availability.get({ staffId })`) |
| Painel pronto do backend              | `dashboard.getMine({ from, to })`, pelo hook `useDashboard`                                                                                           | As telas ainda calculam os números no navegador (`metrics.js`)                                                    |
| Editar perfil                         | `profile.getMine`, `saveMine`                                                                                                                         | A edição da cliente salva só na sessão, e o profissional não tem tela                                             |
| Categoria do serviço                  | `services.create`, `update` e cadastro do profissional, com `category`                                                                                | Falta o campo na tela; sem ele, o backend deduz pelo nome                                                         |

### Problemas no backend encontrados na integração

- **Sessão não renovava (corrigido no PR #15):** token vencido recebia 403, mas o app só renova no 401. Agora, quem não está autenticado recebe 401, e o 403 fica para quem está logado sem permissão.
- **Chat sem checagem de acesso (corrigido):** antes, qualquer pessoa logada lia qualquer conversa. Com a correção, só a cliente e o estúdio do agendamento veem as mensagens, e só quem recebeu pode marcar como lida. Quem tentar marcar a própria mensagem recebe erro, então a tela deve chamar `markRead` só para mensagens com `mine: false`. A correção já está na `main` do backend.
- **Lista de comissões (corrigido no PR #9):** `GET /api/comissoes/funcionaria/{id}` agora devolve DTO. O app ainda usa só o total (`/total`).
- **Funcionária no agendamento (corrigido nos PRs #8 e #10):** o `POST /api/agendamentos` só aceita funcionária ativa do próprio estúdio. O conflito de horário e os slots livres passam a valer por funcionária: com duas funcionárias livres, o estúdio aceita dois atendimentos no mesmo horário. Os slots aceitam a funcionária escolhida (`funcionariaId`).
- **Painel incompleto (corrigido no PR #12):** o `/dashboard` agora traz ranking de serviços, avaliações, faturamento por dia, ticket médio, taxa de conclusão e comparação com o período anterior. Falta o app usar esses campos (ver "O que falta no frontend" no `ARQUITETURA.md`).

## O backend tem, mas o app não usa

- **Denúncias (só na `feat/canal-seguranca`; canal de segurança fica por último):** `POST /api/denuncias` e as rotas de análise em `/api/admin/denuncias`. A branch parte de um commit antigo e ainda não foi juntada. O app tem a tela de denúncia, mas ela não envia nada. Os motivos também não batem: o app usa `endereco_invalido` e `risco_imediato`, e o backend espera `ENDERECO_FALSO`, `LOCAL_NAO_VALIDADO` e `PERIGO_DURANTE_ATENDIMENTO`.

### Rotas que o app não usa de propósito

- **Busca no servidor:** `/api/studios/busca`, `/cidade` e `/tipo` carregam todos os usuários e filtram em memória, como o app já faz, e não trazem os serviços. Trocar não deixa a busca mais rápida e perde os filtros por serviço, preço e nota. Vale trocar quando o backend filtrar no banco e paginar.
- **Médias de avaliação:** `/api/studios/{id}/media` e `/api/avaliacoes/empresa/{id}/media`. A lista e o perfil do estúdio já usam o `mediaAvaliacoes` que vem no próprio estúdio. O painel do profissional calcula a média a partir das avaliações que ele já carrega para mostrar.

## O app tem, mas o backend não

- **Chat com IA (atendimento):** tela pronta em `/cliente/atendimento`, com respostas simuladas (`api.chat`) e aviso de demonstração. Futuro: n8n. É outro chat, diferente do cliente–empresa (`api.messages`). Os cards de profissional usam dados de exemplo, então abrir o perfil de um deles dá erro.
- **Acompanhar agendamento:** mostra o agendamento real, mas as etapas e o Pix são simulados (`api.bookings`), com aviso de demonstração.
- Fotos, favoritas, emergência, gift cards, fidelidade, cupons e formas de pagamento.
- **Documento e selfie do cadastro:** as fotos ficam só no navegador e não são enviadas. O backend não tem rota de upload nem campo de verificação, então o botão "Continuar para verificação facial" não verifica nada. Falta decidir entre verificação por um serviço externo (guardar só o resultado e descartar a selfie), revisão manual dos documentos ou esconder essas telas por enquanto.

## Situação do backend

Desde 02/11, a `main` do backend tem tudo o que o app usa. O único PR aberto é o #24, que cria o CI. Em 02/11 entraram os PRs #15 a #19 e #21 a #23 (chat em tempo real, resposta 401 que faz a sessão renovar, lista de conversas, notificações, horário só pelo dono, painel com concluídos, respostas de erro, teste com banco e rotas de avaliações). Em 29/10 entraram os PRs #8, #9, #10, #11, #12, #13 e #14 (funcionária, comissões, horário por funcionária, rota de admin, conta desativada, painel completo, editar perfil, categoria no serviço e coordenadas do estúdio). O filtro por categoria e a distância já funcionam no app; a edição de perfil e o campo de categoria ainda não têm tela. O [PR #7](https://github.com/IsabelaCristinaDev/kira-backend/pull/7) juntou a pilha de branches que faltava:

- Só o estúdio dono conclui ou cancela, sem erro 500 ao cancelar
- Confere o dono nas rotas de agendamento e o estúdio dono nas rotas do estabelecimento
- Link de redefinição no e-mail de "esqueci a senha"
- Remarcar só até 2 horas antes
- Id do usuário no login e no refresh
- Chat só para quem participa do agendamento

Testes do backend: passam os 400, com o Docker e o banco local no ar. No app, os 159 testes passam.

## Para tudo funcionar de verdade

1. **E-mail:** `MAIL_USERNAME` e `MAIL_PASSWORD` já estão no `.env` do backend. Falta testar a troca de senha do começo ao fim (pedir o link, abrir o e-mail, criar a nova senha e entrar).
2. **Merge do PR #13 do app:** os ajustes da revisão estão feitos; antes, testar a sessão e o calendário no navegador (ver `ARQUITETURA.md`).
3. **Telas que faltam no app:** lista de conversas e não lidas no menu, gerenciar serviços, funcionárias, escolher a funcionária no agendamento, editar perfil, campo de categoria e usar o painel do backend.
4. **Integração que falta:** notificação do navegador e áudio no chat (ver "O que falta no frontend" no `ARQUITETURA.md`).
5. **Hospedar o backend e o web:** hoje tudo roda só local.
