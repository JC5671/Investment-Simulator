import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { ThemeProvider } from "./components/theme-provider.tsx";
import SimulatorPage from "./pages/SimulatorPage.tsx";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div
          className="min-h-screen bg-cover bg-center text-gray-100"
          style={{ backgroundImage: "url('/background.jpeg')" }}
        >
          <NavBar />
          <div className="p-6 relative z-10">
            <Routes>
              <Route path="/" element={<SimulatorPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
