import type { Project, CreateProjectInput } from '../Project'

export interface IProjectRepository {
  findAll(): Promise<Project[]>
  findById(id: number): Promise<Project | null>
  save(input: CreateProjectInput): Promise<Project>
  update(project: Project): Promise<Project>
  delete(id: number): Promise<void>
}
