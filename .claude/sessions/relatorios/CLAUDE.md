# Sessão: Relatórios

Você está trabalhando na feature **Relatórios** — tela `/relatorios` com abas Obras / Financeiro / Externo, filtro por período, busca textual e exportação CSV.

## Arquivos desta sessão

- `context.md` — Requisitos aprovados, critérios de aceite, regras de negócio e os dados de referência extraídos do Figma
- `architecture.md` — Notas arquiteturais, camadas afetadas e decisões técnicas
- `design-discovery.md` — Componentes do Figma mapeados ao DS (preenchido em `/plan`)
- `plan.md` — Fases de implementação (gerado por `/plan`)
- `progress.md` — Estado atual e próximo passo imediato (atualizado por `/work`)

## Decisões do refinamento (não alterar sem consultar o usuário)

1. **Dados literais do Figma** — `src/mocks/relatorios.ts` abandona o faker e recebe os 10 registros exatos de cada aba. Segue o precedente do `InMemoryDashboardRepository`.
2. **Filtro default fixo em 01/01/2026 – 31/01/2026**, não "mês corrente" como dizia a spec original. Os dados do Figma são de janeiro/2026; mês corrente abriria a tela vazia.
3. **`Obra.dataInicio` dentro de janeiro/2026** para as 10 obras — alimenta o filtro, não é exibida.
4. **Filtragem em use case parametrizado** — `execute(filtro)` devolve a lista já filtrada; a RN-002 fica em `application/`.
5. **Exportação em use case `ExportarRelatorio`**, com a entrega do arquivo abstraída pela porta `IArquivoDownloader` (implementada em `infrastructure/`), para não acoplar o use case ao browser.
6. **Coluna `#` mantém o índice original** do registro na lista completa — não renumera após filtrar. Linhas 3 e 7 filtradas aparecem como `03` e `07`.
7. **Deep link `?tab=financeiro` existe** — a aba ativa sincroniza com a URL via `useSearchParams`.
8. **Busca resetada ao trocar de aba**; filtro de data preservado.
9. **Header mobile mantém os três ícones da navbar** — o Figma vence a spec, que dizia "apenas logo + avatar".
10. **Exportação é CSV**, não JSON — o Resumo da spec estava desatualizado frente à US-007.
11. **Sem estados de loading e erro** — precedente do Dashboard (`if (data === null) return null`).

## Decisões do `/plan`

_A preencher._

## Próximo passo

Execute `/plan relatorios` em nova janela de chat.
