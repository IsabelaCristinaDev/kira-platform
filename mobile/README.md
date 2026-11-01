# Kira Mobile

App React Native (Expo SDK 58, Expo Router) da Kira. Roda com dados simulados, igual ao protótipo web.

## Rodar

```bash
cd mobile
npm install
npx expo start        # QR code para o Expo Go, ou pressione a (Android), i (iOS), w (web)
```

## Como se liga ao web

O app reaproveita, sem copiar, o código que não depende de navegador, pelo alias `@kira/*` (aponta para `../src`):

- `@kira/shared/api`: contrato, mock e gateway do chat (`api.chat`)
- `@kira/shared/data`, `@kira/shared/utils`: profissionais e datas
- `@kira/client/chat`: reducer, agrupamento por dia e textos do chat
- `@kira/client/utils`: busca de profissionais
- `@kira/context/SchedulingContext`: estado do agendamento

Trocar o mock pela API real em `src/shared/api` vale para o web e para o app ao mesmo tempo.

## O que já está convertido

Abertura, login (simulado), início, busca, perfil da profissional, agendamento, ajuda e suporte e o chat de atendimento
(carregando, boas-vindas, conversa, cartão de horário, transferência para atendente, falha de envio e sem conexão).

Provador virtual: referência, foto, consentimento LGPD, geração da prévia (a primeira falha de propósito, para mostrar o
erro), profissionais compatíveis e, em Perfil, Consentimentos LGPD (apagar fotos e revogar). Fala com `api.tryOn`; hoje
é um mock que devolve a própria foto.

Segurança e denúncia: reportar problema (anônimo, entra na fila) e emergência (190 primeiro, registro na Kira sem
anonimato e com suspensão preventiva do perfil). Entradas: Perfil, Segurança e denúncia, e o perfil da profissional.
Fala com `api.reports`; hoje é um mock que devolve o protocolo (o primeiro envio falha de propósito).

## O que falta converter

Cadastro de cliente e profissional, agenda e toda a área da profissional. O painel da equipe que analisa as denúncias
ainda não existe.

## Regras do projeto

- Cores, raios e fontes vêm de `src/theme/tokens.js`, que espelha `src/shared/styles/tokens.css`.
- Textos em português do Brasil. Em qualquer texto sobre IA, usar "nossa inteligência artificial".
- `src/hooks/useChat.js` repete a lógica do `useChat` do web, trocando só o ouvinte de conexão (NetInfo). Extrair a parte
  comum para `src/shared` quando o web puder ser alterado.
