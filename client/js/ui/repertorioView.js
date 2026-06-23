const form   = document.querySelector('#form-repertorio');
const lista  = document.querySelector('#lista-repertorios');

function criarLinha(repertorio, aoEditarData, aoRemover) {
  const li = document.createElement('li');
  li.className = 'list-group-item';

  const topo = document.createElement('div');
  topo.className = 'd-flex justify-content-between align-items-center';

  const info = document.createElement('span');
  info.innerHTML = `#${repertorio.id} — <strong>${repertorio.titulo}</strong>`;

  const btnRemover = document.createElement('button');
  btnRemover.className = 'btn btn-sm btn-outline-danger';
  btnRemover.textContent = 'Remover';
  btnRemover.addEventListener('click', () => aoRemover(repertorio.id));

  topo.append(info, btnRemover);

  const edicao = document.createElement('div');
  edicao.className = 'd-flex align-items-center gap-2 mt-2';

  const input = document.createElement('input');
  input.type = 'date';
  input.value = (repertorio.dataExecucao || '').split('T')[0]; // Formatando data simples
  input.className = 'form-control form-control-sm';

  const btnSalvar = document.createElement('button');
  btnSalvar.className = 'btn btn-sm btn-outline-primary';
  btnSalvar.textContent = 'Salvar data';
  btnSalvar.addEventListener('click', () => aoEditarData(repertorio.id, input.value));

  edicao.append(input, btnSalvar);
  li.append(topo, edicao);
  return li;
}

export const repertorioView = {
  renderLista(repertorios, aoEditarData, aoRemover) {
    if (!lista) return;
    lista.innerHTML = '';
    if (repertorios.length === 0) {
      lista.innerHTML = '<li class="list-group-item text-muted">Nenhum repertório ainda.</li>';
      return;
    }
    repertorios.forEach(r => lista.appendChild(criarLinha(r, aoEditarData, aoRemover)));
  },

  limparForm() {
    const titulo = document.querySelector('#rep-titulo');
    const data = document.querySelector('#rep-data');
    if (titulo) titulo.value = '';
    if (data) data.value = '';
  },

  onSubmit(callback) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      callback({
        titulo: document.querySelector('#rep-titulo') ? document.querySelector('#rep-titulo').value : '',
        dataExecucao: document.querySelector('#rep-data') ? document.querySelector('#rep-data').value : ''
      });
    });
  },
};