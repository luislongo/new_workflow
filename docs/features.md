# Funcionalidades

## Telas da Aplicação

A aplicação é um sistema de **gestão de empreendimentos** (projetos imobiliários / construção civil).

### Adicionar Empreendimento (`/empreendimento`)

| Atributo | Valor |
|---------|-------|
| Complexidade | Média |
| Reutilização | Alta |
| Interatividade | Média |

**Descrição**: Formulário para cadastro de um novo empreendimento. O usuário preenche os dados básicos e confirma — o sistema exibe `alert("Empreendimento cadastrado com sucesso!")` e reseta o formulário.

**Campos**: Nome do empreendimento, Endereço de e-mail, CEP, Endereço, Proprietário, Tipo de empreendimento (radio: Residencial · Comercial · Infraestrutura).

**Campos obrigatórios**: Nome e E-mail. Tipo é obrigatório (sem seleção bloqueia o submit). CEP, Endereço e Proprietário são opcionais.

**Layout responsivo**: Desktop (≥ 1024 px) — DoubleColumn com campos à esquerda e tipo à direita. Mobile (< 1024 px) — coluna única, campos antes, tipo depois. Breakpoint único do projeto — ver `docs/patterns.md`.

**Rota de entrada**: `/` redireciona para `/dashboards`.

---

### Dashboard (`/dashboards`)

Painel analítico com KPIs, gráficos de evolução de custo, avanço por obra, indicadores e materiais críticos. Dados literais extraídos do Figma, via `InMemoryDashboardRepository`. Sem estados de loading/erro (padrão do projeto: `if (data === null) return null`).

---

### Relatórios (`/relatorios`)

Tela analítica com três abas: **Obras**, **Financeiro** e **Externo** (desabilitada). Toolbar com busca textual, filtro de intervalo de datas e botão de exportação CSV.

**Aba Obras** — tabela com colunas `#`, `Obra`, `Tipo`, `% Concluído`, `Orçamento`, `Status`. Orçamento sem centavos (`R$ 4.560.000`). Percentual inteiro com sufixo `%`.

**Aba Financeiro** — tabela com colunas `#`, `Descrição`, `Tipo`, `Data`, `Valor`, `Método`, `Status`. Data em `dd/MM/yyyy`. Valor com centavos (`R$ 128.500,00`).

**Toolbar**: busca expandida por padrão (placeholder muda por aba); filtro de data default `01/01/2026 – 31/01/2026`; botão "Exportar" que baixa CSV dos dados filtrados.

**Deep link**: `?tab=financeiro` é válido — a aba ativa sincroniza com a URL via `useSearchParams`.

**Exportação**: CSV com separador `;`, BOM UTF-8, colunas e valores formatados idênticos à tabela, refletindo dados filtrados.

---

## Funcionalidades de Infraestrutura

### AppLayout

Estrutura de página com `AppHeader` e `Navbar` integrada (via prop `navbar`). A `Navbar` possui 3 abas:
- **Empreendimento** (`/empreendimento`) — navega para a tela de cadastro
- **Dashboards** (`/dashboards`) — aba ativa na tela principal
- **Relatórios** (`/relatorios`) — navega para a tela de relatórios

A aba ativa é detectada via `useLocation`. Navegação programática via `useNavigate`. Responsividade da navbar: desktop mostra ícone + rótulo; mobile mostra apenas ícone (`NavbarTab size="mobile"`).

### Roteamento

SPA com React Router DOM v7. Rotas declaradas em `App.tsx`:
- `/` → redirect para `/dashboards`
- `/empreendimento` → `<AdicionarEmpreendimento />`
- `/dashboards` → `<Dashboard />`
- `/relatorios` → `<Relatorios />`

Ver [ADR-0001](../meta/adr/0001-roteamento-com-react-router.md).
