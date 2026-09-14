import { AppHeader, IconLocalLibrary } from "@luislongo/ds-core";
import { type ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

const Avatar = () => <div className="w-12 h-12 rounded-full bg-neutral-300" />;

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader
        title="Aplicação"
        icon={<IconLocalLibrary />}
        avatar={<Avatar />}
        className="h-[64px] border-b border-neutral-200"
      />
      <main className="flex-1 p-800 w-full max-w-[1200px] mx-auto">
        {children}
      </main>
    </div>
  );
}
