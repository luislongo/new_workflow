# 2. Formulários e Validação

Data: 2026-09-09

## Status

Ativa

## Contexto

A aplicação tem dois pontos de entrada de dados do usuário: o `FormScreen` (formulário de projeto) e o `RegistrationFlow` (wizard multi-etapas). Precisamos decidir como gerenciar estado de formulário e validação nessas telas.

Forças em jogo:

- Formulários React não controlados (uncontrolled) são difíceis de validar de forma declarativa
- O wizard precisa de validação por etapa — só avança quando a etapa atual é válida
- Os componentes de input são do `@ds/core` (`Textbox`, `Select`, `FormGroup`) — a solução de formulário precisa ser compatível com componentes customizados
- A solução não deve introduzir dependências que conflitem com a restrição de zero runtime deps do design system (o design system tem essa restrição; a aplicação não)
- A pesquisa vai medir o esforço de implementação — a solução deve ser representativa de como times profissionais trabalham em 2026

## Decisão

Vamos usar **React Hook Form** para gerenciamento de estado de formulário e **Zod** para definição e validação de schema.

- `react-hook-form` gerencia registro de campos, estado de submit, erros e dirty/touched
- `zod` define o schema de validação como TypeScript — o mesmo schema serve para type inference e validação em runtime
- A integração é feita via `@hookform/resolvers/zod`

O `FormGroup` do design system envolve campo + label + mensagem de erro — o campo interno recebe `ref` do `register()` via `forwardRef`.

**Esta decisão documenta a intenção; a implementação efetiva acontece quando o scaffold de cada tela for preenchido.**

## Alternativas Consideradas

### Alternativa 1: Estado local puro (`useState` por campo)

**Descrição**: Cada campo tem seu próprio `useState`. Validação acontece no `onSubmit` com `if` statements.

**Prós**:
- Zero dependências
- Familiar para qualquer desenvolvedor React

**Contras**:
- Verboso: N campos = N `useState` + N handlers `onChange`
- Validação manual escala mal — regras cruzadas entre campos são propensas a bug
- Sem abstração de dirty/touched/error por campo — feedback de UX difícil de implementar corretamente
- Não reutilizável entre o formulário simples e o wizard

**Razão para rejeição**: O custo de manutenção é desproporcional. Em times profissionais, formulários com `useState` por campo são considerados antipadrão para formulários com mais de três campos.

### Alternativa 2: Formik

**Descrição**: Biblioteca de formulários com API baseada em render props e Context.

**Prós**:
- Amplamente conhecido — documentação e exemplos abundantes
- API declarativa (`<Field>`, `<ErrorMessage>`)

**Contras**:
- Performance: cada keystroke re-renderiza o formulário inteiro (Context propaga a todos os consumidores)
- Bundle maior que React Hook Form
- Integração com validação externa (Yup ou Zod) é possível mas mais verbosa
- A tendência da comunidade é migrar para React Hook Form

**Razão para rejeição**: Performance inferior ao React Hook Form (re-renders desnecessários), bundle maior, e ecossistema em declínio relativo.

### Alternativa 3: Validação apenas no servidor (fetch + error state)

**Descrição**: Submete os dados sem validação client-side; erros retornam do servidor e são exibidos na UI.

**Prós**:
- Validação centralizada e consistente (nunca duplicada)
- Menos código no client

**Contras**:
- Não aplicável: a aplicação não tem servidor na fase de estudo
- UX ruim: feedback só após round-trip de rede
- Não resolve a validação por etapa do wizard

**Razão para rejeição**: Não há servidor; a validação por etapa do wizard exige validação client-side de qualquer forma.

## Consequências

### Positivas

- `useForm` + `zodResolver` gera type inference automática do formulário a partir do schema Zod
- Performance por design: React Hook Form usa refs e atualiza apenas os campos que mudam (sem re-render do formulário inteiro)
- A validação por etapa do wizard é implementada com `trigger(fieldsDoStep)` — sem lógica manual de validação
- O mesmo schema Zod pode ser reutilizado em múltiplos formulários e futuramente na camada de API

### Negativas

- Duas dependências novas a serem instaladas: `react-hook-form` e `zod` (+ `@hookform/resolvers`)
- Os componentes do `@ds/core` precisam suportar `forwardRef` para integração com `register()` — a maioria já suporta; verificar antes de usar

### Neutras

- O schema Zod vive junto ao arquivo de tela (ex.: `FormScreen.schema.ts`) — sem camada de domínio separada no scaffold inicial

## Notas de Implementação

```bash
# Instalação (quando a tela for implementada)
npm install react-hook-form zod @hookform/resolvers
```

```ts
// FormScreen.schema.ts
import { z } from 'zod'

export const projectSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  dataInicio: z.string().min(1, 'Data de início é obrigatória'),
  gerente: z.string().min(1, 'Gerente é obrigatório'),
  orcamento: z.number().positive('Orçamento deve ser positivo').optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
```

```tsx
// FormScreen.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormData } from './FormScreen.schema'

const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
  resolver: zodResolver(projectSchema),
})
```

## Validação

A decisão é bem-sucedida se:

- Submeter com campos obrigatórios em branco exibe mensagens de erro por campo, sem recarregar a página
- O wizard só avança quando os campos da etapa atual são válidos
- TypeScript infere os tipos do formulário a partir do schema Zod (sem casting manual)

## Revisão

**2026-09-09**: Decisão inicial. Implementação efetiva pendente — telas ainda em scaffold. Instalar dependências quando a implementação das telas começar.
