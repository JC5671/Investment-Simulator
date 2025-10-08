import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.tsx";
import Footer from "./components/Footer.tsx";
import SimulatorPage from "./pages/SimulatorPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <div
        className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/assets/background.jpg')" }}
      >
        <NavBar />

        {/* Main Content */}
        <div className="flex-grow p-6 relative z-10">
          <Routes>
            <Route path="/" element={<SimulatorPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
