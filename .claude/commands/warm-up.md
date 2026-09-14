---
description: "Confirma CLAUDE.md carregado, verifica sessão ativa em .claude/sessions/ e prepara para trabalho"
model: sonnet
---

# Project Warm-up

O `CLAUDE.md` da raiz já é carregado automaticamente pelo Claude Code. Este comando complementa esse contexto com o que não é carregado automaticamente.

Leia os seguintes recursos em PARALELO:

1. **CLAUDE.md raiz**
   Confirme que está carregado e apresente um resumo compacto: documentação disponível e restrições arquiteturais ativas. Se não existir, leia `README.md` como substituto e avise o usuário que `/generate-docs` e `/extract-adr-from-docs` ainda não foram executados.

2. **Sessão Ativa**
   Verifique se existe alguma pasta em `.claude/sessions/`. Se existir, leia o `CLAUDE.md` dentro da mais recente e informe ao usuário qual feature está em andamento e qual é o próximo passo.

3. **Confirmação**
   Apresente um resumo compacto: restrições ativas (do CLAUDE.md), feature em andamento (se houver), próximo passo — e confirme que está pronto para receber a tarefa.
