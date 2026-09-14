# Integrações

## @ds/core — Design System

| Atributo | Valor |
|---------|-------|
| Tipo | Biblioteca local via `file:` link |
| Protocolo | Import ESM — `@ds/core` (componentes) e `@ds/core/style.css` (CSS) |
| Dependência | Crítica — build falha sem @ds/core |

**Pré-requisito**: o design system precisa estar buildado antes de iniciar o dev server:
```bash
cd ../mba/repos/design_system && npm run build
# ou usar o script raiz:
# ../mba/repos/dev.ps1
```

**Componentes consumidos pelas telas:**

| Componente | Tela |
|-----------|------|
| `Navbar`, `NavbarTab` | AppLayout |
| `Button` | FormScreen, RegistrationFlow, CompositeComponent |
| `Textbox`, `Select`, `FormGroup` | FormScreen (a implementar) |
| `Checkbox`, `Radio` | RegistrationFlow (a implementar) |

## Figma — Code Connect (new_workflow exclusivo)

| Atributo | Valor |
|---------|-------|
| Tipo | Ferramenta de desenvolvimento |
| Impacto no bundle | Zero — não afeta o código de produção |
| Propósito | Rastreabilidade design→código |

Arquivos `.figma.tsx` mapeiam componentes React a nós do Figma. Ao inspecionar um componente no Figma, o desenvolvedor vê a implementação React correspondente.

**Configuração:**
```json
// figma.config.json
{ "codeConnect": { "include": ["src/**/*.tsx"] } }
```

**Workflow:**
```bash
npm run figma:connect:dry-run   # preview sem publicar
npm run figma:connect           # publica mappings no Figma
```

## Relação entre os projetos de estudo

| Aspecto | new_workflow | old_workflow |
|---------|-------------|-------------|
| Porta dev | 5173 | 5174 |
| Figma Code Connect | ✅ | ❌ |
| CLAUDE.md + docs/ | ✅ | ❌ |
| ADRs em meta/adr/ | ✅ | ❌ |
| Telas implementadas | Idênticas | Idênticas |
| Design system | Mesmo @ds/core | Mesmo @ds/core |

O script `dev.ps1` na raiz do repositório inicia ambos simultaneamente, junto ao modo watch do design system.
