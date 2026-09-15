export type TipoEmpreendimento = "Residencial" | "Comercial" | "Infraestrutura";

export interface Empreendimento {
  readonly id: number;
  readonly nome: string;
  readonly email: string;
  readonly cep: string;
  readonly endereco: string;
  readonly proprietario: string;
  readonly tipo: TipoEmpreendimento;
}

export type CreateEmpreendimentoInput = Omit<Empreendimento, "id">;
