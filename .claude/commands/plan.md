---
description: "Cria o plano de implementação faseado em .claude/sessions/<slug>/plan.md"
model: opus
---

# Engineer Reason

Este é o comando para iniciar o planejamento de uma funcionalidade.

## Análise

Leia os arquivos context.md e architecture.md na pasta `.claude/sessions/$ARGUMENTS/` se ainda não tiver feito.
Se `$ARGUMENTS` estiver vazio, pergunte ao usuário o feature slug antes de prosseguir (ex: `novo-endpoint-integracao`).

### Descoberta de Design (quando houver Figma URL)

Se `context.md` contiver uma `Figma URL` na seção `## Design`:

1. Use o MCP do Figma (`get_design_context` com a URL) para obter o design context e a lista de componentes presentes no design.
2. Para cada componente retornado com Code Connect, o design context já traz o snippet de código pronto — anote o componente DS correspondente (`@luislongo/ds-core`) e o node ID.
3. Para componentes sem Code Connect, registre que precisam ser criados na aplicação.
4. Preencha a tabela em `.claude/sessions/$ARGUMENTS/design-discovery.md` com os resultados.

Se não houver Figma URL, pule esta etapa.

Sua tarefa agora é criar o arquivo `.claude/sessions/$ARGUMENTS/plan.md` com um plano de implementação detalhado para esta funcionalidade. O objetivo desta documentação é criar uma abordagem de implementação faseada que nos permita construir a funcionalidade incrementalmente, testando cada fase conforme avançamos. E também deve tornar possível retomar o trabalho caso nossa sessão seja interrompida.

O plan.md deve dividir a implementação em fases, cada fase com um pedaço do trabalho que pode ser realizado por um humano em 2 horas.

O template para o plan.md é:

<plan>
# [NOME DA FUNCIONALIDADE]

Se você está trabalhando nesta funcionalidade, certifique-se de atualizar este arquivo plan.md conforme progride.

## Descoberta de Componentes

> Omitir esta seção se não houver design Figma.

**Figma URL:** [URL do frame ou página no Figma]

| Componente (Figma) | Node ID | Componente DS (`@luislongo/ds-core`) | Code Connect | Observações |
|--------------------|---------|--------------------------------------|--------------|-------------|
| [Nome no Figma]    | [ID]    | `<ComponentName />`                  | ✅ Mapeado   | Snippet retornado pelo design context |
| [Nome no Figma]    | [ID]    | —                                    | ❌ Ausente   | Criar na aplicação |

## FASE 1 [Completada ✅]

Detalhes desta parte da funcionalidade

### Uma tarefa que foi feita [Completada ✅]

Detalhes sobre a tarefa

### Uma tarefa que foi feita [Completada ✅]

Detalhes sobre a tarefa

### Comentários:
- Algo que aconteceu e nos forçou a mudar de direção
- Algo que aprendemos durante o desenvolvimento
- Algo que discutimos e concordamos

## FASE 2 [Em Progresso ⏰]

### Uma tarefa que precisa ser feita [Em Progresso ⏰]

Detalhes sobre a tarefa

### Uma tarefa que precisa ser feita [Não Iniciada ⏳]

Detalhes sobre a tarefa

## FASE 3 [Não Iniciada ⏳]

### Uma tarefa que precisa ser feita [Não Iniciada ⏳]

Detalhes sobre a tarefa

### Uma tarefa que precisa ser feita [Não Iniciada ⏳]

Detalhes sobre a tarefa

</plan>


Dicas:
   - Analise detalhes específicos de implementação
   - Use WebSearch e WebFetch para melhores práticas ou documentação de bibliotecas (se necessário)

No caso desta pesquisa levantar uma nova decisão arquitetural ou contradição com as decisões anteriores, você iniciará uma discussão sobre isso com o humano, concordará com as mudanças e atualizará o documento architecture.md para aquela funcionalidade se necessário.

Este documento também deve anotar quais tarefas precisam ser feitas sequencialmente ou em paralelo.

Uma vez que o plan.md esteja finalizado e o humano concorde com o seu entendimento:

1. Se fez a descoberta de design, garanta que `design-discovery.md` está preenchido com a tabela completa de componentes.
2. Atualize o `CLAUDE.md` em `.claude/sessions/$ARGUMENTS/`: mude a seção "Próximo passo" para `Execute /work $ARGUMENTS em nova janela de chat.`
3. Informe ao humano que ELE deve prosseguir para o próximo passo através do comando `/work $ARGUMENTS` em nova janela de chat.

IMPORTANTE: Não inicie nenhuma implementação aqui neste passo.
