import type { GetProjects } from './usecases/GetProjects'
import type { CreateProject } from './usecases/CreateProject'
import type { UpdateProject } from './usecases/UpdateProject'
import type { DeleteProject } from './usecases/DeleteProject'

export interface IContainer {
  readonly getProjects: GetProjects
  readonly createProject: CreateProject
  readonly updateProject: UpdateProject
  readonly deleteProject: DeleteProject
}
