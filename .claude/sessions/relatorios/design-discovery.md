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
| — | — | — | — | A preencher em /plan |

## Candidatos pré-identificados no refinamento

Levantados a partir de `node_modules/@luislongo/ds-core/src/`. **Confirmar o mapeamento Code Connect em `/plan`** via `get_design_context` / `get_code_connect_map`.

| Elemento da tela | Componente DS candidato | Nota |
|------------------|-------------------------|------|
| Abas Obras/Financeiro/Externo | `TabList`, `Tab` | `Tab` tem prop `disabled` para "Externo" |
| Cabeçalho da tabela | `TableHeaderRow`, `TableHeaderCell` | Usar sem `sortable` — ordenação fora de escopo |
| Linhas da tabela | `TableRow`, `TableRowCell` | `alignment` disponível por célula |
| Filtro de período | `DateRangeInput` | Controlado por strings ISO, não `Date`; labels default já corretos |
| Campo de busca | `SearchInput` | Usar controlado com `open={true}` — o default é expand-on-click |
| Botão Exportar | `Button` / `IconButton` | Ícone a definir; set Material completo disponível |
| Título "Relatórios" | `H1` | Consistente com as telas existentes |

**Não usar `ProgressTable`** — cabeçalhos hardcoded (`#`/`Material`/`Estoque`/`Uso`) e shape fixo; restrição já registrada no plano do Dashboard.

**Sem cobertura no DS:** geração e download do CSV. Caso previsto na consequência negativa do ADR-0004 — implementação própria, sem Code Connect.
