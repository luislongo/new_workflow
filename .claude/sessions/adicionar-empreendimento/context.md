# Contexto: Adicionar Empreendimento

## Objetivo

Tela de cadastro de um novo empreendimento (projeto imobiliário/construção civil). O usuário preenche dados básicos e confirma com um `alert()` nativo. Introduce a primeira entidade de domínio real e a primeira rota/tela da aplicação.

## Requisitos

### Entidade de Dados

```typescript
// src/domain/Empreendimento.ts
export type TipoEmpreendimento = "Residencial" | "Comercial" | "Infraestrutura";

export interface Empreendimento {
  readonly id: number;
  readonly nome: string;
  readonly email: string;
  readonly cep: string;
  readonly endereco: string;
  readonly proprietario: string;
  readonly tipo: TipoEmpreendimento;
}

export type CreateEmpreendimentoInput = Omit<Empreendimento, "id">;
```

> **Nota:** `src/mocks/types.ts` já define esses tipos idênticos. Após criar a entidade em `domain/`, `mocks/types.ts` deve reexportá-la ou ser deduplicado — manter apenas uma fonte de verdade.

### Arquitetura (Clean Architecture completa)

Seguir o checklist do ADR-0003 para esta feature:

- `domain/Empreendimento.ts` — entidade e tipos derivados
- `domain/repositories/IEmpreendimentoRepository.ts` — porta de saída
- `application/usecases/CreateEmpreendimento.ts` — use case
- `infrastructure/repositories/InMemoryEmpreendimentoRepository.ts` — repositório em memória (nasce vazio)
- `infrastructure/container.ts` — fiado o novo use case/repositório
- `application/IContainer.ts` — expõe `createEmpreendimento`
- `presentation/screens/AdicionarEmpreendimento/` — tela

### Campos do Formulário

| Campo | Label | Placeholder | Obrigatório | Validação |
|-------|-------|-------------|-------------|-----------|
| `nome` | "Nome do empreendimento" | "Ex.: Residencial Vista Verde" | ✅ | Não vazio |
| `email` | "Endereço de e-mail" | "contato@exemplo.com" | ✅ | `z.string().email()` |
| `cep` | "CEP" | "00000-000" | ❌ | Texto livre |
| `endereco` | "Endereço" | "Rua, número, bairro" | ❌ | Texto livre |
| `proprietario` | "Proprietário" | "Nome completo" | ❌ | Texto livre |
| `tipo` | "Tipo de empreendimento" | — | ✅ | Um dos 3 valores do enum |

### Radio Buttons — Tipo de Empreendimento

3 opções exatamente: Residencial · Comercial · Infraestrutura. Agrupadas com `<fieldset>` / label de grupo "Tipo de empreendimento".

### Navbar

3 abas (conforme Figma):
- **Empreendimento** — rota `/empreendimento` (ativa nesta tela)
- **Dashboards** — desabilitada (`disabled`) — rota não existe
- **Relatórios** — desabilitada (`disabled`) — rota não existe

### Rotas

- `/empreendimento` — tela principal desta feature
- `/` → redirect para `/empreendimento`

## Critérios de Aceite

### US-001 — Cadastro

- [CA-001] Tela exibe campos: Nome do empreendimento, Endereço de e-mail, CEP, Endereço, Proprietário e Tipo de empreendimento
- [CA-002] "Tipo de empreendimento" é um grupo de radio buttons com exatamente 3 opções: Residencial, Comercial, Infraestrutura
- [CA-003] Apenas um tipo pode ser selecionado por vez
- [CA-004] Ao clicar "Confirmar" com formulário válido: `alert("Empreendimento cadastrado com sucesso!")` + formulário resetado
- [CA-005] Ao clicar "Cancelar": formulário resetado, permanece na tela
- [CA-006] Desktop (≥ 1024 px): campos de texto na coluna esquerda, radio buttons na coluna direita (DoubleColumn size="desktop")
- [CA-007] Mobile (< 768 px): coluna única — campos primeiro, tipo abaixo (DoubleColumn size="mobile")
- [CA-008] Aba "Empreendimento" aparece como ativa nesta tela
- [CA-009] Clicar em outra aba da Navbar com formulário preenchido descarta os dados silenciosamente

### US-002 — Validação

- [CA-010] Nome vazio ao submeter → erro inline abaixo do campo
- [CA-011] E-mail vazio ou formato inválido ao submeter → erro inline abaixo do campo
- [CA-012] Tipo não selecionado ao submeter → erro inline abaixo do grupo de radio buttons
- [CA-013] CEP, Endereço e Proprietário não bloqueiam o submit
- [CA-014] Cada mensagem de erro é exibida inline abaixo do campo correspondente

## Regras de Negócio

- **RN-001:** Tipos válidos: Residencial, Comercial, Infraestrutura
- **RN-002:** Tipo é mutuamente exclusivo
- **RN-003:** Nome e e-mail são os únicos campos obrigatórios
- **RN-004:** Formulário não persiste estado parcial — Cancelar ou trocar de aba descarta tudo silenciosamente
- **RN-005:** Submit bem-sucedido: `window.alert("Empreendimento cadastrado com sucesso!")`
- **RN-006:** Cancelar: `reset()` do React Hook Form, permanece em `/empreendimento`

## Comportamento de Loading/Erro

| Situação | Comportamento |
|----------|---------------|
| Campo obrigatório vazio no submit | Erro inline abaixo do campo |
| E-mail com formato inválido | Erro inline no campo |
| Tipo não selecionado | Erro inline abaixo do grupo |
| Submit válido | `alert()` nativo; ao fechar, formulário resetado |

## Fora de Escopo

- Listagem de empreendimentos
- Edição ou exclusão
- Busca automática por CEP
- Integração com API real

## Textos de UI (Figma)

- **H1:** "Adicionar empreendimento vazio"
- **Descrição:** "Preencha as informações necessárias para cadastrar o empreendimento"
- **Botões:** "Cancelar" (secondary/outline) · "Confirmar" (primary)

## Design

- **Figma Desktop:** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/Plataforma-Visus?node-id=288-624&m=dev
- **Figma Mobile:** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/Plataforma-Visus?node-id=404-1098&m=dev
