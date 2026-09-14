# Design System

Pacote: `@luislongo/ds-core`

```tsx
import { ComponentName } from "@luislongo/ds-core"
import "@luislongo/ds-core/style.css" // importado uma vez em main.tsx
```

Componentes mapeados no Figma Code Connect devem ser importados deste pacote. A referência completa de componentes disponíveis está no README do pacote: `node_modules/@luislongo/ds-core/README.md`.

## Particularidades de composição

### `FormGroup` sem `children` já renderiza o próprio `Textbox`

Sem `children`, `FormGroup` cria o `Textbox` internamente, encaminha o `ref` e repassa `label`, `placeholder`, `error` e o restante das props recebidas. **Não compor `FormGroup` + `Textbox`** — um único `FormGroup` por campo de texto:

```tsx
<FormGroup
  label="Nome do empreendimento"
  placeholder="Ex.: Residencial Vista Verde"
  error={errors.nome?.message}
  {...register("nome")}
/>
```

Quando `children` é passado (por exemplo, um `<fieldset>` de radio buttons), `FormGroup` renderiza o conteúdo fornecido no lugar do `Textbox` e não repassa as props restantes — a composição do grupo fica a cargo de quem usa:

```tsx
<FormGroup error={errors.tipo?.message}>
  <fieldset>
    <legend>Tipo de empreendimento</legend>
    {/* <label><Radio ... />...</label> por opção */}
  </fieldset>
</FormGroup>
```

### `Navbar` ignora a própria prop `size`

A implementação do `Navbar` desestrutura e descarta `size` — quem esconde o rótulo no mobile é cada `NavbarTab` individualmente. Passe `size` em **cada** `NavbarTab`, nunca só na `Navbar`.

### `Navbar` é passada ao `AppHeader` pela prop `navbar`

`Navbar` não é um elemento irmão do `AppHeader` — é o valor da prop `navbar: ReactNode`:

```tsx
<AppHeader
  size={size}
  title="Aplicação"
  icon={<IconLocalLibrary />}
  avatar={<Avatar />}
  navbar={
    <Navbar>
      <NavbarTab size={size} label="Empreendimento" icon={<IconAddBusiness />} active onClick={...} />
    </Navbar>
  }
/>
```
