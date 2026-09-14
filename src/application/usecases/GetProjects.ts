import type { IProjectRepository } from '../../domain/repositories/IProjectRepository'
import type { Project } from '../../domain/Project'

export class GetProjects {
  constructor(private readonly repository: IProjectRepository) {}

  execute(): Promise<Project[]> {
    return this.repository.findAll()
  }
}
