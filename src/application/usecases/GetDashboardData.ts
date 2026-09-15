import type { IDashboardRepository } from "../../domain/repositories/IDashboardRepository";
import type { DashboardData } from "../../domain/Dashboard";

export class GetDashboardData {
  private readonly repository: IDashboardRepository;

  constructor(repository: IDashboardRepository) {
    this.repository = repository;
  }

  async execute(): Promise<DashboardData> {
    return this.repository.getDashboardData();
  }
}
