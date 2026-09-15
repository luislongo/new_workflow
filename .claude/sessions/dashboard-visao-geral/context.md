# Contexto: Dashboard — Visão Geral de Obras

## Objetivo

Implementar a tela principal da Plataforma Visus em `/dashboards`, exibindo uma visão consolidada do portfólio: faixa de 6 KPIs, três gráficos analíticos e uma tabela de materiais críticos. Sem filtros, sem drill-down, sem API.

## Requisitos

1. Faixa de 6 KPIs no topo via `ContentRow` + 6 × `InfoCard`.
2. Grid 2×2 de gráficos via `ContentGrid`: Evolução do Custo (`AreaChart`), Avanço por Obra (`BarChart`), Indicadores de Obra (`LineChart`), Materiais Críticos (tabela composta).
3. Breakpoint único `≥1024px` → `layout="desktop"`, `<1024px` → `layout="mobile"`. Mobile: os 4 `GraphCard` em coluna única; os 6 `InfoCard` em flex-wrap (3 por linha a 736px), conforme o frame mobile do Figma. Mesma ordem dos blocos.
4. Apenas estado Default (dados carregados). Estados Vazio e Erro estão **fora do escopo**.
5. Sem estado de loading — nada renderizado até os dados chegarem.
6. Mock com valores literais do Figma — sem `faker` para o dashboard.
7. Cor dos InfoCards por KPI (mapa `id → color` em `presentation/`): red, cyan, purple, amber, lime, slate.
8. Tabela de Materiais Críticos composta com primitivos do DS (`TableHeaderRow`/`TableHeaderCell`/`TableRow`/`TableRowCell` + `ProgressBar` + `ProgressChip`). `ProgressTable` **não é usado**.
9. Cor de linha por posição de índice: 1 → blue, 2 → green, 3 → purple, 4 → orange (`DataVizColor`).

## Critérios de Aceite

### US-001 — Visualizar KPIs do portfólio
- [CA-001] 6 KPIs exibidos com valor principal, label e variação.
- [CA-002] Ordem fixa dos KPIs conforme o design, independente de valores nulos.

### US-003 — Evolução do Custo
- [CA-001] `GraphCard` com título "Evolução do Custo" + `AreaChart` com séries "Mês Anterior" e "Mês Atual".
- [CA-002] Séries visualmente distinguíveis por cor.
- [CA-003] Legenda renderizada internamente pelo recharts (sem código extra).

### US-004 — Avanço por Obra
- [CA-001] `GraphCard` com título "Avanço por Obra" + `BarChart` com séries "Previsto" e "Realizado".
- [CA-002] Nome de cada obra no eixo da categoria.
- [CA-003] Legenda interna.

### US-005 — Indicadores de Obra
- [CA-001] `GraphCard` com título "Indicadores de Obra" + `LineChart` com três séries: Acabamento, Estrutura, Fundação.
- [CA-002] Eixo de tempo com 11 pontos: Jan, Fev, Mar, Abr, Mai, Jun, Jul, Set, Out, Nov, Dez — **sem Ago**, fiel ao snippet de Code Connect do Figma.
- [CA-003] Legenda interna.

### US-006 — Materiais Críticos
- [CA-001] `GraphCard` com título "Materiais Críticos" + tabela com colunas `#`, `Material`, `Estoque`, `Uso`.
- [CA-002] Estoque como `ProgressBar` proporcional ao percentual: `60 / 40 / 25 / 35` (campo `popularity` do `ProgressTable` do DS — no frame do Figma as 4 barras estão em `60` como placeholder).
- [CA-003] Uso como `ProgressChip` com valor formatado (`"82%"`).
- [CA-004] Cor por rotação de posição: 1 → blue, 2 → green, 3 → purple, 4 → orange.

### US-007 — Navegação
- [CA-001] Barra de navegação com "Empreendimento", "Dashboards" e "Relatórios".
- [CA-002] Aba "Dashboards" ativa em `/dashboards`.
- [CA-003] "Empreendimento" navega para `/empreendimento`; "Relatórios" permanece `disabled`.

## Restrições e Premissas

- **Estados Vazio e Erro removidos** — repositório in-memory sempre devolve dados; sem mecanismo de acionamento, seriam código morto não verificável.
- **Sem loading state** — mock resolve imediatamente; não há Skeleton no DS.
- **`erasableSyntaxOnly`** — proíbe parameter properties; campos atribuídos no corpo do construtor.
- **`verbatimModuleSyntax`** — exige `import type` para importações de tipo.
- **`noUnusedLocals/Parameters`** — quebram o build; não deixar variáveis não utilizadas.
- **`presentation` nunca importa de `infrastructure`**.
- **`deltaPositivo` removido** de `KpiIndicador` — `InfoCard` não suporta essa semântica.
- **`ProgressChip.value` é `string`** — percentuais precisam ser formatados antes de passar (ex.: `"82%"`).
- **Mapeamento `KpiIndicador → InfoCard`**: `label → description`, `valor → mainValue`, `delta → subtitles`. Ícones e cores definidos em `/plan` via Figma Code Connect.

## Design

- **Figma URL (Desktop):** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/MBA?node-id=413-235&m=dev
- **Figma URL (Mobile):** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/MBA?node-id=478-1275&m=dev

> As URLs estavam invertidas nesta seção: `413-235` é o frame `Desktop` e `478-1275` é o `mobile-dashboard`. Corrigido durante `/plan`.

- **Estrutura mobile:** no frame mobile o `ContentRow` dos KPIs é o **primeiro filho do `ContentGrid`**; no desktop os dois são irmãos. Replicar a estrutura do Figma.
- **Ícones dos KPIs:** o Figma renderiza círculo sólido sem glifo. Usar 6 ícones semânticos existentes no DS — mapa em `plan.md`, FASE 3.
