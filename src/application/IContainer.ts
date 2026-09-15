import type { CreateEmpreendimento } from "./usecases/CreateEmpreendimento";
import type { GetDashboardData } from "./usecases/GetDashboardData";
import type { GetRelatorioObras } from "./usecases/GetRelatorioObras";
import type { GetRelatorioFinanceiro } from "./usecases/GetRelatorioFinanceiro";
import type { ExportarRelatorio } from "./usecases/ExportarRelatorio";

export interface IContainer {
  createEmpreendimento: CreateEmpreendimento;
  getDashboardData: GetDashboardData;
  getRelatorioObras: GetRelatorioObras;
  getRelatorioFinanceiro: GetRelatorioFinanceiro;
  exportarRelatorio: ExportarRelatorio;
}
