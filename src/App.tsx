import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import SimulatorPage from "./pages/SimulatorPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <div
        className="min-h-screen bg-cover bg-center bg-fixed text-gray-100"
        style={{ backgroundImage: "url('/assets/background.jpg')" }}
      >
        <NavBar />
        <div className="p-6 relative z-10">
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
