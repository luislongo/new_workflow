import type { CreateEmpreendimento } from "./usecases/CreateEmpreendimento";
import type { GetDashboardData } from "./usecases/GetDashboardData";

export interface IContainer {
  createEmpreendimento: CreateEmpreendimento;
  getDashboardData: GetDashboardData;
}
