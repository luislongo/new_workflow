import type { DashboardData } from "../Dashboard";

export interface IDashboardRepository {
  getDashboardData(): Promise<DashboardData>;
}
