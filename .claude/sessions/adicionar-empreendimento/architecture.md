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

## Considerações Técnicas

### FormGroup + Radio com React Hook Form

`FormGroup` tem `forwardRef` — compatível com `register()`. `Radio` também tem `forwardRef`. O padrão para radio buttons com RHF:

```tsx
<input type="radio" value="Residencial" {...register("tipo")} />
```

Ou usar o componente `Radio` do DS passando `{...register("tipo")} value="Residencial"`.

### DoubleColumn para layout responsivo

O DS exporta `DoubleColumn` com prop `size: "desktop" | "mobile"`. Detectar breakpoint com hook de media query:

```tsx
const isDesktop = useMediaQuery("(min-width: 1024px)");
<DoubleColumn size={isDesktop ? "desktop" : "mobile"} slotLeft={...} slotRight={...} />
```

> O `@luislongo/ds-core` não tem `useMediaQuery`. Implementar na aplicação com `window.matchMedia`.

### Navbar no AppLayout

O `AppLayout` atual usa apenas `AppHeader`. Adicionar `Navbar` + `NavbarTab` abaixo do `AppHeader`:

```tsx
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, NavbarTab } from "@luislongo/ds-core";

const { pathname } = useLocation();

<Navbar>
  <NavbarTab label="Empreendimento" icon={<IconX />} active={pathname === "/empreendimento"} onClick={() => navigate("/empreendimento")} />
  <NavbarTab label="Dashboards"     icon={<IconY />} disabled />
  <NavbarTab label="Relatórios"     icon={<IconZ />} disabled />
</Navbar>
```

Ícones do Figma: `IconEmpreendimento` (aba 1), `IconDashboard`/`IconWidgets` (aba 2), `IconRelatorios`/`IconCalendarMonth` (aba 3) — confirmar na etapa de design discovery.

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
