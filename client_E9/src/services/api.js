const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function req(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (res.status === 204) return null;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.erro || body.error || `Erro ${res.status}`);
  return body;
}

// ── Auth ─────────────────────────────────────────
export const fazerLogin      = (email, senha) => req('/login',   { method: 'POST', body: JSON.stringify({ email, senha }) });
export const cadastrarUsuario = (dados)        => req('/usuarios',{ method: 'POST', body: JSON.stringify(dados) });
export const listarUsuarios  = ()              => req('/usuarios');

// ── Cantores ──────────────────────────────────────
export const getCantores    = ()         => req('/api/cantores');
export const criarCantor    = (d)        => req('/api/cantores',    { method: 'POST', body: JSON.stringify(d) });
export const atualizarCantor= (id, d)    => req(`/api/cantores/${id}`, { method: 'PUT',  body: JSON.stringify(d) });
export const removerCantor  = (id)       => req(`/api/cantores/${id}`, { method: 'DELETE' });

// ── Músicas ───────────────────────────────────────
export const getMusicas     = ()         => req('/api/musicas');
export const criarMusica    = (d)        => req('/api/musicas',     { method: 'POST', body: JSON.stringify(d) });
export const atualizarMusica= (id, d)    => req(`/api/musicas/${id}`,  { method: 'PUT',  body: JSON.stringify(d) });
export const removerMusica  = (id)       => req(`/api/musicas/${id}`,  { method: 'DELETE' });

// ── Repertórios ───────────────────────────────────
export const getRepertorios     = ()     => req('/api/repertorios');
export const criarRepertorio    = (d)    => req('/api/repertorios',    { method: 'POST', body: JSON.stringify(d) });
export const atualizarRepertorio= (id,d) => req(`/api/repertorios/${id}`, { method: 'PUT',  body: JSON.stringify(d) });
export const removerRepertorio  = (id)   => req(`/api/repertorios/${id}`, { method: 'DELETE' });

// ── Itens de Repertório ────────────────────────────
export const getItensPorRepertorio = (repId) => req(`/api/itens-repertorio/repertorio/${repId}`);
export const criarItem             = (d)     => req('/api/itens-repertorio',    { method: 'POST', body: JSON.stringify(d) });
export const atualizarItem         = (id, d) => req(`/api/itens-repertorio/${id}`, { method: 'PUT',  body: JSON.stringify(d) });
export const removerItem           = (id)    => req(`/api/itens-repertorio/${id}`, { method: 'DELETE' });
