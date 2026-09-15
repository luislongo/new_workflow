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
│   ├── Empreendimento.ts
│   ├── repositories/
│   │   └── IEmpreendimentoRepository.ts
│   └── index.ts
├── application/                              # use cases e interface do container
│   ├── IContainer.ts
│   ├── usecases/
│   │   ├── CreateEmpreendimento.ts
│   │   └── index.ts
│   └── index.ts
├── infrastructure/                           # implementações concretas
│   ├── repositories/
│   │   ├── InMemoryEmpreendimentoRepository.ts
│   │   └── index.ts
│   ├── container.ts
│   └── index.ts
├── presentation/                             # componentes React
│   ├── context/
│   │   └── ContainerContext.tsx              # ContainerProvider + useContainer
│   ├── components/
│   │   └── AppLayout/                        # layout global (AppHeader + Navbar)
│   ├── hooks/                                # hooks reutilizáveis por telas e pelo AppLayout
│   │   └── useMediaQuery.ts
│   └── screens/                              # uma pasta por tela, criada conforme implementada
│       └── AdicionarEmpreendimento/
└── mocks/                                    # dados de demonstração — fora das camadas
    ├── types.ts
    ├── dashboard.ts
    ├── empreendimentos.ts
    ├── relatorios.ts
    └── index.ts
```

`presentation/screens/` ganha uma pasta por tela conforme ela é implementada — `AdicionarEmpreendimento/` é a primeira.

Cada módulo de tela segue:
```
NomeTela/
├── NomeTela.tsx        # componente principal, exportado nomeado
├── NomeTela.schema.ts  # schema Zod + tipo inferido (apenas telas com formulário)
└── index.ts            # re-export: export { NomeTela } from './NomeTela'
```

## Regras de Importação

| Camada | Pode importar de |
|--------|-----------------|
| `domain` | Nenhuma camada do projeto |
| `application` | `domain` |
| `infrastructure` | `domain`, `application` |
| `presentation` | `application` (interfaces, use cases) e, temporariamente, `mocks` |
| `mocks` | `domain` (apenas re-export de tipos — ver nota abaixo) |
| `App.tsx` | Todas as camadas (composition root) |

**Proibido**: `presentation` importar de `infrastructure` diretamente.

> **Nota sobre `mocks → domain`:** `src/mocks/types.ts` reexporta tipos de `domain/Empreendimento.ts` em vez de redeclará-los. A direção é permitida — `domain` é a camada mais interna e não importa de `mocks`. Esse padrão é válido apenas para re-export de tipos; `mocks/` nunca instancia, constrói ou depende de lógica de `domain`.

## Acesso a Use Cases nas Telas

Telas acessam use cases via `useContainer()` — nunca instanciam repositórios ou serviços diretamente:

```tsx
import { useContainer } from '../../context/ContainerContext'

export function MinhaTela() {
  const { createEmpreendimento } = useContainer()
  // ...
}
```

## Convenção de Use Cases

Cada use case expõe um único método público `execute()` — convenção adotada a partir da primeira use case do projeto (`CreateEmpreendimento`) e válida para as próximas:

```ts
export class CreateEmpreendimento {
  private readonly repository: IEmpreendimentoRepository;

  constructor(repository: IEmpreendimentoRepository) {
    this.repository = repository;
  }

  async execute(input: CreateEmpreendimentoInput): Promise<Empreendimento> {
    return this.repository.create(input);
  }
}
```

Chamada a partir da tela: `await createEmpreendimento.execute(input)`.

## TypeScript: `erasableSyntaxOnly`

`tsconfig.app.json` habilita `erasableSyntaxOnly`, que **proíbe parameter properties** (`constructor(private readonly x: T)`). Toda classe do projeto (use cases, repositórios) declara o campo e o atribui explicitamente no construtor, como no exemplo acima — nunca como atalho no parâmetro. `verbatimModuleSyntax: true` também exige `import type { ... }` para imports usados só como tipo, e `noUnusedLocals`/`noUnusedParameters` quebram o build com variáveis não usadas.

## Hooks

`presentation/hooks/` reúne hooks reutilizáveis por telas e pelo `AppLayout`. O design system não exporta hooks — responsividade é implementada localmente no projeto.

`useMediaQuery(query: string): boolean` usa `window.matchMedia` + `useSyncExternalStore` (evita flash de layout incorreto na hidratação; snapshot de servidor retorna `false`). O projeto usa um único breakpoint — `(min-width: 1024px)` — como fonte de verdade para "desktop" vs. "mobile"; todo componente responsivo (`AppHeader`, `NavbarTab`, `DoubleColumn`, ...) consome o mesmo valor derivado dessa única chamada, feita uma vez por componente que precisa dele.

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

1. **Não passa pelo container.** `fetchEmpreendimentos()` não implementa `IEmpreendimentoRepository` e não é injetado via `useContainer()` — é dado de protótipo visual, independente do `InMemoryEmpreendimentoRepository` real usado pela tela `AdicionarEmpreendimento`.
2. **Vocabulário parcialmente reconciliado.** `mocks/types.ts` reexporta `TipoEmpreendimento`, `Empreendimento` e `CreateEmpreendimentoInput` de `domain/Empreendimento.ts` — fonte única de verdade para essas telas. `Obra` e `LancamentoFinanceiro` (usados por `relatorios.ts`) ainda são vocabulário exclusivo de mock, sem entidade correspondente em `domain/` até que a tela de Relatórios seja implementada.
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
