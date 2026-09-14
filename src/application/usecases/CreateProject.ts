import type { IProjectRepository } from '../../domain/repositories/IProjectRepository'
import type { Project, CreateProjectInput } from '../../domain/Project'

export class CreateProject {
  constructor(private readonly repository: IProjectRepository) {}

  execute(input: CreateProjectInput): Promise<Project> {
    return this.repository.save(input)
  }
}
