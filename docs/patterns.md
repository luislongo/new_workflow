# Padrões de Design

## Arquitetura

**Clean Architecture** com quatro camadas explícitas. As regras de dependência são verificáveis pelo compilador TypeScript — nenhuma camada interna importa de uma camada externa.

```
domain → application → infrastructure
                  ↘                 ↘
               presentation ← App.tsx (composition root)
```

Veja [ADR-0003](../meta/adr/0003-principios-solid-e-arquitetura-limpa.md) para a decisão completa.

## Organização de Código

```
src/
├── App.tsx                                   # composition root: instancia container e define rotas
├── domain/                                   # entidades e contratos (sem dependências externas)
│   ├── Project.ts
│   ├── repositories/
│   │   └── IProjectRepository.ts
│   └── index.ts
├── application/                              # use cases e interface do container
│   ├── IContainer.ts
│   ├── usecases/
│   │   ├── GetProjects.ts
│   │   ├── CreateProject.ts
│   │   ├── UpdateProject.ts
│   │   ├── DeleteProject.ts
│   │   └── index.ts
│   └── index.ts
├── infrastructure/                           # implementações concretas
│   ├── repositories/
│   │   └── InMemoryProjectRepository.ts
│   ├── container.ts
│   └── index.ts
└── presentation/                             # componentes React
    ├── context/
    │   └── ContainerContext.tsx              # ContainerProvider + useContainer
    ├── components/
    │   └── AppLayout/
    └── screens/
        ├── Dashboard/
        ├── FormScreen/
        ├── DataTableScreen/
        ├── RegistrationFlow/
        └── CompositeComponent/
```

Cada módulo de tela segue:
```
NomeTela/
├── NomeTela.tsx    # componente principal, exportado nomeado
└── index.ts        # re-export: export { NomeTela } from './NomeTela'
```

## Regras de Importação

| Camada | Pode importar de |
|--------|-----------------|
| `domain` | Nenhuma camada do projeto |
| `application` | `domain` |
| `infrastructure` | `domain`, `application` |
| `presentation` | `application` (interfaces, use cases) |
| `App.tsx` | Todas as camadas (composition root) |

**Proibido**: `presentation` importar de `infrastructure` diretamente.

## Acesso a Use Cases nas Telas

Telas acessam use cases via `useContainer()` — nunca instanciam repositórios ou serviços diretamente:

```tsx
import { useContainer } from '../../context/ContainerContext'

export function Dashboard() {
  const { getProjects } = useContainer()
  // ...
}
```

## Componentes

| Categoria | Local | Responsabilidade |
|-----------|-------|-----------------|
| Layout | `presentation/components/` | Estrutura de página, sem lógica de domínio |
| Tela | `presentation/screens/` | Stateful, compõe componentes do design system |
| Design System | `@ds/core` | Atômicos, sem margem emitida, API props-only |

## Estilos

As telas usam **Tailwind CSS v4** com tokens derivados do design system. Tokens disponíveis: `color-primary-*`, `color-neutral-*`, `color-danger-*`, `color-light-*`, `spacing-*`, `radius-*`, `text-*`, `font-sans`. Ver `src/index.css` para a lista completa.

## Code Connect (new_workflow exclusivo)

Arquivos `.figma.tsx` ao lado de cada componente mapeiam o React ao nó Figma correspondente. Isso permite inspecionar um componente no Figma e ver diretamente a implementação em código.

## Marcadores de manutenção

Pontos de extensão planejados são marcados com `// TODO [manutenção]:` no código, para facilitar a localização das tarefas durante o estudo.

## Convenções de Nomenclatura

- Arquivos de componente: PascalCase (`AppLayout.tsx`, `Dashboard.tsx`)
- Funções/hooks: camelCase
- Rotas URL: kebab-case (`/novo-projeto`)
- Named exports em todos os módulos; default export apenas em `App.tsx`
