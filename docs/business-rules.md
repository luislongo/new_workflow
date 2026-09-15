# Regras de Negócio

> Esta aplicação é um objeto de estudo para pesquisa de MBA. As regras de negócio são simplificadas e servem como cenário realista para as tarefas de implementação — não representam um sistema de produção.

## Domínio: Empreendimentos

Um **empreendimento** representa um projeto imobiliário ou de construção civil cadastrado na plataforma.

### Tipo de empreendimento

Cada empreendimento tem exatamente um dos seguintes tipos:

| Tipo | Descrição |
|------|-----------|
| `Residencial` | Edificações habitacionais |
| `Comercial` | Edificações ou áreas de uso comercial |
| `Infraestrutura` | Obras de infraestrutura pública ou urbana |

O tipo é mutuamente exclusivo — somente um pode ser selecionado por cadastro.

### Campos obrigatórios no cadastro

- **Nome do empreendimento** — não pode ser vazio
- **Endereço de e-mail** — deve ser um e-mail válido (`z.string().email()`)
- **Tipo de empreendimento** — um dos três tipos acima deve ser selecionado

### Campos opcionais

- CEP — texto livre, sem validação de formato
- Endereço — texto livre
- Proprietário — texto livre

### Comportamento do submit

- **Submit válido**: salva no repositório em memória via use case `CreateEmpreendimento`; exibe `window.alert("Empreendimento cadastrado com sucesso!")`; ao fechar o alert, o formulário é resetado para o estado inicial.
- **Submit inválido**: erros inline abaixo de cada campo com problema; formulário permanece preenchido.

### Comportamento do Cancelar

- Reseta o formulário (`reset()` do React Hook Form)
- Permanece na rota `/empreendimento`
- Não persiste dados parciais

### Descarte silencioso

Trocar de aba na Navbar com o formulário preenchido descarta os dados sem confirmação.

## Persistência

O repositório (`InMemoryEmpreendimentoRepository`) nasce vazio a cada sessão — os dados de demonstração em `src/mocks/empreendimentos.ts` são usados apenas por telas de protótipo visual; eles **não passam pelo use case** nem pelo repositório da Clean Architecture.

## Domínio: Relatórios

### RN-001 — Aba Externo desabilitada

A aba "Externo" é exibida na `TabList` mas permanece desabilitada: não responde a cliques, não recebe foco por teclado e não tem conteúdo. Iteração futura.

### RN-002 — Filtro composto (AND)

Filtro de data e busca textual são aplicados em conjunto (AND lógico). O use case aplica os dois critérios simultaneamente.

### RN-003 — Exportação CSV fiel ao filtro

A exportação gera um arquivo CSV com as mesmas colunas e formatação da tabela ativa, refletindo apenas os dados atualmente filtrados (data + busca) — não o total. Tabela vazia gera CSV com apenas a linha de cabeçalho.

### RN-004 — Numeração `#` mantém índice original

A coluna `#` exibe o índice do registro na lista completa, não na lista filtrada. Com filtro ativo mostrando o 3º e o 7º registros, eles aparecem como `03` e `07` — não são renumerados. O CSV exporta o mesmo número exibido na tabela.

### RN-005 — Percentual concluído

`% Concluído` é um inteiro de 0 a 100 inclusive, exibido com sufixo `%` (ex: `85%`).

### RN-006 — Intervalo de datas nunca fica invertido

Mover uma das pontas do `DateRangeInput` além da outra arrasta a outra ponta junto, em vez de rejeitar a alteração. Assim o usuário consegue deslocar o intervalo em qualquer direção sem ter que alterar os dois campos numa ordem específica.

As datas são date-only e tratadas em UTC: `Data Início` vale a partir de `00:00:00.000Z` e `Data Fim` até `23:59:59.999Z` do dia escolhido, para que o último dia do intervalo não seja excluído. A exibição (`dd/MM/yyyy`) também usa UTC — sem isso, um usuário em fuso negativo veria cada data um dia antes.

### RN-007 — Busca é por aba

Trocar de aba limpa o termo de busca, inclusive quando a troca vem da navegação do browser (botão voltar) ou de um deep link. Cada aba pesquisa campos diferentes, então um termo válido em uma raramente faz sentido na outra.

### RN-008 — CSV é inerte ao abrir

Campos exportados que começam com `=`, `+`, `-`, `@`, TAB ou CR são prefixados com apóstrofo, para que Excel e Google Sheets os leiam como texto em vez de executá-los como fórmula.

---

## Fora de Escopo (v1)

- Listagem de empreendimentos cadastrados
- Edição ou exclusão de empreendimentos
- Busca automática por CEP
- Integração com API real
- Autenticação / controle de acesso
