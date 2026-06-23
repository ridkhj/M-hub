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
  musicaView.renderLista(musicas, removerMusica);
  // O dropdown de itens de repertório depende das músicas:
  itemRepertorioView.preencherSelectMusicas(musicas);
}

async function criarMusica(dados) {
  limparErro();
  try {
    await musicaService.criar(dados);
    musicaView.limparForm();
    await atualizarMusicas();
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
  cantorView.renderLista(cantores, removerCantor);
  // O dropdown de itens de repertório depende dos cantores:
  itemRepertorioView.preencherSelectCantores(cantores);
}

async function criarCantor(dados) {
  limparErro();
  try {
    await cantorService.criar(dados);
    cantorView.limparForm();
    await atualizarCantores();
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
  repertorioView.renderLista(repertorios, removerRepertorio);
  // O dropdown de itens de repertório depende dos repertórios:
  itemRepertorioView.preencherSelectRepertorios(repertorios);
}

async function criarRepertorio(dados) {
  limparErro();
  try {
    await repertorioService.criar(dados);
    repertorioView.limparForm();
    await atualizarRepertorios();
  } catch (err) { mostrarErro(err.message); }
}

async function removerRepertorio(id) {
  limparErro();
  try {
    await repertorioService.remover(id);
    await atualizarRepertorios();
    await atualizarItensRepertorio(); // Atualiza itens caso o repertório suma
  } catch (err) { mostrarErro(err.message); }
}

// ---- Itens de Repertório ----
async function atualizarItensRepertorio() {
  const itens = await itemRepertorioService.listar();
  itemRepertorioView.renderLista(itens, removerItemRepertorio);
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
    await atualizarMusicas();
    await atualizarCantores();
    await atualizarRepertorios();
    
    // Carrega a lista final que depende das entidades acima
    await atualizarItensRepertorio();
  } catch (err) {
    mostrarErro('Não foi possível conectar à API. Verifique se o servidor está rodando (ex: porta 3000) e se o CORS está configurado.');
  }
}

iniciar();