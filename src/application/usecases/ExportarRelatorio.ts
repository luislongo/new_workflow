import type { IArquivoDownloader } from "../../domain/repositories/IArquivoDownloader";
import type { Obra, LancamentoFinanceiro } from "../../domain/Relatorio";
import { formatOrcamento, formatValor, formatData } from "../formatters";

const BOM = "﻿";
const SEPARADOR = ";";

type ExportarInput =
  | { tipo: "obras"; itens: Array<{ indice: number; obra: Obra }>; nomeArquivo: string }
  | { tipo: "financeiro"; itens: Array<{ indice: number; lancamento: LancamentoFinanceiro }>; nomeArquivo: string };

// Excel/Sheets executam como fórmula qualquer célula iniciada por = + - @ TAB ou CR,
// mesmo entre aspas. O apóstrofo à frente força a leitura como texto.
function neutralizarFormula(valor: string): string {
  return /^[=+\-@\t\r]/.test(valor) ? `'${valor}` : valor;
}

function escaparCampo(valor: string): string {
  const seguro = neutralizarFormula(valor);
  if (/[";\r\n]/.test(seguro)) {
    return `"${seguro.replace(/"/g, '""')}"`;
  }
  return seguro;
}

function montarLinha(campos: string[]): string {
  return campos.map(escaparCampo).join(SEPARADOR);
}

export class ExportarRelatorio {
  private readonly downloader: IArquivoDownloader;

  constructor(downloader: IArquivoDownloader) {
    this.downloader = downloader;
  }

  execute(input: ExportarInput): void {
    const linhas =
      input.tipo === "obras"
        ? [
            montarLinha(["#", "Obra", "Tipo", "% Concluído", "Orçamento", "Status"]),
            ...input.itens.map(({ indice, obra }) =>
              montarLinha([
                String(indice).padStart(2, "0"),
                obra.nome,
                obra.tipo,
                `${obra.percentualConcluido}%`,
                formatOrcamento(obra.orcamento),
                obra.status,
              ]),
            ),
          ]
        : [
            montarLinha(["#", "Descrição", "Tipo", "Data", "Valor", "Método", "Status"]),
            ...input.itens.map(({ indice, lancamento }) =>
              montarLinha([
                String(indice).padStart(2, "0"),
                lancamento.descricao,
                lancamento.tipo,
                formatData(lancamento.data),
                formatValor(lancamento.valor),
                lancamento.metodo,
                lancamento.status,
              ]),
            ),
          ];

    const conteudo = BOM + linhas.join("\r\n");
    this.downloader.baixar(input.nomeArquivo, conteudo, "text/csv;charset=utf-8");
  }
}
