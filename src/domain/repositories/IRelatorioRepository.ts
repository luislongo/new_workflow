import type { Obra, LancamentoFinanceiro } from "../Relatorio";

export interface IRelatorioRepository {
  listarObras(): Promise<Obra[]>;
  listarLancamentos(): Promise<LancamentoFinanceiro[]>;
}
