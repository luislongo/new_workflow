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

## Build

- **Vite ^8** com `@vitejs/plugin-react` — HMR, dev server e bundling

## Qualidade

- **oxlint** — linting rápido
- **TypeScript strict** — único gate automatizado de build; não há ESLint, Prettier nem test runner configurados nesta fase

## Figma Code Connect

- **@figma/code-connect ^1.5.3** — mapeia componentes React a nós Figma
- `figma.config.json` na raiz — inclui `src/**/*.tsx`

## Arquitetura Geral

SPA puro servido pelo Vite. Sem backend, sem SSR, sem API própria.

```
Camadas:
1. AppLayout (presentation/components/)      — estrutura de página e navegação global
2. Telas (presentation/screens/)             — páginas da aplicação, uma pasta por tela
3. App.tsx                                   — composition root: container de DI + Routes
```
