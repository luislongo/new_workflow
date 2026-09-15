# RELATÓRIOS

Se você está trabalhando nesta funcionalidade, certifique-se de atualizar este arquivo plan.md conforme progride.

## Descoberta de Componentes

**Figma URL (Desktop — Obras):** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/MBA?node-id=479-1566&m=dev
**Figma URL (Desktop — Financeiro):** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/MBA?node-id=486-1862&m=dev
**Figma URL (Mobile — Obras):** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/MBA?node-id=486-2739&m=dev
**Figma URL (Mobile — Financeiro):** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/MBA?node-id=486-3402&m=dev

| Componente (Figma) | Node ID | Componente DS (`@luislongo/ds-core`) | Code Connect | Observações |
|--------------------|---------|--------------------------------------|--------------|-------------|
| NavbarTab "Relatórios" | `0:54` | `<NavbarTab />` | ✅ Mapeado | Adicionar `active` + `onClick` no AppLayout |
| H1 "Relatórios" | `479:1580` | `<H1>Relatórios</H1>` | ✅ Mapeado | |
| TabList | `481:1564` | `<TabList size="Large">` | ✅ Mapeado | Passe `size` em cada `Tab` — `TabList` não propaga |
| Tab "Obras" | `0:65` | `<Tab label="Obras" size="Large" />` | ✅ Mapeado | `active` controlado via `useSearchParams` |
| Tab "Financeiro" | `0:68` | `<Tab label="Financeiro" size="Large" />` | ✅ Mapeado | `active` controlado via `useSearchParams` |
| Tab "Externo" | `0:71` | `<Tab label="Externo" size="Large" disabled />` | ✅ Mapeado | Fixo; sem `onClick`; sem conteúdo |
| SearchInput | `483:1574` | `<SearchInput open placeholder="Buscar obras..." />` | ✅ Mapeado | `open={true}` fixo; controlado com `value`/`onChange` |
| DateRangeInput | `486:1299` | `<DateRangeInput startValue="2026-01-01" endValue="2026-01-31" />` | ✅ Mapeado | Strings ISO; `onStartChange`/`onEndChange` |
| Button "Exportar" | `479:1601` | `<Button variant="tertiary" size="md" startIcon={<IconPictureAsPdf />}>Exportar</Button>` | ✅ Mapeado | |
| TableHeaderRow | `485:1972` (área) | `<TableHeaderRow>` | ✅ Mapeado | `children` obrigatório |
| TableHeaderCell | `485:1972..1987` | `<TableHeaderCell>` | ✅ Mapeado | Sem `sortable` |
| TableRow | — | `<TableRow>` | ✅ Mapeado | `children` obrigatório |
| TableRowCell | `485:1992..2364` | `<TableRowCell>` | ✅ Mapeado | `alignment` por coluna; largura via `className` |
| Download CSV | — | — | ❌ Ausente | `BlobArquivoDownloader` na aplicação (ADR-0004) |

---

## FASE 1 — Fundação: domain, application, infrastructure [Não Iniciada ⏳]

Cria a espinha dorsal de dados. Nenhuma UI nesta fase.

**Gate:** `npm run build` passa.

Todas as tarefas são **sequenciais** (cada camada depende da anterior).

### Criar `src/domain/Relatorio.ts` [Não Iniciada ⏳]

Mover `Obra`, `LancamentoFinanceiro` e `FiltroRelatorio` de `src/mocks/types.ts` para o domínio. Campos `readonly`, sem métodos, seguindo o padrão de `Dashboard.ts`.

```ts
export interface Obra {
  readonly id: string
  readonly nome: string
  readonly tipo: 'Residencial' | 'Comercial' | 'Loteamento' | 'Industrial' | 'Institucional'
  readonly percentualConcluido: number
  readonly orcamento: number
  readonly status: 'Em andamento' | 'Concluída' | 'Atrasada' | 'Não iniciada'
  readonly dataInicio: Date   // alimenta o filtro de período; não exibida na tabela
}

export interface LancamentoFinanceiro {
  readonly id: string
  readonly descricao: string
  readonly tipo: 'Receita' | 'Despesa'
  readonly data: Date
  readonly valor: number
  readonly metodo: 'Transferência' | 'Boleto' | 'PIX' | 'Débito Automático' | 'Cartão'
  readonly status: 'Confirmado' | 'Pago' | 'Pendente' | 'Vencido'
}

export interface FiltroRelatorio {
  readonly dataInicio: Date
  readonly dataFim: Date
  readonly busca: string
}
```

### Criar `src/domain/repositories/IRelatorioRepository.ts` [Não Iniciada ⏳]

```ts
import type { Obra } from '../Relatorio'
import type { LancamentoFinanceiro } from '../Relatorio'

export interface IRelatorioRepository {
  listarObras(): Promise<Obra[]>
  listarLancamentos(): Promise<LancamentoFinanceiro[]>
}
```

### Criar `src/domain/repositories/IArquivoDownloader.ts` [Não Iniciada ⏳]

Porta estreita que isola a entrega de arquivo (API de plataforma) do use case. O use case monta o conteúdo; a implementação em `infrastructure/` decide como entregar.

```ts
export interface IArquivoDownloader {
  baixar(nomeArquivo: string, conteudo: string, mimeType: string): void
}
```

### Atualizar `src/domain/index.ts` [Não Iniciada ⏳]

Re-exportar as novas entidades e interfaces com `export type` (exigido por `verbatimModuleSyntax`).

### Criar `src/application/usecases/GetRelatorioObras.ts` [Não Iniciada ⏳]

`execute(filtro: FiltroRelatorio): Promise<Array<{ indice: number; obra: Obra }>>`.

Estratégia para preservar índice original (RN-004): enumerar com `map` antes de `filter`.

```ts
const obras = await this.repository.listarObras()
return obras
  .map((obra, i) => ({ indice: i + 1, obra }))
  .filter(({ obra }) => {
    const dentroDoIntervalo =
      obra.dataInicio >= filtro.dataInicio && obra.dataInicio <= filtro.dataFim
    const buscaVazia = filtro.busca.trim() === ''
    const matchBusca = buscaVazia || [obra.nome, obra.tipo, obra.status]
      .some(campo => campo.toLowerCase().includes(filtro.busca.toLowerCase()))
    return dentroDoIntervalo && matchBusca
  })
```

Convenção: campo `private readonly repository` declarado e atribuído explicitamente — sem parameter properties (`erasableSyntaxOnly`).

### Criar `src/application/usecases/GetRelatorioFinanceiro.ts` [Não Iniciada ⏳]

Mesma estrutura. Retorna `Array<{ indice: number; lancamento: LancamentoFinanceiro }>`.

Filtro de data sobre `lancamento.data`. Busca case-insensitive sobre `descricao`, `tipo`, `metodo`, `status`.

### Criar `src/application/usecases/ExportarRelatorio.ts` [Não Iniciada ⏳]

Monta a string CSV e delega ao `IArquivoDownloader`. Responsabilidades:
- Cabeçalho com os rótulos exatos das colunas visíveis
- Valores formatados (moeda, data, percentual) — mesmas funções da tela
- Separador `;`, BOM `﻿` no início, UTF-8
- Escaping de campos com `;`, aspas ou quebra de linha

Assinatura:
```ts
type ExportarInput =
  | { tipo: 'obras'; itens: Array<{ indice: number; obra: Obra }>; nomeArquivo: string }
  | { tipo: 'financeiro'; itens: Array<{ indice: number; lancamento: LancamentoFinanceiro }>; nomeArquivo: string }

execute(input: ExportarInput): void
```

Observação: `execute` é síncrono — a montagem do CSV é pura e a entrega via `IArquivoDownloader.baixar` também é síncrona.

### Atualizar `src/application/usecases/index.ts` e `src/application/IContainer.ts` [Não Iniciada ⏳]

Exportar os 3 novos use cases. Adicionar à interface:
```ts
getRelatorioObras: GetRelatorioObras
getRelatorioFinanceiro: GetRelatorioFinanceiro
exportarRelatorio: ExportarRelatorio
```

### Criar `src/infrastructure/repositories/InMemoryRelatorioRepository.ts` [Não Iniciada ⏳]

Wrapper fino que delega a `fetchObras()` / `fetchLancamentos()` de `src/mocks/relatorios.ts`. Sem lógica de negócio.

Reexportar em `repositories/index.ts`.

### Criar `src/infrastructure/BlobArquivoDownloader.ts` [Não Iniciada ⏳]

Implementa `IArquivoDownloader` via API de plataforma (`Blob`, `URL.createObjectURL`, `<a download>`). Único ponto do projeto que toca essas APIs.

```ts
import type { IArquivoDownloader } from '../domain/repositories/IArquivoDownloader'

export class BlobArquivoDownloader implements IArquivoDownloader {
  baixar(nomeArquivo: string, conteudo: string, mimeType: string): void {
    const blob = new Blob([conteudo], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nomeArquivo
    a.click()
    URL.revokeObjectURL(url)
  }
}
```

### Atualizar `src/infrastructure/container.ts` [Não Iniciada ⏳]

Instanciar:
```ts
const relatorioRepository = new InMemoryRelatorioRepository()
const arquivoDownloader = new BlobArquivoDownloader()

export const container: IContainer = {
  // ...existentes...
  getRelatorioObras: new GetRelatorioObras(relatorioRepository),
  getRelatorioFinanceiro: new GetRelatorioFinanceiro(relatorioRepository),
  exportarRelatorio: new ExportarRelatorio(arquivoDownloader),
}
```

---

## FASE 2 — Mocks literais [Não Iniciada ⏳]

Substitui o faker pelos 10 registros exatos do Figma. Depende da FASE 1 (tipos vêm do domínio).

**Gate:** `npm run build` passa; `fetchObras()` retorna 10 obras com `dataInicio` em janeiro/2026.

As tarefas desta fase são **paralelas** (arquivos independentes), mas ambas dependem da FASE 1.

### Reescrever `src/mocks/relatorios.ts` [Não Iniciada ⏳]

Remover `import { faker }` e `faker.seed(42)`. Substituir pelos 10 registros literais do Figma:

**Obras** — `dataInicio` em janeiro/2026 (distribuídas pelo mês para cobrir o filtro default):
```ts
const obras: Obra[] = [
  { id: '1', nome: 'Residencial Aurora', tipo: 'Residencial', percentualConcluido: 85, orcamento: 4560000, status: 'Em andamento', dataInicio: new Date('2026-01-05') },
  { id: '2', nome: 'Edifício Central', tipo: 'Comercial', percentualConcluido: 62, orcamento: 2840000, status: 'Em andamento', dataInicio: new Date('2026-01-08') },
  { id: '3', nome: 'Loteamento Sol Nascente', tipo: 'Loteamento', percentualConcluido: 100, orcamento: 1875000, status: 'Concluída', dataInicio: new Date('2026-01-10') },
  { id: '4', nome: 'Condomínio Parque das Flores', tipo: 'Residencial', percentualConcluido: 35, orcamento: 5670000, status: 'Em andamento', dataInicio: new Date('2026-01-12') },
  { id: '5', nome: 'Torre Norte Empresarial', tipo: 'Comercial', percentualConcluido: 48, orcamento: 3225000, status: 'Atrasada', dataInicio: new Date('2026-01-15') },
  { id: '6', nome: 'Vila Verde Residências', tipo: 'Residencial', percentualConcluido: 15, orcamento: 2100000, status: 'Em andamento', dataInicio: new Date('2026-01-18') },
  { id: '7', nome: 'Parque Industrial Oeste', tipo: 'Industrial', percentualConcluido: 0, orcamento: 8200000, status: 'Não iniciada', dataInicio: new Date('2026-01-20') },
  { id: '8', nome: 'Conjunto Habitacional Vida Nova', tipo: 'Residencial', percentualConcluido: 92, orcamento: 1350000, status: 'Em andamento', dataInicio: new Date('2026-01-22') },
  { id: '9', nome: 'Galpão Logístico BR-101', tipo: 'Industrial', percentualConcluido: 58, orcamento: 4750000, status: 'Atrasada', dataInicio: new Date('2026-01-25') },
  { id: '10', nome: 'Centro Comunitário Esperança', tipo: 'Institucional', percentualConcluido: 100, orcamento: 2400000, status: 'Concluída', dataInicio: new Date('2026-01-28') },
]
```

**Lançamentos Financeiros** — `data` nos dias exatos do Figma (Jan/2026):
```ts
const lancamentos: LancamentoFinanceiro[] = [
  { id: '1', descricao: 'Medição Fundação – Res. Aurora', tipo: 'Receita', data: new Date('2026-01-05'), valor: 128500, metodo: 'Transferência', status: 'Confirmado' },
  { id: '2', descricao: 'Compra Cimento – Ed. Central', tipo: 'Despesa', data: new Date('2026-01-08'), valor: 45200, metodo: 'Boleto', status: 'Pago' },
  { id: '3', descricao: 'Medição Estrutura – Cond. Parque', tipo: 'Receita', data: new Date('2026-01-10'), valor: 214800, metodo: 'PIX', status: 'Confirmado' },
  { id: '4', descricao: 'Aluguel Equipamentos – Torre Norte', tipo: 'Despesa', data: new Date('2026-01-12'), valor: 32600, metodo: 'Débito Automático', status: 'Pago' },
  { id: '5', descricao: 'Medição Alvenaria – Vila Verde', tipo: 'Receita', data: new Date('2026-01-15'), valor: 187350, metodo: 'Transferência', status: 'Pendente' },
  { id: '6', descricao: 'Mão de Obra – Res. Aurora', tipo: 'Despesa', data: new Date('2026-01-18'), valor: 76400, metodo: 'Boleto', status: 'Pago' },
  { id: '7', descricao: 'Medição Cobertura – Lot. Sol', tipo: 'Receita', data: new Date('2026-01-20'), valor: 95000, metodo: 'PIX', status: 'Confirmado' },
  { id: '8', descricao: 'Transporte Material – Galpão BR-101', tipo: 'Despesa', data: new Date('2026-01-22'), valor: 18900, metodo: 'Cartão', status: 'Pago' },
  { id: '9', descricao: 'Medição Acabamento – Vida Nova', tipo: 'Receita', data: new Date('2026-01-25'), valor: 63750, metodo: 'Transferência', status: 'Pendente' },
  { id: '10', descricao: 'Licença Ambiental – Pq. Industrial', tipo: 'Despesa', data: new Date('2026-01-28'), valor: 12800, metodo: 'Boleto', status: 'Vencido' },
]
```

### Atualizar `src/mocks/types.ts` [Não Iniciada ⏳]

Remover as definições locais de `Obra`, `LancamentoFinanceiro` e `FiltroRelatorio`. Re-exportá-las de `../domain/Relatorio`:

```ts
export type { Obra, LancamentoFinanceiro, FiltroRelatorio } from '../domain/Relatorio'
```

Mesmo padrão já usado para `Dashboard` e `Empreendimento`.

---

## FASE 3 — Tela base, rota, navegação e abas [Não Iniciada ⏳]

Primeira fase com resultado visível no browser. Depende das FASES 1 e 2.

**Gate:** `/relatorios` abre com H1 "Relatórios" e três abas; aba "Relatórios" fica ativa na navbar; trocar de aba atualiza `?tab=` na URL; `/relatorios?tab=financeiro` abre diretamente a aba Financeiro; busca reseta ao trocar de aba.

### Criar `src/presentation/screens/Relatorios/Relatorios.tsx` + `index.ts` [Não Iniciada ⏳]

Named export `Relatorios`. Sem `.schema.ts` — não é formulário.

```tsx
import { useSearchParams } from 'react-router-dom'
import { H1, TabList, Tab } from '@luislongo/ds-core'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export function Relatorios() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const size = isDesktop ? 'desktop' : 'mobile'

  const tabParam = searchParams.get('tab')
  const tab: 'obras' | 'financeiro' = tabParam === 'financeiro' ? 'financeiro' : 'obras'

  const [busca, setBusca] = useState('')
  const [dataInicio, setDataInicio] = useState('2026-01-01')
  const [dataFim, setDataFim] = useState('2026-01-31')

  const handleTabChange = (novaTab: 'obras' | 'financeiro') => {
    setBusca('')   // RN-002 / decisão 8: busca reseta; datas preservadas
    setSearchParams({ tab: novaTab })
  }

  return (
    <div className="flex flex-col gap-400 px-600 py-600 bg-light-900 min-h-full">
      <H1>Relatórios</H1>
      <TabList size="Large">
        <Tab label="Obras" size="Large" active={tab === 'obras'} onClick={() => handleTabChange('obras')} />
        <Tab label="Financeiro" size="Large" active={tab === 'financeiro'} onClick={() => handleTabChange('financeiro')} />
        <Tab label="Externo" size="Large" disabled />
      </TabList>
      {/* toolbar e tabelas nas próximas fases */}
    </div>
  )
}
```

`index.ts`: `export { Relatorios } from './Relatorios'`

### Registrar rota em `src/App.tsx` [Não Iniciada ⏳]

Importar `Relatorios` de `./presentation/screens/Relatorios`. Adicionar:
```tsx
<Route path="/relatorios" element={<Relatorios />} />
```

Nenhuma outra mudança em `App.tsx`.

### Atualizar `src/presentation/components/AppLayout/AppLayout.tsx` [Não Iniciada ⏳]

Terceira `NavbarTab`: remover `disabled`, adicionar:
```tsx
<NavbarTab size={size} label="Relatórios" icon={<IconEventNote />}
  active={pathname === '/relatorios'}
  onClick={() => navigate('/relatorios')} />
```

---

## FASE 4 — Toolbar e esqueleto das tabelas [Não Iniciada ⏳]

Depende da FASE 3.

**Gate:** toolbar aparece em ambas as abas ativas com layout correto em desktop e mobile; cabeçalhos das tabelas renderizam (sem linhas de dados ainda).

### Implementar a toolbar responsiva [Não Iniciada ⏳]

**Desktop** (uma linha):
```tsx
<div className="flex items-end gap-400">
  <SearchInput open className="flex-1" placeholder={placeholder} value={busca} onChange={(e) => setBusca(e.target.value)} />
  <DateRangeInput startValue={dataInicio} endValue={dataFim} onStartChange={setDataInicio} onEndChange={setDataFim} />
  <Button variant="tertiary" size="md" startIcon={<IconPictureAsPdf />} onClick={handleExportar}>Exportar</Button>
</div>
```

**Mobile** (empilhado):
```tsx
<div className="flex flex-col gap-300">
  <SearchInput open placeholder={placeholder} value={busca} onChange={(e) => setBusca(e.target.value)} />
  <DateRangeInput startValue={dataInicio} endValue={dataFim} onStartChange={setDataInicio} onEndChange={setDataFim} />
  <div className="flex justify-end">
    <Button variant="tertiary" size="md" startIcon={<IconPictureAsPdf />} onClick={handleExportar}>Exportar</Button>
  </div>
</div>
```

`placeholder` dinâmico: `tab === 'obras' ? 'Buscar obras...' : 'Buscar lançamentos...'`.

Validação de data: se `dataInicio > dataFim`, não atualizar o estado (ou desabilitar o endpoint — a ser decidido durante implementação; mínimo: ignorar a mudança que tornaria o intervalo inválido).

### Adicionar cabeçalhos das tabelas [Não Iniciada ⏳]

Cada aba renderiza dentro de `<div className="overflow-x-auto">`.

**Aba Obras** — 6 colunas: `#` | `Obra` | `Tipo` | `% Concluído` | `Orçamento` | `Status`

Larguras de referência (ajustar no build visual):
- `#` → `className="w-[56px] shrink-0"`
- `Obra` → `className="flex-1 min-w-0"`
- `Tipo` → `className="w-[120px] shrink-0"`
- `% Concluído` → `className="w-[120px] shrink-0"`
- `Orçamento` → `className="w-[140px] shrink-0"`
- `Status` → `className="w-[140px] shrink-0"`

**Aba Financeiro** — 7 colunas: `#` | `Descrição` | `Tipo` | `Data` | `Valor` | `Método` | `Status`

Larguras de referência:
- `#` → `w-[56px] shrink-0`
- `Descrição` → `flex-1 min-w-0`
- `Tipo` → `w-[100px] shrink-0`
- `Data` → `w-[110px] shrink-0`
- `Valor` → `w-[140px] shrink-0`
- `Método` → `w-[140px] shrink-0`
- `Status` → `w-[110px] shrink-0`

---

## FASE 5 — Aba Obras: dados, filtragem e renderização [Não Iniciada ⏳]

Depende das FASES 2 e 4.

**Gate:** aba Obras mostra 10 linhas com o filtro default; busca filtra em tempo real; trocar datas refiltra; coluna `#` mantém índice original com filtro ativo; tabela vazia mostra apenas o cabeçalho.

### Wiring de dados para Obras [Não Iniciada ⏳]

```tsx
const { getRelatorioObras } = useContainer()
const [obras, setObras] = useState<Array<{ indice: number; obra: Obra }> | null>(null)

useEffect(() => {
  let ativo = true
  const filtro: FiltroRelatorio = {
    dataInicio: new Date(dataInicio),
    dataFim: new Date(dataFim),
    busca,
  }
  getRelatorioObras.execute(filtro).then((r) => { if (ativo) setObras(r) })
  return () => { ativo = false }
}, [getRelatorioObras, dataInicio, dataFim, busca])

if (obras === null) return null
```

Deps primitivas (`dataInicio`, `dataFim`, `busca`) — **não usar o objeto `filtro` no array de deps** (geraria novo objeto a cada render, causando loop infinito).

### Funções de formatação [Não Iniciada ⏳]

Definir fora do componente (ou em arquivo irmão `relatorios.utils.ts` se também usadas no CSV):

```ts
const formatOrcamento = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)

const formatValor = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)

const formatData = (d: Date) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
```

Sem biblioteca de datas — apenas `Intl` (nativa). As mesmas funções alimentam o CSV.

### Renderizar linhas de Obras [Não Iniciada ⏳]

```tsx
{obras.map(({ indice, obra }) => (
  <TableRow key={obra.id}>
    <TableRowCell className="w-[56px] shrink-0">{String(indice).padStart(2, '0')}</TableRowCell>
    <TableRowCell className="flex-1 min-w-0">{obra.nome}</TableRowCell>
    <TableRowCell className="w-[120px] shrink-0">{obra.tipo}</TableRowCell>
    <TableRowCell className="w-[120px] shrink-0" alignment="center">{obra.percentualConcluido}%</TableRowCell>
    <TableRowCell className="w-[140px] shrink-0" alignment="right">{formatOrcamento(obra.orcamento)}</TableRowCell>
    <TableRowCell className="w-[140px] shrink-0">{obra.status}</TableRowCell>
  </TableRow>
))}
```

Tabela vazia (filtro sem resultado): `obras.length === 0` renderiza apenas o `TableHeaderRow` — nenhuma mensagem extra (CA-006 US-003).

---

## FASE 6 — Aba Financeiro + Exportação CSV [Não Iniciada ⏳]

Depende da FASE 5.

**Gate:** aba Financeiro mostra 10 linhas; `Data` formatada como `dd/MM/yyyy`; `Valor` com centavos; clicar em "Exportar" baixa CSV com dados filtrados, separador `;`, BOM, headers corretos.

### Wiring de dados para Financeiro [Não Iniciada ⏳]

Mesmo padrão da FASE 5: `useEffect` com `getRelatorioFinanceiro`, deps primitivas, guarda de cancelamento.

```tsx
const [lancamentos, setLancamentos] = useState<Array<{ indice: number; lancamento: LancamentoFinanceiro }> | null>(null)
```

Renderização de linhas com 7 `TableRowCell`:
```tsx
<TableRowCell className="w-[56px] shrink-0">{String(indice).padStart(2, '0')}</TableRowCell>
<TableRowCell className="flex-1 min-w-0">{lancamento.descricao}</TableRowCell>
<TableRowCell className="w-[100px] shrink-0">{lancamento.tipo}</TableRowCell>
<TableRowCell className="w-[110px] shrink-0">{formatData(lancamento.data)}</TableRowCell>
<TableRowCell className="w-[140px] shrink-0" alignment="right">{formatValor(lancamento.valor)}</TableRowCell>
<TableRowCell className="w-[140px] shrink-0">{lancamento.metodo}</TableRowCell>
<TableRowCell className="w-[110px] shrink-0">{lancamento.status}</TableRowCell>
```

### Wiring do botão Exportar [Não Iniciada ⏳]

```tsx
const { exportarRelatorio } = useContainer()

const handleExportar = () => {
  if (tab === 'obras' && obras !== null) {
    exportarRelatorio.execute({ tipo: 'obras', itens: obras, nomeArquivo: 'obras.csv' })
  } else if (tab === 'financeiro' && lancamentos !== null) {
    exportarRelatorio.execute({ tipo: 'financeiro', itens: lancamentos, nomeArquivo: 'financeiro.csv' })
  }
}
```

O botão recebe `onClick={handleExportar}`.

**Dentro do `ExportarRelatorio.execute`**, o CSV de Obras usa os rótulos `#;Obra;Tipo;% Concluído;Orçamento;Status` e formata os valores (mesmas funções). O CSV de Financeiro usa `#;Descrição;Tipo;Data;Valor;Método;Status`.

---

## FASE 7 — Documentação e qualidade [Não Iniciada ⏳]

Depende de todas as fases anteriores.

**Gate:** `npm run build` e `npm run lint` passam (1 warning pré-existente em `ContainerContext.tsx` é aceito); docs atualizados.

As tarefas desta fase são **paralelas** entre si.

### Atualizar `docs/features.md` [Não Iniciada ⏳]

- Adicionar seção "Relatórios (`/relatorios`)" descrevendo as três abas, toolbar, filtros e exportação.
- Corrigir informações desatualizadas:
  - Aba "Dashboards" já está habilitada (não mais `disabled`)
  - `/` redireciona para `/dashboards` (não para `/empreendimento`)
  - Seção AppLayout: atualizar lista das 3 abas

### Atualizar `docs/business-rules.md` [Não Iniciada ⏳]

Adicionar seção "Domínio: Relatórios" com as RN-001 a RN-005 do `context.md`:

- **RN-001** Aba "Externo" é exibida mas permanece desabilitada.
- **RN-002** Filtro de data e busca textual são aplicados em conjunto (AND lógico).
- **RN-003** A exportação é CSV, com as mesmas colunas e formatação da tabela, refletindo os dados filtrados.
- **RN-004** A numeração `#` mantém o índice original do registro na lista completa — não renumera após filtragem.
- **RN-005** `% Concluído` é um inteiro de 0 a 100 inclusive.
