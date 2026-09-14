# 1. Roteamento com React Router DOM

Data: 2026-09-09

## Status

Ativa

## Contexto

A aplicação tem cinco telas distintas (Dashboard, Formulário, Tabela de Dados, Fluxo de Cadastro e Componente Composto) que precisam de navegação independente. Precisamos decidir como implementar o roteamento client-side de uma SPA React.

Forças em jogo:

- O usuário deve poder navegar diretamente para qualquer tela via URL (deep linking e recarregamento de página devem funcionar)
- A navegação precisa ser refletida na barra de endereço do navegador para que os botões Voltar/Avançar funcionem naturalmente
- O `AppLayout` (Navbar) precisa saber a rota ativa para destacar a aba correta
- As telas são scaffolds por enquanto — o roteamento deve escalar quando cada tela ganhar subrotas ou parâmetros

## Decisão

Vamos usar **React Router DOM v7** com `BrowserRouter` e a API declarativa de `Routes`/`Route`. O `BrowserRouter` é instanciado em `App.tsx`, que também declara todas as rotas. O `AppLayout` usa `useLocation` para detectar a rota ativa e `useNavigate` para navegar programaticamente.

Estrutura de rotas:

| URL | Tela |
|-----|------|
| `/` | Dashboard |
| `/projetos` | Tabela de Dados |
| `/cadastro` | Formulário |
| `/onboarding` | Fluxo de Cadastro |
| `/componentes` | Componente Composto |

## Alternativas Consideradas

### Alternativa 1: Roteamento manual com estado local (`useState`)

**Descrição**: Um `useState` em `App.tsx` controla qual tela está ativa; a Navbar chama `setScreen`.

**Prós**:
- Zero dependência adicional
- Implementação trivial para cinco telas fixas

**Contras**:
- URLs não refletem a tela atual — recarregar a página sempre vai para a Home
- Botões Voltar/Avançar do browser não funcionam
- Deep linking impossível — não há URL para compartilhar
- Não escala para subrotas, parâmetros dinâmicos ou lazy loading

**Razão para rejeição**: A falta de URL por tela invalida qualquer cenário realista de uso. O custo de adicionar React Router depois seria maior do que adicioná-lo agora.

### Alternativa 2: Hash Router (`HashRouter`)

**Descrição**: Usa `#/projetos` em vez de `/projetos` na URL.

**Prós**:
- Funciona sem configuração de servidor (sem necessidade de reescrever todas as rotas para `index.html`)
- Suportado pelo Vite dev server sem configuração extra

**Contras**:
- URLs feias (`/#/projetos` em vez de `/projetos`)
- SEO prejudicado (crawlers ignoram o fragmento de hash)
- Padrão que a comunidade React abandonou em favor de `BrowserRouter` + configuração de servidor

**Razão para rejeição**: O Vite dev server já serve `index.html` para qualquer rota com configuração padrão. A fealdade e os contras de SEO não compensam a conveniência marginal.

### Alternativa 3: TanStack Router

**Descrição**: Biblioteca de roteamento type-safe com file-based routing opcional.

**Prós**:
- Type safety completa nas rotas e parâmetros (sem casting manual)
- Integração nativa com TanStack Query para data loading por rota
- File-based routing elimina o arquivo de rotas centralizado

**Contras**:
- Overhead de aprendizado maior para um scaffold de estudo
- API mais verbosa para casos simples (cinco rotas estáticas)
- Dependência menos ubíqua — documentação, exemplos e suporte da comunidade são menores que React Router

**Razão para rejeição**: Os benefícios de type safety e file-based routing não justificam o overhead para cinco rotas estáticas. React Router é suficiente e familiar para o contexto da pesquisa.

## Consequências

### Positivas

- Cada tela tem URL própria: deep linking, compartilhamento e histórico do browser funcionam
- `useLocation` e `useNavigate` disponíveis em qualquer componente — AppLayout detecta rota ativa sem prop drilling
- A API declarativa (`<Route path="..." element={...} />`) é legível e extensível para subrotas futuras
- Lazy loading por rota (`React.lazy`) é trivial de adicionar sem mudar a estrutura

### Negativas

- Dependência adicional (`react-router-dom`) que não existe no `old_workflow`
- O Vite dev server precisa servir `index.html` para todas as rotas — comportamento padrão já satisfaz isso, mas o deploy de produção precisará de configuração equivalente (ex.: `nginx try_files`)

### Neutras

- O `BrowserRouter` fica em `App.tsx` em vez de `main.tsx` — convenção válida para isolar o provider junto às rotas que ele serve

## Notas de Implementação

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projetos" element={<DataTableScreen />} />
          {/* ... */}
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
```

```tsx
// AppLayout.tsx — detecta rota ativa
import { useLocation, useNavigate } from 'react-router-dom'

const { pathname } = useLocation()
const navigate = useNavigate()

<NavbarTab active={pathname === '/projetos'} onClick={() => navigate('/projetos')} />
```

## Validação

A decisão é bem-sucedida se:

- Recarregar a página em `/projetos` renderiza a tela correta (sem redirecionar para a Home)
- Os botões Voltar/Avançar do browser navegam entre telas
- A aba ativa na Navbar corresponde sempre à URL atual

## Revisão

**2026-09-09**: Decisão inicial. Cinco rotas estáticas implementadas. Sem subrotas ou parâmetros dinâmicos por enquanto.
