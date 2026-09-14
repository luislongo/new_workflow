import { BrowserRouter, Routes } from "react-router-dom";
import { container } from "./infrastructure/container";
import { ContainerProvider } from "./presentation/context/ContainerContext";
import { AppLayout } from "./presentation/components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <ContainerProvider container={container}>
        <AppLayout>
          <Routes></Routes>
        </AppLayout>
      </ContainerProvider>
    </BrowserRouter>
  );
}

export default App;
