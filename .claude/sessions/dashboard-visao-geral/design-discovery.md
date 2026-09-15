# Descoberta de Componentes: Dashboard — Visão Geral de Obras

## URL do Design Figma

- **Desktop:** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/MBA?node-id=413-235&m=dev
- **Mobile:** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/MBA?node-id=478-1275&m=dev

> As URLs estavam invertidas na versão original deste arquivo e do `context.md`. O frame `413-235` chama-se `Desktop`; o frame `478-1275` chama-se `mobile-dashboard`.

Os arquivos `.figma.tsx` de Code Connect vivem no repositório do design system (`design_system/src/components/<categoria>/<Componente>/`), não neste repositório. O `figma.config.json` da raiz está vazio por isso.

## Componentes Identificados

| Componente (Figma) | Node ID | Componente DS (`@luislongo/ds-core`) | Code Connect | Observações |
|--------------------|---------|--------------------------------------|--------------|-------------|
| AppHeader | `413:236` / `478:1276` | `<AppHeader size title icon navbar avatar />` | ✅ Mapeado | Já implementado em `AppLayout.tsx` |
| Navbar / NavbarTab | dentro do AppHeader | `<Navbar>` + `<NavbarTab size label icon active onClick />` | ✅ Mapeado | `Navbar` descarta a própria prop `size` — passar em cada tab |
| H1 | `413:366` / `478:1296` | `<H1>Dashboard</H1>` | ✅ Mapeado | — |
| ContentRow | `429:6061` / `I478:1397;470:846;546:12598` | `<ContentRow layout />` | ✅ Mapeado | Desktop `h-[140px] overflow-hidden`; mobile `flex-wrap` |
| InfoCard ×6 | `I429:6061;473:80;429:6169` … `429:6174` | `<InfoCard color icon layout mainValue description subtitles />` | ✅ Mapeado | Cores na ordem: red, cyan, purple, amber, lime, slate. `subtitles` só renderiza no desktop. Largura fixa `w-4000` — exige override |
| ContentGrid | `470:938` / `478:1397` | `<ContentGrid layout />` | ✅ Mapeado | `flex flex-wrap`, **não** CSS grid — filhos precisam declarar largura |
| GraphCard ×4 | `I470:938;470:842;470:1047` / `:1111` / `:1175` / `:1239` | `<GraphCard titulo />` | ✅ Mapeado | Títulos: Evolução do Custo, Avanço por Obra, Indicadores de Obra, Materiais Críticos |
| AreaChart | `…;470:1047;464:184;429:6677` | `<AreaChart data series />` | ✅ Mapeado | Altura fixa 258px. Snippet traz 8 pontos literais |
| BarChart | `…;470:1111;464:184;429:6737` | `<BarChart data series />` | ✅ Mapeado | Altura fixa 240px. Snippet traz 7 categorias literais |
| LineChart | `…;470:1175;464:184;429:6811` | `<LineChart data series />` | ✅ Mapeado | Altura fixa 238px. Snippet traz 11 pontos (sem Ago) |
| ProductTable | `…;470:1239;464:184;429:6943` | `<ProgressTable data />` | ⚠️ Mapeado, **não usar** | Cabeçalhos fixos `#/Name/Popularity/Sales`; não aceita `Material/Estoque/Uso`. Compor com primitivos |
| Header Cells ×4 | `…;429:6943;461:1490` / `1493` / `1496` / `1499` | `<TableHeaderRow>` + `<TableHeaderCell>` | ✅ Mapeado | `children` obrigatório em `TableHeaderRow` |
| Number / Name Cell | `…;461:1506` / `1510` (e pares por linha) | `<TableRow>` + `<TableRowCell alignment />` | ✅ Mapeado | `children` obrigatório em `TableRow` |
| ProgressBar ×4 | `…;461:1616/1624/1632/1640;455:1450;558:277x` | `<ProgressBar value color />` | ✅ Mapeado | `value: number` (clamp 0–100), `color: DataVizColor` |
| ProgressChip ×4 | `…;461:1620/1628/1636/1644;455:1450;493:209x` | `<ProgressChip value color />` | ✅ Mapeado | `value` é **string** — formatar `"82%"` |

## Componentes sem Code Connect

Nenhum. Todos os componentes do design estão mapeados no DS — nada precisa ser criado na aplicação.

## Tokens e tipos relevantes

- `DataVizColor = "blue" | "green" | "purple" | "orange"` (`dist/tokens/dataviz.d.ts`)
- `InfoCardColor = "red" | "cyan" | "purple" | "amber" | "lime" | "slate"`
- `ChartDataPoint` exige literalmente a chave `name`; `ChartSeries = { key, name, color? }`
- `CHART_COLORS = ["#0095ff", "#00e096", "#a700ff", "#ef4444", "#3cd856", "#ff9f43", "#ee5a24"]`
- `icon` do `InfoCard` é `ReactNode` livre (sem enum); o default é `IconAcUnit`
