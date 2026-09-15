import type { Empreendimento, CreateEmpreendimentoInput } from "../Empreendimento";

export interface IEmpreendimentoRepository {
  create(input: CreateEmpreendimentoInput): Promise<Empreendimento>;
}
