import { InMemoryProjectRepository } from './repositories/InMemoryProjectRepository'
import { GetProjects, CreateProject, UpdateProject, DeleteProject } from '../application'
import type { IContainer } from '../application/IContainer'

const projectRepository = new InMemoryProjectRepository()

export const container: IContainer = {
  getProjects: new GetProjects(projectRepository),
  createProject: new CreateProject(projectRepository),
  updateProject: new UpdateProject(projectRepository),
  deleteProject: new DeleteProject(projectRepository),
}
