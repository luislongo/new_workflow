# Progresso: Relatórios

## Última Atualização
2026-09-15

## Estado Atual
`/pre-pr` executado. Pronto para commit e `/pr`.

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
- Tailwind canonical classes usadas onde possível; larguras de coluna desktop derivadas das medidas dos frames do Figma (`479:1566` e `486:1862`).
- Espaçamento do container usa escala padrão do Tailwind (`p-4 lg:p-12`, `gap-4 lg:gap-6`) em vez dos tokens `px-600/py-600` previstos no plano: os valores do Figma são 16px (mobile) e 48px (desktop), e a escala padrão os expressa diretamente.
- `size` de `TabList` e `Tab` unificado na constante `tabSize` — antes `TabList` era responsivo e os `Tab` fixos em `"Large"`.

## Validação Visual vs. Figma (`/pre-pr`)
Comparação dos 4 frames (`479:1566`, `486:1862`, `486:2739`, `486:3402`) contra a implementação. Corrigido:
- `% Concluído` (Obras) usava `alignment="center"`; no Figma a célula é a variante alinhada à direita, igual a `Orçamento`/`Valor`.
- Larguras fixas de coluna do desktop ajustadas às medidas do Figma — `#` 60px; Financeiro: Tipo 140, Data 140, Valor 160, Método 180, Status 140.

Larguras do mobile mantidas mais estreitas que o Figma de propósito: os frames mobile do design têm 600px e 390px de largura com medidas divergentes entre si, e a tabela já rola horizontalmente (`overflow-x-auto`).
