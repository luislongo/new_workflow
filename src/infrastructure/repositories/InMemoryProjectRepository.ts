import type { IProjectRepository } from '../../domain/repositories/IProjectRepository'
import type { Project, CreateProjectInput } from '../../domain/Project'

let nextId = 1

export class InMemoryProjectRepository implements IProjectRepository {
  private readonly store = new Map<number, Project>()

  async findAll(): Promise<Project[]> {
    return [...this.store.values()]
  }

  async findById(id: number): Promise<Project | null> {
    return this.store.get(id) ?? null
  }

  async save(input: CreateProjectInput): Promise<Project> {
    const project: Project = { ...input, id: nextId++, progresso: input.progresso ?? 0 }
    this.store.set(project.id, project)
    return project
  }

  async update(project: Project): Promise<Project> {
    if (!this.store.has(project.id)) throw new Error(`Project ${project.id} not found`)
    this.store.set(project.id, project)
    return project
  }

  async delete(id: number): Promise<void> {
    this.store.delete(id)
  }
}
