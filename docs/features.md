# Funcionalidades

## Telas da Aplicação

A aplicação é um sistema de **gestão de projetos** com cinco telas. As telas são idênticas em `old_workflow` e `new_workflow` — o diferencial é o workflow de implementação, não o produto.

### Dashboard (`/`)

| Atributo | Valor |
|---------|-------|
| Complexidade | Alta |
| Reutilização | Alta |
| Interatividade | Média |

**Descrição**: Visão geral do portfólio com indicadores-chave (KPIs) e gráficos de evolução e distribuição por status.

**KPIs exibidos**: Projetos Ativos, No Prazo, Orçamento Utilizado (%), Membros da Equipe.

**Manutenção planejada**: Adicionar filtro de período que atualize todos os indicadores conforme o intervalo selecionado.

---

### Formulário — Cadastro de Projeto (`/cadastro`)

| Atributo | Valor |
|---------|-------|
| Complexidade | Baixa |
| Reutilização | Alta |
| Interatividade | Média |

**Descrição**: Formulário para criação e edição de projetos, usando componentes de input do design system.

**Campos previstos**: Nome, Cliente, Data de Início, Data de Término, Orçamento, Gerente, Descrição.

**Manutenção planejada**: Adicionar um campo obrigatório utilizando componente do design system (ex.: `Select` para categoria).

---

### Tabela de Dados — Lista de Projetos (`/projetos`)

| Atributo | Valor |
|---------|-------|
| Complexidade | Média |
| Reutilização | Alta |
| Interatividade | Alta |

**Descrição**: Listagem tabular de todos os projetos cadastrados com colunas de dados e ações.

**Colunas**: #, Nome, Cliente, Status, Início, Término, Orçamento, Ações.

**Manutenção planejada**: Adicionar ordenação a uma coluna existente (clique no cabeçalho).

---

### Fluxo de Cadastro — Wizard (`/onboarding`)

| Atributo | Valor |
|---------|-------|
| Complexidade | Alta |
| Reutilização | Média |
| Interatividade | Alta |

**Descrição**: Wizard multi-etapas para cadastro guiado de novos projetos com stepper visual.

**Etapas atuais**: 1. Informações Básicas → 2. Equipe → 3. Orçamento → 4. Confirmação.

**Manutenção planejada**: Adicionar etapa de Revisão entre Orçamento e Confirmação.

---

### Componente Composto — ProjectCard (`/componentes`)

| Atributo | Valor |
|---------|-------|
| Complexidade | Média |
| Reutilização | Alta |
| Interatividade | Baixa |

**Descrição**: Showcase do componente `ProjectCard` com cards de projetos e toggle de modo compacto.

**Props atuais**: `title`, `client`, `status`, `progress`.

**Manutenção planejada**: Adicionar prop `compact?: boolean` — modo com altura reduzida, sem barra de progresso e tipografia menor.

---

## Funcionalidades de Infraestrutura

### AppLayout

Barra de navegação global usando `Navbar` e `NavbarTab` do `@ds/core`. Destaca a aba ativa via `useLocation`. Envolve todas as telas.

### Roteamento

SPA com React Router DOM. Cada tela tem rota própria (ver [ADR-0001](../meta/adr/0001-roteamento-com-react-router.md)).
