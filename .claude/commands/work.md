---
description: "Implementa a feature em .claude/sessions/<slug>/ fase por fase, com validação ao final de cada fase"
model: sonnet
---

# Engineer Work

Estamos atualmente trabalhando em uma funcionalidade especificada em `.claude/sessions/$ARGUMENTS/`.
Se `$ARGUMENTS` estiver vazio, pergunte ao usuário o feature slug antes de prosseguir.

Para trabalhar nisso, siga esta ordem:

1. Leia `.claude/sessions/$ARGUMENTS/CLAUDE.md` para o briefing da sessão
2. Leia `.claude/sessions/$ARGUMENTS/progress.md` se existir — indica onde a sessão anterior parou e qual é o próximo passo imediato
3. Leia os demais arquivos em `.claude/sessions/$ARGUMENTS/` (context.md, architecture.md, plan.md)
4. Se existir `.claude/sessions/$ARGUMENTS/design-discovery.md`, leia-o — ele contém a Figma URL e a tabela de componentes mapeados ao DS via Code Connect. Ao implementar fases de UI, use esses mapeamentos para importar os componentes corretos de `@luislongo/ds-core`; se precisar de mais detalhes de um componente específico, use `get_design_context` com a Figma URL ou node ID registrado.
5. Revise o plan.md e identifique qual Fase está atualmente em progresso
6. Apresente ao usuário um resumo do estado atual e um plano para abordar a próxima fase

Importante:

Quando você desenvolver o código para a fase atual, use sub-agentes quando apropriado para preservar o máximo possível do seu contexto:
- Para exploração de código: agent do tipo `Explore` (busca em arquivos e símbolos sem comprometer contexto)
- Para revisão de código: Agent com subagent_type `branch-code-reviewer`
- Para planejamento de testes: Agent com subagent_type `branch-test-planner`

Use a ferramenta **TodoWrite** para rastrear as tarefas da fase atual enquanto trabalha, marcando cada item como completo ao concluir.

Toda vez que completar uma fase do plano:
- Se a fase implementou UI e há uma Figma URL disponível, chame `get_screenshot` para o frame ou node correspondente e compare visualmente com o que foi implementado. Anote discrepâncias relevantes antes de apresentar ao usuário.
- Pause e peça ao usuário para validar seu código.
- Faça as mudanças necessárias até ser aprovado
- Atualize a fase correspondente no arquivo plan.md marcando o que foi feito e adicionando comentários úteis para o desenvolvedor que abordará as próximas fases, especialmente sobre questões, decisões, etc.
- Atualize `.claude/sessions/$ARGUMENTS/progress.md` com o que foi concluído, o próximo passo imediato, e decisões tomadas. Use este template:

  ```markdown
  # Progresso: [Nome da Feature]

  ## Última Atualização
  [Data]

  ## Estado Atual
  Fase [X] — [Em Progresso / Concluída]

  ## O Que Foi Feito Nesta Sessão
  - [Item 1]

  ## Próximo Passo Imediato
  [Primeira tarefa pendente, específica o suficiente para retomar sem reler tudo]

  ## Decisões Tomadas
  - [Decisão e justificativa breve]
  ```

- Apenas inicie a próxima fase após o usuário concordar que você deve começar. Quando iniciar a próxima fase, atualize o arquivo plan.md marcando a nova fase como em progresso.

Agora, veja a fase atual de desenvolvimento e forneça um plano ao usuário sobre como abordá-la.

Quando todas as fases do plan.md estiverem concluídas, informe ao usuário que o próximo passo é executar `/pre-pr` para as verificações finais antes de abrir o Pull Request.
