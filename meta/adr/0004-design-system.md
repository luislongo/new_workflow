# 4. Design System

Data: 2026-09-14

## Status

Ativa

## Contexto

A aplicação precisa de uma camada de componentes de UI consistente com o design no Figma. Os componentes precisam estar mapeados via Figma Code Connect para que o design context retorne exemplos de código prontos para uso.

## Decisão

Adotamos **`@luislongo/ds-core`** como único fornecedor de componentes de UI. Qualquer componente presente no Figma que tenha mapeamento Code Connect deve ser importado deste pacote.

```tsx
import { ComponentName } from "@luislongo/ds-core"
```

O CSS do pacote é importado uma única vez em `main.tsx`:

```tsx
import "@luislongo/ds-core/style.css"
```

## Consequências

### Positivas

- Componentes, tokens e estilos vêm de uma única fonte — sem duplicação entre aplicação e DS
- Code Connect já está publicado pelo DS; o design context do Figma retorna exemplos prontos para uso
- Tokens de cor, espaçamento e tipografia estão disponíveis via Tailwind e via import de runtime

### Negativas

- Qualquer componente não coberto pelo DS precisa ser criado na aplicação sem suporte de Code Connect

### Neutras

- A API e os componentes disponíveis são documentados em `node_modules/@luislongo/ds-core/README.md`

## Revisão

**2026-09-14**: Decisão inicial.
