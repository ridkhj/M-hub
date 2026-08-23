import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import Layout from "./components/layout/Layout";
import Login    from "./components/Login";
import Cadastro from "./components/Cadastro";
import Home     from "./components/Home";
import Cantores from "./components/Cantores";
import Musicas  from "./components/Musicas";
import Repertorios      from "./components/Repertorios";
import RepertorioDetalhe from "./components/RepertorioDetalhe";
import "./App.css";

function Protected({ usuario, onSair, children }) {
  const [busca, setBusca] = useState("");
  if (!usuario) return <Navigate to="/login" replace />;
  return (
    <Layout usuario={usuario} onSair={onSair} busca={busca} onBusca={setBusca}>
      {children}
    </Layout>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("mhub-user")) || null; }
    catch { return null; }
  });

  function handleLogin(u) {
    setUsuario(u);
    sessionStorage.setItem("mhub-user", JSON.stringify(u));
  }
  function handleSair() {
    setUsuario(null);
    sessionStorage.removeItem("mhub-user");
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login"    element={usuario ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
            <Route path="/cadastro" element={usuario ? <Navigate to="/" replace /> : <Cadastro />} />
            <Route path="/" element={<Protected usuario={usuario} onSair={handleSair}><Home usuario={usuario} /></Protected>} />
            <Route path="/cantores"    element={<Protected usuario={usuario} onSair={handleSair}><Cantores /></Protected>} />
            <Route path="/musicas"     element={<Protected usuario={usuario} onSair={handleSair}><Musicas /></Protected>} />
            <Route path="/repertorios" element={<Protected usuario={usuario} onSair={handleSair}><Repertorios /></Protected>} />
            <Route path="/repertorios/:id" element={<Protected usuario={usuario} onSair={handleSair}><RepertorioDetalhe /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
