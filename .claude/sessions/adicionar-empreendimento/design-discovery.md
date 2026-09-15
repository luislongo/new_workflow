# Descoberta de Componentes: Adicionar Empreendimento

## URLs do Design Figma

- **File key:** `s3BAU9djJ4fZWidxHbeMaB` (Plataforma Visus)
- **Desktop:** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/Plataforma-Visus?node-id=288-624&m=dev
- **Mobile:** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/Plataforma-Visus?node-id=404-1098&m=dev

Descoberta executada via MCP do Figma (`get_design_context` + `get_code_connect_map`) em 2026-09-14.

## Componentes Identificados

Todos os componentes do design possuem Code Connect — **nenhum componente novo precisa ser criado** na aplicação.

| Componente (Figma) | Node ID | Componente DS (`@luislongo/ds-core`) | Code Connect | Snippet retornado |
|--------------------|---------|--------------------------------------|--------------|-------------------|
| Header (desktop) | `405:1302` | `AppHeader` | ✅ Mapeado | `<AppHeader size="desktop" title="Título" icon={<IconLocalLibrary />} navbar={...} avatar={<img .../>} />` |
| Header (mobile) | `405:1334` | `AppHeader` | ✅ Mapeado | `<AppHeader size="mobile" ... />` |
| NavbarTab — Empreendimento | `0:43` | `NavbarTab` | ✅ Mapeado | `<NavbarTab label="Empreendimento" icon={<IconAddBusiness />} active />` |
| NavbarTab — Dashboards | `0:55` | `NavbarTab` | ✅ Mapeado | `<NavbarTab label="Dashboards" icon={<IconDashboard />} />` |
| NavbarTab — Relatórios | `0:62` | `NavbarTab` | ✅ Mapeado | `<NavbarTab label="Relatórios" icon={<IconEventNote />} />` |
| H1 | `395:677` (desktop) / `404:1102` (mobile) | `H1` (de `Typography`) | ✅ Mapeado | `<H1>Adicionar empreendimento vazio</H1>` |
| Description | `395:678` (desktop) / `404:1103` (mobile) | `Description` (de `Typography`) | ✅ Mapeado | `<Description>Preencha as informações necessárias para cadastrar o empreendimento</Description>` |
| DoubleColumn (desktop) | `429:4884` | `DoubleColumn` | ✅ Mapeado | `<DoubleColumn size="desktop" />` |
| DoubleColumn (mobile) | `429:5015` | `DoubleColumn` | ✅ Mapeado | `<DoubleColumn size="mobile" />` |
| FormGroup × 5 (campos de texto) | `0:75`, `0:81`, `0:87`, `0:93`, `0:99` | `FormGroup` | ✅ Mapeado | `<FormGroup />` (label passado como prop) |
| FormGroup (grupo de tipo) | `0:107` | `FormGroup` | ✅ Mapeado | `<FormGroup label="Tipo de empreendimento" />` |
| FormGroup — Residencial | `0:118` | `FormGroup` | ✅ Mapeado | `<FormGroup label="Residencial" />` |
| FormGroup — Comercial | `0:122` | `FormGroup` | ✅ Mapeado | `<FormGroup label="Comercial" />` |
| FormGroup — Infraestrutura | `0:120` | `FormGroup` | ✅ Mapeado | `<FormGroup label="Infraestrutura" />` |
| Textbox × 5 | `0:79`, `0:85`, `0:91`, `0:97`, `0:103` | `Textbox` | ✅ Mapeado | `<Textbox state="default" />` |
| Radio | `0:110`, `0:112`, `0:114`, `0:116` | `Radio` | ✅ Mapeado | `<Radio />` |
| Button "Cancelar" | `403:1088` (desktop) / `404:1122` (mobile) | `Button` | ✅ Mapeado | `<Button variant="secondary" size="md">Cancelar</Button>` |
| Button "Confirmar" | `403:1089` (desktop) / `404:1123` (mobile) | `Button` | ✅ Mapeado | `<Button variant="primary" size="md">Confirmar</Button>` |

## Ícones da Navbar — confirmados

| Aba | Ícone (`@luislongo/ds-core`) |
|-----|------------------------------|
| Empreendimento | `IconAddBusiness` |
| Dashboards | `IconDashboard` |
| Relatórios | `IconEventNote` |
| Logo do AppHeader | `IconLocalLibrary` |

## Achados que divergem das notas iniciais

### 1. `Navbar` fica DENTRO de `AppHeader` (prop `navbar`)

O `architecture.md` previa `Navbar` como irmã abaixo do `AppHeader`. O Code Connect mostra que o `AppHeader` recebe a navbar por prop:

```tsx
<AppHeader
  size="desktop"
  title="Aplicação"
  icon={<IconLocalLibrary />}
  navbar={
    <Navbar>
      <NavbarTab label="Empreendimento" icon={<IconAddBusiness />} active />
      <NavbarTab label="Dashboards" icon={<IconDashboard />} />
      <NavbarTab label="Relatórios" icon={<IconEventNote />} />
    </Navbar>
  }
  avatar={<Avatar />}
/>
```

### 2. `size` do `AppHeader` também é responsivo

Além do `DoubleColumn`, o `AppHeader` tem `size="desktop" | "mobile"`. No mobile os `NavbarTab` aparecem só com ícone (sem rótulo) — consistente com a decisão já registrada no `CLAUDE.md` da sessão. O mesmo hook `useMediaQuery` serve aos dois componentes.

### 3. `Radio` não tem prop `label`

`RadioProps` só estende `InputHTMLAttributes<HTMLInputElement>` sem `label`. O rótulo de cada opção precisa ser composto na aplicação com `<label>` ou `Label` do DS:

```tsx
<label>
  <Radio value="Residencial" {...register("tipo")} />
  Residencial
</label>
```

### 4. `Radio` tem 4 nós no Figma, mas só 3 são visíveis

Confirmado nos screenshots desktop e mobile: **3 opções** (Residencial, Comercial, Infraestrutura). O 4º nó (`0:116`) é artefato de layer. Implementar 3.

### 5. Ordem visual das opções

Os screenshots confirmam a ordem: **Residencial · Comercial · Infraestrutura**. Seguir essa ordem (diferente da ordem dos node IDs no Figma).

### 6. `title` do AppHeader

O Code Connect traz `title="Título"` (placeholder do componente DS), mas o screenshot mostra **"Aplicação"** — usar `"Aplicação"` na implementação.

## Layout — medidas do design

| Aspecto | Desktop (`288:624`) | Mobile (`404:1098`) |
|---------|---------------------|---------------------|
| Container de conteúdo | `max-width: 800px`, `padding: 48px 0`, centralizado | `max-width: 800px`, `padding: 48px 12px 12px`, centralizado |
| Gap entre blocos | `10px` | `10px` |
| Colunas | 2 (campos à esquerda, tipo à direita) | 1 (campos, depois tipo) |
| Rodapé de botões | alinhado à direita, gap `10px` | alinhado à direita, gap `10px` |
| Navbar | ícone + rótulo | somente ícone |
