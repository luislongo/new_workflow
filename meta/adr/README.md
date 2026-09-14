# ADRs — new_workflow

Registro de decisões arquiteturais do projeto. Cada ADR documenta uma decisão de design significativa: o contexto em que foi tomada, as alternativas consideradas e as consequências esperadas.

## Índice

| # | Título | Status | Categoria |
|---|--------|--------|-----------|
| [0001](0001-roteamento-com-react-router.md) | Roteamento com React Router DOM | Ativa | Navegação |
| [0002](0002-formularios-e-validacao.md) | Formulários e validação | Ativa | Dados |
| [0003](0003-principios-solid-e-arquitetura-limpa.md) | Arquitetura Limpa Completa | Ativa | Arquitetura |
| [0004](0004-design-system.md) | Design System | Ativa | UI |

## Grafo de dependências

```
ADR-0003 (arquitetura limpa)
  └── ADR-0001 (roteamento)        ← rotas ficam na camada de apresentação
  └── ADR-0002 (formulários)       ← validação fica na camada de apresentação
```

## Template

Novas ADRs devem seguir o [TEMPLATE.md](TEMPLATE.md).
