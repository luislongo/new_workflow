import { faker } from '@faker-js/faker/locale/pt_BR'
import type { DashboardData } from './types'

faker.seed(42)

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const OBRAS = ['Res. Aurora', 'Ed. Central', 'Cond. Parque', 'Torre Norte', 'Vila Verde', 'Lot. Sol', 'Pq. Industrial']

const dashboardData: DashboardData = {
  kpis: [
    { id: 'obras-ativas', label: 'Obras Ativas', valor: '12', delta: '+2 este mês', deltaPositivo: true },
    { id: 'custo-total', label: 'Custo Total', valor: 'R$8.2M', delta: '+12% vs. orçado', deltaPositivo: false },
    { id: 'etapas-concluidas', label: 'Etapas Concluídas', valor: '47', delta: '+5 esta semana', deltaPositivo: true },
    { id: 'orcamento-livre', label: 'Orçamento Livre', valor: 'R$3.1M', delta: '-8% vs. planejado', deltaPositivo: false },
    { id: 'equipes-campo', label: 'Equipes em Campo', valor: '86', delta: '+10 vs. semana ant.', deltaPositivo: true },
    { id: 'progresso-geral', label: 'Progresso Geral', valor: '72%', delta: '+4% esta semana', deltaPositivo: true },
  ],
  evolucaoCusto: MESES.map(mes => ({
    mes,
    mesAnterior: faker.number.int({ min: 50_000, max: 200_000 }),
    mesAtual: faker.number.int({ min: 50_000, max: 200_000 }),
  })),
  avancoPorObra: OBRAS.map(nomeObra => ({
    nomeObra,
    previsto: faker.number.int({ min: 40, max: 100 }),
    realizado: faker.number.int({ min: 20, max: 100 }),
  })),
  indicadoresObra: MESES.map(mes => ({
    mes,
    acabamento: faker.number.int({ min: 0, max: 100 }),
    estrutura: faker.number.int({ min: 0, max: 100 }),
    fundacao: faker.number.int({ min: 0, max: 100 }),
  })),
  materiaisCriticos: [
    { rank: 1, nome: 'Cimento CP-II', estoquePercent: 82, usoPercent: 82 },
    { rank: 2, nome: 'Aço CA-50 (vergalhão)', estoquePercent: 64, usoPercent: 64 },
    { rank: 3, nome: 'Concreto Usinado', estoquePercent: 41, usoPercent: 41 },
    { rank: 4, nome: 'Blocos Cerâmicos', estoquePercent: 73, usoPercent: 73 },
  ],
}

export async function fetchDashboardData(): Promise<DashboardData> {
  return dashboardData
}
