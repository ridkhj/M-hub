const form   = document.querySelector('#form-item');
const lista  = document.querySelector('#lista-itens');
const selectRep = document.querySelector('#item-repertorio');
const selectMus = document.querySelector('#item-musica');
const selectCan = document.querySelector('#item-cantor');

let nomePorMusicaId = {};
let nomePorCantorId = {};

function criarLinha(item, aoEditarOrdem, aoRemover) {
  const li = document.createElement('li');
  li.className = 'list-group-item';

  const topo = document.createElement('div');
  topo.className = 'd-flex justify-content-between align-items-center';

  const musicaNome = nomePorMusicaId[item.musicaId] || `Música #${item.musicaId}`;
  const cantorNome = nomePorCantorId[item.cantorId] || `Cantor #${item.cantorId}`;

  const info = document.createElement('span');
  info.innerHTML = `#${item.id} — Repertório ${item.repertorioId} | <strong>${musicaNome}</strong> cantado por ${cantorNome}`;

  const btnRemover = document.createElement('button');
  btnRemover.className = 'btn btn-sm btn-outline-danger';
  btnRemover.textContent = 'Remover';
  btnRemover.addEventListener('click', () => aoRemover(item.id));

  topo.append(info, btnRemover);

  const edicao = document.createElement('div');
  edicao.className = 'd-flex align-items-center gap-2 mt-2';

  const input = document.createElement('input');
  input.type = 'number';
  input.value = item.ordem || 0;
  input.className = 'form-control form-control-sm';
  input.placeholder = 'Ordem do item';

  const btnSalvar = document.createElement('button');
  btnSalvar.className = 'btn btn-sm btn-outline-primary';
  btnSalvar.textContent = 'Salvar ordem';
  btnSalvar.addEventListener('click', () => aoEditarOrdem(item.id, input.value));

  edicao.append(input, btnSalvar);
  li.append(topo, edicao);
  return li;
}

export const itemRepertorioView = {
    
  preencherSelects(repertorios = [], musicas = [], cantores = []) {
    if (selectRep) {
      selectRep.innerHTML = '<option value="">Repertório...</option>';
      repertorios.forEach(r => selectRep.innerHTML += `<option value="${r.id}">${r.titulo}</option>`);
    }

    if (selectMus) {
      nomePorMusicaId = {};
      selectMus.innerHTML = '<option value="">Música...</option>';
      musicas.forEach(m => {
        nomePorMusicaId[m.id] = m.nome;
        selectMus.innerHTML += `<option value="${m.id}">${m.nome}</option>`;
      });
    }

    if (selectCan) {
      nomePorCantorId = {};
      selectCan.innerHTML = '<option value="">Cantor...</option>';
      cantores.forEach(c => {
        nomePorCantorId[c.id] = c.nome;
        selectCan.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
      });
    }
  },

  renderLista(itens, aoEditarOrdem, aoRemover) {
    if (!lista) return;
    lista.innerHTML = '';
    if (itens.length === 0) {
      lista.innerHTML = '<li class="list-group-item text-muted">Nenhum item adicionado.</li>';
      return;
    }
    itens.forEach(i => lista.appendChild(criarLinha(i, aoEditarOrdem, aoRemover)));
  },

  limparForm() {
    if (selectRep) selectRep.value = '';
    if (selectMus) selectMus.value = '';
    if (selectCan) selectCan.value = '';
    const inputTom = document.querySelector('#item-tom');
    const inputOrdem = document.querySelector('#item-ordem');
    if (inputTom) inputTom.value = '';
    if (inputOrdem) inputOrdem.value = '';
  },

  onSubmit(callback) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      callback({
        repertorioId: selectRep.value,
        musicaId: selectMus.value,
        cantorId: selectCan.value,
        tomExecucao: document.querySelector('#item-tom') ? document.querySelector('#item-tom').value : '',
        ordem: document.querySelector('#item-ordem') ? document.querySelector('#item-ordem').value : ''
      });
    });
  },
};