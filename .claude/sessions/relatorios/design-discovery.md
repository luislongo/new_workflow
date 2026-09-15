# Descoberta de Componentes: Relatórios

## URL do Design Figma

https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/MBA?node-id=479-1566&m=dev

| Frame | Node ID |
|-------|---------|
| Relatórios — Obras (Desktop) | `479:1566` |
| Relatórios — Financeiro (Desktop) | `486:1862` |
| Relatórios — Obras (Mobile) | `486:2739` |
| Relatórios — Financeiro (Mobile) | `486:3402` |

## Componentes Identificados

| Componente (Figma) | Node ID | Componente DS (`@luislongo/ds-core`) | Code Connect | Observações |
|--------------------|---------|--------------------------------------|--------------|-------------|
| NavbarTab "Relatórios" | `0:54` | `<NavbarTab label="Relatórios" icon={<IconEventNote />} active />` | ✅ Mapeado | Adicionar `active={pathname === "/relatorios"}` + `onClick` no AppLayout |
| H1 "Relatórios" | `479:1580` | `<H1>Relatórios</H1>` | ✅ Mapeado | Consistente com as outras telas |
| TabList | `481:1564` | `<TabList size="Large">` | ✅ Mapeado | Contém os 3 Tabs; `TabList` não propaga `size` — passe em cada `Tab` |
| Tab "Obras" | `0:65` | `<Tab label="Obras" size="Large" />` | ✅ Mapeado | `active` controlado por estado derivado de `useSearchParams` |
| Tab "Financeiro" | `0:68` | `<Tab label="Financeiro" size="Large" />` | ✅ Mapeado | `active` controlado por estado derivado de `useSearchParams` |
| Tab "Externo" | `0:71` | `<Tab label="Externo" size="Large" disabled />` | ✅ Mapeado | Fixo; sem conteúdo; sem `onClick` |
| SearchInput | `483:1574` | `<SearchInput open placeholder="Buscar obras..." />` | ✅ Mapeado | `open={true}` fixo (expandido por padrão); controlado: `value` + `onChange` |
| DateRangeInput | `486:1299` | `<DateRangeInput startValue="2026-01-01" endValue="2026-01-31" />` | ✅ Mapeado | Strings ISO; defaults fixos; `onStartChange`/`onEndChange` |
| Button "Exportar" | `479:1601` | `<Button variant="tertiary" size="md" startIcon={<IconPictureAsPdf />}>Exportar</Button>` | ✅ Mapeado | Ícone confirmado no DS |
| TableHeaderRow (Obras) | `485:1972` (área) | `<TableHeaderRow>` | ✅ Mapeado | `role="row"` flex-div; `children` obrigatório |
| TableHeaderCell | `485:1972..1987` | `<TableHeaderCell>` | ✅ Mapeado | Sem `sortable` — ordenação fora de escopo |
| TableRow | — | `<TableRow>` | ✅ Mapeado | `role="row"` flex-div; `children` obrigatório |
| TableRowCell | `485:1992..2364` | `<TableRowCell>` | ✅ Mapeado | `alignment` por coluna; largura via `className` |
| Download CSV | — | — | ❌ Ausente | Implementar `BlobArquivoDownloader` na aplicação; caso previsto no ADR-0004 |

## Snippets confirmados pelo Code Connect

```tsx
// Aba Obras — SearchInput expandido por padrão
<SearchInput open placeholder="Buscar obras..." />

// Aba Financeiro
<SearchInput open placeholder="Buscar lançamentos..." />

// DateRangeInput com datas default
<DateRangeInput startLabel="Data Início" endLabel="Data Fim" startValue="2026-01-01" endValue="2026-01-31" />

// Botão Exportar (mesmo snippet em ambas as abas)
<Button variant="tertiary" size="md" startIcon={<IconPictureAsPdf />}>
  Exportar
</Button>

// TabList com 3 abas (Obras ativo)
<TabList size="Large">
  <Tab label="Obras" active size="Large" />
  <Tab label="Financeiro" size="Large" />
  <Tab label="Externo" size="Large" disabled />
</TabList>
```

## Componentes da tela sem cobertura no DS

| Necessidade | Solução |
|-------------|---------|
| Download de arquivo (CSV) | `infrastructure/BlobArquivoDownloader.ts` implementando porta `IArquivoDownloader` |

**Não usar `ProgressTable`** — cabeçalhos hardcoded (`#`/`Material`/`Estoque`/`Uso`) e shape fixo; restrição documentada no plano do Dashboard.
