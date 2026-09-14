import type { IEmpreendimentoRepository } from "../../domain/repositories/IEmpreendimentoRepository";
import type { Empreendimento, CreateEmpreendimentoInput } from "../../domain/Empreendimento";

export class InMemoryEmpreendimentoRepository implements IEmpreendimentoRepository {
  private readonly items: Empreendimento[] = [];
  private nextId = 1;

  async create(input: CreateEmpreendimentoInput): Promise<Empreendimento> {
    const empreendimento: Empreendimento = { id: this.nextId++, ...input };
    this.items.push(empreendimento);
    return empreendimento;
  }
}
