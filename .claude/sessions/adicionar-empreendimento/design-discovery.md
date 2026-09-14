# Descoberta de Componentes: Adicionar Empreendimento

## URLs do Design Figma

- **Desktop:** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/Plataforma-Visus?node-id=288-624&m=dev
- **Mobile:** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/Plataforma-Visus?node-id=404-1098&m=dev

## Componentes Identificados

| Componente (Figma) | Node ID | Componente DS (`@luislongo/ds-core`) | Code Connect | Observações |
|--------------------|---------|--------------------------------------|--------------|-------------|
| Header > Navbar | `I405:1302;376:245` | `Navbar` | A verificar | 3 tabs; `size="desktop"` |
| Header > NavbarTab × 3 | `I405:1302;376:245;466:152;429:4812` etc. | `NavbarTab` | A verificar | Aba 1 ativa; 2 e 3 disabled |
| DoubleColumn | `429:4884` | `DoubleColumn` | A verificar | `size="desktop"` no desktop, `"mobile"` no mobile |
| FormGroup × 5 (esquerda) | `I429:4884;393:661;429:4889` a `4893` | `FormGroup` | A verificar | Labels: Nome, E-mail, CEP, Endereço, Proprietário |
| RadioButton × 3 (direita) | `I429:4884;393:659;429:4898` a `4900` | `Radio` | A verificar | Residencial, Comercial, Infraestrutura |
| Button "Cancelar" | `403:1088` | `Button` variant="secondary" | A verificar | — |
| Button "Confirmar" | `403:1089` | `Button` variant="primary" | A verificar | — |
| H1 | `395:677` | `H1` | A verificar | "Adicionar empreendimento vazio" |
| Description | `395:678` | `Description` | A verificar | Subtítulo abaixo do H1 |
| AppHeader | `405:1302` (instância Header) | `AppHeader` | A verificar | Já em uso no AppLayout |

> **Nota Figma vs. spec:** O frame desktop mostra 4 `RadioButton` no XML (4898–4901), mas o screenshot confirma apenas 3 opções visíveis (Residencial, Comercial, Infraestrutura). Um dos radio nodes é provavelmente um artefato de layer. Implementar 3 opções conforme a spec e o screenshot.

## Ícones da Navbar (a confirmar no get_design_context)

| Aba | Ícone esperado (aproximado) |
|-----|-----------------------------|
| Empreendimento | Ícone de prédio/construção (visível no Figma) |
| Dashboards | Ícone de grade/widgets |
| Relatórios | Ícone de calendário/lista |

A preencher com os nomes exatos de `Icon*` exportados por `@luislongo/ds-core` durante `/plan`.
