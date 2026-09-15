# Progresso: Relatórios

## Última Atualização
2026-09-15

## Estado Atual
Todas as fases concluídas. Pronto para `/pre-pr`.

## O Que Foi Feito Nesta Sessão
- FASE 1: domain (`Relatorio.ts`, `IRelatorioRepository`, `IArquivoDownloader`), use cases (`GetRelatorioObras`, `GetRelatorioFinanceiro`, `ExportarRelatorio`), infrastructure (`InMemoryRelatorioRepository`, `BlobArquivoDownloader`, `container.ts`)
- FASE 2: mocks literais (10 obras + 10 lançamentos do Figma), `mocks/types.ts` passa a reexportar do `domain/`
- FASE 3–6: tela `Relatorios.tsx` com rota `/relatorios`, abas + `useSearchParams`, toolbar responsiva, tabelas Obras e Financeiro com dados filtrados, exportação CSV
- FASE 7: `docs/features.md` e `docs/business-rules.md` atualizados

## Próximo Passo Imediato
Executar `/pre-pr` para verificações finais e abrir PR.

## Decisões Tomadas
- Funções de formatação colocadas em `src/application/formatters.ts` (e não em `presentation/`) para que `ExportarRelatorio` possa importá-las sem violar a regra de dependência do ADR-0003. A tela importa as mesmas funções do mesmo arquivo.
- FASES 3–6 foram implementadas em um único componente (`Relatorios.tsx`): os dois `useEffect` rodam sempre (obras e financeiro), evitando loading ao trocar de aba e simplificando o componente. O guard `if (obras === null || lancamentos === null) return null` cobre o estado inicial.
- Tailwind canonical classes usadas onde possível (`w-14`, `w-30`, `w-35`, `w-25`); `w-[110px]` mantido onde não há equivalente canônico Tailwind.
