# Stack Tecnológica

## Linguagens e Runtime

- **TypeScript ~6.0** — modo strict; único gate automático de build junto ao `tsc`
- **Node.js** — runtime de desenvolvimento

## Frameworks e Bibliotecas

| Biblioteca | Versão | Propósito |
|-----------|--------|-----------|
| React | ^19 | Biblioteca de UI |
| React Router DOM | ^7 | Roteamento client-side (SPA) |
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
1. Design System (@ds/core)     — componentes atômicos + tokens
2. AppLayout (src/components/)  — estrutura de página e navegação global
3. Telas (src/screens/)         — páginas da aplicação, uma pasta por tela
4. Roteador (App.tsx)           — BrowserRouter + Routes declarativo
```

O design system é compilado separadamente e consumido via `file:` link no package.json. O CSS do design system é importado em `main.tsx` via `@ds/core/style.css`.
