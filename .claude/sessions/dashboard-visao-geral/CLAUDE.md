# Sessão: Dashboard — Visão Geral de Obras

Você está trabalhando na feature **Dashboard**.

## Arquivos desta sessão
- `context.md` — Requisitos aprovados (inclui Figma URLs)
- `architecture.md` — Notas arquiteturais e decisões técnicas
- `design-discovery.md` — Componentes do Figma mapeados ao DS (preenchido em `/plan`)
- `plan.md` — Fases de implementação (gerado por `/plan`)
- `progress.md` — Estado atual e próximo passo imediato (atualizado por `/work`)

## Decisões do refinamento (não alterar sem consultar o usuário)
- **Apenas estado Default** — estados Vazio e Erro fora do escopo.
- **Sem loading state** — sem Skeleton, sem placeholder.
- **Mock com valores literais do Figma** — sem `faker` para o dashboard.
- **Breakpoint único `≥1024px`** — `layout="desktop" | "mobile"`, consistente com AppLayout.
- **Figma vence** — em qualquer divergência entre spec e design, o Figma é a fonte de verdade.

## Decisões do `/plan` (não alterar sem consultar o usuário)
- **LineChart com 11 pontos** (sem Ago) — fiel ao snippet de Code Connect, não aos 12 meses da spec.
- **Estoque = 60 / 40 / 25 / 35** — campo `popularity` do `ProgressTable` do DS.
- **6 ícones semânticos do DS** nos InfoCards, em vez do default `IconAcUnit`.
- **URLs Desktop/Mobile do Figma estavam invertidas** — já corrigidas em `context.md` e `design-discovery.md`.
- **Mobile:** `ContentRow` é filho do `ContentGrid`; KPIs em flex-wrap, não em coluna única.

## Próximo passo
Execute `/work dashboard-visao-geral` em nova janela de chat.
