import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { container } from "./infrastructure/container";
import { ContainerProvider } from "./presentation/context/ContainerContext";
import { AppLayout } from "./presentation/components/AppLayout";
import { AdicionarEmpreendimento } from "./presentation/screens/AdicionarEmpreendimento";
import { Dashboard } from "./presentation/screens/Dashboard";
import { Relatorios } from "./presentation/screens/Relatorios";

function App() {
  return (
    <BrowserRouter>
      <ContainerProvider container={container}>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboards" replace />} />
            <Route path="/empreendimento" element={<AdicionarEmpreendimento />} />
            <Route path="/dashboards" element={<Dashboard />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </AppLayout>
      </ContainerProvider>
    </BrowserRouter>
  );
}

export default App;
