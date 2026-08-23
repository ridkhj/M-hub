import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { fazerLogin } from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostraSenha, setMostraSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const u = await fazerLogin(email, senha);
      onLogin(u);
      navigate("/");
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🎵</span>
          <span className="auth-logo-name">M-hub</span>
        </div>
        <h2 className="auth-title">Bem-vindo de volta 👋</h2>
        <p className="auth-subtitle">Gerencie seu repertório musical</p>

        {erro && <div className="auth-error" role="alert">{erro}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" className="input" placeholder="seu@email.com"
              value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <div className="input-wrapper">
              <input id="senha" type={mostraSenha ? "text" : "password"} className="input"
                placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} required />
              <button type="button" className="input-eye" onClick={() => setMostraSenha(v => !v)}
                aria-label="Mostrar senha">{mostraSenha ? "🙈" : "👁️"}</button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar →"}
          </button>
        </form>
        <p className="auth-footer">Não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
      </div>
    </div>
  );
}
