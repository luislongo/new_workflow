---
description: "Executa 5 agents em paralelo (code review, docs, testes, metaspec, qualidade) e aplica correções antes do PR"
model: opus
---

Estamos quase terminando o trabalho neste branch e nos preparando para abrir um pull request. Agora é hora de fazer as verificações finais e limpezas para garantir que estamos alinhados com nossos padrões e objetivos.

## Validação Visual (quando houver design Figma)

Antes de invocar os agents, verifique se existe `.claude/sessions/*/design-discovery.md` com uma Figma URL. Se sim:

1. Para cada tela ou frame implementado nesta feature, chame `get_screenshot` no node correspondente do Figma.
2. Compare visualmente o screenshot do Figma com a implementação — foco em layout, espaçamentos, cores e componentes usados.
3. Liste as discrepâncias encontradas (se houver) e corrija as que forem objetivas (componente errado, cor fora do token, espaçamento claramente diferente). Discrepâncias subjetivas ou fora de escopo devem ser listadas para revisão do usuário.

Só avance para os agents após concluir ou pular esta etapa.

---

Você deve invocar os seguintes 5 agents em PARALELO usando a ferramenta Agent. Executar em paralelo é crucial para minimizar o tempo total de execução.

Invoque os seguintes agents em PARALELO usando a ferramenta Agent (`subagent_type` deve corresponder exatamente ao `name` definido no frontmatter do agent):

1. Agent com subagent_type: `branch-code-reviewer`
2. Agent com subagent_type: `documentation-writer`
3. Agent com subagent_type: `branch-test-planner`
4. Agent com subagent_type: `branch-metaspec-checker`
5. Agent com subagent_type: `branch-quality-checker`

Após o término da execução dos cinco subagentes, consolide os feedbacks e aplique as correções nesta ordem de prioridade:

1. **branch-quality-checker** — aplique primeiro; erros de linting, formatação e tipagem são bloqueantes
2. **branch-code-reviewer** — corrija todos os itens críticos (bugs, segurança, performance); itens menores a seu critério
3. **branch-metaspec-checker** — resolva desvios de alinhamento com CLAUDE.md e meta specs
4. **branch-test-planner** — implemente apenas testes de alta prioridade (P1); os demais ficam para o backlog
5. **documentation-writer** — aplique atualizações de docs e CLAUDE.md geradas pelo agente

IMPORTANTE: Não commit nada sozinho! Apenas faça as alterações localmente e depois me mostre um resumo de todas as mudanças que você fez. Depois de revisar o resumo, eu mesmo farei o commit.

Uma vez que você terminar, me peça para revisar, fazer o commit e iniciar o comando /pr para abrir o pull request.
