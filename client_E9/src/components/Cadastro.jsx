import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { cadastrarUsuario } from "../services/api";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostraSenha, setMostraSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (senha.length < 6) { setErro("A senha deve ter pelo menos 6 caracteres."); return; }
    setCarregando(true);
    try {
      await cadastrarUsuario({ nome, email, senha });
      navigate("/login");
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
        <h2 className="auth-title">Criar conta</h2>
        <p className="auth-subtitle">Comece a gerenciar seus repertórios</p>

        {erro && <div className="auth-error" role="alert">{erro}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="nome">Nome</label>
            <input id="nome" type="text" className="input" placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} required autoFocus />
          </div>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" className="input" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <div className="input-wrapper">
              <input id="senha" type={mostraSenha ? "text" : "password"} className="input"
                placeholder="Mínimo 6 caracteres" value={senha} onChange={e => setSenha(e.target.value)} required minLength={6} />
              <button type="button" className="input-eye" onClick={() => setMostraSenha(v => !v)} aria-label="Mostrar senha">{mostraSenha ? "🙈" : "👁️"}</button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} disabled={carregando}>
            {carregando ? "Cadastrando..." : "Criar conta →"}
          </button>
        </form>
        <p className="auth-footer">Já tem conta? <Link to="/login">Entrar</Link></p>
      </div>
    </div>
  );
}
