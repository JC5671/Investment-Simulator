import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import SimulatorPage from "./pages/SimulatorPage.tsx";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <NavBar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<SimulatorPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
