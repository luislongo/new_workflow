import {
  AppHeader,
  IconLocalLibrary,
  Navbar,
  NavbarTab,
  IconAddBusiness,
  IconDashboard,
  IconEventNote,
} from "@luislongo/ds-core";
import { type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";

interface AppLayoutProps {
  children: ReactNode;
}

const Avatar = () => (
  <div className="w-full h-full rounded-full bg-neutral-300" />
);

export function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const size = isDesktop ? "desktop" : "mobile";

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader
        size={size}
        title="Aplicação"
        icon={<IconLocalLibrary />}
        avatar={<Avatar />}
        navbar={
          <Navbar>
            <NavbarTab
              size={size}
              label="Empreendimento"
              aria-label="Empreendimento"
              icon={<IconAddBusiness />}
              active={pathname === "/empreendimento"}
              onClick={() => navigate("/empreendimento")}
            />
            <NavbarTab
              size={size}
              label="Dashboards"
              aria-label="Dashboards"
              icon={<IconDashboard />}
              active={pathname === "/dashboards"}
              onClick={() => navigate("/dashboards")}
            />
            <NavbarTab
              size={size}
              label="Relatórios"
              aria-label="Relatórios"
              icon={<IconEventNote />}
              active={pathname === "/relatorios"}
              onClick={() => navigate("/relatorios")}
            />
          </Navbar>
        }
      />
      <main className="flex-1 w-full ">{children}</main>
    </div>
  );
}
