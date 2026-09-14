import { createContext, useContext, type ReactNode } from 'react'
import type { IContainer } from '../../application/IContainer'

const ContainerContext = createContext<IContainer | null>(null)

export function ContainerProvider({ children, container }: { children: ReactNode; container: IContainer }) {
  return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>
}

export function useContainer(): IContainer {
  const ctx = useContext(ContainerContext)
  if (!ctx) throw new Error('useContainer must be used inside <ContainerProvider>')
  return ctx
}
