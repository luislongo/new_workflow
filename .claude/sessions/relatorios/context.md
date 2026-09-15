# Contexto: Relatórios

## Objetivo

Entregar a tela de Relatórios (`/relatorios`) — uma visão analítica do portfólio de obras e dos lançamentos financeiros, organizada em abas temáticas, com filtro por intervalo de datas, busca textual e exportação CSV dos dados filtrados.

## Requisitos

### Navegação e layout

1. Nova rota `/relatorios`, registrada em `App.tsx` junto às demais.
2. A aba "Relatórios" do `AppLayout` deixa de ser `disabled` e passa a navegar para `/relatorios`, ficando ativa quando `pathname === "/relatorios"`.
3. O header mobile **mantém os três ícones da navbar** (sem rótulos), conforme o Figma — a spec original dizia "apenas logo + avatar", e o Figma prevalece.
4. Três abas de conteúdo: **Obras** (default), **Financeiro**, **Externo** (desabilitada, sem foco por teclado, sem conteúdo).
5. A aba ativa sincroniza com a URL via query param: `/relatorios?tab=financeiro` é um deep link válido. Sem o param, a aba Obras é a ativa.

### Aba Obras

6. Tabela com as colunas `#`, `Obra`, `Tipo`, `% Concluído`, `Orçamento`, `Status`.
7. `Orçamento` formatado como moeda brasileira **sem centavos** (ex: `R$ 4.560.000`).
8. `% Concluído` exibido como inteiro com sufixo `%` (ex: `85%`).
9. `dataInicio` alimenta o filtro de período, mas **não é exibida** na tabela.

### Aba Financeiro

10. Tabela com as colunas `#`, `Descrição`, `Tipo`, `Data`, `Valor`, `Método`, `Status`.
11. `Data` formatada como `dd/MM/yyyy`; `Valor` como moeda brasileira **com centavos** (ex: `R$ 128.500,00`).

### Toolbar

12. Campo de busca **expandido por padrão**, ocupando a largura disponível. Placeholder muda por aba: `"Buscar obras..."` / `"Buscar lançamentos..."`.
13. Busca case-insensitive, em tempo real. Obras: incide sobre nome, tipo e status. Financeiro: sobre descrição, tipo, método e status.
14. Ao trocar de aba, **a busca é resetada**; o filtro de data é preservado.
15. Filtro de intervalo com dois campos, "Data Início" e "Data Fim". **Default fixo: 01/01/2026 – 31/01/2026** (ver Restrições).
16. Validação: Data Início ≤ Data Fim.
17. Botão "Exportar" na toolbar de ambas as abas ativas.

### Exportação

18. Clique em "Exportar" dispara download direto de um CSV com os dados **atualmente filtrados** (data + busca), não o total.
19. O CSV reproduz exatamente as colunas visíveis da aba ativa, com os mesmos rótulos no cabeçalho e os valores **já formatados** (moeda, percentual, data) — incluindo a coluna `#`.
20. Separador `;` e codificação UTF-8 com BOM, para abrir corretamente no Excel.
21. Tabela vazia exporta um CSV contendo apenas a linha de cabeçalho.

### Dados

22. Entidades `Obra`, `LancamentoFinanceiro` e `FiltroRelatorio` sobem de `src/mocks/types.ts` para `domain/`.
23. `src/mocks/relatorios.ts` é reescrito com os **10 registros literais de cada aba conforme o Figma** (substituindo a geração via faker).

## Critérios de Aceite

### US-001 — Acessar a tela de Relatórios

- [ ] CA-001 A navegação exibe "Empreendimento", "Dashboards" e "Relatórios", cada um com seu ícone
- [ ] CA-002 Ao acessar `/relatorios`, o item "Relatórios" aparece destacado na navegação
- [ ] CA-003 A tela carrega com a aba "Obras" ativa por padrão
- [ ] CA-004 Em mobile o header exibe logo, os três ícones da navbar (sem rótulos) e o avatar

### US-002 — Navegar entre as abas

- [ ] CA-001 As três abas são exibidas: Obras (ativa por padrão), Financeiro, Externo (desabilitada)
- [ ] CA-002 Clicar em "Obras" exibe a tabela de obras e marca a aba como ativa
- [ ] CA-003 Clicar em "Financeiro" exibe a tabela de lançamentos e marca a aba como ativa
- [ ] CA-004 A aba "Externo" não responde a cliques nem recebe foco por teclado
- [ ] CA-005 O toolbar (busca + filtro de data + exportar) é exibido em ambas as abas ativas
- [ ] CA-006 Trocar de aba atualiza o query param `?tab=` na URL
- [ ] CA-007 Acessar `/relatorios?tab=financeiro` diretamente abre a aba Financeiro

### US-003 — Visualizar lista de obras

- [ ] CA-001 A tabela exibe as colunas `#`, `Obra`, `Tipo`, `% Concluído`, `Orçamento`, `Status`
- [ ] CA-002 O campo `#` exibe o índice com dois dígitos (`01`, `02`, …)
- [ ] CA-003 `Orçamento` é formatado como moeda brasileira sem centavos (ex: `R$ 4.560.000`)
- [ ] CA-004 `% Concluído` exibe o valor inteiro com sufixo `%` (ex: `85%`)
- [ ] CA-005 `Status` exibe o texto do status (Em andamento, Concluída, Atrasada, Não iniciada)
- [ ] CA-006 Sem dados, a tabela exibe apenas o cabeçalho

### US-004 — Visualizar lançamentos financeiros

- [ ] CA-001 A tabela exibe as colunas `#`, `Descrição`, `Tipo`, `Data`, `Valor`, `Método`, `Status`
- [ ] CA-002 `Tipo` exibe `Receita` ou `Despesa`
- [ ] CA-003 `Data` é formatada como `dd/MM/yyyy` (ex: `05/01/2026`)
- [ ] CA-004 `Valor` é formatado como moeda brasileira com centavos (ex: `R$ 128.500,00`)
- [ ] CA-005 `Método` exibe o método de pagamento
- [ ] CA-006 `Status` exibe o texto do status (Confirmado, Pago, Pendente, Vencido)
- [ ] CA-007 Sem dados, a tabela exibe apenas o cabeçalho

### US-005 — Filtrar por intervalo de datas

- [ ] CA-001 O filtro exibe dois campos: "Data Início" e "Data Fim"
- [ ] CA-002 O valor default é `01/01/2026` – `31/01/2026`
- [ ] CA-003 Alterar as datas re-filtra a tabela para o intervalo informado
- [ ] CA-004 Em desktop, o filtro de data fica na mesma linha que o botão Exportar
- [ ] CA-005 Em mobile, o filtro fica abaixo da busca, ocupando a largura total
- [ ] CA-006 Data Início posterior a Data Fim não é aceita

### US-006 — Buscar por texto

- [ ] CA-001 O campo de busca está expandido e visível por padrão
- [ ] CA-002 Placeholder na aba Obras: `"Buscar obras..."`
- [ ] CA-003 Placeholder na aba Financeiro: `"Buscar lançamentos..."`
- [ ] CA-004 A busca é case-insensitive e filtra as linhas conforme o usuário digita
- [ ] CA-005 Para Obras, a busca incide sobre nome, tipo e status
- [ ] CA-006 Para Financeiro, sobre descrição, tipo, método e status
- [ ] CA-007 Ao trocar de aba, o campo de busca é resetado

### US-007 — Exportar dados como CSV

- [ ] CA-001 O botão "Exportar" está visível na toolbar de ambas as abas ativas
- [ ] CA-002 Em desktop, o botão aparece à direita do filtro de data
- [ ] CA-003 Em mobile, o botão aparece alinhado à direita, abaixo do filtro de data
- [ ] CA-004 Clicar em "Exportar" inicia o download direto do CSV da aba ativa
- [ ] CA-005 O CSV reproduz as colunas visíveis, com os mesmos rótulos e valores formatados
- [ ] CA-006 O arquivo reflete os dados filtrados (data + busca), não o total
- [ ] CA-007 O CSV usa `;` como separador e UTF-8 com BOM
- [ ] CA-008 Com a tabela vazia, o CSV contém apenas a linha de cabeçalho

## Regras de Negócio

- **RN-001** A aba "Externo" é exibida mas permanece desabilitada — não clicável, sem foco por teclado, sem conteúdo.
- **RN-002** Filtro de data e busca textual são aplicados em conjunto (AND lógico).
- **RN-003** A exportação é CSV, com as mesmas colunas e formatação da tabela, refletindo os dados filtrados.
- **RN-004** A numeração `#` **mantém o índice original** do registro na lista completa. Com filtro ativo exibindo o 3º e o 7º registros, eles aparecem como `03` e `07` — não são renumerados. O CSV exporta esse mesmo número.
- **RN-005** `% Concluído` é um inteiro de 0 a 100 inclusive.

## Restrições e Premissas

### Decisões tomadas no refinamento (não alterar sem consultar o usuário)

1. **Dados literais do Figma.** `src/mocks/relatorios.ts` abandona o faker e passa a conter os 10 registros exatos de cada aba conforme os frames. Segue o precedente do `InMemoryDashboardRepository`, que também usou valores literais do Figma.
2. **Filtro default fixo em janeiro/2026**, não "primeiro e último dia do mês corrente" como dizia a spec. Motivo: os dados do Figma são de janeiro/2026; um default de mês corrente abriria a tela vazia. Este requisito substitui o CA-002 original da US-005.
3. **Datas de `Obra.dataInicio` dentro de janeiro/2026**, para que as 10 obras apareçam sob o filtro default. O campo não é exibido na tabela, apenas alimenta o filtro.
4. **Filtragem em use case parametrizado** — `execute(filtro)` devolve a lista já filtrada, mantendo a RN-002 em `application/`.
5. **Exportação em use case `ExportarRelatorio`**, com a entrega do arquivo abstraída por uma porta `IArquivoDownloader` para não acoplar o use case ao browser.
6. **`#` mantém o índice original** (RN-004), não renumera após filtragem.
7. **Deep link `?tab=` existe** — a aba ativa sincroniza com a URL.
8. **Busca resetada ao trocar de aba**; filtro de data preservado.

### Divergências resolvidas a favor do Figma

- **Header mobile**: a spec pedia "apenas logo + avatar"; o Figma mostra os três ícones da navbar. Vale o Figma — nada muda no `AppLayout` além de ativar a terceira aba.
- **Formato de exportação**: o Resumo da spec dizia "JSON"; a US-007 e a RN-003 detalham CSV. Vale CSV.

### Premissas

- Não há backend: os dados vêm de repositório in-memory, conforme `docs/stack.md`.
- Os nomes abreviados no frame mobile (`Lot. Sol Nascente`, `Conj. Hab. Vida Nova`) são truncamento visual do designer, não dados distintos. Os nomes completos são usados; o scroll horizontal da tabela cuida do overflow.
- Sem estados de loading e erro, seguindo o precedente do Dashboard (`if (data === null) return null`). A spec marca ambos como "não especificado".

## Fora de Escopo

- Conteúdo da aba "Externo" — iteração futura.
- Ordenação por coluna (o `TableHeaderCell` do DS suporta, mas o Figma não a exibe).
- Paginação ou scroll infinito — o design mostra 10 linhas fixas.
- Filtros avançados por tipo, status ou método.
- Edição ou detalhamento de registros — não há ação de clique nas linhas.
- Persistência dos filtros entre sessões.

## Design

- **Figma URL:** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/MBA?node-id=479-1566&m=dev

| Frame | Node ID | Descrição |
|-------|---------|-----------|
| Relatórios — Obras (Desktop) | `479:1566` | Estado default da aba Obras |
| Relatórios — Financeiro (Desktop) | `486:1862` | Estado default da aba Financeiro |
| Relatórios — Obras (Mobile) | `486:2739` | Layout vertical, tabela com scroll horizontal |
| Relatórios — Financeiro (Mobile) | `486:3402` | Layout vertical, tabela com scroll horizontal |

## Dados de Referência (extraídos do Figma)

### Obras

| # | Obra | Tipo | % Concluído | Orçamento | Status |
|---|------|------|-------------|-----------|--------|
| 01 | Residencial Aurora | Residencial | 85% | R$ 4.560.000 | Em andamento |
| 02 | Edifício Central | Comercial | 62% | R$ 2.840.000 | Em andamento |
| 03 | Loteamento Sol Nascente | Loteamento | 100% | R$ 1.875.000 | Concluída |
| 04 | Condomínio Parque das Flores | Residencial | 35% | R$ 5.670.000 | Em andamento |
| 05 | Torre Norte Empresarial | Comercial | 48% | R$ 3.225.000 | Atrasada |
| 06 | Vila Verde Residências | Residencial | 15% | R$ 2.100.000 | Em andamento |
| 07 | Parque Industrial Oeste | Industrial | 0% | R$ 8.200.000 | Não iniciada |
| 08 | Conjunto Habitacional Vida Nova | Residencial | 92% | R$ 1.350.000 | Em andamento |
| 09 | Galpão Logístico BR-101 | Industrial | 58% | R$ 4.750.000 | Atrasada |
| 10 | Centro Comunitário Esperança | Institucional | 100% | R$ 2.400.000 | Concluída |

### Lançamentos Financeiros

| # | Descrição | Tipo | Data | Valor | Método | Status |
|---|-----------|------|------|-------|--------|--------|
| 01 | Medição Fundação – Res. Aurora | Receita | 05/01/2026 | R$ 128.500,00 | Transferência | Confirmado |
| 02 | Compra Cimento – Ed. Central | Despesa | 08/01/2026 | R$ 45.200,00 | Boleto | Pago |
| 03 | Medição Estrutura – Cond. Parque | Receita | 10/01/2026 | R$ 214.800,00 | PIX | Confirmado |
| 04 | Aluguel Equipamentos – Torre Norte | Despesa | 12/01/2026 | R$ 32.600,00 | Débito Automático | Pago |
| 05 | Medição Alvenaria – Vila Verde | Receita | 15/01/2026 | R$ 187.350,00 | Transferência | Pendente |
| 06 | Mão de Obra – Res. Aurora | Despesa | 18/01/2026 | R$ 76.400,00 | Boleto | Pago |
| 07 | Medição Cobertura – Lot. Sol | Receita | 20/01/2026 | R$ 95.000,00 | PIX | Confirmado |
| 08 | Transporte Material – Galpão BR-101 | Despesa | 22/01/2026 | R$ 18.900,00 | Cartão | Pago |
| 09 | Medição Acabamento – Vida Nova | Receita | 25/01/2026 | R$ 63.750,00 | Transferência | Pendente |
| 10 | Licença Ambiental – Pq. Industrial | Despesa | 28/01/2026 | R$ 12.800,00 | Boleto | Vencido |
