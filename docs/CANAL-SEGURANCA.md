# Canal de segurança: backend e app

Situação em 01/11/2026. Revisão do canal de denúncias no backend (branch `feat/canal-seguranca` do kira-backend) e no app (`src/shared/components/Safety.jsx`), com a lista do que falta resolver.

## Backend (`feat/canal-seguranca`)

A branch ainda não foi juntada e, em 01/11, estava 51 commits atrás da `main`. O worktree `kira-backend-canal-seguranca` tem um merge sem commit, feito quando a `main` tinha 241 testes (hoje são 400), e precisa ser refeito com a `main` atual. Naquele merge, passavam os 269 testes: os 241 da `main` mais os 28 das denúncias.

### O que está certo

- **Anonimato:** a denúncia comum é anônima, e a lista do admin esconde quem denunciou. No risco imediato, a identidade aparece para a equipe poder entrar em contato.
- **Risco imediato:** os admins recebem um e-mail urgente na hora, enviado só depois de a denúncia ser gravada e com novas tentativas se o envio falhar.
- **Suspensão preventiva com limites:** só acontece se a denúncia for durante um atendimento (de 2h antes a 2h depois). Também não acontece se quem denuncia já fez uma denúncia de risco julgada infundada.
- **A suspensão corta o acesso na hora:** a conta fica inativa, o refresh token é apagado e o filtro JWT recusa o token que ainda estiver válido.
- **Regras:**
  - ninguém denuncia a si mesmo nem um admin;
  - o agendamento informado precisa envolver as duas partes;
  - não dá para abrir uma segunda denúncia pendente contra o mesmo perfil.
- **Análise pelo admin:** encaminhar ou arquivar, marcar como infundada, revogar a suspensão. A suspensão só é desfeita se não houver outra ativa contra o mesmo perfil.
- **Rotas de admin:** `/api/admin/**` exige ADMIN em todos os métodos, inclusive os GETs da lista de denúncias.

### O que está errado

- [x] **Estúdio suspenso continua aparecendo e recebendo agendamentos.** Corrigido na `main` pelo PR #11: a conta inativa some da vitrine, não cria nem remarca agendamento e perde o token e o refresh. Os agendamentos que já existiam continuam valendo, e a cliente ainda pode cancelá-los. Falta trazer isso para a `feat/canal-seguranca`.
- [ ] **Não há como criar um admin.** Não existe rota nem cadastro inicial. Sem inserir um admin direto no banco, ninguém analisa as denúncias, e o e-mail de risco imediato não vai para ninguém, porque é enviado só para os admins (`AdminRepository.findByAtivoTrue`).
- [ ] **Perfil suspenso recebe uma mensagem errada no login:** "Usuário inexistente ou senha inválida" (`GlobalExceptionHandler`, que trata toda `AuthenticationException` igual). A pessoa acha que errou a senha.
- [ ] **Menor:** a suspensão reaproveita o campo `ativo` do usuário. Se no futuro uma conta for desativada por outro motivo, revogar uma suspensão vai reativá-la.

### O que falta

- [ ] Refazer o merge com a `main` atual, rodar os testes, fazer o commit e o push (normal, sem forçar) e abrir o PR da `feat/canal-seguranca` para a `main`.
- [ ] Uma rota para quem denunciou acompanhar a própria denúncia. Hoje só o admin vê o andamento.

## App (`Safety.jsx`)

### O que está certo

- O fluxo segue o fluxograma: escolher o motivo; no risco imediato, aparece "Ligar para 190 agora" (`tel:190`); no caso comum, vai para a fila anônima.
- O botão de denúncia já está no detalhe do agendamento da cliente (`ClientAgendaDetailScreen`), recebendo o id do agendamento.

### O que está errado

- [ ] **Nada é enviado.** "Enviar denúncia anônima" (`ReportModal`) só mostra "Denúncia recebida". "Também registrar no Kira", no risco imediato (`EmergencyFlow`), chama `onRegisterInternally`, que nenhuma tela passa, então só fecha o modal. Quem usa acredita que denunciou.
- [ ] **O modal de risco imediato promete que "o perfil envolvido é suspenso de forma preventiva".** O backend só suspende durante um atendimento e na primeira vez. Nos outros casos, a pessoa recebe uma promessa falsa num momento de perigo.
- [ ] **Na tela de segurança do profissional (`ProSecurityScreen`), o botão não tem agendamento.** Sem agendamento, não há como saber quem está sendo denunciado, e o backend exige o `denunciadoId`. Esse ponto de entrada não tem como funcionar como está.
- [ ] **Os motivos não batem com os do backend.** A tradução cabe no `httpAdapter.js`, sem mexer nas telas:

  | App (`reportMotivoOptions`) | Backend (`MotivoDenuncia`)                                   |
  | --------------------------- | ------------------------------------------------------------ |
  | `endereco_invalido`         | `ENDERECO_FALSO` (o backend também tem `LOCAL_NAO_VALIDADO`) |
  | `comportamento_suspeito`    | `COMPORTAMENTO_SUSPEITO`                                     |
  | `risco_imediato`            | `PERIGO_DURANTE_ATENDIMENTO`, mais `riscoImediato: true`     |
  | `outro`                     | `OUTRO`                                                      |

### O que falta

- [ ] A chamada `api.reports.submit` no `httpAdapter.js` (mesmo contrato do mock do Expo, em `reportContract.js`), com a tradução dos motivos e o `denunciadoId` tirado do agendamento (a outra parte dele). Depois, ligar essa chamada aos dois botões.
- [ ] Mostrar a orientação que o backend devolve (`DenunciaRegistradaResponse`): se o perfil foi suspenso, o telefone 190 e o texto de orientação.
- [ ] Uma área de admin para analisar as denúncias. Hoje só daria para fazer pelo Swagger.

## Ordem sugerida

O canal de segurança fica por último, depois das outras pendências do web.

1. **Backend:** dar uma mensagem clara no login de conta suspensa. (Esconder e bloquear o estúdio suspenso já está na `main`, pelo PR #11.)
2. **Backend:** criar o primeiro admin, por exemplo a partir de variáveis do `.env` ao subir a aplicação.
3. Refazer o merge e abrir o PR da `feat/canal-seguranca`.
4. **App:** ligar a denúncia no `httpAdapter.js`. Ligar os botões e corrigir as duas mensagens exige mexer em `Safety.jsx` e na tela do profissional, então isso fica para quando for a hora de mexer nas telas.
