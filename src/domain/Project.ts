export type ProjectStatus = 'Planejado' | 'Em andamento' | 'Pausado' | 'Concluído'

export interface Project {
  readonly id: number
  readonly nome: string
  readonly cliente: string
  readonly status: ProjectStatus
  readonly inicio: string
  readonly termino: string
  readonly orcamento: number
  readonly progresso: number
}

export type CreateProjectInput = Omit<Project, 'id' | 'progresso'> & {
  readonly progresso?: number
}
