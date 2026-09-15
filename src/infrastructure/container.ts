import type { IContainer } from "../application/IContainer";
import { CreateEmpreendimento } from "../application/usecases/CreateEmpreendimento";
import { GetDashboardData } from "../application/usecases/GetDashboardData";
import { InMemoryEmpreendimentoRepository } from "./repositories/InMemoryEmpreendimentoRepository";
import { InMemoryDashboardRepository } from "./repositories/InMemoryDashboardRepository";

const empreendimentoRepository = new InMemoryEmpreendimentoRepository();
const dashboardRepository = new InMemoryDashboardRepository();

export const container: IContainer = {
  createEmpreendimento: new CreateEmpreendimento(empreendimentoRepository),
  getDashboardData: new GetDashboardData(dashboardRepository),
};
