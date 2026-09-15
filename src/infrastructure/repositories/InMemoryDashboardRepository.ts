import type { IDashboardRepository } from "../../domain/repositories/IDashboardRepository";
import type { DashboardData } from "../../domain/Dashboard";
import { fetchDashboardData } from "../../mocks/dashboard";

export class InMemoryDashboardRepository implements IDashboardRepository {
  async getDashboardData(): Promise<DashboardData> {
    return fetchDashboardData();
  }
}
