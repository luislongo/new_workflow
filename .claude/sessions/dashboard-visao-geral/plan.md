# DASHBOARD — VISÃO GERAL DE OBRAS

Se você está trabalhando nesta funcionalidade, certifique-se de atualizar este arquivo plan.md conforme progride.

## Descoberta de Componentes

**Figma URL (Desktop):** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/MBA?node-id=413-235&m=dev
**Figma URL (Mobile):** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/MBA?node-id=478-1275&m=dev

> ⚠️ As URLs estavam **invertidas** no `context.md` original. `413-235` é o frame `Desktop`; `478-1275` é o frame `mobile-dashboard`. Já corrigido em `context.md` e `design-discovery.md`.

| Componente (Figma) | Node ID | Componente DS (`@luislongo/ds-core`) | Code Connect | Observações |
|--------------------|---------|--------------------------------------|--------------|-------------|
| ContentRow | `429:6061` (desktop) / `I478:1397;470:846;546:12598` (mobile) | `<ContentRow layout />` | ✅ Mapeado | `layout="desktop" \| "mobile"` |
| InfoCard ×6 | `I429:6061;473:80;429:6169`…`6174` | `<InfoCard color icon layout />` | ✅ Mapeado | Cores: red, cyan, purple, amber, lime, slate |
| ContentGrid | `470:938` (desktop) / `478:1397` (mobile) | `<ContentGrid layout />` | ✅ Mapeado | Flex-wrap, **não** CSS grid |
| GraphCard ×4 | `I470:938;470:842;470:1047 / :1111 / :1175 / :1239` | `<GraphCard titulo />` | ✅ Mapeado | `titulo` + `children` |
| AreaChart | `I470:938;470:842;470:1047;464:184;429:6677` | `<AreaChart data series />` | ✅ Mapeado | Dados literais no snippet |
| BarChart | `I470:938;470:842;470:1111;464:184;429:6737` | `<BarChart data series />` | ✅ Mapeado | Dados literais no snippet |
| LineChart | `I470:938;470:842;470:1175;464:184;429:6811` | `<LineChart data series />` | ✅ Mapeado | Dados literais no snippet |
| ProductTable | `I470:938;470:842;470:1239;464:184;429:6943` | `<ProgressTable data />` | ✅ Mapeado | **Não usar** — cabeçalhos hardcoded (`#/Name/Popularity/Sales`), não aceita `Material/Estoque/Uso`. Compor com primitivos. |
| ProgressBar ×4 | `…;461:1616/1624/1632/1640;455:1450;558:277x` | `<ProgressBar value color />` | ✅ Mapeado | `value: number`, `color: DataVizColor` |
| ProgressChip ×4 | `…;461:1620/1628/1636/1644;455:1450;493:209x` | `<ProgressChip value color />` | ✅ Mapeado | `value: string` — formatar `"82%"` |
| Header Cells | `…;429:6943;461:1490/1493/1496/1499` | `<TableHeaderRow />` + `<TableHeaderCell />` | ✅ Mapeado | `children` **obrigatório** em `TableHeaderRow` |
| Row Cells | `…;429:6943;461:1506/1510/1616/1620` | `<TableRow />` + `<TableRowCell alignment />` | ✅ Mapeado | `children` **obrigatório** em `TableRow` |
| AppHeader / Navbar / NavbarTab | `413:236` / `478:1276` | `<AppHeader />` etc. | ✅ Mapeado | Já implementado em `AppLayout.tsx` |
| H1 | `413:366` / `478:1296` | `<H1 />` | ✅ Mapeado | Título "Dashboard" |

### Divergências Figma × spec — resolvidas

| # | Divergência | Resolução |
|---|-------------|-----------|
| D1 | URLs Desktop/Mobile trocadas no `context.md` | Corrigido: `413-235` = Desktop, `478-1275` = Mobile |
| D2 | `context.md` req. 3 diz "Mobile: coluna única". O Figma mobile mostra os **6 InfoCards em 2 linhas de 3** (`ContentRow` mobile é `flex-wrap`) | **Figma vence.** KPIs em flex-wrap; os 4 GraphCards sim em coluna única |
| D3 | No mobile o `ContentRow` fica **dentro** do `ContentGrid` (1º filho); no desktop são **irmãos** | Replicar a estrutura do Figma (JSX condicional por `layout`) |
| D4 | CA-002 de US-005 exige 12 meses; o Code Connect entrega **11 pontos** (Ago ausente) | **Decisão do usuário:** 11 pontos, fiel ao Code Connect. CA-002 corrigido no `context.md` |
| D5 | As 4 `ProgressBar` de Estoque estão todas em `value=60` no Figma (placeholder) | **Decisão do usuário:** usar `60 / 40 / 25 / 35` (campo `popularity` do `ProgressTable` do DS) |
| D6 | Figma renderiza os InfoCards como círculo sólido sem glifo; só o 1º tem ícone (`IconSupervisedUserCircle`), os outros caem no default `IconAcUnit` (floco de neve) | **Decisão do usuário:** 6 ícones semânticos do DS (tabela na FASE 3) |
| D7 | `AreaChart` tem **8 pontos** (Jan–Ago), não 12 | Fiel ao Code Connect: 8 pontos |

### Dados literais extraídos do Code Connect

Fonte autoritativa para a FASE 2. Não inventar valores.

**`evolucaoCusto`** — 8 pontos:
```
Jan 160/360 · Fev 220/300 · Mar 80/320 · Abr 80/260
Mai 130/340 · Jun 120/280 · Jul 220/200 · Ago 220/210      (mesAnterior/mesAtual)
```

**`avancoPorObra`** — 7 obras (previsto/realizado):
```
Res. Aurora 14000/12000 · Ed. Central 16000/11000 · Cond. Parque 6000/22000
Torre Norte 15000/5000 · Vila Verde 12000/11000 · Lot. Sol 15000/13000
Pq. Industrial 21000/10000
```

**`indicadoresObra`** — 11 pontos, **sem Ago** (acabamento/estrutura/fundacao):
```
Jan 330/260/340 · Fev 300/250/300 · Mar 320/220/320 · Abr 250/200/240
Mai 210/215/215 · Jun 220/260/260 · Jul 260/310/330 · Set 310/310/310
Out 270/280/200 · Nov 130/110/150 · Dez 150/90/230
```

**`materiaisCriticos`** — estoque / uso:
```
1 Cimento CP-II 60/82 · 2 Aço CA-50 (vergalhão) 40/64
3 Concreto Usinado 25/41 · 4 Blocos Cerâmicos 35/73
```

**Cores de série:** `CHART_COLORS` do DS é `["#0095ff", "#00e096", "#a700ff", …]`. Os gráficos de 2 séries (Area, Bar) podem **omitir** `color` — o default já bate com o Figma. O `LineChart` **precisa** de cores explícitas: `#a700ff` (Acabamento), `#ef4444` (Estrutura), `#3cd856` (Fundação), porque o 2º e 3º defaults não correspondem.

---

## FASE 1 — Fundação: domínio, aplicação e infraestrutura [Concluída ✅]

Cria a espinha dorsal de dados seguindo o padrão já estabelecido por `CreateEmpreendimento` / `InMemoryEmpreendimentoRepository`. Nenhuma UI nesta fase. **Gate:** `npm run build` passa.

Todas as tarefas desta fase são **sequenciais** (cada camada depende da anterior).

### Criar `src/domain/Dashboard.ts` [Não Iniciada ⏳]

Mover as entidades de `src/mocks/types.ts` para o domínio, **sem `deltaPositivo`** em `KpiIndicador` (o `InfoCard` não suporta essa semântica, e no Figma o delta negativo "−8% vs. planejado" usa a mesma cor dos positivos).

Entidades: `KpiIndicador`, `PontoEvolucaoCusto`, `PontoAvancoPorObra`, `PontoIndicadorObra`, `MaterialCritico`, `DashboardData`. Campos `readonly`, seguindo `Empreendimento.ts`.

### Criar `src/domain/repositories/IDashboardRepository.ts` [Não Iniciada ⏳]

Porta de saída com um único método `getDashboardData(): Promise<DashboardData>`.

### Atualizar `src/domain/index.ts` [Não Iniciada ⏳]

Reexportar as entidades de `Dashboard.ts` e o tipo `IDashboardRepository`, com `export type` (exigido por `verbatimModuleSyntax`).

### Criar `src/application/usecases/GetDashboardData.ts` [Não Iniciada ⏳]

Classe com um único método público `execute(): Promise<DashboardData>` delegando ao repositório. Campo `private readonly repository` **declarado e atribuído no corpo do construtor** — `erasableSyntaxOnly` proíbe parameter properties.

### Atualizar `src/application/usecases/index.ts` e `src/application/IContainer.ts` [Não Iniciada ⏳]

Reexportar `GetDashboardData` e adicionar `getDashboardData: GetDashboardData` à interface `IContainer`.

### Criar `src/infrastructure/repositories/InMemoryDashboardRepository.ts` [Não Iniciada ⏳]

Implementa `IDashboardRepository` delegando a `fetchDashboardData()` de `src/mocks/dashboard.ts`. Wrapper fino — não há lógica de negócio. Reexportar em `repositories/index.ts`.

### Atualizar `src/infrastructure/container.ts` [Não Iniciada ⏳]

Instanciar `InMemoryDashboardRepository` e injetar em `new GetDashboardData(...)`.

---

## FASE 2 — Mock com valores literais do Figma [Concluída ✅]

Substitui o `faker` por exatamente os números do Code Connect (tabela acima). Depende da FASE 1 (os tipos passam a vir do domínio). **Gate:** `npm run build` passa e `fetchDashboardData()` devolve as contagens corretas (8 / 7 / 11 / 4).

### Reescrever `src/mocks/dashboard.ts` [Não Iniciada ⏳]

Remover `import { faker }` e `faker.seed(42)` **apenas deste arquivo** — `empreendimentos.ts` e `relatorios.ts` continuam usando faker, então a dependência permanece no `package.json`.

Preencher os 4 conjuntos com os literais da seção "Dados literais extraídos do Code Connect". Os 6 KPIs já estão literais no arquivo atual — apenas remover o campo `deltaPositivo` de cada um.

Atenção às constantes: `MESES` e `OBRAS` no topo do arquivo hoje geram 12 e 7 entradas. `evolucaoCusto` usa 8 meses e `indicadoresObra` 11 (sem Ago) — as listas deixam de ser reaproveitáveis como estão.

### Atualizar `src/mocks/types.ts` [Não Iniciada ⏳]

Remover as definições locais duplicadas das 6 entidades de dashboard e reexportá-las de `../domain/Dashboard` — mesmo padrão já usado ali para `Empreendimento`. As interfaces de Relatórios (`Obra`, `LancamentoFinanceiro`, `FiltroRelatorio`) permanecem locais.

---

## FASE 3 — Tela, rota e navegação: faixa de KPIs [Concluída ✅]

Primeira fase com resultado visível no navegador. Depende das FASES 1 e 2. **Gate:** `/dashboards` abre, mostra o H1 e os 6 KPIs na ordem e cores do Figma; a aba "Dashboards" fica ativa; "Empreendimento" ainda navega.

### Criar `src/presentation/screens/Dashboard/Dashboard.tsx` + `index.ts` [Não Iniciada ⏳]

Named export, seguindo `AdicionarEmpreendimento.tsx`: `useContainer()` para o use case, `useMediaQuery("(min-width: 1024px)")` → `const size = isDesktop ? "desktop" : "mobile"`.

Estado local `data: DashboardData | null`, carregado em `useEffect`. Sem loading/vazio/erro — retornar `null` enquanto `data` for `null`.

Nesta fase renderizar só `<H1>Dashboard</H1>` + `<ContentRow layout={size}>` com os 6 `<InfoCard>`. Mapeamento: `label → description`, `valor → mainValue`, `delta → subtitles`.

### Declarar o mapa `id → {color, icon}` em `presentation/` [Não Iniciada ⏳]

Constante no próprio `Dashboard.tsx` (ou arquivo irmão) — **nunca** em `domain/`, que não conhece o DS.

| `id` | `color` | `icon` |
|------|---------|--------|
| `obras-ativas` | `red` | `IconApartment` |
| `custo-total` | `cyan` | `IconAttachMoney` |
| `etapas-concluidas` | `purple` | `IconAssignmentTurnedIn` |
| `orcamento-livre` | `amber` | `IconAccountBalanceWallet` |
| `equipes-campo` | `lime` | `IconBusinessCenter` |
| `progresso-geral` | `slate` | `IconDonutLarge` |

Os 6 ícones foram verificados como existentes no DS. Confirmar no build — `IconEngineering`, `IconConstruction`, `IconGroups` e `IconInventory` **não existem**, evitar substituições ad-hoc.

### Atualizar `src/App.tsx` [Não Iniciada ⏳]

Adicionar `<Route path="/dashboards" element={<Dashboard />} />` e trocar o redirect de `/` de `/empreendimento` para `/dashboards`.

### Atualizar `src/presentation/components/AppLayout/AppLayout.tsx` [Não Iniciada ⏳]

Na `NavbarTab` "Dashboards": remover `disabled`, adicionar `active={pathname === "/dashboards"}` e `onClick={() => navigate("/dashboards")}`. "Relatórios" permanece `disabled`.

### Ajustar dimensões dos InfoCards [Não Iniciada ⏳]

O `InfoCard` do DS tem largura **fixa** `w-4000` (160px) e, no desktop, `h-4000` (160px) — enquanto o `ContentRow` desktop é `h-[140px]` com `overflow-hidden`. No Figma os cards desktop são 246×140 e ocupam a linha inteira em `flex-1`.

Passar `className` de override em cada `InfoCard` (ex.: `flex-1 min-w-0 h-full` no desktop) para que os 6 preencham a faixa sem estourar a altura. No mobile o Figma mostra 3 por linha em 704px; como `ContentRow` mobile já é `flex-wrap`, usar uma largura flexível com `min-width` em vez de fração fixa, para degradar bem abaixo de 704px.

---

## FASE 4 — Três gráficos no ContentGrid [Concluída ✅]

Depende da FASE 3. Pode ser feita **em paralelo com a FASE 5** por outra pessoa, desde que a estrutura do `ContentGrid` seja criada antes (é o mesmo arquivo — coordenar para evitar conflito).

**Gate:** os 3 cards aparecem com os títulos corretos, séries distinguíveis por cor e legenda interna do recharts; comparação visual com o frame desktop do Figma.

### Montar o `ContentGrid` com larguras 2×2 [Não Iniciada ⏳]

`ContentGrid` é `flex flex-wrap gap-400`, **não** CSS grid — o 2×2 só acontece se cada filho declarar largura. No Figma desktop: 1557px de faixa, gap 16px, cards de 770.5px → `className="w-[calc(50%-8px)]"` nos `GraphCard` quando `size === "desktop"`. No mobile, largura total (coluna única).

### Adicionar os 3 GraphCards com seus gráficos [Não Iniciada ⏳]

- `<GraphCard titulo="Evolução do Custo">` + `<AreaChart>` — séries `mesAnterior` → "Mês Anterior", `mesAtual` → "Mês Atual"
- `<GraphCard titulo="Avanço por Obra">` + `<BarChart>` — séries `previsto` → "Previsto", `realizado` → "Realizado"
- `<GraphCard titulo="Indicadores de Obra">` + `<LineChart>` — séries `acabamento` → "Acabamento" `#a700ff`, `estrutura` → "Estrutura" `#ef4444`, `fundacao` → "Fundação" `#3cd856`

Area e Bar podem omitir `color` (defaults `#0095ff` / `#00e096` já batem com o Figma). O LineChart **não** — ver nota em "Cores de série".

### Normalizar as chaves para `name` [Não Iniciada ⏳]

`ChartDataPoint` exige literalmente a chave `name`. Mapear na camada de apresentação: `mes → name` (Evolução do Custo e Indicadores de Obra) e `nomeObra → name` (Avanço por Obra). O domínio mantém os nomes semânticos.

### Verificar altura dos cards [Não Iniciada ⏳]

Os gráficos têm altura fixa (Area 258px, Bar 240px, Line 238px) dentro de um `ResponsiveContainer`, e o contêiner interno do `GraphCard` é `overflow-y-auto`. No Figma os 4 cards desktop têm 340px. Conferir se a altura natural fecha; só forçar `h-[340px]` se os cards ficarem desalinhados no wrap.

---

## FASE 5 — Tabela de Materiais Críticos [Concluída ✅]

Depende da FASE 4 (estrutura do `ContentGrid`). **Gate:** 4 linhas com `#`, `Material`, `Estoque` (barra proporcional) e `Uso` (chip com `%`), nas cores blue/green/purple/orange.

### Verificar a marcação dos primitivos de tabela [Não Iniciada ⏳]

**Fazer antes de escrever o JSX.** Ler `design_system/src/components/table/` para descobrir se `TableHeaderRow` / `TableRow` renderizam `<tr>` (exigindo um `<table>`/`<tbody>` em volta) ou `<div>`. `TableRowProps.children` e `TableHeaderRowProps.children` são **obrigatórios** — não podem ficar vazios.

### Compor a tabela dentro do `GraphCard titulo="Materiais Críticos"` [Não Iniciada ⏳]

`TableHeaderRow` com 4 `TableHeaderCell`: `#`, `Material`, `Estoque`, `Uso`. Uma `TableRow` por material com 4 `TableRowCell`:

1. rank formatado com zero à esquerda (`"01"`…`"04"`)
2. `nome`
3. `<ProgressBar value={estoquePercent} color={cor} />`
4. `<ProgressChip value={`${usoPercent}%`} color={cor} />` — `value` é **string**

`ProgressTable` **não é usado**: recebe apenas `data` e tem os cabeçalhos do template (`#/Name/Popularity/Sales`) fixos, incompatíveis com `Material/Estoque/Uso`.

### Aplicar a cor por posição de índice [Não Iniciada ⏳]

Array `["blue", "green", "purple", "orange"]` tipado como `DataVizColor[]`, indexado pela posição da linha (não pelo `rank`). Mesma cor para a `ProgressBar` e o `ProgressChip` da linha.

---

## FASE 6 — Responsividade e conferência visual [Concluída ✅]

Depende das FASES 3–5. **Gate:** comparação lado a lado com os dois frames do Figma, em ≥1024px e <1024px.

### Implementar a estrutura mobile do Figma [Não Iniciada ⏳]

No desktop, `ContentRow` e `ContentGrid` são **irmãos**. No mobile, o `ContentRow` é o **primeiro filho do `ContentGrid`** (ver D3). Renderizar condicionalmente por `size`, mantendo a ordem dos blocos: KPIs → Evolução do Custo → Avanço por Obra → Indicadores de Obra → Materiais Críticos.

### Conferir o InfoCard no mobile [Não Iniciada ⏳]

O DS **só renderiza `subtitles` no layout desktop** — no mobile o delta some, exatamente como no Figma. Confirmar que o card fica na proporção 224×60 do design e que a linha quebra em 3+3 a 736px.

### Comparação visual contra o Figma [Não Iniciada ⏳]

`npm run dev` e conferir contra os dois frames: ordem e cores dos 6 KPIs, títulos dos 4 cards, séries e legendas dos 3 gráficos, as 4 linhas da tabela. Não há test runner no projeto — a verificação no navegador é o único gate real de comportamento.

### Rodar `npm run build` e `npm run lint` [Não Iniciada ⏳]

`noUnusedLocals` / `noUnusedParameters` quebram o build com qualquer sobra de código — atenção a imports e variáveis deixados para trás na remoção do `faker` e do `deltaPositivo`.
