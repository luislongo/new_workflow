import type { Obra, LancamentoFinanceiro } from "../domain/Relatorio";

const obras: Obra[] = [
  { id: "1", nome: "Residencial Aurora", tipo: "Residencial", percentualConcluido: 85, orcamento: 4560000, status: "Em andamento", dataInicio: new Date("2026-01-05") },
  { id: "2", nome: "Edifício Central", tipo: "Comercial", percentualConcluido: 62, orcamento: 2840000, status: "Em andamento", dataInicio: new Date("2026-01-08") },
  { id: "3", nome: "Loteamento Sol Nascente", tipo: "Loteamento", percentualConcluido: 100, orcamento: 1875000, status: "Concluída", dataInicio: new Date("2026-01-10") },
  { id: "4", nome: "Condomínio Parque das Flores", tipo: "Residencial", percentualConcluido: 35, orcamento: 5670000, status: "Em andamento", dataInicio: new Date("2026-01-12") },
  { id: "5", nome: "Torre Norte Empresarial", tipo: "Comercial", percentualConcluido: 48, orcamento: 3225000, status: "Atrasada", dataInicio: new Date("2026-01-15") },
  { id: "6", nome: "Vila Verde Residências", tipo: "Residencial", percentualConcluido: 15, orcamento: 2100000, status: "Em andamento", dataInicio: new Date("2026-01-18") },
  { id: "7", nome: "Parque Industrial Oeste", tipo: "Industrial", percentualConcluido: 0, orcamento: 8200000, status: "Não iniciada", dataInicio: new Date("2026-01-20") },
  { id: "8", nome: "Conjunto Habitacional Vida Nova", tipo: "Residencial", percentualConcluido: 92, orcamento: 1350000, status: "Em andamento", dataInicio: new Date("2026-01-22") },
  { id: "9", nome: "Galpão Logístico BR-101", tipo: "Industrial", percentualConcluido: 58, orcamento: 4750000, status: "Atrasada", dataInicio: new Date("2026-01-25") },
  { id: "10", nome: "Centro Comunitário Esperança", tipo: "Institucional", percentualConcluido: 100, orcamento: 2400000, status: "Concluída", dataInicio: new Date("2026-01-28") },
];

const lancamentos: LancamentoFinanceiro[] = [
  { id: "1", descricao: "Medição Fundação – Res. Aurora", tipo: "Receita", data: new Date("2026-01-05"), valor: 128500, metodo: "Transferência", status: "Confirmado" },
  { id: "2", descricao: "Compra Cimento – Ed. Central", tipo: "Despesa", data: new Date("2026-01-08"), valor: 45200, metodo: "Boleto", status: "Pago" },
  { id: "3", descricao: "Medição Estrutura – Cond. Parque", tipo: "Receita", data: new Date("2026-01-10"), valor: 214800, metodo: "PIX", status: "Confirmado" },
  { id: "4", descricao: "Aluguel Equipamentos – Torre Norte", tipo: "Despesa", data: new Date("2026-01-12"), valor: 32600, metodo: "Débito Automático", status: "Pago" },
  { id: "5", descricao: "Medição Alvenaria – Vila Verde", tipo: "Receita", data: new Date("2026-01-15"), valor: 187350, metodo: "Transferência", status: "Pendente" },
  { id: "6", descricao: "Mão de Obra – Res. Aurora", tipo: "Despesa", data: new Date("2026-01-18"), valor: 76400, metodo: "Boleto", status: "Pago" },
  { id: "7", descricao: "Medição Cobertura – Lot. Sol", tipo: "Receita", data: new Date("2026-01-20"), valor: 95000, metodo: "PIX", status: "Confirmado" },
  { id: "8", descricao: "Transporte Material – Galpão BR-101", tipo: "Despesa", data: new Date("2026-01-22"), valor: 18900, metodo: "Cartão", status: "Pago" },
  { id: "9", descricao: "Medição Acabamento – Vida Nova", tipo: "Receita", data: new Date("2026-01-25"), valor: 63750, metodo: "Transferência", status: "Pendente" },
  { id: "10", descricao: "Licença Ambiental – Pq. Industrial", tipo: "Despesa", data: new Date("2026-01-28"), valor: 12800, metodo: "Boleto", status: "Vencido" },
];

export async function fetchObras(): Promise<Obra[]> {
  return obras;
}

export async function fetchLancamentos(): Promise<LancamentoFinanceiro[]> {
  return lancamentos;
}
