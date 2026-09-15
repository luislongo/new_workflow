# Notas Arquiteturais: Dashboard — Visão Geral de Obras

## Decisões Relevantes

- **ADR-0003 (Clean Architecture):** mesmo padrão de `AdicionarEmpreendimento` — todas as quatro camadas.
- **ADR-0004 (Design System):** `@luislongo/ds-core` via Code Connect; nunca reimplementar primitivos disponíveis no DS.
- **`erasableSyntaxOnly`:** campos de classe atribuídos no corpo do construtor (nunca parameter properties).
- **`verbatimModuleSyntax`:** `import type` obrigatório para importações de tipo.
- **Breakpoint único:** `useMediaQuery("(min-width: 1024px)")` → `size = "desktop" | "mobile"`, repassado como `layout` aos componentes do DS.

## Arquivos a Criar / Modificar

| Camada | Arquivo | Ação |
|--------|---------|------|
| `domain` | `src/domain/Dashboard.ts` | **Criar** — entidades `KpiIndicador`, `PontoEvolucaoCusto`, `PontoAvancoPorObra`, `PontoIndicadorObra`, `MaterialCritico`, `DashboardData` |
| `domain` | `src/domain/repositories/IDashboardRepository.ts` | **Criar** — porta de saída com `getDashboardData(): Promise<DashboardData>` |
| `domain` | `src/domain/index.ts` | **Atualizar** — reexportar de `Dashboard.ts` |
| `application` | `src/application/usecases/GetDashboardData.ts` | **Criar** — `execute()` delega ao repositório |
| `application` | `src/application/IContainer.ts` | **Atualizar** — adicionar `getDashboardData: GetDashboardData` |
| `application` | `src/application/index.ts` | **Atualizar** — reexportar use case |
| `infrastructure` | `src/infrastructure/repositories/InMemoryDashboardRepository.ts` | **Criar** — implementa `IDashboardRepository`; lê de `src/mocks/dashboard.ts` |
| `infrastructure` | `src/infrastructure/container.ts` | **Atualizar** — instanciar e injetar |
| `infrastructure` | `src/infrastructure/index.ts` | **Atualizar** — reexportar repositório |
| `mocks` | `src/mocks/dashboard.ts` | **Atualizar** — trocar `faker` por valores literais do Figma; remover `deltaPositivo` de `KpiIndicador` |
| `mocks` | `src/mocks/types.ts` | **Atualizar** — reexportar entidades de `domain/Dashboard.ts` (remover definições locais duplicadas) |
| `presentation` | `src/presentation/screens/Dashboard/Dashboard.tsx` | **Criar** |
| `presentation` | `src/presentation/screens/Dashboard/index.ts` | **Criar** — re-export público |
| `App.tsx` | `src/App.tsx` | **Atualizar** — rota `/dashboards` → `<Dashboard />`; `/` redireciona para `/dashboards` |
| `AppLayout.tsx` | `src/presentation/components/AppLayout/AppLayout.tsx` | **Atualizar** — aba "Dashboards": remover `disabled`, adicionar `active` e `onClick` |

## Pontos de Integração

### Componentes do DS utilizados

| Componente | Props relevantes |
|------------|-----------------|
| `ContentRow` | `layout`, `children` |
| `ContentGrid` | `layout`, `children` |
| `InfoCard` | `color`, `icon`, `mainValue`, `description`, `subtitles`, `layout` |
| `GraphCard` | `titulo`, `children` |
| `AreaChart` | `data: ChartDataPoint[]`, `series: ChartSeries[]` |
| `BarChart` | `data: ChartDataPoint[]`, `series: ChartSeries[]` |
| `LineChart` | `data: ChartDataPoint[]`, `series: ChartSeries[]` |
| `TableHeaderRow` | `children` |
| `TableHeaderCell` | `children` |
| `TableRow` | `children` |
| `TableRowCell` | `children`, `alignment` |
| `ProgressBar` | `value: number`, `color?: DataVizColor` |
| `ProgressChip` | `value: string`, `color?: DataVizColor` |

### Mapeamentos críticos

- **`ChartDataPoint`** exige chave `name` — normalizar `mes` e `nomeObra` para `name` na camada de apresentação.
- **`InfoCard`**: `label → description`, `valor → mainValue`, `delta → subtitles`. Ícones definidos em `/plan`.
- **`ProgressChip.value`** é `string` — formatar percentual antes de passar (ex.: `"${material.usoPercent}%"`).
- **Mapa cor/ícone por KPI** (`id → {color, icon}`) declarado em `presentation/` (nunca em `domain/`).

## Considerações Técnicas

- `InMemoryDashboardRepository` lê diretamente de `src/mocks/dashboard.ts`. Como não há lógica de negócio extra, `execute()` é um wrapper fino.
- Não há estado de loading nem estados Vazio/Erro — a tela só renderiza quando `data` não é `null`.
- `AdicionarEmpreendimento` mantém seu próprio `max-w-[800px]` como wrapper interno; `AppLayout.main` já é `flex-1 w-full` no branch atual — nenhuma alteração de layout necessária.
