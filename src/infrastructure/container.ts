import type { IContainer } from "../application/IContainer";
import { CreateEmpreendimento } from "../application/usecases/CreateEmpreendimento";
import { GetDashboardData } from "../application/usecases/GetDashboardData";
import { GetRelatorioObras } from "../application/usecases/GetRelatorioObras";
import { GetRelatorioFinanceiro } from "../application/usecases/GetRelatorioFinanceiro";
import { ExportarRelatorio } from "../application/usecases/ExportarRelatorio";
import { InMemoryEmpreendimentoRepository } from "./repositories/InMemoryEmpreendimentoRepository";
import { InMemoryDashboardRepository } from "./repositories/InMemoryDashboardRepository";
import { InMemoryRelatorioRepository } from "./repositories/InMemoryRelatorioRepository";
import { BlobArquivoDownloader } from "./BlobArquivoDownloader";

const empreendimentoRepository = new InMemoryEmpreendimentoRepository();
const dashboardRepository = new InMemoryDashboardRepository();
const relatorioRepository = new InMemoryRelatorioRepository();
const arquivoDownloader = new BlobArquivoDownloader();

export const container: IContainer = {
  createEmpreendimento: new CreateEmpreendimento(empreendimentoRepository),
  getDashboardData: new GetDashboardData(dashboardRepository),
  getRelatorioObras: new GetRelatorioObras(relatorioRepository),
  getRelatorioFinanceiro: new GetRelatorioFinanceiro(relatorioRepository),
  exportarRelatorio: new ExportarRelatorio(arquivoDownloader),
};
