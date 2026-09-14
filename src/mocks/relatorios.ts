import { faker } from '@faker-js/faker/locale/pt_BR'
import type { Obra, LancamentoFinanceiro } from './types'

faker.seed(42)

const obras: Obra[] = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  nome: faker.company.name(),
  tipo: faker.helpers.arrayElement(['Residencial', 'Comercial', 'Loteamento', 'Industrial', 'Institucional'] as const),
  percentualConcluido: faker.number.int({ min: 0, max: 100 }),
  orcamento: faker.number.int({ min: 500_000, max: 25_000_000 }),
  status: faker.helpers.arrayElement(['Em andamento', 'Concluída', 'Atrasada', 'Não iniciada'] as const),
  dataInicio: faker.date.between({ from: '2024-01-01', to: '2026-01-01' }),
}))

const lancamentos: LancamentoFinanceiro[] = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  descricao: faker.finance.transactionDescription(),
  tipo: faker.helpers.arrayElement(['Receita', 'Despesa'] as const),
  data: faker.date.between({ from: '2026-01-01', to: '2026-12-31' }),
  valor: faker.number.int({ min: 5_000, max: 700_000 }),
  metodo: faker.helpers.arrayElement(['Transferência', 'Boleto', 'PIX', 'Débito Automático', 'Cartão'] as const),
  status: faker.helpers.arrayElement(['Confirmado', 'Pago', 'Pendente', 'Vencido'] as const),
}))

export async function fetchObras(): Promise<Obra[]> {
  return obras
}

export async function fetchLancamentos(): Promise<LancamentoFinanceiro[]> {
  return lancamentos
}
