import { API_URL } from './config.js';

// Helper central: monta a requisição, checa erros e trata o 204 (sem corpo).
async function request(caminho, opcoes = {}) {
  const resp = await fetch(`${API_URL}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });

  if (!resp.ok) {
    // tenta extrair a mensagem de erro do backend
    let msg = `Erro ${resp.status}`;
    try {
      const corpo = await resp.json();
      if (corpo && corpo.erro) msg = corpo.erro;
      else if (corpo && corpo.error) msg = corpo.error;
    } catch (_) { /* resposta sem JSON */ }
    throw new Error(msg);
  }

  // 204 No Content: não há corpo para parsear
  if (resp.status === 204) return null;
  return resp.json();
}

export const api = {
  // ---- Músicas ----
  getMusicas()               { return request('/api/musicas'); },
  criarMusica(dados)         { return request('/api/musicas', { method: 'POST', body: JSON.stringify(dados) }); },
  atualizarMusica(id, dados) { return request(`/api/musicas/${id}`, { method: 'PUT', body: JSON.stringify(dados) }); },
  removerMusica(id)          { return request(`/api/musicas/${id}`, { method: 'DELETE' }); },

  // ---- Cantores ----
  getCantores()              { return request('/api/cantores'); },
  criarCantor(dados)         { return request('/api/cantores', { method: 'POST', body: JSON.stringify(dados) }); },
  atualizarCantor(id, dados) { return request(`/api/cantores/${id}`, { method: 'PUT', body: JSON.stringify(dados) }); },
  removerCantor(id)          { return request(`/api/cantores/${id}`, { method: 'DELETE' }); },

  // ---- Repertórios ----
  getRepertorios()               { return request('/api/repertorios'); },
  criarRepertorio(dados)         { return request('/api/repertorios', { method: 'POST', body: JSON.stringify(dados) }); },
  atualizarRepertorio(id, dados) { return request(`/api/repertorios/${id}`, { method: 'PUT', body: JSON.stringify(dados) }); },
  removerRepertorio(id)          { return request(`/api/repertorios/${id}`, { method: 'DELETE' }); },

  // ---- Itens de Repertório ----
  getItensRepertorio()           { return request('/api/itens-repertorio'); },
  getItensPorRepertorio(repId)   { return request(`/api/itens-repertorio/repertorio/${repId}`); },
  criarItemRepertorio(dados)     { return request('/api/itens-repertorio', { method: 'POST', body: JSON.stringify(dados) }); },
  atualizarItemRepertorio(id, dados) { return request(`/api/itens-repertorio/${id}`, { method: 'PUT', body: JSON.stringify(dados) }); },
  removerItemRepertorio(id)      { return request(`/api/itens-repertorio/${id}`, { method: 'DELETE' }); },
};