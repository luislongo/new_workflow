import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  H1,
  TabList,
  Tab,
  SearchInput,
  DateRangeInput,
  Button,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableRowCell,
  IconPictureAsPdf,
} from "@luislongo/ds-core";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useContainer } from "../../context/ContainerContext";
import type {
  Obra,
  LancamentoFinanceiro,
  FiltroRelatorio,
} from "../../../domain/Relatorio";
import {
  formatOrcamento,
  formatValor,
  formatData,
} from "../../../application/formatters";

type Tab = "obras" | "financeiro";

export function Relatorios() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const tabParam = searchParams.get("tab");
  const tab: Tab = tabParam === "financeiro" ? "financeiro" : "obras";

  const [busca, setBusca] = useState("");
  const [dataInicio, setDataInicio] = useState("2026-01-01");
  const [dataFim, setDataFim] = useState("2026-01-31");

  const [obras, setObras] = useState<Array<{
    indice: number;
    obra: Obra;
  }> | null>(null);
  const [lancamentos, setLancamentos] = useState<Array<{
    indice: number;
    lancamento: LancamentoFinanceiro;
  }> | null>(null);

  const { getRelatorioObras, getRelatorioFinanceiro, exportarRelatorio } =
    useContainer();

  const handleTabChange = (novaTab: Tab) => {
    setBusca("");
    setSearchParams({ tab: novaTab });
  };

  const handleStartChange = (valor: string) => {
    if (valor <= dataFim) setDataInicio(valor);
  };

  const handleEndChange = (valor: string) => {
    if (valor >= dataInicio) setDataFim(valor);
  };

  const handleExportar = () => {
    if (tab === "obras" && obras !== null) {
      exportarRelatorio.execute({
        tipo: "obras",
        itens: obras,
        nomeArquivo: "obras.csv",
      });
    } else if (tab === "financeiro" && lancamentos !== null) {
      exportarRelatorio.execute({
        tipo: "financeiro",
        itens: lancamentos,
        nomeArquivo: "financeiro.csv",
      });
    }
  };

  useEffect(() => {
    let ativo = true;
    const filtro: FiltroRelatorio = {
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
      busca,
    };
    getRelatorioObras.execute(filtro).then((r) => {
      if (ativo) setObras(r);
    });
    return () => {
      ativo = false;
    };
  }, [getRelatorioObras, dataInicio, dataFim, busca]);

  useEffect(() => {
    let ativo = true;
    const filtro: FiltroRelatorio = {
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim),
      busca,
    };
    getRelatorioFinanceiro.execute(filtro).then((r) => {
      if (ativo) setLancamentos(r);
    });
    return () => {
      ativo = false;
    };
  }, [getRelatorioFinanceiro, dataInicio, dataFim, busca]);

  if (obras === null || lancamentos === null) return null;

  const placeholder =
    tab === "obras" ? "Buscar obras..." : "Buscar lançamentos...";

  const toolbar = isDesktop ? (
    <div className="flex items-end gap-4">
      <SearchInput
        open
        className="flex-1"
        placeholder={placeholder}
        value={busca}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setBusca(e.target.value)
        }
      />
      <DateRangeInput
        startValue={dataInicio}
        endValue={dataFim}
        onStartChange={handleStartChange}
        onEndChange={handleEndChange}
      />
      <Button
        variant="tertiary"
        size="md"
        startIcon={<IconPictureAsPdf />}
        onClick={handleExportar}
      >
        Exportar
      </Button>
    </div>
  ) : (
    <div className="flex flex-col gap-3 align-bottom">
      <SearchInput
        open
        placeholder={placeholder}
        value={busca}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setBusca(e.target.value)
        }
      />

      <div className="flex flex-col justify-start w-full gap-3">
        <DateRangeInput
          startValue={dataInicio}
          endValue={dataFim}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
        />
        <div className="flex justify-end w-full">
          <Button
            variant="tertiary"
            size="sm"
            startIcon={<IconPictureAsPdf />}
            onClick={handleExportar}
          >
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );

  const tabelaObras = (
    <div className="overflow-x-auto">
      <TableHeaderRow className="shrink-0">
        <TableHeaderCell className={`${isDesktop ? "w-14" : "w-12"} shrink-0`}>
          #
        </TableHeaderCell>
        <TableHeaderCell
          className={`${isDesktop ? "flex-1" : ""} shrink-0 min-w-40 w-40`}
        >
          Obra
        </TableHeaderCell>
        <TableHeaderCell className={`${isDesktop ? "w-50" : "w-40"} shrink-0`}>
          Tipo
        </TableHeaderCell>
        <TableHeaderCell className={`${isDesktop ? "w-35" : "w-30"} shrink-0`}>
          % Concluído
        </TableHeaderCell>
        <TableHeaderCell className={`${isDesktop ? "w-40" : "w-35"} shrink-0`}>
          Orçamento
        </TableHeaderCell>
        <TableHeaderCell className={`${isDesktop ? "w-30" : "w-25"} shrink-0`}>
          Status
        </TableHeaderCell>
      </TableHeaderRow>
      {obras.map(({ indice, obra }) => (
        <TableRow key={obra.id} className="shrink-0">
          <TableRowCell className={`${isDesktop ? "w-14" : "w-12"} shrink-0`}>
            {String(indice).padStart(2, "0")}
          </TableRowCell>
          <TableRowCell
            className={`${isDesktop ? "flex-1" : ""} shrink-0 min-w-40 w-40`}
          >
            {obra.nome}
          </TableRowCell>
          <TableRowCell className={`${isDesktop ? "w-50" : "w-40"} shrink-0`}>
            {obra.tipo}
          </TableRowCell>
          <TableRowCell
            className={`${isDesktop ? "w-35" : "w-30"} shrink-0`}
            alignment="center"
          >
            {obra.percentualConcluido}%
          </TableRowCell>
          <TableRowCell
            className={`${isDesktop ? "w-40" : "w-35"} shrink-0`}
            alignment="right"
          >
            {formatOrcamento(obra.orcamento)}
          </TableRowCell>
          <TableRowCell className={`${isDesktop ? "w-30" : "w-25"} shrink-0`}>
            {obra.status}
          </TableRowCell>
        </TableRow>
      ))}
    </div>
  );

  const tabelaFinanceiro = (
    <div className="overflow-x-auto">
      <TableHeaderRow className="shrink-0">
        <TableHeaderCell className={`${isDesktop ? "w-14" : "w-12"} shrink-0`}>
          #
        </TableHeaderCell>
        <TableHeaderCell className={`grow min-w-40 shrink-0 w-50`}>
          Descrição
        </TableHeaderCell>
        <TableHeaderCell className={`${isDesktop ? "w-25" : "w-20"} shrink-0`}>
          Tipo
        </TableHeaderCell>
        <TableHeaderCell
          className={`${isDesktop ? "w-[110px]" : "w-[90px]"} shrink-0`}
        >
          Data
        </TableHeaderCell>
        <TableHeaderCell className={`${isDesktop ? "w-35" : "w-30"} shrink-0`}>
          Valor
        </TableHeaderCell>
        <TableHeaderCell className={`${isDesktop ? "w-35" : "w-30"} shrink-0`}>
          Método
        </TableHeaderCell>
        <TableHeaderCell
          className={`${isDesktop ? "w-[110px]" : "w-[90px]"} shrink-0`}
        >
          Status
        </TableHeaderCell>
      </TableHeaderRow>
      {lancamentos.map(({ indice, lancamento }) => (
        <TableRow key={lancamento.id} className="shrink-0">
          <TableRowCell className={`${isDesktop ? "w-14" : "w-12"} shrink-0`}>
            {String(indice).padStart(2, "0")}
          </TableRowCell>
          <TableRowCell className={`grow-1 min-w-40 shrink-0 w-50`}>
            {lancamento.descricao}
          </TableRowCell>
          <TableRowCell className={`${isDesktop ? "w-25" : "w-20"} shrink-0`}>
            {lancamento.tipo}
          </TableRowCell>
          <TableRowCell
            className={`${isDesktop ? "w-[110px]" : "w-[90px]"} shrink-0`}
          >
            {formatData(lancamento.data)}
          </TableRowCell>
          <TableRowCell
            className={`${isDesktop ? "w-35" : "w-30"} shrink-0`}
            alignment="right"
          >
            {formatValor(lancamento.valor)}
          </TableRowCell>
          <TableRowCell className={`${isDesktop ? "w-35" : "w-30"} shrink-0`}>
            {lancamento.metodo}
          </TableRowCell>
          <TableRowCell
            className={`${isDesktop ? "w-[110px]" : "w-[90px]"} shrink-0`}
          >
            {lancamento.status}
          </TableRowCell>
        </TableRow>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 lg:gap-6 p-4 lg:p-12 bg-light-900 min-h-full">
      <H1>Relatórios</H1>
      <TabList size={isDesktop ? "Large" : "Default"} className="w-full">
        <Tab
          label="Obras"
          size="Large"
          active={tab === "obras"}
          onClick={() => handleTabChange("obras")}
        />
        <Tab
          label="Financeiro"
          size="Large"
          active={tab === "financeiro"}
          onClick={() => handleTabChange("financeiro")}
        />
        <Tab label="Externo" size="Large" disabled />
      </TabList>
      {toolbar}
      {tab === "obras" ? tabelaObras : tabelaFinanceiro}
    </div>
  );
}
