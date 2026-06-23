const form   = document.querySelector('#form-cantor');
const lista  = document.querySelector('#lista-cantores');

function criarLinha(cantor, aoEditarNome, aoRemover) {
  const li = document.createElement('li');
  li.className = 'list-group-item';

  const topo = document.createElement('div');
  topo.className = 'd-flex justify-content-between align-items-center';

  const info = document.createElement('span');
  info.innerHTML = `#${cantor.id} — <strong>${cantor.nome}</strong>`;

  const btnRemover = document.createElement('button');
  btnRemover.className = 'btn btn-sm btn-outline-danger';
  btnRemover.textContent = 'Remover';
  btnRemover.addEventListener('click', () => aoRemover(cantor.id));

  topo.append(info, btnRemover);

  const edicao = document.createElement('div');
  edicao.className = 'd-flex align-items-center gap-2 mt-2';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = cantor.nome;
  input.className = 'form-control form-control-sm';

  const btnSalvar = document.createElement('button');
  btnSalvar.className = 'btn btn-sm btn-outline-primary';
  btnSalvar.textContent = 'Salvar nome';
  btnSalvar.addEventListener('click', () => aoEditarNome(cantor.id, input.value));

  edicao.append(input, btnSalvar);
  li.append(topo, edicao);
  return li;
}

export const cantorView = {
  renderLista(cantores, aoEditarNome, aoRemover) {
    if (!lista) return;
    lista.innerHTML = '';
    if (cantores.length === 0) {
      lista.innerHTML = '<li class="list-group-item text-muted">Nenhum cantor ainda.</li>';
      return;
    }
    cantores.forEach(c => lista.appendChild(criarLinha(c, aoEditarNome, aoRemover)));
  },

  limparForm() {
    document.querySelector('#cantor-nome').value = '';
    document.querySelector('#cantor-sexo').value = '';
  },

  onSubmit(callback) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      callback({
        nome: document.querySelector('#cantor-nome').value,
        sexo: document.querySelector('#cantor-sexo').value
      });
    });
  },

};