import type { DashboardData } from '../domain/Dashboard'

const dashboardData: DashboardData = {
  kpis: [
    { id: 'obras-ativas', label: 'Obras Ativas', valor: '12', delta: '+2 este mês' },
    { id: 'custo-total', label: 'Custo Total', valor: 'R$8.2M', delta: '+12% vs. orçado' },
    { id: 'etapas-concluidas', label: 'Etapas Concluídas', valor: '47', delta: '+5 esta semana' },
    { id: 'orcamento-livre', label: 'Orçamento Livre', valor: 'R$3.1M', delta: '-8% vs. planejado' },
    { id: 'equipes-campo', label: 'Equipes em Campo', valor: '86', delta: '+10 vs. semana ant.' },
    { id: 'progresso-geral', label: 'Progresso Geral', valor: '72%', delta: '+4% esta semana' },
  ],
  evolucaoCusto: [
    { mes: 'Jan', mesAnterior: 160, mesAtual: 360 },
    { mes: 'Fev', mesAnterior: 220, mesAtual: 300 },
    { mes: 'Mar', mesAnterior: 80, mesAtual: 320 },
    { mes: 'Abr', mesAnterior: 80, mesAtual: 260 },
    { mes: 'Mai', mesAnterior: 130, mesAtual: 340 },
    { mes: 'Jun', mesAnterior: 120, mesAtual: 280 },
    { mes: 'Jul', mesAnterior: 220, mesAtual: 200 },
    { mes: 'Ago', mesAnterior: 220, mesAtual: 210 },
  ],
  avancoPorObra: [
    { nomeObra: 'Res. Aurora', previsto: 14000, realizado: 12000 },
    { nomeObra: 'Ed. Central', previsto: 16000, realizado: 11000 },
    { nomeObra: 'Cond. Parque', previsto: 6000, realizado: 22000 },
    { nomeObra: 'Torre Norte', previsto: 15000, realizado: 5000 },
    { nomeObra: 'Vila Verde', previsto: 12000, realizado: 11000 },
    { nomeObra: 'Lot. Sol', previsto: 15000, realizado: 13000 },
    { nomeObra: 'Pq. Industrial', previsto: 21000, realizado: 10000 },
  ],
  indicadoresObra: [
    { mes: 'Jan', acabamento: 330, estrutura: 260, fundacao: 340 },
    { mes: 'Fev', acabamento: 300, estrutura: 250, fundacao: 300 },
    { mes: 'Mar', acabamento: 320, estrutura: 220, fundacao: 320 },
    { mes: 'Abr', acabamento: 250, estrutura: 200, fundacao: 240 },
    { mes: 'Mai', acabamento: 210, estrutura: 215, fundacao: 215 },
    { mes: 'Jun', acabamento: 220, estrutura: 260, fundacao: 260 },
    { mes: 'Jul', acabamento: 260, estrutura: 310, fundacao: 330 },
    { mes: 'Set', acabamento: 310, estrutura: 310, fundacao: 310 },
    { mes: 'Out', acabamento: 270, estrutura: 280, fundacao: 200 },
    { mes: 'Nov', acabamento: 130, estrutura: 110, fundacao: 150 },
    { mes: 'Dez', acabamento: 150, estrutura: 90, fundacao: 230 },
  ],
  materiaisCriticos: [
    { rank: 1, nome: 'Cimento CP-II', estoquePercent: 60, usoPercent: 82 },
    { rank: 2, nome: 'Aço CA-50 (vergalhão)', estoquePercent: 40, usoPercent: 64 },
    { rank: 3, nome: 'Concreto Usinado', estoquePercent: 25, usoPercent: 41 },
    { rank: 4, nome: 'Blocos Cerâmicos', estoquePercent: 35, usoPercent: 73 },
  ],
}

export async function fetchDashboardData(): Promise<DashboardData> {
  return dashboardData
}
