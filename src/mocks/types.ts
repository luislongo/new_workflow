// Dashboard
export interface KpiIndicador {
  id: string
  label: string
  valor: string
  delta: string
  deltaPositivo: boolean
}

export interface PontoEvolucaoCusto {
  mes: string
  mesAnterior: number
  mesAtual: number
}

export interface PontoAvancoPorObra {
  nomeObra: string
  previsto: number
  realizado: number
}

export interface PontoIndicadorObra {
  mes: string
  acabamento: number
  estrutura: number
  fundacao: number
}

export interface MaterialCritico {
  rank: number
  nome: string
  estoquePercent: number
  usoPercent: number
}

export interface DashboardData {
  kpis: KpiIndicador[]
  evolucaoCusto: PontoEvolucaoCusto[]
  avancoPorObra: PontoAvancoPorObra[]
  indicadoresObra: PontoIndicadorObra[]
  materiaisCriticos: MaterialCritico[]
}

// Empreendimento
export type { TipoEmpreendimento, Empreendimento, CreateEmpreendimentoInput } from "../domain/Empreendimento";

// Relatórios
export interface Obra {
  id: string
  nome: string
  tipo: 'Residencial' | 'Comercial' | 'Loteamento' | 'Industrial' | 'Institucional'
  percentualConcluido: number
  orcamento: number
  status: 'Em andamento' | 'Concluída' | 'Atrasada' | 'Não iniciada'
  dataInicio: Date
}

export interface LancamentoFinanceiro {
  id: string
  descricao: string
  tipo: 'Receita' | 'Despesa'
  data: Date
  valor: number
  metodo: 'Transferência' | 'Boleto' | 'PIX' | 'Débito Automático' | 'Cartão'
  status: 'Confirmado' | 'Pago' | 'Pendente' | 'Vencido'
}

export interface FiltroRelatorio {
  dataInicio: Date
  dataFim: Date
  busca: string
}
