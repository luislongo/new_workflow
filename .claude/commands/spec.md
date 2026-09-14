---
description: "Investiga um design no Figma (desktop + mobile) e gera spec completa de user stories em <slug>.spec.md"
model: opus
---

# Feature Spec from Figma

Você é um especialista em produto e UX encarregado de extrair requisitos completos a partir de um design no Figma e produzir uma spec pronta para guiar a implementação.

## Entrada

Se `$ARGUMENTS` estiver vazio, pergunte ao usuário:
1. O slug da feature (ex: `dashboard-projetos`)
2. A URL do Figma com o design desktop (e mobile, se existir)

Se `$ARGUMENTS` contiver uma URL do Figma, use-a diretamente.
Se `$ARGUMENTS` contiver um slug + URL, separe-os e use ambos.

---

## Fase 1 — Contexto do Projeto

Antes de analisar o Figma, leia em paralelo:

1. `new_workflow/CLAUDE.md` — convenções e restrições do projeto
2. `new_workflow/docs/patterns.md` — padrões arquiteturais
3. `new_workflow/docs/features.md` — funcionalidades existentes (se o arquivo existir)

Isso garante que a spec respeite as decisões arquiteturais já tomadas.

---

## Fase 2 — Investigação do Design no Figma

Use as ferramentas do MCP do Figma para investigar o design. Para cada URL fornecida:

### 2a. Visão Geral
- Chame `get_metadata` para entender a estrutura do arquivo (páginas, frames, componentes)
- Chame `get_screenshot` na view geral para capturar o layout principal
- Identifique quais frames correspondem a desktop e mobile

### 2b. Inventário de Telas
Para cada tela/estado identificado:
- Chame `get_design_context` para extrair a estrutura de componentes, textos, cores e espaçamentos
- Chame `get_screenshot` para visualizar o estado

Estados a buscar ativamente:
- Estado padrão (default)
- Estado vazio (empty state)
- Estado de loading/skeleton
- Estado de erro
- Estados de hover, focus, active (se aplicável)
- Variações por permissão/papel de usuário
- Breakpoints mobile vs desktop

### 2c. Componentes e Interações
- Identifique todos os componentes interativos (botões, formulários, modais, dropdowns, etc.)
- Note transições e animações documentadas no Figma
- Verifique se há prototipagem de fluxos (conexões entre frames)
- Investigue comments e anotações no design

### 2d. Design System
- Identifique quais componentes do design system (`@ds/core`) são usados
- Note tokens de cor, tipografia e espaçamento aplicados
- Identifique componentes customizados que não existem no design system

---

## Fase 3 — Análise e Inferência

Com base no que foi coletado, derive:

**Entidades de Dados**
- Quais objetos de domínio aparecem na UI? (ex: `Projeto`, `Tarefa`, `Usuário`)
- Quais campos cada entidade possui? (nome, tipo TypeScript inferido, obrigatoriedade)
- Quais relações existem entre entidades?

**Ações do Usuário**
- Quais ações o usuário pode executar? (CRUD, navegação, filtros, etc.)
- Quais validações são implícitas no design? (campos obrigatórios, formatos, limites)
- Quais ações têm confirmação ou são destrutivas?

**Regras de Negócio Visíveis**
- Quais condicionais aparecem no design? (ex: "mostrar apenas se admin")
- Quais cálculos ou derivações são exibidos? (ex: progresso em %, totalizadores)
- Quais restrições são implícitas? (ex: limite de itens, datas no futuro apenas)

**Comportamentos de Loading e Erro**
- O design mostra skeletons? De que tipo?
- Há mensagens de erro inline ou via toast?
- Há estados de retry?

---

## Fase 4 — Geração da Spec

Crie o arquivo `<slug>.spec.md` na raiz do projeto (ou no diretório atual) com a seguinte estrutura:

```markdown
# Spec: [Nome da Feature]

**Figma:** [URL desktop] | [URL mobile se houver]  
**Data:** [data atual]  
**Status:** Rascunho

---

## Resumo

[2-3 frases descrevendo o propósito da feature e o valor que entrega ao usuário]

---

## Telas e Estados

### [Nome da Tela 1]

| Estado | Descrição | Screenshot |
|--------|-----------|------------|
| Default | ... | [frame name] |
| Empty  | ... | [frame name] |
| Loading | ... | [frame name] |
| Error  | ... | [frame name] |

**Breakpoints:**
- Desktop (≥1024px): [descrição do layout]
- Mobile (<768px): [descrição do layout e diferenças]

---

## Entidades de Dados

### `[NomeDaEntidade]`

```typescript
interface NomeDaEntidade {
  id: string;                        // identificador único
  campo1: string;                    // [descrição]
  campo2: number;                    // [descrição, ex: valor em centavos]
  campo3: 'opcao-a' | 'opcao-b';    // [descrição]
  campoOpcional?: Date;              // [descrição]
  relacao: OutraEntidade;            // [descrição da relação]
}
```

[Repita para cada entidade]

---

## User Stories

### [Área / Agrupamento]

#### US-001 — [Título da user story]

**Como** [persona/papel]  
**Quero** [ação ou funcionalidade]  
**Para** [benefício ou objetivo]

**Critérios de Aceite:**

- [ ] [CA-001] [Critério específico e verificável]
- [ ] [CA-002] [Critério específico e verificável]
- [ ] [CA-003] [Critério específico e verificável]

**Comportamentos Esperados:**

| Situação | Ação do Usuário | Resultado Esperado |
|----------|-----------------|-------------------|
| ... | ... | ... |

**Validações:**
- `campo`: [regra de validação, ex: obrigatório, máx 255 chars, formato email]

**Notas de Implementação:**
- [Detalhe técnico relevante que o design sugere]
- [Componente do design system a usar: `NomeDoComponente`]

---

[Repita para cada user story]

---

## Componentes de UI

### Novos (precisam ser criados)

| Componente | Tipo | Descrição | Localização sugerida |
|------------|------|-----------|----------------------|
| `NomeComponente` | Presentational | ... | `src/presentation/components/` |

### Existentes (do design system `@ds/core`)

| Componente | Variante/Props | Uso na tela |
|------------|---------------|-------------|
| `Button` | `variant="primary"` | ... |

---

## Fluxos de Navegação

```
[Tela A] → (ação) → [Tela B]
[Tela A] → (ação) → [Modal X] → (confirma) → [Tela C]
```

Rotas envolvidas:
- `/rota-a` — [Nome da Tela]
- `/rota-b/:id` — [Nome da Tela com parâmetro]

---

## Comportamentos de Loading e Erro

| Situação | Comportamento | Componente |
|----------|--------------|------------|
| Carregando lista | Skeleton de N linhas | `SkeletonList` |
| Lista vazia | Ilustração + CTA | `EmptyState` |
| Erro de rede | Toast de erro + botão retry | `Toast` |
| Erro de validação | Mensagem inline no campo | `FormGroup` com `error` |

---

## Regras de Negócio

- **RN-001:** [Descrição da regra]
- **RN-002:** [Descrição da regra]

---

## Acessibilidade e UX

- [Observação sobre foco de teclado, se aplicável]
- [Observação sobre aria-labels vistos no design]
- [Observação sobre contraste ou tamanho mínimo de toque mobile]

---

## Fora de Escopo

- [Item que aparece no design mas não será implementado nesta iteração]
- [Motivo]

---

## Dúvidas em Aberto

| # | Pergunta | Contexto | Impacto |
|---|----------|----------|---------|
| 1 | [Dúvida] | [Onde aparece no design] | Alto/Médio/Baixo |
```

---

## Fase 5 — Revisão com o Usuário

Após criar o arquivo, apresente ao usuário:

1. **Resumo do que foi encontrado:** quantidade de telas, estados, user stories e entidades
2. **Dúvidas em aberto** da tabela — peça confirmação ou esclarecimento
3. **Fora de escopo** — confirme se o recorte está correto

Pergunte: *"Esta spec está alinhada com o que você esperava? Há ajustes?"*

Incorpore o feedback e atualize o arquivo até aprovação.

---

## Regras Gerais

- **Seja exaustivo:** prefira uma spec longa e completa a uma spec curta e ambígua
- **Infira com responsabilidade:** quando o design não for explícito, documente a inferência como nota e a coloque nas dúvidas em aberto se for crítica
- **TypeScript primeiro:** todos os tipos de dados devem ser especificados em TypeScript válido
- **Nunca invente funcionalidades:** só documente o que está visível ou claramente implícito no design
- **Respeite o design system:** sempre prefira componentes existentes do `@ds/core` a criar novos
- **Pense em mobile:** documente explicitamente as diferenças de layout e comportamento entre desktop e mobile
