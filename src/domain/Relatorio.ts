export interface Obra {
  readonly id: string;
  readonly nome: string;
  readonly tipo: "Residencial" | "Comercial" | "Loteamento" | "Industrial" | "Institucional";
  readonly percentualConcluido: number;
  readonly orcamento: number;
  readonly status: "Em andamento" | "Concluída" | "Atrasada" | "Não iniciada";
  readonly dataInicio: Date;
}

export interface LancamentoFinanceiro {
  readonly id: string;
  readonly descricao: string;
  readonly tipo: "Receita" | "Despesa";
  readonly data: Date;
  readonly valor: number;
  readonly metodo: "Transferência" | "Boleto" | "PIX" | "Débito Automático" | "Cartão";
  readonly status: "Confirmado" | "Pago" | "Pendente" | "Vencido";
}

export interface FiltroRelatorio {
  readonly dataInicio: Date;
  readonly dataFim: Date;
  readonly busca: string;
}
