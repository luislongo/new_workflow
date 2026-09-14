# Stack Tecnológica

## Linguagens e Runtime

- **TypeScript ~6.0** — modo strict; único gate automático de build junto ao `tsc`
- **Node.js** — runtime de desenvolvimento

## Frameworks e Bibliotecas

| Biblioteca | Versão | Propósito |
|-----------|--------|-----------|
| React | ^19 | Biblioteca de UI |
| React Router DOM | ^7 | Roteamento client-side (SPA) |
| React Hook Form | ^7.88 | Estado de formulário (ver [ADR-0002](../meta/adr/0002-formularios-e-validacao.md)) |
| Zod | ^3.25 | Schema e validação |
| @hookform/resolvers | ^5.9 | Ponte entre React Hook Form e Zod |
| @faker-js/faker | ^9.9 | Geração dos dados de `src/mocks/` |
| @ds/core | 0.0.1 (local) | Design system interno |

## Build

- **Vite ^8** com `@vitejs/plugin-react` — HMR, dev server e bundling

## Qualidade

- **oxlint** — linting rápido
- **TypeScript strict** — único gate automatizado de build; não há ESLint, Prettier nem test runner configurados nesta fase

## Figma Code Connect (new_workflow exclusivo)

- **@figma/code-connect ^1.5.3** — mapeia componentes React a nós Figma
- `figma.config.json` na raiz — inclui `src/**/*.tsx`
- Scripts: `figma:connect`, `figma:connect:dry-run`, `figma:connect:unpublish`

## Arquitetura Geral

SPA puro servido pelo Vite. Sem backend, sem SSR, sem API própria.

```
Camadas:
1. Design System (@ds/core)                  — componentes atômicos + tokens
2. AppLayout (presentation/components/)      — estrutura de página e navegação global
3. Telas (presentation/screens/)             — páginas da aplicação, uma pasta por tela
4. App.tsx                                   — composition root: container de DI + Routes
```

O design system é compilado separadamente e consumido via `file:../mba/repos/design_system` no package.json. O CSS do design system é importado em `main.tsx` via `@ds/core/style.css`.
