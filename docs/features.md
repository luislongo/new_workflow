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

**Rota de entrada**: `/` redireciona para `/empreendimento`.

---

## Funcionalidades de Infraestrutura

### AppLayout

Estrutura de página com `AppHeader` e `Navbar` integrada (via prop `navbar`). A `Navbar` possui 3 abas:
- **Empreendimento** (`/empreendimento`) — aba ativa nesta tela
- **Dashboards** — desabilitada (rota não implementada)
- **Relatórios** — desabilitada (rota não implementada)

A aba ativa é detectada via `useLocation`. Navegação programática via `useNavigate`. Responsividade da navbar: desktop mostra ícone + rótulo; mobile mostra apenas ícone (`NavbarTab size="mobile"`).

### Roteamento

SPA com React Router DOM v7. Rotas declaradas em `App.tsx`:
- `/` → redirect para `/empreendimento`
- `/empreendimento` → `<AdicionarEmpreendimento />`

Ver [ADR-0001](../meta/adr/0001-roteamento-com-react-router.md).
