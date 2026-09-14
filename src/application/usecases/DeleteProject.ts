import type { IProjectRepository } from '../../domain/repositories/IProjectRepository'

export class DeleteProject {
  constructor(private readonly repository: IProjectRepository) {}

  execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
