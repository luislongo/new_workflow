# Regras de Negócio

> Esta aplicação é um objeto de estudo para pesquisa de MBA. As regras de negócio são simplificadas e servem como cenário realista para as tarefas de implementação — não representam um sistema de produção.

## Domínio: Projetos

### Status válidos

Um projeto tem exatamente um dos seguintes status:
- `Planejado` — projeto aprovado, ainda não iniciado
- `Em andamento` — execução ativa
- `Pausado` — execução suspensa temporariamente
- `Concluído` — todas as entregas finalizadas

### Campos obrigatórios no cadastro

- Nome do projeto
- Cliente
- Data de início
- Gerente responsável

### Progresso

- Valor inteiro entre 0 e 100 (porcentagem)
- Calculado com base nas entregas concluídas sobre o total
- Exibido como barra de progresso no `ProjectCard`
- Um projeto `Concluído` tem progresso = 100

## Dashboard — Indicadores

| KPI | Cálculo |
|-----|---------|
| Projetos Ativos | `count(status = 'Em andamento')` |
| No Prazo | `count(termino >= hoje AND status != 'Concluído')` |
| Orçamento Utilizado | `sum(gasto) / sum(orçamento) × 100` |
| Membros da Equipe | `count(distinct membros em projetos ativos)` |

O filtro de período (manutenção planejada) deve restringir todos os indicadores ao intervalo de datas selecionado.

## Fluxo de Cadastro (Wizard)

Sequência de etapas e seus campos obrigatórios:

| Etapa | Campos obrigatórios |
|-------|---------------------|
| 1. Informações Básicas | Nome, Cliente, Data de início |
| 2. Equipe | Gerente responsável |
| 3. Orçamento | Valor total |
| *(4. Revisão — a adicionar)* | — (leitura) |
| 4/5. Confirmação | — (submit) |

Regra de navegação: o botão "Próximo" só avança quando os campos obrigatórios da etapa atual estão preenchidos.

## Tabela de Dados

- Ordenação padrão: por ID crescente
- Ordenação por coluna (manutenção planejada): alternância asc/desc ao clicar no cabeçalho
- Não há paginação no scaffold inicial; será adicionada quando o volume de dados demandar
