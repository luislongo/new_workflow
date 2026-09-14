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
├── presentation/                             # componentes React
│   ├── context/
│   │   └── ContainerContext.tsx              # ContainerProvider + useContainer
│   ├── components/
│   │   └── AppLayout/                        # layout global
│   └── screens/                              # uma pasta por tela, criada conforme implementada
└── mocks/                                    # dados de demonstração — fora das camadas
    ├── types.ts
    ├── dashboard.ts
    ├── empreendimentos.ts
    ├── relatorios.ts
    └── index.ts
```

`presentation/screens/` e as telas ainda não existem — cada uma é criada quando for implementada.

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
| `presentation` | `application` (interfaces, use cases) e, temporariamente, `mocks` |
| `mocks` | Nenhuma camada do projeto |
| `App.tsx` | Todas as camadas (composition root) |

**Proibido**: `presentation` importar de `infrastructure` diretamente.

## Acesso a Use Cases nas Telas

Telas acessam use cases via `useContainer()` — nunca instanciam repositórios ou serviços diretamente:

```tsx
import { useContainer } from '../../context/ContainerContext'

export function MinhaTela() {
  const { getProjects } = useContainer()
  // ...
}
```

## Dados de Mock

`src/mocks/` reúne dados de demonstração gerados com `@faker-js/faker` (locale `pt_BR`). Cada módulo chama `faker.seed(42)` no topo, então a saída é determinística entre execuções. O módulo existe para popular telas antes de haver uma fonte de dados real.

| Arquivo | Exporta | Dados |
|---------|---------|-------|
| `dashboard.ts` | `fetchDashboardData()` | `DashboardData`: 6 KPIs, evolução de custo por mês, avanço previsto vs. realizado por obra, indicadores por etapa e materiais críticos |
| `empreendimentos.ts` | `fetchEmpreendimentos()` | 10 `Empreendimento` (nome, e-mail, CEP, endereço, proprietário, tipo) |
| `relatorios.ts` | `fetchObras()`, `fetchLancamentos()` | 10 `Obra` e 10 `LancamentoFinanceiro` |
| `types.ts` | os tipos dos três módulos | — |

As funções são `async` e retornam o array já materializado — a assinatura imita uma chamada de rede para que a troca por uma fonte real não mude o call site.

Três ressalvas:

1. **Não passa pelo container.** Os mocks não implementam `IProjectRepository` e não são injetados via `useContainer()`.
2. **O vocabulário não é o do domínio.** `Empreendimento`, `Obra` e `LancamentoFinanceiro` são de construção civil; a entidade de `domain/` é `Project`. Os dois conjuntos ainda não foram reconciliados.
3. **`@faker-js/faker` é uma dependência de runtime**, não de desenvolvimento — enquanto os mocks forem importados por código de tela, o faker entra no bundle de produção.

Quando uma tela deixar de ser protótipo visual, o mock vira a fonte de uma implementação de repositório em `infrastructure/` e a tela passa a consumir o use case. Ver [ADR-0003](../meta/adr/0003-principios-solid-e-arquitetura-limpa.md).

## Componentes

| Categoria | Local | Responsabilidade |
|-----------|-------|-----------------|
| Layout | `presentation/components/` | Estrutura de página, sem lógica de domínio |
| Tela | `presentation/screens/` | Stateful, compõe componentes de UI |

## Estilos

As telas usam **Tailwind CSS v4**. Tokens disponíveis: `color-primary-*`, `color-neutral-*`, `color-danger-*`, `color-light-*`, `spacing-*`, `radius-*`, `text-*`, `font-sans`. Ver `src/index.css` para a lista completa.

## Code Connect

Arquivos `.figma.tsx` ao lado de cada componente mapeiam o React ao nó Figma correspondente. Isso permite inspecionar um componente no Figma e ver diretamente a implementação em código.

## Marcadores de manutenção

Pontos de extensão planejados são marcados com `// TODO [manutenção]:` no código, para facilitar a localização das tarefas durante o estudo.

## Convenções de Nomenclatura

- Arquivos de componente: PascalCase (`AppLayout.tsx`, `Dashboard.tsx`)
- Funções/hooks: camelCase
- Rotas URL: kebab-case (`/novo-projeto`)
- Named exports em todos os módulos; default export apenas em `App.tsx`
