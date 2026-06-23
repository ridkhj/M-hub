import { musicaService } from './services/musicaService.js';
import { cantorService } from './services/cantorService.js';
import { repertorioService } from './services/repertorioService.js';
import { itemRepertorioService } from './services/itemRepertorioService.js';

import { musicaView } from './ui/musicaView.js';
import { cantorView } from './ui/cantorView.js';
import { repertorioView } from './ui/repertorioView.js';
import { itemRepertorioView } from './ui/itemRepertorioView.js';

const alerta = document.querySelector('#alerta');

function mostrarErro(msg) {
  alerta.textContent = msg;
  alerta.classList.remove('d-none');
}

function limparErro() {
  alerta.classList.add('d-none');
  alerta.textContent = '';
}

// ---- Músicas ----
async function atualizarMusicas() {
  const musicas = await musicaService.listar();
  musicaView.renderLista(musicas, editarMusicaTom, removerMusica);
  return musicas;
}

async function criarMusica(dados) {
  limparErro();
  try {
    await musicaService.criar(dados);
    musicaView.limparForm();
    await atualizarMusicas();
    await atualizarSelects();
  } catch (err) { mostrarErro(err.message); }
}

async function removerMusica(id) {
  limparErro();
  try {
    await musicaService.remover(id);
    await atualizarMusicas();
  } catch (err) { mostrarErro(err.message); }
}

// ---- Cantores ----
async function atualizarCantores() {
  const cantores = await cantorService.listar();
  cantorView.renderLista(cantores, editarCantorNome, removerCantor);
  return cantores;
}

async function criarCantor(dados) {
  limparErro();
  try {
    await cantorService.criar(dados);
    cantorView.limparForm();
    await atualizarCantores();
    await atualizarSelects();
  } catch (err) { mostrarErro(err.message); }
}

async function removerCantor(id) {
  limparErro();
  try {
    await cantorService.remover(id);
    await atualizarCantores();
  } catch (err) { mostrarErro(err.message); }
}

// ---- Repertórios ----
async function atualizarRepertorios() {
  const repertorios = await repertorioService.listar();
  repertorioView.renderLista(repertorios, editarRepertorioData, removerRepertorio);
  return repertorios;
}
  
async function criarRepertorio(dados) {
  limparErro();
  try {
    await repertorioService.criar(dados);
    repertorioView.limparForm();
    await atualizarRepertorios();
    await atualizarSelects();
  } catch (err) { mostrarErro(err.message); }
}

async function removerRepertorio(id) {
  limparErro();
  try {
    await repertorioService.remover(id);
    await atualizarRepertorios();
    await atualizarItensRepertorio(); // Atualiza itens caso o repertório suma
    await atualizarSelects();
  } catch (err) { mostrarErro(err.message); }
}

// ---- Itens de Repertório ----
async function atualizarItensRepertorio() {
  const itens = await itemRepertorioService.listar();
  itemRepertorioView.renderLista(itens, editarItemOrdem, removerItemRepertorio);
}

async function criarItemRepertorio(dados) {
  limparErro();
  try {
    await itemRepertorioService.criar(dados);
    itemRepertorioView.limparForm();
    await atualizarItensRepertorio();
  } catch (err) { mostrarErro(err.message); }
}

async function removerItemRepertorio(id) {
  limparErro();
  try {
    await itemRepertorioService.remover(id);
    await atualizarItensRepertorio();
    await atualizarSelects();
  } catch (err) { mostrarErro(err.message); }
}

// Atualiza os selects usados pelo form de itens de repertório
async function atualizarSelects() {
  try {
    const musicas = await musicaService.listar();
    const cantores = await cantorService.listar();
    const repertorios = await repertorioService.listar();
    itemRepertorioView.preencherSelects(repertorios, musicas, cantores);
  } catch (err) {
    mostrarErro(err.message);
  }
}

// --- Edit handlers (salvar alterações inline)
async function editarMusicaTom(id, novoTom) {
  limparErro();
  try {
    await musicaService.atualizar(id, { tonalidadeOriginal: novoTom });
    await atualizarMusicas();
    await atualizarItensRepertorio();
  } catch (err) { mostrarErro(err.message); }
}

async function editarCantorNome(id, novoNome) {
  limparErro();
  try {
    await cantorService.atualizar(id, { nome: novoNome });
    await atualizarCantores();
    await atualizarItensRepertorio();
  } catch (err) { mostrarErro(err.message); }
}

async function editarRepertorioData(id, novaData) {
  limparErro();
  try {
    await repertorioService.atualizar(id, { dataExecucao: novaData });
    await atualizarRepertorios();
    await atualizarItensRepertorio();
    await atualizarSelects();
  } catch (err) { mostrarErro(err.message); }
}

async function editarItemOrdem(id, novaOrdem) {
  limparErro();
  try {
    await itemRepertorioService.atualizar(id, { ordem: Number(novaOrdem) });
    await atualizarItensRepertorio();
  } catch (err) { mostrarErro(err.message); }
}

// ---- Inicialização ----
musicaView.onSubmit(criarMusica);
cantorView.onSubmit(criarCantor);
repertorioView.onSubmit(criarRepertorio);
itemRepertorioView.onSubmit(criarItemRepertorio);

async function iniciar() {
  try {
    // Carrega os dados básicos que alimentam os selects e as listas
    const musicas = await atualizarMusicas();
    const cantores = await atualizarCantores();
    const repertorios = await atualizarRepertorios();
    // Popula selects de itens de repertório com todas as informações
    itemRepertorioView.preencherSelects(repertorios, musicas, cantores);
    // Carrega a lista final que depende das entidades acima
    await atualizarItensRepertorio();
  } catch (err) {
    mostrarErro(err.message);
  }
}

iniciar();