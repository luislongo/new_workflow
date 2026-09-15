import type { IRelatorioRepository } from "../../domain/repositories/IRelatorioRepository";
import type { Obra, FiltroRelatorio } from "../../domain/Relatorio";

export class GetRelatorioObras {
  private readonly repository: IRelatorioRepository;

  constructor(repository: IRelatorioRepository) {
    this.repository = repository;
  }

  async execute(filtro: FiltroRelatorio): Promise<Array<{ indice: number; obra: Obra }>> {
    const obras = await this.repository.listarObras();
    const busca = filtro.busca.trim().toLowerCase();

    return obras
      .map((obra, i) => ({ indice: i + 1, obra }))
      .filter(({ obra }) => {
        const dentroDoIntervalo = obra.dataInicio >= filtro.dataInicio && obra.dataInicio <= filtro.dataFim;
        const matchBusca =
          busca === "" || [obra.nome, obra.tipo, obra.status].some((campo) => campo.toLowerCase().includes(busca));
        return dentroDoIntervalo && matchBusca;
      });
  }
}
