import type { IRelatorioRepository } from "../../domain/repositories/IRelatorioRepository";
import type { LancamentoFinanceiro, FiltroRelatorio } from "../../domain/Relatorio";

export class GetRelatorioFinanceiro {
  private readonly repository: IRelatorioRepository;

  constructor(repository: IRelatorioRepository) {
    this.repository = repository;
  }

  async execute(filtro: FiltroRelatorio): Promise<Array<{ indice: number; lancamento: LancamentoFinanceiro }>> {
    const lancamentos = await this.repository.listarLancamentos();
    const busca = filtro.busca.trim().toLowerCase();

    return lancamentos
      .map((lancamento, i) => ({ indice: i + 1, lancamento }))
      .filter(({ lancamento }) => {
        const dentroDoIntervalo = lancamento.data >= filtro.dataInicio && lancamento.data <= filtro.dataFim;
        const matchBusca =
          busca === "" ||
          [lancamento.descricao, lancamento.tipo, lancamento.metodo, lancamento.status].some((campo) =>
            campo.toLowerCase().includes(busca),
          );
        return dentroDoIntervalo && matchBusca;
      });
  }
}
