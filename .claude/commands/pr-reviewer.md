---
description: "Revisa e resolve comentários automatizados de code review em um PR existente"
model: sonnet
---

Agora é solicitado que você revise comentários automatizados de um Pull Request (PR) já existente. Siga estes passos cuidadosamente para completar a tarefa:

1. Solicite ao usuário o número ou a URL do PR que será revisado.

2. Busque os comentários e checks do PR usando gh cli (por exemplo, `gh pr view <PR> --comments` e, quando útil, `gh pr checks <PR>`). Exiba os resultados para o usuário.

3. Analise cada comentário e classifique:
   a. Comentários que exigem correção
   b. Comentários que não devem ser seguidos por estarem desalinhados com as ADRs do projeto ou requisitos da tarefa ou por justificativa técnica forte
   c. Comentários inconclusivos — peça explicitamente ao usuário como proceder, informando se o comentário se enquadra em "a" ou "b"
   Em seguida, apresente a análise ao usuário e peça permissão antes de aplicar mudanças.

4. Para cada correção aprovada pelo usuário:
   a. Faça as mudanças necessárias no código
   b. Execute novamente todas as verificações de qualidade e padronização do projeto (testes unitários, linting, formatação e outras conforme documentação do projeto)
   c. Confirme que todas as verificações obrigatórias estão passando
   d. Faça commit das mudanças com uma mensagem clara e concisa
   e. Faça push para a mesma branch do PR
   f. Usando o gh cli, adicione uma resposta sucinta para cada comentário (no máximo 5 linhas) indicando se foi corrigido conforme sugestão ou com uma justificativa caso não tenha sido corrigido, e marque-o como "Resolvido"

5. Após concluir as correções e push (quando houver), notifique o usuário que a tarefa está completa e que o PR está pronto para revisão final e merge manual.

REGRAS DE OURO:
- Sempre faça commit APENAS dos arquivos que você alterou. Não use `git add .` para prevenir commits de arquivos que não deveriam ser commitados.
- Nunca faça push sem antes confirmar que TODAS as verificações obrigatórias do projeto estão passando (testes unitários, linting, formatação e outras conforme documentação do projeto).

Seu output final deve ser uma mensagem para o usuário, formatada da seguinte forma:

<task_completion_message>
Tarefa completada:
- Comentários automatizados do PR analisados
- Correções aprovadas aplicadas e pushed (se necessário)
- Verificações de qualidade e padronização do projeto estão passando (quando correções foram aplicadas)

[INSERT PR LINK]
</task_completion_message>
