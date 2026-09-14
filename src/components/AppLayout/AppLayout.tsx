import { useLocation, useNavigate } from 'react-router-dom'
import { type ReactNode } from 'react'
import { Navbar, NavbarTab } from '@ds/core'

const ROUTES = [
  { path: '/', label: 'Dashboard' },
  { path: '/projetos', label: 'Projetos' },
  { path: '/cadastro', label: 'Novo Projeto' },
  { path: '/onboarding', label: 'Onboarding' },
  { path: '/componentes', label: 'Componentes' },
]

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar>
        {ROUTES.map(route => (
          <NavbarTab
            key={route.path}
            label={route.label}
            active={pathname === route.path}
            onClick={() => navigate(route.path)}
          />
        ))}
      </Navbar>
      <main className="flex-1 p-800 w-full max-w-[1200px] mx-auto">
        {children}
      </main>
    </div>
  )
}
