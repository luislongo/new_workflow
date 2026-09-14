---
description: "Abre um Pull Request com título padronizado, template de descrição e validações obrigatórias"
model: sonnet
---

Agora é solicitado que você faça um PR. Siga estes passos cuidadosamente para completar a tarefa:

1. Verifique se há mudanças não commitadas. Se houver, **não prossiga para a abertura do PR enquanto a branch ou working tree não estiver limpo**. Pergunte ao usuário se deseja fazer commit das alterações, sugerindo uma mensagem de commit clara e concisa que resuma as alterações. Se o usuário não autorizar o commit, oriente-o a limpar o working tree por meio de `git stash` ou descarte das mudanças. **Se a branch ou working tree continuar com mudanças não commitadas, interrompa o comando e não abra o PR.**

2. Solicite a target_branch do usuário para o PR. Use este branch como o branch base para o PR.

3. Determine o título do PR seguindo o padrão do projeto:
   a. Use Conventional Commits como prefixo (feat:, fix:, docs:, refactor:, test:, chore:, etc.)
   b. Depois do prefixo, use o nome do branch ou uma descrição em português
   c. Exemplos:
      - "feat: Story/279197/novo endpoint para cadastro de integracoes personalizadas"
      - "fix: Bug/279417/Ajuste-na-geracao-do-token-embed"
      - "docs: Atualização da documentação de APIs"
   d. Mantenha o restante do título em português

4. Antes de abrir o PR, confirme com o usuário que o `/pre-pr` foi executado e que todas as verificações obrigatórias do projeto estão passando (testes unitários, linting, formatação e outras conforme documentação do projeto). Se o usuário não puder confirmar, interrompa o comando.

5. Use o gh cli e abra um Pull Request (PR), passando o target_branch informado pelo usuário como o branch base para o PR, junto com os detalhes da implementação:
   a. **IMPORTANTE**: Escreva toda a descrição do PR em PORTUGUÊS
   b. Use o seguinte template para o corpo do PR:

      ```markdown
      ## Resumo

      [Descrição clara do que foi implementado e por quê]

      ## Mudanças

      - [Mudança principal 1]
      - [Mudança principal 2]

      ## Arquitetura

      [Decisões de design relevantes, padrões seguidos, justificativas — ou "Sem mudanças arquiteturais" se não houver]

      ## Testes

      - [ ] Testes unitários adicionados/atualizados
      - [ ] Linting e formatação passando
      - [ ] [Outros critérios específicos do projeto]

      ## Notas de Deploy

      [Migrações, variáveis de ambiente, mudanças de configuração necessárias — ou "Nenhuma" se não houver]
      ```
   c. Use `gh pr create` com `--body` passado via heredoc para evitar problemas de escape

REGRAS DE OURO:
- Sempre faça commit APENAS dos arquivos que você alterou. Não use `git add .` para prevenir commits de arquivos que não deveriam ser commitados.
- Nunca abra um PR nem envie um push em um PR já aberto sem antes confirmar que TODAS as verificações obrigatórias do projeto estão passando (testes unitários, linting, formatação e outras conforme documentação do projeto).

Seu output final deve ser uma mensagem para o usuário, formatada da seguinte forma:

<task_completion_message>
Tarefa completada:
- Mudanças commitadas (se aplicável)
- PR aberto: [INSERT PR TITLE]

Execute `/pr-reviewer` para analisar os comentários automatizados de code review.

O PR está agora pronto para sua revisão final e merge manual.

[INSERT PR LINK]
</task_completion_message>
