# Adicionar Empreendimento

Se você está trabalhando nesta feature, certifique-se de atualizar este arquivo plan.md conforme progride.

## Descoberta de Componentes

**Figma Desktop:** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/Plataforma-Visus?node-id=288-624&m=dev
**Figma Mobile:** https://www.figma.com/design/s3BAU9djJ4fZWidxHbeMaB/Plataforma-Visus?node-id=404-1098&m=dev

| Componente (Figma) | Node ID | Componente DS (`@luislongo/ds-core`) | Code Connect | Observações |
|--------------------|---------|--------------------------------------|--------------|-------------|
| Header (desktop) | `405:1302` | `AppHeader` | ✅ Mapeado | `<AppHeader size="desktop" title="Aplicação" icon={<IconLocalLibrary />} navbar={...} avatar={...} />` |
| Header (mobile) | `405:1334` | `AppHeader` | ✅ Mapeado | `<AppHeader size="mobile" ... />` |
| NavbarTab — Empreendimento | `0:43` | `NavbarTab` | ✅ Mapeado | `<NavbarTab label="Empreendimento" icon={<IconAddBusiness />} active size={size} />` |
| NavbarTab — Dashboards | `0:55` | `NavbarTab` | ✅ Mapeado | `<NavbarTab label="Dashboards" icon={<IconDashboard />} disabled size={size} />` |
| NavbarTab — Relatórios | `0:62` | `NavbarTab` | ✅ Mapeado | `<NavbarTab label="Relatórios" icon={<IconEventNote />} disabled size={size} />` |
| H1 | `395:677` / `404:1102` | `H1` | ✅ Mapeado | `<H1>Adicionar empreendimento vazio</H1>` |
| Description | `395:678` / `404:1103` | `Description` | ✅ Mapeado | `<Description>Preencha as informações necessárias...</Description>` |
| DoubleColumn (desktop) | `429:4884` | `DoubleColumn` | ✅ Mapeado | `<DoubleColumn size="desktop" slotLeft={...} slotRight={...} />` |
| DoubleColumn (mobile) | `429:5015` | `DoubleColumn` | ✅ Mapeado | `<DoubleColumn size="mobile" ... />` |
| FormGroup ×5 (texto) | vários | `FormGroup` | ✅ Mapeado | Sem `children` → renderiza `Textbox` internamente; passar `label`, `placeholder`, `error` e `{...register("campo")}` direto no `FormGroup` |
| FormGroup (tipo, wrapper) | `0:107` | `FormGroup` | ✅ Mapeado | Sem `label` — só `error`; `children` = `fieldset` com radio buttons |
| Radio ×3 | `0:110`–`0:114` | `Radio` | ✅ Mapeado | Sem prop `label`; envolver em `<label>` nativo. 4º nó (`0:116`) é artefato de layer — ignorar |
| Button "Cancelar" | `403:1088` / `404:1122` | `Button` | ✅ Mapeado | `<Button variant="secondary" size="md">Cancelar</Button>` |
| Button "Confirmar" | `403:1089` / `404:1123` | `Button` | ✅ Mapeado | `<Button variant="primary" size="md" type="submit">Confirmar</Button>` |

**Ícones confirmados:**

| Aba | Ícone |
|-----|-------|
| Empreendimento | `IconAddBusiness` |
| Dashboards | `IconDashboard` |
| Relatórios | `IconEventNote` |
| Logo AppHeader | `IconLocalLibrary` |

---

## FASE 1 — Camada de domínio e aplicação [Concluída ✅]

> Objetivo: estrutura TypeScript pura das camadas `domain/` e `application/`. Sem React, sem infraestrutura. Verificação: `npm run build` e `npm run lint` passam sem erros.

As tarefas desta fase **podem ser feitas em paralelo** (não há dependência entre si), exceto `IContainer.ts` e `application/usecases/index.ts`, que dependem do use case estar definido.

### Criar `src/domain/Empreendimento.ts` [Não Iniciada ⏳]

```ts
export type TipoEmpreendimento = "Residencial" | "Comercial" | "Infraestrutura";

export interface Empreendimento {
  readonly id: number;
  readonly nome: string;
  readonly email: string;
  readonly cep: string;
  readonly endereco: string;
  readonly proprietario: string;
  readonly tipo: TipoEmpreendimento;
}

export type CreateEmpreendimentoInput = Omit<Empreendimento, "id">;
```

### Criar `src/domain/repositories/IEmpreendimentoRepository.ts` [Não Iniciada ⏳]

```ts
import type { Empreendimento, CreateEmpreendimentoInput } from "../Empreendimento";

export interface IEmpreendimentoRepository {
  create(input: CreateEmpreendimentoInput): Promise<Empreendimento>;
}
```

### Atualizar `src/domain/index.ts` [Não Iniciada ⏳]

Re-exportar tudo de `Empreendimento.ts` e `repositories/IEmpreendimentoRepository.ts`.

### Criar `src/application/usecases/CreateEmpreendimento.ts` [Não Iniciada ⏳]

Método `execute()` — convenção adotada como precedente para todas as use cases do projeto.
`erasableSyntaxOnly: true` proíbe parameter properties no construtor — atribuir o campo explicitamente.

```ts
import type { IEmpreendimentoRepository } from "../../domain/repositories/IEmpreendimentoRepository";
import type { Empreendimento, CreateEmpreendimentoInput } from "../../domain/Empreendimento";

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

### Atualizar `src/application/usecases/index.ts` e `src/application/IContainer.ts` [Não Iniciada ⏳]

- `usecases/index.ts`: exportar `CreateEmpreendimento`.
- `IContainer.ts`: adicionar `createEmpreendimento: CreateEmpreendimento`.

### Deduplificar `src/mocks/types.ts` [Não Iniciada ⏳]

Substituir as definições locais de `TipoEmpreendimento`, `Empreendimento` e `CreateEmpreendimentoInput` por re-exports de `domain/`:

```ts
export type { TipoEmpreendimento, Empreendimento, CreateEmpreendimentoInput } from "../domain/Empreendimento";
```

O restante do arquivo (KpiIndicador, Obra, etc.) permanece intocado. Direção de importação legal: `mocks/` pode importar de `domain/` (domínio é a camada mais interna).

---

## FASE 2 — Camada de infraestrutura + rotas [Concluída ✅]

> Objetivo: repositório em memória, container com injeção de dependência e rotas no `App.tsx`. Verificação: `npm run build` passa; abrir `localhost:5173` redireciona para `/empreendimento` sem erros no console.

As tarefas são **sequenciais**: repositório → container → App.tsx.

### Criar `src/infrastructure/repositories/InMemoryEmpreendimentoRepository.ts` [Não Iniciada ⏳]

Array em memória com `id` auto-increment. Atenção ao `erasableSyntaxOnly`:

```ts
import type { IEmpreendimentoRepository } from "../../domain/repositories/IEmpreendimentoRepository";
import type { Empreendimento, CreateEmpreendimentoInput } from "../../domain/Empreendimento";

export class InMemoryEmpreendimentoRepository implements IEmpreendimentoRepository {
  private readonly items: Empreendimento[] = [];
  private nextId = 1;

  async create(input: CreateEmpreendimentoInput): Promise<Empreendimento> {
    const empreendimento: Empreendimento = { id: this.nextId++, ...input };
    this.items.push(empreendimento);
    return empreendimento;
  }
}
```

### Atualizar `src/infrastructure/container.ts` [Não Iniciada ⏳]

Instanciar repositório e use case e expô-los via `IContainer`:

```ts
import type { IContainer } from "../application/IContainer";
import { CreateEmpreendimento } from "../application/usecases/CreateEmpreendimento";
import { InMemoryEmpreendimentoRepository } from "./repositories/InMemoryEmpreendimentoRepository";

const empreendimentoRepository = new InMemoryEmpreendimentoRepository();

export const container: IContainer = {
  createEmpreendimento: new CreateEmpreendimento(empreendimentoRepository),
};
```

### Criar `src/infrastructure/repositories/index.ts` (barrel) [Não Iniciada ⏳]

Re-exportar `InMemoryEmpreendimentoRepository`.

### Atualizar `src/App.tsx` com rotas [Não Iniciada ⏳]

Adicionar `Navigate` + `Route` para `/empreendimento`. A tela `AdicionarEmpreendimento` ainda não existe nesta fase — importar como import dinâmico com `React.lazy` ou simplesmente deixar como placeholder `<div>em breve</div>` para que o build passe. Preferir **placeholder** para não criar dependência de fase.

```tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

<Routes>
  <Route path="/" element={<Navigate to="/empreendimento" replace />} />
  <Route path="/empreendimento" element={<div>em breve</div>} />
</Routes>
```

---

## FASE 3 — AppLayout responsivo + Navbar [Concluída ✅]

> Objetivo: `AppHeader` com Navbar de 3 abas, layout responsivo via `useMediaQuery`. Verificação: Navbar aparece no browser com ícones corretos; aba "Empreendimento" marcada como ativa; abas desabilitadas não respondem a cliques; no mobile o rótulo some.

### Criar `src/presentation/hooks/useMediaQuery.ts` [Não Iniciada ⏳]

O DS não exporta hook. Implementar com `window.matchMedia` + `useSyncExternalStore` (disponível no React 19):

```ts
import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const mql = window.matchMedia(query);

  return useSyncExternalStore(
    (cb) => {
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => mql.matches,
    () => false  // server snapshot (SSR safety)
  );
}
```

### Atualizar `src/presentation/components/AppLayout/AppLayout.tsx` [Não Iniciada ⏳]

Mudanças em relação ao estado atual:
1. Adicionar `useLocation` + `useNavigate` para aba ativa e navegação.
2. Adicionar `useMediaQuery("(min-width: 1024px)")` → `size`.
3. Passar `navbar` ao `AppHeader` com os 3 `NavbarTab`, cada um com `size={size}`.
4. Corrigir o container de conteúdo: `max-w-[800px]` centralizado, padding responsivo (`pt-[48px] px-0 pb-0` desktop; `pt-[48px] px-[12px] pb-[12px]` mobile).

> **Atenção:** `NavbarTab` com `disabled={true}` renderiza `disabled` no botão nativo, mas **não** aceita `onClick` — não passar `onClick` nas abas desabilitadas. `Navbar` ignora a própria prop `size` — passar `size` em cada `NavbarTab`.

### Comentários desta fase

- A prop `navbar` já existe em `AppHeaderProps` (`ReactNode`) — não há conflito com o código atual.
- O hook `useLocation` exige estar dentro do `BrowserRouter` (que já envolve `AppLayout` em `App.tsx`) — sem problema.

---

## FASE 4 — Tela AdicionarEmpreendimento [Concluída ✅]

> Objetivo: formulário completo com todos os campos, validação Zod, layout responsivo de duas colunas, submit e cancel. Verificação de todos os CAs (CA-001 a CA-014). Ao final: `npm run lint`, `npm run build`, teste no browser desktop e mobile.

As tarefas são **sequenciais**: schema → componente → substituir placeholder no App.tsx.

### Criar `src/presentation/screens/AdicionarEmpreendimento/AdicionarEmpreendimento.schema.ts` [Não Iniciada ⏳]

```ts
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

### Criar `src/presentation/screens/AdicionarEmpreendimento/AdicionarEmpreendimento.tsx` [Não Iniciada ⏳]

Estrutura geral:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormGroup, Radio, DoubleColumn, Button, H1, Description } from "@luislongo/ds-core";
import { useContainer } from "../../context/ContainerContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { empreendimentoSchema, type EmpreendimentoFormData } from "./AdicionarEmpreendimento.schema";

const TIPOS = ["Residencial", "Comercial", "Infraestrutura"] as const;

export function AdicionarEmpreendimento() {
  const { createEmpreendimento } = useContainer();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const size = isDesktop ? "desktop" : "mobile";

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmpreendimentoFormData>({
    resolver: zodResolver(empreendimentoSchema),
  });

  async function onSubmit(data: EmpreendimentoFormData) {
    await createEmpreendimento.execute(data);
    window.alert("Empreendimento cadastrado com sucesso!");
    reset();
  }

  function onCancel() {
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <H1>Adicionar empreendimento vazio</H1>
      <Description>Preencha as informações necessárias para cadastrar o empreendimento</Description>

      <DoubleColumn
        size={size}
        slotLeft={/* 5 FormGroups de texto */}
        slotRight={/* FormGroup com fieldset de radio */}
      />

      {/* rodapé de botões alinhado à direita, gap 10px */}
      <div>
        <Button variant="secondary" size="md" type="button" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" size="md" type="submit">Confirmar</Button>
      </div>
    </form>
  );
}
```

Detalhes críticos:
- Cada `FormGroup` de texto: sem `children` → DS renderiza o `Textbox` internamente. Passar `label`, `placeholder`, `error` e `{...register("campo")}` diretamente no `FormGroup`.
- `FormGroup` do grupo de radio: sem `label`, com `error={errors.tipo?.message}`, e `children` = `fieldset` + `legend` + 3 `<label><Radio .../>{tipo}</label>`.
- `register("tipo")` gera o mesmo `name` para os 3 radios — o browser garante exclusividade mútua.
- Campos opcionais (cep, endereco, proprietario) não têm `error` — Zod os declara `.optional()`.
- Container do form: `max-w-[800px]` centralizado, `gap-[10px]` entre blocos (conforme medidas Figma).
- Rodapé: `flex justify-end gap-[10px]`.

### Criar `src/presentation/screens/AdicionarEmpreendimento/index.ts` [Não Iniciada ⏳]

```ts
export { AdicionarEmpreendimento } from "./AdicionarEmpreendimento";
```

### Substituir placeholder no `src/App.tsx` [Não Iniciada ⏳]

Trocar `<div>em breve</div>` pelo `<AdicionarEmpreendimento />`.

### Verificação final — todos os CAs [Não Iniciada ⏳]

Executar `npm run lint && npm run build` e verificar no browser:

| CA | Check |
|----|-------|
| CA-001 | Todos os 6 campos presentes |
| CA-002 | Exatamente 3 radio buttons |
| CA-003 | Só um tipo selecionável por vez |
| CA-004 | Submit válido → alert + reset |
| CA-005 | Cancelar → reset, permanece na tela |
| CA-006 | Desktop: 2 colunas |
| CA-007 | Mobile: 1 coluna (campos, depois tipo) |
| CA-008 | Aba "Empreendimento" ativa |
| CA-009 | Trocar de aba descarta silenciosamente |
| CA-010 | Nome vazio → erro inline |
| CA-011 | E-mail inválido → erro inline |
| CA-012 | Tipo não selecionado → erro inline |
| CA-013 | CEP/Endereço/Proprietário não bloqueiam submit |
| CA-014 | Erros inline abaixo de cada campo |
