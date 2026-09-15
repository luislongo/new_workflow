export interface KpiIndicador {
  readonly id: string;
  readonly label: string;
  readonly valor: string;
  readonly delta: string;
}

export interface PontoEvolucaoCusto {
  readonly mes: string;
  readonly mesAnterior: number;
  readonly mesAtual: number;
}

export interface PontoAvancoPorObra {
  readonly nomeObra: string;
  readonly previsto: number;
  readonly realizado: number;
}

export interface PontoIndicadorObra {
  readonly mes: string;
  readonly acabamento: number;
  readonly estrutura: number;
  readonly fundacao: number;
}

export interface MaterialCritico {
  readonly rank: number;
  readonly nome: string;
  readonly estoquePercent: number;
  readonly usoPercent: number;
}

export interface DashboardData {
  readonly kpis: KpiIndicador[];
  readonly evolucaoCusto: PontoEvolucaoCusto[];
  readonly avancoPorObra: PontoAvancoPorObra[];
  readonly indicadoresObra: PontoIndicadorObra[];
  readonly materiaisCriticos: MaterialCritico[];
}
