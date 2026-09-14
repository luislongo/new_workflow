import type { CreateEmpreendimento } from "./usecases/CreateEmpreendimento";

export interface IContainer {
  createEmpreendimento: CreateEmpreendimento;
}
