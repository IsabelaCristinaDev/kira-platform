# Como contribuir

## Branches

`<tipo>/<assunto-curto>`, a partir da `main`. Exemplos: `feat/agenda-cliente`, `fix/calendario-mes`, `docs/arquitetura`.

## Commits (Conventional Commits)

```
<tipo>(<escopo>): <verbo no infinitivo + objeto, até 60 caracteres, minúsculo, sem ponto final>

<corpo opcional: o que e por que>
```

- **Tipos:** `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `build`, `ci`.
- **Escopos:** `shared`, `client`, `professional`, `core`, `build`, `ci`, `docs`.
- Um commit, uma intenção. Não misturar refatoração com funcionalidade.
- Corpo só se for necessário, em até 2 linhas. O commitlint valida a mensagem (Husky local e CI).

## Pull Requests

- Título no mesmo padrão dos commits.
- Preencher o template: o que mudou, como testar, impacto.
- `npm run lint`, `npm run format:check`, `npm test` e `npm run build` devem passar antes do merge (o CI roda tudo).
- Merge com `--no-ff` para manter o histórico dos commits.

## Legenda de arquivo

Todo arquivo de `src/` começa com uma linha de comentário: o que faz, origem dos dados e API usada.
Ao ligar uma tela a um endpoint novo, atualize a legenda do arquivo e `docs/ARQUITETURA.md`.

## Versionamento

SemVer (`MAJOR.MINOR.PATCH`). Toda mudança relevante entra no `CHANGELOG.md` (Keep a Changelog).
