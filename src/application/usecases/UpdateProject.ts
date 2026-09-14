import type { IProjectRepository } from '../../domain/repositories/IProjectRepository'
import type { Project } from '../../domain/Project'

export class UpdateProject {
  constructor(private readonly repository: IProjectRepository) {}

  execute(project: Project): Promise<Project> {
    return this.repository.update(project)
  }
}
