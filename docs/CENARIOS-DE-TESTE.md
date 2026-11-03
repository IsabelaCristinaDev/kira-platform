# Cenários de teste pelo app

Roteiro para testar o Kira de ponta a ponta usando o frontend, com o backend e o banco no ar. Marque cada cenário ao testar e anote o que der errado.

## Antes de começar

- Backend no ar (`./mvnw spring-boot:run` no kira-backend, porta 8081) com `MAIL_USERNAME` e `MAIL_PASSWORD` no `.env`.
- App no ar (`npm run dev` no kira-platform).
- Dois e-mails de verdade a que você tenha acesso: um para a cliente e outro para o profissional. Dá para usar o mesmo Gmail com `+`: `voce+cliente@gmail.com` e `voce+studio@gmail.com` chegam na mesma caixa.
- Os testes de agendamento precisam de horários futuros. Os de cancelar e remarcar dependem da regra das 2 horas, então marque um horário para daqui a mais de 2 horas e outro para daqui a menos de 2 horas.

## 1. Conta

### 1.1 Criar conta de profissional e receber as boas-vindas

- [ ] Na tela inicial, escolher a área do profissional e fazer o cadastro até a última etapa, com pelo menos dois serviços (nome, preço e duração).
- [ ] **Esperado:** a conta é criada e o app vai para o login.
- [ ] **Esperado:** chega o e-mail de boas-vindas no e-mail do profissional (olhar também o spam).

### 1.2 Criar conta de cliente e receber as boas-vindas

- [ ] Fazer o cadastro da cliente até a etapa "Termos".
- [ ] **Esperado:** a conta é criada e chega o e-mail de boas-vindas.

### 1.3 Cadastro repetido

- [ ] Tentar criar outra conta com o mesmo e-mail.
- [ ] **Esperado:** mensagem de e-mail já cadastrado, sem criar a conta.
- [ ] Repetir com o mesmo CPF (cliente) ou CNPJ (profissional) e outro e-mail.
- [ ] **Esperado:** mensagem de documento já cadastrado.

### 1.4 Entrar e sair

- [ ] Entrar com a cliente. **Esperado:** cai na área da cliente.
- [ ] Sair e entrar com o profissional. **Esperado:** cai na área do profissional.
- [ ] Entrar com a senha errada. **Esperado:** mensagem de usuário ou senha inválidos.

### 1.5 Continuar logada

- [ ] Entrar, deixar o app aberto por mais de 1 hora e usar de novo.
- [ ] **Esperado:** continua funcionando sem pedir login (a sessão renova sozinha).

### 1.6 Esqueci a senha

- [ ] No login, "Esqueci minha senha", informar o e-mail da cliente.
- [ ] **Esperado:** chega um e-mail com o link de redefinição.
- [ ] Abrir o link, criar uma senha nova e entrar com ela. **Esperado:** entra.
- [ ] Tentar entrar com a senha antiga. **Esperado:** não entra.
- [ ] Usar o mesmo link de novo. **Esperado:** erro, o link só vale uma vez.
- [ ] Pedir outro link e só usar depois de 30 minutos. **Esperado:** erro de link expirado.

## 2. Profissional: preparar o estúdio

### 2.1 Horário de funcionamento

- [ ] Logada como profissional, abrir o Início. **Esperado:** aviso de que falta o horário de funcionamento.
- [ ] Perfil → "Horário de funcionamento": abrir de segunda a sábado, das 9h às 18h, e salvar.
- [ ] Sair da tela e voltar. **Esperado:** o horário salvo aparece, e o aviso do Início some.

## 3. Cliente: encontrar e agendar

### 3.1 Busca e perfil do estúdio

- [ ] Logada como cliente, abrir Início e Buscar. **Esperado:** o estúdio criado no 1.1 aparece.
- [ ] Buscar pelo nome e filtrar por serviço. **Esperado:** o estúdio continua aparecendo.
- [ ] Abrir o perfil do estúdio. **Esperado:** serviços com preço e duração do cadastro.

### 3.2 Horários livres

- [ ] No agendamento, escolher um serviço e um dia em que o estúdio abre.
- [ ] **Esperado:** aparecem os horários dentro do expediente.
- [ ] Escolher um dia em que o estúdio está fechado (domingo). **Esperado:** nenhum horário, sem erro.

### 3.3 Agendar

- [ ] Agendar um horário para daqui a mais de 2 horas.
- [ ] **Esperado:** confirmação, e o agendamento aparece em Agenda → próximos.
- [ ] Voltar ao mesmo dia e serviço. **Esperado:** o horário agendado não aparece mais como livre.
- [ ] Agendar outro horário para daqui a menos de 2 horas (vai ser usado no 4.3).

### 3.4 Lembrete por e-mail

- [ ] Ter um agendamento para as próximas 24 horas e esperar a virada da hora (o envio roda de hora em hora).
- [ ] **Esperado:** a cliente recebe o e-mail de lembrete, uma vez só.

## 4. Cliente: mudar o agendamento

### 4.1 Remarcar

- [ ] No detalhe do agendamento de daqui a mais de 2 horas, "Remarcar horário" e escolher outro horário.
- [ ] **Esperado:** o agendamento aparece com a data nova, e o horário antigo volta a ficar livre.

### 4.2 Cancelar

- [ ] Cancelar o agendamento remarcado.
- [ ] **Esperado:** vai para Agenda → cancelados, e o horário volta a ficar livre.

### 4.3 Prazo de 2 horas

- [ ] No agendamento de daqui a menos de 2 horas, tentar cancelar e tentar remarcar.
- [ ] **Esperado:** mensagem de que precisa de 2 horas de antecedência, e nada muda.

## 5. Profissional: atender

### 5.1 Painel e agenda

- [ ] Logada como profissional, abrir o Início. **Esperado:** clientes do dia, receita da semana e nota.
- [ ] Abrir a Agenda. **Esperado:** os agendamentos da cliente aparecem no calendário.

### 5.2 Concluir e cancelar

- [ ] Concluir um atendimento. **Esperado:** vai para concluído; a receita da semana e o Financeiro passam a contar o valor.
- [ ] Cancelar outro atendimento. **Esperado:** some da agenda do dia; para a cliente, aparece em cancelados.

### 5.3 Remarcar

- [ ] Na Agenda, em um atendimento ativo, "Remarcar", escolher outro dia (de outro mês também) e um horário.
- [ ] **Esperado:** confirmação; "Ver agenda" abre o dia novo com o atendimento marcado como remarcado, e o horário antigo volta a ficar livre.
- [ ] Para a cliente. **Esperado:** o agendamento aparece com a data nova.
- [ ] Remarcar um atendimento para daqui a menos de 2 horas. **Esperado:** funciona (o limite de 2 horas só vale para a cliente).
- [ ] Com duas funcionárias, deixar a do atendimento ocupada em um horário. **Esperado:** esse horário não aparece.

### 5.4 Financeiro e Analytics

- [ ] Abrir Financeiro e Analytics. **Esperado:** os números batem com os atendimentos concluídos (soma dos preços, serviço mais feito, dia da semana).

## 6. Avaliações

### 6.1 Avaliar

- [ ] Logada como cliente, abrir um atendimento concluído e avaliar (nota e comentário).
- [ ] **Esperado:** a avaliação aparece em "Minhas avaliações" e no perfil do estúdio, e a nota média do estúdio muda.
- [ ] Tentar avaliar o mesmo atendimento de novo. **Esperado:** não deixa.
- [ ] Tentar avaliar um atendimento que não foi concluído. **Esperado:** não deixa.

### 6.2 Avaliação no painel

- [ ] Logada como profissional. **Esperado:** a avaliação aparece no painel e a nota é atualizada.

## 7. Chat entre cliente e estúdio

Abra as duas contas ao mesmo tempo (uma delas em janela anônima).

- [ ] Cliente: detalhe do agendamento → "Conversar com…". Profissional: Agenda → "Conversar com…".
- [ ] Enviar uma mensagem de cada lado. **Esperado:** aparece na hora do outro lado, sem recarregar e sem repetir.
- [ ] Parar o backend. **Esperado:** aviso "Reconectando...". Subir de novo. **Esperado:** o aviso some, e as mensagens voltam a chegar na hora.
- [ ] Cancelar o agendamento e abrir a conversa pelo lado da cliente. **Esperado:** o histórico aparece, sem campo de envio.

## 8. Histórico

- [ ] Logada como cliente, Perfil → histórico e pagamentos. **Esperado:** os atendimentos concluídos com os valores.

## 9. Recursos simulados

Estes recursos ainda não têm backend. O teste é só conferir que a tela deixa isso claro.

- [ ] Perfil → Ajuda → "Conversar com o suporte". **Esperado:** abre o chat com IA, com o aviso de demonstração.
- [ ] No detalhe de um agendamento próximo, "Acompanhar agendamento". **Esperado:** mostra o serviço, a profissional e o horário reais, e o aviso de que as etapas e o Pix são simulados.

## Ainda sem tela no app

Estes recursos já existem no backend, mas o app ainda não tem a tela. Entram neste roteiro quando a tela ficar pronta (ver "O que falta no frontend" no `ARQUITETURA.md`):

- Editar perfil da cliente e do profissional
- Gerenciar serviços depois do cadastro
- Funcionárias e escolher a funcionária no agendamento
- Denúncia (canal de segurança)
