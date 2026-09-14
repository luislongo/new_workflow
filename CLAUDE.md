# new_workflow

Aplicação React de **gestão de projetos** com cinco telas. Utiliza documentação estruturada (este CLAUDE.md, docs/, ADRs) e Figma Code Connect.

## Documentação do Projeto

Consulte os arquivos abaixo antes de implementar lógica de domínio, adicionar telas ou alterar componentes:

| Arquivo | Conteúdo |
|---------|----------|
| `docs/stack.md` | Tecnologias, frameworks e ferramentas |
| `docs/patterns.md` | Padrões arquiteturais e de código |
| `docs/features.md` | Funcionalidades principais e telas |
| `docs/business-rules.md` | Regras de negócio implementadas |
| `docs/design-system.md` | Design system — pacote, imports e Code Connect |

## Restrições e Decisões Arquiteturais

Leia os ADRs em `meta/adr/` antes de propor mudanças de stack, arquitetura ou padrões. Comece pelo [meta/adr/README.md](meta/adr/README.md).

| ADR | Título | Status |
|-----|--------|--------|
| [ADR-0001](meta/adr/0001-roteamento-com-react-router.md) | Roteamento com React Router DOM | Ativa |
| [ADR-0002](meta/adr/0002-formularios-e-validacao.md) | Formulários e validação | Ativa |
| [ADR-0003](meta/adr/0003-principios-solid-e-arquitetura-limpa.md) | Arquitetura Limpa Completa | Ativa |
| [ADR-0004](meta/adr/0004-design-system.md) | Design System | Ativa |

## Convenções rápidas

**Estrutura de tela**

```
src/presentation/screens/<NomeTela>/
├── <NomeTela>.tsx     # componente principal da tela
└── index.ts           # re-export público
```

Telas acessam dados via `useContainer()` de `presentation/context/ContainerContext`. Nunca importar de `infrastructure/` dentro de `presentation/`.

**Comandos**

```bash
npm run dev            # localhost:5173
npm run build          # tsc + vite build
npm run lint           # oxlint
```

## Sessão Ativa

Verifique `.claude/sessions/` para features em andamento. Para retomar: `/work <slug>`.
