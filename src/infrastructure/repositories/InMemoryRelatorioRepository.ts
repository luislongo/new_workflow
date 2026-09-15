import type { IRelatorioRepository } from "../../domain/repositories/IRelatorioRepository";
import type { Obra, LancamentoFinanceiro } from "../../domain/Relatorio";
import { fetchObras, fetchLancamentos } from "../../mocks/relatorios";

export class InMemoryRelatorioRepository implements IRelatorioRepository {
  async listarObras(): Promise<Obra[]> {
    return fetchObras();
  }

  async listarLancamentos(): Promise<LancamentoFinanceiro[]> {
    return fetchLancamentos();
  }
}
