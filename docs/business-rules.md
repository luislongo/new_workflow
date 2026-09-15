# Regras de Negócio

> Esta aplicação é um objeto de estudo para pesquisa de MBA. As regras de negócio são simplificadas e servem como cenário realista para as tarefas de implementação — não representam um sistema de produção.

## Domínio: Empreendimentos

Um **empreendimento** representa um projeto imobiliário ou de construção civil cadastrado na plataforma.

### Tipo de empreendimento

Cada empreendimento tem exatamente um dos seguintes tipos:

| Tipo | Descrição |
|------|-----------|
| `Residencial` | Edificações habitacionais |
| `Comercial` | Edificações ou áreas de uso comercial |
| `Infraestrutura` | Obras de infraestrutura pública ou urbana |

O tipo é mutuamente exclusivo — somente um pode ser selecionado por cadastro.

### Campos obrigatórios no cadastro

- **Nome do empreendimento** — não pode ser vazio
- **Endereço de e-mail** — deve ser um e-mail válido (`z.string().email()`)
- **Tipo de empreendimento** — um dos três tipos acima deve ser selecionado

### Campos opcionais

- CEP — texto livre, sem validação de formato
- Endereço — texto livre
- Proprietário — texto livre

### Comportamento do submit

- **Submit válido**: salva no repositório em memória via use case `CreateEmpreendimento`; exibe `window.alert("Empreendimento cadastrado com sucesso!")`; ao fechar o alert, o formulário é resetado para o estado inicial.
- **Submit inválido**: erros inline abaixo de cada campo com problema; formulário permanece preenchido.

### Comportamento do Cancelar

- Reseta o formulário (`reset()` do React Hook Form)
- Permanece na rota `/empreendimento`
- Não persiste dados parciais

### Descarte silencioso

Trocar de aba na Navbar com o formulário preenchido descarta os dados sem confirmação.

## Persistência

O repositório (`InMemoryEmpreendimentoRepository`) nasce vazio a cada sessão — os dados de demonstração em `src/mocks/empreendimentos.ts` são usados apenas por telas de protótipo visual; eles **não passam pelo use case** nem pelo repositório da Clean Architecture.

## Fora de Escopo (v1)

- Listagem de empreendimentos cadastrados
- Edição ou exclusão de empreendimentos
- Busca automática por CEP
- Integração com API real
- Autenticação / controle de acesso
