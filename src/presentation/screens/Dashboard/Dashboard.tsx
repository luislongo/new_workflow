import { useEffect, useState } from "react";
import {
  H1,
  ContentRow,
  ContentGrid,
  InfoCard,
  GraphCard,
  AreaChart,
  BarChart,
  LineChart,
  ProgressTable,
  IconApartment,
  IconAttachMoney,
  IconAssignmentTurnedIn,
  IconAccountBalanceWallet,
  IconBusinessCenter,
  IconDonutLarge,
} from "@luislongo/ds-core";
import type { InfoCardColor } from "@luislongo/ds-core";
import type { ProgressTableRow } from "@luislongo/ds-core";
import type { DashboardData, KpiIndicador } from "../../../domain/Dashboard";
import { useContainer } from "../../context/ContainerContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";

interface KpiConfig {
  color: InfoCardColor;
  icon: ReactNode;
}

const KPI_CONFIG: Record<string, KpiConfig> = {
  "obras-ativas": { color: "red", icon: <IconApartment /> },
  "custo-total": { color: "cyan", icon: <IconAttachMoney /> },
  "etapas-concluidas": { color: "purple", icon: <IconAssignmentTurnedIn /> },
  "orcamento-livre": { color: "amber", icon: <IconAccountBalanceWallet /> },
  "equipes-campo": { color: "lime", icon: <IconBusinessCenter /> },
  "progresso-geral": { color: "slate", icon: <IconDonutLarge /> },
};

export function Dashboard() {
  const { getDashboardData } = useContainer();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const size = isDesktop ? "desktop" : "mobile";

  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardData.execute().then(setData);
  }, [getDashboardData]);

  if (data === null) return null;

  const infoCards = data.kpis.map((kpi: KpiIndicador) => {
    const config = KPI_CONFIG[kpi.id];
    return (
      <InfoCard
        key={kpi.id}
        layout={size}
        color={config.color}
        icon={config.icon}
        mainValue={kpi.valor}
        description={kpi.label}
        subtitles={kpi.delta}
        className={
          isDesktop ? "flex-1 min-w-0 h-full" : "basis-[calc(50%-8px)] min-w-0"
        }
      />
    );
  });

  const evolucaoData = data.evolucaoCusto.map((p) => ({
    name: p.mes,
    mesAnterior: p.mesAnterior,
    mesAtual: p.mesAtual,
  }));

  const avancoPorObraData = data.avancoPorObra.map((p) => ({
    name: p.nomeObra,
    previsto: p.previsto,
    realizado: p.realizado,
  }));

  const indicadoresData = data.indicadoresObra.map((p) => ({
    name: p.mes,
    acabamento: p.acabamento,
    estrutura: p.estrutura,
    fundacao: p.fundacao,
  }));

  const graphCardClass = isDesktop ? "w-[calc(50%-8px)]" : "w-full";

  const graphCards = (
    <>
      <GraphCard titulo="Evolução do Custo" className={graphCardClass}>
        <AreaChart
          data={evolucaoData}
          series={[
            { key: "mesAnterior", name: "Mês Anterior" },
            { key: "mesAtual", name: "Mês Atual" },
          ]}
        />
      </GraphCard>

      <GraphCard titulo="Avanço por Obra" className={graphCardClass}>
        <BarChart
          data={avancoPorObraData}
          series={[
            { key: "previsto", name: "Previsto" },
            { key: "realizado", name: "Realizado" },
          ]}
        />
      </GraphCard>

      <GraphCard titulo="Indicadores de Obra" className={graphCardClass}>
        <LineChart
          data={indicadoresData}
          series={[
            { key: "acabamento", name: "Acabamento", color: "#a700ff" },
            { key: "estrutura", name: "Estrutura", color: "#ef4444" },
            { key: "fundacao", name: "Fundação", color: "#3cd856" },
          ]}
        />
      </GraphCard>

      <GraphCard titulo="Materiais Críticos" className={graphCardClass}>
        <ProgressTable
          data={data.materiaisCriticos.map(
            (material): ProgressTableRow => ({
              id: material.rank.toString().padStart(2, "0"),
              name: material.nome,
              popularity: material.estoquePercent,
              sales: material.usoPercent,
            })
          )}
        />
      </GraphCard>
    </>
  );

  if (isDesktop) {
    return (
      <div className="flex flex-col gap-2.5 p-12 bg-light-900">
        <H1>Dashboard</H1>
        <div className="flex flex-col p-4 gap-4">
          <ContentRow layout="desktop">{infoCards}</ContentRow>
          <ContentGrid layout="desktop">{graphCards}</ContentGrid>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-fit gap-5 px-400 py-600 bg-light-900">
      <H1>Dashboard</H1>
      <ContentRow layout="mobile">{infoCards}</ContentRow>
      <ContentGrid layout="mobile">{graphCards}</ContentGrid>
    </div>
  );
}
