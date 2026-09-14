# Sessão: Adicionar Empreendimento

Você está trabalhando na feature **Adicionar Empreendimento**.

Esta é a **primeira tela real** da aplicação e o **primeiro uso completo** da Clean Architecture definida no ADR-0003. O esqueleto existe (`domain/index.ts` vazio, `IContainer = {}`, `container = {}`), mas nenhuma entidade, use case, repositório ou tela foram implementados ainda.

## Arquivos desta sessão

- `context.md` — Requisitos aprovados (campos, CAs, RNs, textos, rotas)
- `architecture.md` — Notas arquiteturais: camadas a criar, integrações, padrões de código
- `design-discovery.md` — Componentes do Figma mapeados ao DS (a completar em `/plan`)
- `plan.md` — Fases de implementação (gerado por `/plan`)
- `progress.md` — Estado atual e próximo passo imediato (atualizado por `/work`)

## Decisões já tomadas (não reabrir)

| Ponto | Decisão |
|-------|---------|
| Arquitetura | Clean Architecture completa — entidade em `domain/`, use case, repositório em `infrastructure/` |
| Submit | Grava no repositório em memória via use case; exibe `alert("Empreendimento cadastrado com sucesso!")` |
| Repositório | Nasce vazio (mocks são dados de demonstração, separados) |
| Navbar | 3 abas (Empreendimento ativa, Dashboards/Relatórios desabilitadas) |
| Mobile | Abas visíveis como ícones sem rótulo (segue Figma, não a spec textual) |
| Cancelar | Reseta formulário, permanece em `/empreendimento` |
| Rota raiz | `/` → redirect para `/empreendimento` |
| Validação e-mail | `z.string().email()` (Zod padrão, mais estrito que `x@x.x`) |

## Próximo passo

Execute `/plan adicionar-empreendimento` em nova janela de chat.
