# Notas Arquiteturais: Relatórios

## Decisões Relevantes

### ADR-0003 — Arquitetura Limpa Completa

A feature toca as quatro camadas. A regra de ouro se aplica: **`presentation/` não importa de `infrastructure/`**. `App.tsx` continua sendo o único arquivo autorizado a fazê-lo.

Consequências diretas:

- `Obra`, `LancamentoFinanceiro` e `FiltroRelatorio` sobem de `src/mocks/types.ts` para `domain/Relatorio.ts` (ou arquivos separados por entidade, a definir em `/plan`). `mocks/types.ts` passa a reexportá-los, como já faz com `Dashboard` e `Empreendimento`.
- Nasce `domain/repositories/IRelatorioRepository.ts`.
- `infrastructure/repositories/InMemoryRelatorioRepository.ts` delega aos mocks — mesmo padrão do `InMemoryDashboardRepository`, que é o precedente explícito citado no ADR-0003 para "mock vira fonte do repositório".
- `IContainer` (em `application/`, não em `infrastructure/`) ganha as novas entradas.
- `infrastructure/container.ts` instancia repositório + use cases.

**Convenção de use case:** método público único `execute()` (adendo de 2026-09-14 ao ADR-0003).

**`erasableSyntaxOnly` está habilitado** — parameter properties (`constructor(private readonly x)`) quebram o build. As classes de use case devem declarar os campos explicitamente, como já fazem `CreateEmpreendimento` e `GetDashboardData`.

**Vocabulário:** o projeto usa termos em português (`Empreendimento`, `Obra`, `LancamentoFinanceiro`), nunca equivalentes em inglês.

### ADR-0004 — Design System

`@luislongo/ds-core` é o único fornecedor de componentes de UI. Todos os componentes da tela existem no pacote, **exceto exportação** — não há componente de export, download, CSV ou XLSX no DS nem dependência de geração de arquivo no projeto. Este é precisamente o caso previsto na consequência negativa do ADR-0004: componente não coberto pelo DS é criado na aplicação, sem Code Connect.

### ADR-0001 — Roteamento

Nova `<Route path="/relatorios">` em `App.tsx`. A sincronização da aba com a URL usa `useSearchParams` do React Router, coerente com o uso já existente de `useLocation`/`useNavigate` no `AppLayout`.

### ADR-0002 — Formulários e validação

**Não se aplica diretamente.** A toolbar não é um formulário com submit — é filtro reativo. Não há `<NomeTela>.schema.ts`. A validação "Data Início ≤ Data Fim" é uma regra pontual, não um schema Zod de formulário. O `DateRangeInput` do DS não usa `forwardRef` e não integra com `register()` do React Hook Form, o que reforça o uso de estado local controlado.

## Pontos de Integração

### Camada `domain`

| Arquivo | Conteúdo |
|---------|----------|
| `domain/Relatorio.ts` | `Obra`, `LancamentoFinanceiro`, `FiltroRelatorio` (interfaces `readonly`, sem métodos) |
| `domain/repositories/IRelatorioRepository.ts` | `listarObras()`, `listarLancamentos()` |
| `domain/repositories/IArquivoDownloader.ts` | Porta de entrega de arquivo (ver "Considerações Técnicas") |

### Camada `application`

| Arquivo | Responsabilidade |
|---------|------------------|
| `usecases/GetRelatorioObras.ts` | `execute(filtro)` → obras filtradas, com índice original preservado |
| `usecases/GetRelatorioFinanceiro.ts` | `execute(filtro)` → lançamentos filtrados, com índice original preservado |
| `usecases/ExportarRelatorio.ts` | `execute(...)` → monta o CSV e delega a entrega ao `IArquivoDownloader` |
| `IContainer.ts` | Ganha as três novas entradas |

### Camada `infrastructure`

| Arquivo | Responsabilidade |
|---------|------------------|
| `repositories/InMemoryRelatorioRepository.ts` | Delega a `fetchObras()` / `fetchLancamentos()` |
| `BlobArquivoDownloader.ts` | Implementa `IArquivoDownloader` via `Blob` + `URL.createObjectURL` |
| `container.ts` | Instancia e injeta |

### Camada `presentation`

| Arquivo | Responsabilidade |
|---------|------------------|
| `screens/Relatorios/Relatorios.tsx` | Tela principal, abas, toolbar, tabelas |
| `screens/Relatorios/index.ts` | Re-export nomeado |
| `components/AppLayout/AppLayout.tsx` | Aba "Relatórios" deixa de ser `disabled` |

### Fora das camadas

`src/mocks/relatorios.ts` — reescrito com os 10 registros literais do Figma, substituindo o faker. `src/mocks/types.ts` passa a reexportar as entidades a partir de `domain/`, como já faz para Dashboard e Empreendimento.

### App.tsx

Nova rota; o container já é injetado via `ContainerProvider`, sem mudança estrutural.

## Considerações Técnicas

### Porta `IArquivoDownloader`

O use case `ExportarRelatorio` foi a opção escolhida no refinamento, mas um use case em `application/` não pode tocar `Blob`/`URL.createObjectURL` sem violar a regra de dependência do ADR-0003 — são APIs de plataforma, que pertencem a `infrastructure/`.

Solução: uma porta estreita no domínio.

```ts
// domain/repositories/IArquivoDownloader.ts
export interface IArquivoDownloader {
  baixar(nomeArquivo: string, conteudo: string, mimeType: string): void
}
```

O use case monta a string CSV (lógica pura, testável) e chama a porta. `infrastructure/BlobArquivoDownloader.ts` implementa com `Blob` + `createObjectURL` + `<a download>` + `revokeObjectURL`. O container injeta a implementação, e `App.tsx` continua sendo o único ponto que conhece `infrastructure/`.

### Índice original na coluna `#` (RN-004)

A coluna `#` mantém o índice do registro na **lista completa**, não na lista filtrada. Isso significa que o use case não pode devolver apenas `Obra[]` — o índice precisa sobreviver à filtragem.

Duas formas de resolver, a escolher em `/plan`:
- o use case devolve `{ indice: number; item: T }[]`, calculando o índice antes de filtrar;
- as entidades ganham um campo de ordem estável vindo do mock.

A primeira mantém o domínio limpo (o índice é uma preocupação de apresentação da lista, não do registro). Qualquer que seja a escolha, o CSV exporta o mesmo número exibido na tabela.

### Race condition no filtro reativo

O use case é parametrizado (`execute(filtro)`), então a tela dispara uma chamada assíncrona a cada tecla digitada na busca. Ainda que o repositório seja in-memory e o custo desprezível, `Promise` não garante ordem de resolução — uma resposta antiga pode sobrescrever uma recente.

O `useEffect` precisa de guarda de cancelamento:

```ts
useEffect(() => {
  let ativo = true
  getRelatorioObras.execute(filtro).then((r) => { if (ativo) setObras(r) })
  return () => { ativo = false }
}, [getRelatorioObras, filtro])
```

O objeto `filtro` também precisa ser referencialmente estável (ou o efeito depender dos campos primitivos), sob risco de loop infinito.

### Componentes do DS

Todos disponíveis, nenhum ainda usado no projeto:

| Necessidade | Componente | Observação |
|-------------|-----------|------------|
| Abas de conteúdo | `TabList`, `Tab` | `Tab` aceita `label`, `active`, `disabled`, `size`, `onClick`; `role="tab"` + `aria-selected` nativos |
| Tabela | `TableHeaderRow`, `TableHeaderCell`, `TableRow`, `TableRowCell` | Primitivos flexbox com `role="row"`/`role="cell"`, não `<table>` HTML. `TableRowCell` aceita `alignment` |
| Filtro de datas | `DateRangeInput` | Labels default já são "Data Início"/"Data Fim". Controlado por **strings ISO**, não `Date` — a conversão fica na tela |
| Busca | `SearchInput` | Padrão expand-on-click: fechado é só um botão-lupa 40×40. Para reproduzir o Figma, usar modo **controlado com `open` fixo em `true`** |
| Botão exportar | `Button` ou `IconButton` | Ícone a definir em `/plan` (o DS traz o set Material completo) |
| Título | `H1` | Como nas telas existentes |

**`ProgressTable` não deve ser usada** — tem cabeçalhos hardcoded (`#`/`Material`/`Estoque`/`Uso`) e shape fixo. O `plan.md` do Dashboard já registrou essa restrição.

**`TableHeaderCell` suporta ordenação** (`sortable`, `sort`, `onSort`, `aria-sort`), mas ordenação está fora de escopo — usar sem essas props.

### Responsividade

O projeto tem **um único breakpoint**: `useMediaQuery("(min-width: 1024px)")` → `const size = isDesktop ? "desktop" : "mobile"`. É a fonte de verdade, e a spec menciona `<768px` para mobile — o breakpoint do projeto prevalece.

O Dashboard estabeleceu o padrão de **dois `return` completos separados** (`if (isDesktop) return (...)` seguido do return mobile) em vez de classes responsivas. A tela de Relatórios tem estrutura suficientemente parecida entre os breakpoints (só a toolbar reorganiza) para que valha avaliar em `/plan` se esse padrão se justifica aqui ou se um único return com a toolbar condicional é mais legível.

A tabela em mobile precisa de container com `overflow-x: auto`, acessível por toque e teclado.

### Formatação

Dois formatos de moeda distintos convivem na tela:
- **Orçamento** (Obras): sem centavos — `R$ 4.560.000`
- **Valor** (Financeiro): com centavos — `R$ 128.500,00`

Ambos via `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` com `minimumFractionDigits`/`maximumFractionDigits` diferentes. Datas em `dd/MM/yyyy` via `Intl.DateTimeFormat('pt-BR')` — não há biblioteca de datas no projeto e não se deve adicionar uma.

As mesmas funções de formatação alimentam a tabela e o CSV (CA-005 da US-007 exige valores já formatados no arquivo).

### Geração do CSV

- Separador `;`, codificação UTF-8 com **BOM** (`﻿` no início) para o Excel reconhecer acentuação.
- Campos contendo `;`, aspas ou quebra de linha precisam ser escapados com aspas duplas (descrições como `Medição Fundação – Res. Aurora` não contêm `;`, mas o serializador deve ser correto de todo modo).
- Valores já formatados: `R$ 4.560.000` contém `.` como separador de milhar — inofensivo com separador `;`.

### Gates de qualidade

Não há test runner no projeto. Os únicos gates são `npm run build` (`tsc -b && vite build`) e `npm run lint` (oxlint). Existe **1 warning pré-existente de oxlint em `ContainerContext.tsx`** — conhecido e aceito, não deve ser tratado como regressão.

### Documentação a atualizar

`docs/features.md` está **desatualizado** — não menciona o Dashboard, afirma que a aba "Dashboards" está desabilitada e que `/` redireciona para `/empreendimento` (hoje redireciona para `/dashboards`). Vale corrigir junto com esta feature, já que o documento precisará ganhar a seção de Relatórios de qualquer modo.

`docs/business-rules.md` ganha as RN-001 a RN-005.
