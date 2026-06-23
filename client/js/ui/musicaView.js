const form   = document.querySelector('#form-musica');
const lista  = document.querySelector('#lista-musicas');

function criarLinha(    musica, aoEditarTom, aoRemover) {
  const li = document.createElement('li');
  li.className = 'list-group-item';

  const topo = document.createElement('div');
  topo.className = 'd-flex justify-content-between align-items-center';

  const info = document.createElement('span');
  info.innerHTML = `#${musica.id} — <strong>${musica.nome}</strong> (Tom: ${musica.tonalidadeOriginal})`;

  const btnRemover = document.createElement('button');
  btnRemover.className = 'btn btn-sm btn-outline-danger';
  btnRemover.textContent = 'Remover';
  btnRemover.addEventListener('click', () => aoRemover(musica.id));

  topo.append(info, btnRemover);

  const edicao = document.createElement('div');
  edicao.className = 'd-flex align-items-center gap-2 mt-2';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = musica.tonalidadeOriginal || '';
  input.className = 'form-control form-control-sm';

  const btnSalvar = document.createElement('button');
  btnSalvar.className = 'btn btn-sm btn-outline-primary';
  btnSalvar.textContent = 'Salvar tom';
  btnSalvar.addEventListener('click', () => aoEditarTom(musica.id, input.value));

  edicao.append(input, btnSalvar);
  li.append(topo, edicao);
  return li;
}

export const musicaView = {
  renderLista(musicas, aoEditarTom, aoRemover) {
    if (!lista) return;
    lista.innerHTML = '';
    if (musicas.length === 0) {
      lista.innerHTML = '<li class="list-group-item text-muted">Nenhuma música ainda.</li>';
      return;
    }
    musicas.forEach(m => lista.appendChild(criarLinha(m, aoEditarTom, aoRemover)));
  },

  limparForm() {
    document.querySelector('#musica-nome').value = '';
    document.querySelector('#musica-tom').value = '';
    document.querySelector('#musica-bpm').value = '';
  },

  onSubmit(callback) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      callback({
        nome: document.querySelector('#musica-nome').value,
        tonalidadeOriginal : document.querySelector('#musica-tom').value,
        bpm: document.querySelector('#musica-bpm').value
      });
    });
  },
};