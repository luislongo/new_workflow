# 1. Roteamento com React Router DOM

Data: 2026-09-09

## Status

Ativa

## Contexto

A aplicação é uma SPA React cujas telas precisam de navegação independente. Precisamos decidir como implementar o roteamento client-side.

Forças em jogo:

- O usuário deve poder navegar diretamente para qualquer tela via URL (deep linking e recarregamento de página devem funcionar)
- A navegação precisa ser refletida na barra de endereço do navegador para que os botões Voltar/Avançar funcionem naturalmente
- Quando o `AppLayout` expuser itens de navegação, ele precisa saber a rota ativa para destacar o item correspondente
- O roteamento deve escalar quando as telas ganharem subrotas ou parâmetros

## Decisão

Vamos usar **React Router DOM v7** com `BrowserRouter` e a API declarativa de `Routes`/`Route`. O `BrowserRouter` é instanciado em `App.tsx`, que também declara todas as rotas. Quando o `AppLayout` expuser itens de navegação, ele usa `useLocation` para detectar a rota ativa e `useNavigate` para navegar programaticamente.

Esta ADR fixa o **mecanismo** de roteamento, não o conjunto de rotas. As rotas concretas são declaradas em `App.tsx` à medida que cada tela é implementada, seguindo a convenção de URL em kebab-case.

## Alternativas Consideradas

### Alternativa 1: Roteamento manual com estado local (`useState`)

**Descrição**: Um `useState` em `App.tsx` controla qual tela está ativa; a navegação chama `setScreen`.

**Prós**:
- Zero dependência adicional
- Implementação trivial para um conjunto pequeno de telas fixas

**Contras**:
- URLs não refletem a tela atual — recarregar a página sempre vai para a Home
- Botões Voltar/Avançar do browser não funcionam
- Deep linking impossível — não há URL para compartilhar
- Não escala para subrotas, parâmetros dinâmicos ou lazy loading

**Razão para rejeição**: A falta de URL por tela invalida qualquer cenário realista de uso. O custo de adicionar React Router depois seria maior do que adicioná-lo agora.

### Alternativa 2: Hash Router (`HashRouter`)

**Descrição**: Usa `#/rota` em vez de `/rota` na URL.

**Prós**:
- Funciona sem configuração de servidor (sem necessidade de reescrever todas as rotas para `index.html`)
- Suportado pelo Vite dev server sem configuração extra

**Contras**:
- URLs feias (`/#/rota` em vez de `/rota`)
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

**Razão para rejeição**: Os benefícios de type safety e file-based routing não justificam o overhead para cinco rotas estáticas. React Router é suficiente para este porte.

## Consequências

### Positivas

- Cada tela tem URL própria: deep linking, compartilhamento e histórico do browser funcionam
- `useLocation` e `useNavigate` disponíveis em qualquer componente — AppLayout detecta rota ativa sem prop drilling
- A API declarativa (`<Route path="..." element={...} />`) é legível e extensível para subrotas futuras
- Lazy loading por rota (`React.lazy`) é trivial de adicionar sem mudar a estrutura

### Negativas

- O Vite dev server precisa servir `index.html` para todas as rotas — comportamento padrão já satisfaz isso, mas o deploy de produção precisará de configuração equivalente (ex.: `nginx try_files`)

### Neutras

- O `BrowserRouter` fica em `App.tsx` em vez de `main.tsx` — convenção válida para isolar o provider junto às rotas que ele serve

## Notas de Implementação

```tsx
// App.tsx — composition root: container de DI + declaração de rotas
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <ContainerProvider container={container}>
        <AppLayout>
          <Routes>
            {/* um <Route path="..." element={<Tela />} /> por tela implementada */}
          </Routes>
        </AppLayout>
      </ContainerProvider>
    </BrowserRouter>
  )
}
```

```tsx
// AppLayout.tsx — quando houver itens de navegação, detectar a rota ativa
import { useLocation, useNavigate } from 'react-router-dom'

const { pathname } = useLocation()
const navigate = useNavigate()

<NavbarTab active={pathname === rota} onClick={() => navigate(rota)} />
```

## Validação

A decisão é bem-sucedida se:

- Recarregar a página em qualquer rota renderiza a tela correta (sem redirecionar para a Home)
- Os botões Voltar/Avançar do browser navegam entre telas
- O item de navegação ativo corresponde sempre à URL atual

## Revisão

**2026-09-09**: Decisão inicial.

**2026-09-13**: Removida a tabela de rotas concretas. Nenhuma tela está implementada e o `<Routes>` em `App.tsx` está vazio — a ADR passa a documentar apenas o mecanismo de roteamento, e as rotas entram conforme cada tela for construída. O `AppLayout` atual ainda não expõe itens de navegação, portanto não usa `useLocation`/`useNavigate`.
