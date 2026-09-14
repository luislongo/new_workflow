import type { IContainer } from "../application/IContainer";
import { CreateEmpreendimento } from "../application/usecases/CreateEmpreendimento";
import { InMemoryEmpreendimentoRepository } from "./repositories/InMemoryEmpreendimentoRepository";

const empreendimentoRepository = new InMemoryEmpreendimentoRepository();

export const container: IContainer = {
  createEmpreendimento: new CreateEmpreendimento(empreendimentoRepository),
};
