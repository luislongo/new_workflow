# 3. Arquitetura Limpa Completa

Data: 2026-09-09

## Status

Ativa

## Contexto

Esta é uma aplicação de estudo cujas telas serão implementadas e depois mantidas por tarefas controladas. Precisamos definir os princípios arquiteturais que guiarão as decisões de design de código — não apenas a estrutura de pastas, mas como responsabilidades são separadas, como componentes crescem e como mudanças são contidas.

A pergunta central: qual nível de estrutura é adequado para uma aplicação deste porte?

Forças em jogo:

- As telas serão implementadas duas vezes (em `old_workflow` e `new_workflow`) e depois sofrerão manutenção — o código precisa ser legível e modificável por qualquer desenvolvedor sem contexto prévio
- As telas compartilham a mesma entidade (`Project`) e as mesmas operações CRUD — há um domínio real, mesmo que simples
- A pesquisa compara workflows — e a qualidade arquitetural é uma dimensão relevante do resultado, não um ruído a ser eliminado
- O custo real de Clean Architecture para uma aplicação com uma entidade é baixo: quatro use cases, um repositório em memória, uma interface de container

## Decisão

Adotamos **Clean Architecture completa** com quatro camadas explícitas:

```
src/
├── domain/           # entidades e contratos de repositório
├── application/      # use cases e interface do container de DI
├── infrastructure/   # implementações concretas (repositório em memória, container)
├── presentation/     # componentes React, telas, contexto de DI
└── mocks/            # dados de demonstração — fora das camadas, ver exceção abaixo
```

### Regras de dependência

- `domain` não importa nada do projeto — apenas tipos primitivos TypeScript
- `application` importa apenas de `domain`
- `infrastructure` importa de `domain` e `application`
- `presentation` importa de `application` (via interfaces) — **nunca** de `infrastructure` diretamente
- `App.tsx` é a composition root: único arquivo autorizado a importar de `infrastructure`

### Camada de domínio

```
src/domain/
├── Project.ts                        # entidade Project e tipos derivados
├── repositories/
│   └── IProjectRepository.ts         # porta de saída (interface)
└── index.ts
```

`Project` é uma interface readonly pura — sem métodos, sem lógica. `IProjectRepository` define o contrato sem mencionar mecanismos de persistência.

### Camada de aplicação

```
src/application/
├── IContainer.ts                     # interface do container de DI (na camada de aplicação, não infraestrutura)
├── usecases/
│   ├── GetProjects.ts
│   ├── CreateProject.ts
│   ├── UpdateProject.ts
│   ├── DeleteProject.ts
│   └── index.ts
└── index.ts
```

Cada use case recebe `IProjectRepository` via construtor. `IContainer` fica na camada de aplicação — não na infraestrutura — para que `presentation/context/ContainerContext.tsx` possa depender dele sem violar a regra de dependência.

### Camada de infraestrutura

```
src/infrastructure/
├── repositories/
│   └── InMemoryProjectRepository.ts  # implementa IProjectRepository
├── container.ts                      # instancia use cases e repositório
└── index.ts
```

### Camada de apresentação

```
src/presentation/
├── context/
│   └── ContainerContext.tsx          # ContainerProvider + useContainer hook
├── components/
│   └── AppLayout/                    # layout global, monta o AppHeader do @ds/core
└── screens/                          # uma pasta por tela, criada conforme a tela é implementada
```

Telas acessam use cases via `useContainer()` — nunca instanciam repositórios ou serviços diretamente.

`AppLayout` é o único componente em `presentation/components/`. Não existe `src/components/` fora da camada de apresentação — componentes de layout moram em `presentation/components/`, atômicos moram no `@ds/core`.

### Exceção: `src/mocks/`

`src/mocks/` fica **fora** das quatro camadas. É um módulo de dados de demonstração gerados com `@faker-js/faker` (seed fixa, locale `pt_BR`), usado para popular telas antes de existir uma fonte de dados real.

```
src/mocks/
├── types.ts            # tipos dos dados de demonstração
├── dashboard.ts        # fetchDashboardData()
├── empreendimentos.ts  # fetchEmpreendimentos()
├── relatorios.ts       # fetchObras(), fetchLancamentos()
└── index.ts
```

Duas características importantes:

- **Não implementa `IProjectRepository`** e não passa pelo container — expõe funções `fetch*` assíncronas diretamente.
- **O vocabulário não é o do domínio.** `Empreendimento`, `Obra`, `LancamentoFinanceiro` e `DashboardData` são de construção civil e não coincidem com a entidade `Project` de `domain/`.

Caminho preferido: quando uma tela precisar desses dados de verdade, o mock vira a fonte de uma implementação de repositório em `infrastructure/`, e a tela consome o use case via `useContainer()`. Importar de `mocks/` direto em `presentation/` é tolerado apenas enquanto a tela for protótipo visual. Nenhuma outra camada importa de `mocks/`.

## Alternativas Consideradas

### Alternativa 1: SOLID como guia sem camadas explícitas

**Descrição**: Princípios SOLID orientando decisões de design, mas sem separação formal em camadas. Telas em `src/screens/`, componentes compartilhados em `src/components/`.

**Prós**:

- Estrutura de pastas mais simples
- Menor cerimônia para adicionar uma tela

**Contras**:

- Ausência de contratos explícitos (interfaces de repositório, interface do container) — qualquer tela pode importar qualquer coisa de qualquer lugar
- As telas compartilham a mesma entidade `Project`; sem uma camada de domínio, essa entidade vive em um local arbitrário
- Telas acumulam responsabilidades (busca de dados + renderização) com o tempo

**Razão para rejeição**: O custo de Clean Architecture para este porte é baixo; o benefício em rastreabilidade de dependências e clareza de papéis é real e relevante para o estudo.

### Alternativa 2: Clean Architecture sem injeção de dependência via contexto

**Descrição**: Instanciar use cases diretamente nas telas, sem container.

**Contras**: Cada tela criaria seu próprio repositório — sem estado compartilhado entre telas. O repositório em memória é um singleton; sem DI centralizada, não há como compartilhá-lo.

**Razão para rejeição**: Inviável para a aplicação.

### Alternativa 3: Feature-Sliced Design (FSD)

**Descrição**: Metodologia de organização em camadas (`app`, `pages`, `widgets`, `features`, `entities`, `shared`).

**Contras**: Curva de aprendizado não trivial com regras de importação próprias. Excessivo para uma aplicação com uma entidade.

**Razão para rejeição**: Overhead de metodologia não proporcional ao porte.

## Consequências

### Positivas

- Dependências entre camadas são rastreáveis e verificáveis pelo compilador TypeScript
- Telas não sabem como os dados são persistidos — só conhecem use cases
- Trocar `InMemoryProjectRepository` por uma implementação HTTP não afeta nenhuma tela
- Use cases são testáveis sem React — recebem `IProjectRepository` por construtor

### Negativas

- Estrutura de pastas mais profunda — mais arquivos para criar ao adicionar uma feature
- Desenvolvedores sem familiaridade com Clean Architecture precisam entender as regras de importação antes de contribuir

### Neutras

- `App.tsx` como composition root é um padrão reconhecível — seu papel especial é documentado aqui

## Notas de Implementação

**Checklist de nova feature:**

- [ ] Entidade ou tipo novo? → `domain/`
- [ ] Operação nova (buscar, criar, atualizar, deletar)? → `application/usecases/`
- [ ] Persistência nova (API, localStorage)? → `infrastructure/repositories/`
- [ ] Tela ou componente? → `presentation/`
- [ ] Dados de demonstração para protótipo visual? → `mocks/` (temporário — ver a exceção acima)
- [ ] `App.tsx` precisa ser atualizado? Só se mudar o container ou as rotas

**Regra de ouro**: se um arquivo de `presentation/` contém `import ... from '../../infrastructure'`, é uma violação da arquitetura.

## Revisão

**2026-09-09**: Decisão inicial. Arquitetura implementada com `InMemoryProjectRepository`.
