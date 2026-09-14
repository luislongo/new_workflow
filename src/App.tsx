import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { container } from "./infrastructure/container";
import { ContainerProvider } from "./presentation/context/ContainerContext";
import { AppLayout } from "./presentation/components/AppLayout";
import { AdicionarEmpreendimento } from "./presentation/screens/AdicionarEmpreendimento";

function App() {
  return (
    <BrowserRouter>
      <ContainerProvider container={container}>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/empreendimento" replace />} />
            <Route path="/empreendimento" element={<AdicionarEmpreendimento />} />
          </Routes>
        </AppLayout>
      </ContainerProvider>
    </BrowserRouter>
  );
}

export default App;
