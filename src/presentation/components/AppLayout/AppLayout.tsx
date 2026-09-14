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
              icon={<IconAddBusiness />}
              active={pathname === "/empreendimento"}
              onClick={() => navigate("/empreendimento")}
            />
            <NavbarTab
              size={size}
              label="Dashboards"
              icon={<IconDashboard />}
              disabled
            />
            <NavbarTab
              size={size}
              label="Relatórios"
              icon={<IconEventNote />}
              disabled
            />
          </Navbar>
        }
      />
      <main className="flex-1 w-full max-w-[800px] mx-auto pt-[48px] px-0 pb-0 lg:px-0 max-[1023px]:px-[12px] max-[1023px]:pb-[12px]">
        {children}
      </main>
    </div>
  );
}
