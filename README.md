# kira-platform

Kira é uma plataforma inteligente de agendamento e gestão de serviços, criada para otimizar a disponibilidade de profissionais, automatizar processos e oferecer uma experiência escalável.

## Stack

Vite + React (JavaScript/JSX) e lucide-react. React Router (`/cliente/*`, `/profissional/*`).

## Como rodar

O app consome o [kira-backend](../kira-backend) (Spring Boot, porta 8081 por padrão). Suba o backend antes. Em desenvolvimento o Vite repassa `/api` ao backend (proxy em `vite.config.js`), então não há CORS em nenhuma porta. Para outro endereço do backend ou para o build de produção, veja `.env.example`.

```bash
npm install
npm run dev      # desenvolvimento (http://localhost:5173)
npm run build    # build de produção em dist/
npm run lint     # ESLint
npm run format   # Prettier
npm test         # Vitest
```

## Estrutura

```
src/
  main.jsx                 entrada
  App.jsx                  moldura do celular + atalhos de tela (dev)
  routes.js                tabela chave da tela -> URL
  AppRoutes.jsx            rotas e layouts
  screens.js               mapa chave -> componente da tela
  context/                 estado por assunto: sessão, cadastro, busca, agendamento, Provador e painel
  shared/api/              cliente HTTP do kira-backend, conversão de dados e contrato
  shared/                  tema, tokens (styles/), utils, dados e componentes comuns (primitives, NavBar)
  client/                  lado cliente (telas, componentes, hooks de dados, recomendação)
  professional/            lado profissional (telas, componentes, métricas do painel)
```

Cada arquivo de `src/` começa com uma legenda de uma linha: o que faz, de onde vêm os dados e qual API usa.

## Documentação

- [Arquitetura e integrações](docs/ARQUITETURA.md): o que vem do backend, o que ainda não tem API e o que é futuro
- [Como contribuir](CONTRIBUTING.md): commits, branches e PRs
- [Histórico de mudanças](CHANGELOG.md)
