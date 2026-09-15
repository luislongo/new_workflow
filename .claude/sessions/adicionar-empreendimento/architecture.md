# Notas Arquiteturais: Adicionar Empreendimento

## Decisões Relevantes

| ADR | Impacto nesta feature |
|-----|-----------------------|
| ADR-0001 — React Router DOM | Rota `/empreendimento`; redirect `/` → `/empreendimento`; `useLocation` no AppLayout para destacar aba ativa |
| ADR-0002 — React Hook Form + Zod | `useForm` + `zodResolver`; schema em `AdicionarEmpreendimento.schema.ts`; `register` nos campos DS; `handleSubmit` no form |
| ADR-0003 — Clean Architecture | **Esta é a primeira feature real** — implementa a arquitetura de ponta a ponta; entidade em `domain/`, use case em `application/`, repositório em `infrastructure/`, tela em `presentation/` |
| ADR-0004 — Design System | `FormGroup`, `Textbox`, `Radio`, `DoubleColumn`, `Navbar`, `NavbarTab`, `Button` de `@luislongo/ds-core`; sem componentes de UI ad-hoc |

## Pontos de Integração

### Camada `domain/`

```
src/domain/
├── Empreendimento.ts                       # TipoEmpreendimento, Empreendimento, CreateEmpreendimentoInput
├── repositories/
│   └── IEmpreendimentoRepository.ts        # create(input): Promise<Empreendimento>
└── index.ts                                # re-export
```

### Camada `application/`

```
src/application/
├── IContainer.ts                           # adicionar: createEmpreendimento: CreateEmpreendimento
├── usecases/
│   └── CreateEmpreendimento.ts             # recebe IEmpreendimentoRepository via construtor
└── index.ts
```

### Camada `infrastructure/`

```
src/infrastructure/
├── repositories/
│   └── InMemoryEmpreendimentoRepository.ts # nasce com array vazio; gera id auto-increment
└── container.ts                            # instancia repositório + use case; expostos em IContainer
```

### Camada `presentation/`

```
src/presentation/
├── components/
│   └── AppLayout/
│       └── AppLayout.tsx                   # adicionar Navbar com 3 NavbarTabs; useLocation para ativa
└── screens/
    └── AdicionarEmpreendimento/
        ├── AdicionarEmpreendimento.tsx      # componente principal
        ├── AdicionarEmpreendimento.schema.ts  # Zod schema
        └── index.ts
```

### `App.tsx`

```tsx
<Routes>
  <Route path="/" element={<Navigate to="/empreendimento" replace />} />
  <Route path="/empreendimento" element={<AdicionarEmpreendimento />} />
</Routes>
```

## Decisões tomadas no `/plan` (2026-09-14)

| Ponto | Decisão | Motivo |
|-------|---------|--------|
| Método do use case | `execute()` | ADR-0003 não definia o nome. Esta é a primeira use case do projeto — vira precedente. Registrar como adendo no ADR-0003. |
| Grupo de radio buttons | `<fieldset>`/`<legend>` dentro de `FormGroup` (sem a prop `label`) | O `htmlFor` gerado pelo `FormGroup` apontaria para elemento inexistente. O `FormGroup` continua fornecendo a renderização da mensagem de erro. |
| Validação dos CAs | Manual no navegador + `npm run lint` + `npm run build` | O projeto não tem infraestrutura de testes. Adicioná-la seria mudança de stack e exigiria ADR novo. |

## Considerações Técnicas

### `FormGroup` já renderiza o próprio `Textbox`

Inspeção de `@luislongo/ds-core@0.0.7` (`dist/index.js`):

```tsx
<div className="flex flex-col gap-100">
  {label && <Label htmlFor={id} className={error ? "text-danger-500" : ...}>{label}</Label>}
  {children ?? <Textbox ref={ref} id={id} hasError={!!error} disabled={disabled} {...rest} />}
  {error && <Caption className="text-danger-500">{error}</Caption>}
</div>
```

Consequências:

- **Não compor `FormGroup` + `Textbox`.** Sem `children`, o `FormGroup` cria o `Textbox`, encaminha o `ref` e repassa o resto das props. Um único componente por campo de texto:

  ```tsx
  <FormGroup
    label="Nome do empreendimento"
    placeholder="Ex.: Residencial Vista Verde"
    error={errors.nome?.message}
    {...register("nome")}
  />
  ```

  > O `design-discovery.md` lista `FormGroup ×5` **e** `Textbox ×5` como nós separados no Figma — em código são o mesmo componente.

- Sem a prop `id`, o `FormGroup` deriva o `id` de `label.toLowerCase().replace(/\s+/g, "-")`. Os seis labels desta tela são distintos, então não há colisão.
- Com `children` presentes, as props restantes **não** são repassadas — é por isso que o grupo de radio buttons precisa montar o próprio markup.

### Grupo de radio buttons

`RadioProps` não tem `label` (confirmado no `design-discovery.md`), e o `Radio` renderiza um `<span>` com o `<input type="radio">` dentro — envolver em `<label>` funciona para associar rótulo e controle.

```tsx
const TIPOS = ["Residencial", "Comercial", "Infraestrutura"] as const;

<FormGroup error={errors.tipo?.message}>
  <fieldset className="flex flex-col gap-200">
    <legend className="text-sm text-neutral-600">Tipo de empreendimento</legend>
    {TIPOS.map((tipo) => (
      <label key={tipo} className="flex items-center gap-200">
        <Radio value={tipo} {...register("tipo")} />
        {tipo}
      </label>
    ))}
  </fieldset>
</FormGroup>
```

`register("tipo")` devolve o mesmo `name` para os três inputs — é o agrupamento nativo de radio que garante a exclusividade mútua (RN-002 / CA-003).

### `erasableSyntaxOnly: true` proíbe parameter properties

`tsconfig.app.json` habilita `erasableSyntaxOnly`. O atalho `constructor(private readonly repo: ...)` **não compila**. Atribuir o campo explicitamente:

```ts
export class CreateEmpreendimento {
  private readonly repository: IEmpreendimentoRepository;

  constructor(repository: IEmpreendimentoRepository) {
    this.repository = repository;
  }

  async execute(input: CreateEmpreendimentoInput): Promise<Empreendimento> {
    return this.repository.create(input);
  }
}
```

O mesmo vale para o repositório em memória. `verbatimModuleSyntax: true` também exige `import type { ... }` para imports exclusivamente de tipo, e `noUnusedLocals`/`noUnusedParameters` quebram o build com variáveis não usadas.

### Responsividade — um único breakpoint

O DS não exporta hooks. Implementar `presentation/hooks/useMediaQuery.ts` com `window.matchMedia` + `useSyncExternalStore` (React 19 já disponível), que evita o flash de layout errado na hidratação.

Um único ponto de corte governa a tela inteira: `(min-width: 1024px)` → `desktop`, abaixo disso → `mobile`. Três componentes consomem o mesmo valor:

```tsx
const isDesktop = useMediaQuery("(min-width: 1024px)");
const size = isDesktop ? "desktop" : "mobile";

<AppHeader size={size} ... />
<NavbarTab size={size} ... />
<DoubleColumn size={size} slotLeft={...} slotRight={...} />
```

### Navbar fica DENTRO do AppHeader e o `size` vai em cada NavbarTab

Duas correções às notas iniciais:

1. A `Navbar` é passada ao `AppHeader` pela prop `navbar` (ver `design-discovery.md`), não como irmã abaixo dele.
2. **O componente `Navbar` ignora a própria prop `size`** — na implementação do DS ela é desestruturada como `size: _size` e nunca usada. Quem esconde o rótulo no mobile é o `NavbarTab` (`size === "desktop" && <span>{label}</span>`). Portanto o `size` precisa ir em **cada** `NavbarTab`, não na `Navbar`.

```tsx
import { useLocation, useNavigate } from "react-router-dom";
import { AppHeader, Navbar, NavbarTab, IconLocalLibrary, IconAddBusiness, IconDashboard, IconEventNote } from "@luislongo/ds-core";

const { pathname } = useLocation();
const navigate = useNavigate();

<AppHeader
  size={size}
  title="Aplicação"
  icon={<IconLocalLibrary />}
  avatar={<Avatar />}
  navbar={
    <Navbar>
      <NavbarTab size={size} label="Empreendimento" icon={<IconAddBusiness />} active={pathname === "/empreendimento"} onClick={() => navigate("/empreendimento")} />
      <NavbarTab size={size} label="Dashboards" icon={<IconDashboard />} disabled />
      <NavbarTab size={size} label="Relatórios" icon={<IconEventNote />} disabled />
    </Navbar>
  }
/>
```

Ícones confirmados na descoberta de design: `IconAddBusiness`, `IconDashboard`, `IconEventNote`, `IconLocalLibrary`.

### Container de conteúdo do AppLayout

O `AppLayout` atual usa `max-w-[1200px] p-800`. O design pede `max-width: 800px` centralizado, com `padding: 48px 0` no desktop e `48px 12px 12px` no mobile (ver `design-discovery.md`).

### Zod schema

```ts
// AdicionarEmpreendimento.schema.ts
import { z } from "zod";

export const empreendimentoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cep: z.string().optional(),
  endereco: z.string().optional(),
  proprietario: z.string().optional(),
  tipo: z.enum(["Residencial", "Comercial", "Infraestrutura"], {
    required_error: "Selecione o tipo de empreendimento",
  }),
});

export type EmpreendimentoFormData = z.infer<typeof empreendimentoSchema>;
```

### Deduplicação de tipos em `mocks/types.ts`

`mocks/types.ts` define `TipoEmpreendimento`, `Empreendimento` e `CreateEmpreendimentoInput` idênticos ao que vai para `domain/`. Após criar `domain/Empreendimento.ts`, atualizar `mocks/types.ts` para reexportar de `domain/` — ou substituir as definições por imports.

> Atenção: `mocks/` não pode importar de outras camadas do projeto (ADR-0003 — mocks ficam "fora das camadas"). Neste caso a direção é a correta: `domain/` não importa de `mocks/`, mas `mocks/` pode importar de `domain/` — domínio é a camada mais interna.
