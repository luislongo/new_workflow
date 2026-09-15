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
│   ├── Dashboard.ts
│   ├── Relatorio.ts                          # Obra, LancamentoFinanceiro, FiltroRelatorio
│   ├── repositories/
│   │   ├── IEmpreendimentoRepository.ts
│   │   ├── IDashboardRepository.ts
│   │   ├── IRelatorioRepository.ts
│   │   └── IArquivoDownloader.ts             # porta de I/O de browser (download de arquivo)
│   └── index.ts
├── application/                              # use cases, formatadores e interface do container
│   ├── IContainer.ts
│   ├── formatters.ts                         # formatOrcamento, formatValor, formatData
│   ├── usecases/
│   │   ├── CreateEmpreendimento.ts
│   │   ├── GetDashboardData.ts
│   │   ├── GetRelatorioObras.ts
│   │   ├── GetRelatorioFinanceiro.ts
│   │   ├── ExportarRelatorio.ts
│   │   └── index.ts
│   └── index.ts
├── infrastructure/                           # implementações concretas
│   ├── repositories/
│   │   ├── InMemoryEmpreendimentoRepository.ts
│   │   ├── InMemoryDashboardRepository.ts
│   │   ├── InMemoryRelatorioRepository.ts
│   │   └── index.ts
│   ├── BlobArquivoDownloader.ts               # implementa IArquivoDownloader via Blob + <a download>
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
│       ├── AdicionarEmpreendimento/
│       ├── Dashboard/
│       └── Relatorios/
└── mocks/                                    # dados de demonstração — fora das camadas
    ├── types.ts
    ├── dashboard.ts
    ├── empreendimentos.ts
    ├── relatorios.ts
    └── index.ts
```

`presentation/screens/` ganha uma pasta por tela conforme ela é implementada — `AdicionarEmpreendimento/` é a primeira, seguida por `Dashboard/` e `Relatorios/`.

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

Nem todo `execute()` é assíncrono: `ExportarRelatorio.execute()` é síncrono (monta o CSV em memória e delega o download), pois não há I/O assíncrono envolvido. A convenção é "um único método público chamado `execute`", não "sempre retorna `Promise`".

## Formatadores compartilhados (`application/formatters.ts`)

Funções de formatação usadas tanto pela tela quanto por um use case (ex.: `formatOrcamento`, `formatValor`, `formatData`, usadas pela tabela de Relatórios e por `ExportarRelatorio` para gerar o CSV) ficam em `application/`, não em `presentation/`. Colocá-las em `presentation/` violaria a regra de dependência do ADR-0003, já que `application` não pode importar de `presentation`. Ambos os consumidores importam do mesmo módulo, garantindo que a tabela exibida e o CSV exportado fiquem sempre idênticos (RN-003).

## Portas para efeitos colaterais do browser

Nem toda porta em `domain/repositories/` é um repositório de dados — `IArquivoDownloader` (`domain/repositories/IArquivoDownloader.ts`) abstrai o download de arquivo pelo browser (`Blob` + `URL.createObjectURL` + `<a download>`), implementado em `infrastructure/BlobArquivoDownloader.ts`. O use case (`ExportarRelatorio`) monta o conteúdo e delega a entrega à porta, sem acoplar `application/` a APIs de browser. Use esse padrão para qualquer efeito colateral de plataforma (download, clipboard, notificação) que um use case precise disparar.

## TypeScript: `erasableSyntaxOnly`

`tsconfig.app.json` habilita `erasableSyntaxOnly`, que **proíbe parameter properties** (`constructor(private readonly x: T)`). Toda classe do projeto (use cases, repositórios) declara o campo e o atribui explicitamente no construtor, como no exemplo acima — nunca como atalho no parâmetro. `verbatimModuleSyntax: true` também exige `import type { ... }` para imports usados só como tipo, e `noUnusedLocals`/`noUnusedParameters` quebram o build com variáveis não usadas.

## Hooks

`presentation/hooks/` reúne hooks reutilizáveis por telas e pelo `AppLayout`. O design system não exporta hooks — responsividade é implementada localmente no projeto.

`useMediaQuery(query: string): boolean` usa `window.matchMedia` + `useSyncExternalStore` (evita flash de layout incorreto na hidratação; snapshot de servidor retorna `false`). O projeto usa um único breakpoint — `(min-width: 1024px)` — como fonte de verdade para "desktop" vs. "mobile"; todo componente responsivo (`AppHeader`, `NavbarTab`, `DoubleColumn`, ...) consome o mesmo valor derivado dessa única chamada, feita uma vez por componente que precisa dele.

## Dados de Mock

`src/mocks/` reúne dados de demonstração usados para popular telas antes de (ou no lugar de) uma fonte de dados real. Apenas `empreendimentos.ts` gera dados sintéticos, com `@faker-js/faker` (locale `pt_BR`) e `faker.seed(42)` no topo do módulo, garantindo saída determinística. `dashboard.ts` e `relatorios.ts` usam dados **literais**, extraídos diretamente do Figma (não gerados) — precedente aberto pelo Dashboard e seguido por Relatórios, para que os valores exibidos batam exatamente com o design.

| Arquivo | Exporta | Dados | Origem |
|---------|---------|-------|--------|
| `dashboard.ts` | `fetchDashboardData()` | `DashboardData`: 6 KPIs, evolução de custo por mês, avanço previsto vs. realizado por obra, indicadores por etapa e materiais críticos | Literal (Figma) |
| `empreendimentos.ts` | `fetchEmpreendimentos()` | 10 `Empreendimento` (nome, e-mail, CEP, endereço, proprietário, tipo) | `@faker-js/faker` |
| `relatorios.ts` | `fetchObras()`, `fetchLancamentos()` | 10 `Obra` e 10 `LancamentoFinanceiro` | Literal (Figma) |
| `types.ts` | os tipos dos três módulos, todos reexportados de `domain/` | — | — |

As funções são `async` e retornam o array já materializado — a assinatura imita uma chamada de rede para que a troca por uma fonte real não mude o call site.

Ressalvas:

1. **Não passa pelo container (Empreendimento).** `fetchEmpreendimentos()` não implementa `IEmpreendimentoRepository` e não é injetado via `useContainer()` — é dado de protótipo visual, independente do `InMemoryEmpreendimentoRepository` real usado pela tela `AdicionarEmpreendimento`. Já `dashboard.ts` e `relatorios.ts` **passam pelo container**: `InMemoryDashboardRepository` e `InMemoryRelatorioRepository` chamam essas funções internamente e são injetados via `useContainer()` — as telas `Dashboard` e `Relatorios` sempre acessam os dados através do use case, nunca importando o mock diretamente.
2. **Vocabulário totalmente reconciliado com `domain/`.** `mocks/types.ts` reexporta `TipoEmpreendimento`, `Empreendimento` e `CreateEmpreendimentoInput` de `domain/Empreendimento.ts`, e `Obra`, `LancamentoFinanceiro`, `FiltroRelatorio` de `domain/Relatorio.ts` — fonte única de verdade para todas as telas. Não há mais tipos declarados exclusivamente em `mocks/`.
3. **`@faker-js/faker` é uma dependência de runtime**, não de desenvolvimento — enquanto `empreendimentos.ts` for importado por código de tela, o faker entra no bundle de produção.

Quando `AdicionarEmpreendimento` deixar de depender do mock diretamente, ele segue o mesmo caminho já percorrido por Dashboard e Relatórios: o mock vira a fonte de uma implementação de repositório em `infrastructure/` e a tela passa a consumir o use case. Ver [ADR-0003](../meta/adr/0003-principios-solid-e-arquitetura-limpa.md).

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
