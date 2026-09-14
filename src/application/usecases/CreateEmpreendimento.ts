import type { IEmpreendimentoRepository } from "../../domain/repositories/IEmpreendimentoRepository";
import type { Empreendimento, CreateEmpreendimentoInput } from "../../domain/Empreendimento";

export class CreateEmpreendimento {
  private readonly repository: IEmpreendimentoRepository;

  constructor(repository: IEmpreendimentoRepository) {
    this.repository = repository;
  }

  async execute(input: CreateEmpreendimentoInput): Promise<Empreendimento> {
    return this.repository.create(input);
  }
}
