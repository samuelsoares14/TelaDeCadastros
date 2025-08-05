// Elementos do DOM
const telaCadastroProdutos = document.getElementById('btn-tela-cadastro-produtos');
const listaProdutos = document.getElementById('btn-lista-produtos');
const formCadastroProduto = document.getElementById('formulario-novo-produto');
const telaListaProdutos = document.getElementById('form-listaProdutos');
const listaProdutosUl = document.querySelector('#form-listaProdutos .card-itens');

const botaoUpload = document.getElementById('upload-btn');
const inputImagem = document.getElementById('imagem-upload');
const previewImagem = document.getElementById('preview-imagem');
const nomeImagem = document.getElementById('nome-imagem');

const nomeProduto = document.getElementById('nome');
const codigoProduto = document.getElementById('codigo');
const quantproduto = document.getElementById('quantidade');
const precoProduto = document.getElementById('valor');

const selectCategoria = document.getElementById('categoria');
const btnNovaCategoria = document.getElementById('btn-nova-categoria');
const formNovaCategoria = document.getElementById('form-nova-categoria');
const inputNovaCategoria = document.getElementById('nova-categoria');
const btnSalvarCategoria = document.getElementById('btn-salvar-nova-categoria');

// Navegação entre telas
telaCadastroProdutos.addEventListener('click', () => {
  formCadastroProduto.classList.remove('hidden');
  telaListaProdutos.classList.add('hidden');
});

listaProdutos.addEventListener('click', () => {
  formCadastroProduto.classList.add('hidden');
  telaListaProdutos.classList.remove('hidden');
  renderizarProdutos();
});

// Upload e preview da imagem
botaoUpload.addEventListener('click', () => inputImagem.click());

inputImagem.addEventListener('change', () => {
  const file = inputImagem.files[0];
  if (file) {
    previewImagem.src = URL.createObjectURL(file);
    nomeImagem.textContent = file.name;
  } else {
    previewImagem.src = 'produto.png';
    nomeImagem.textContent = 'Nenhuma imagem selecionada';
  }
});

// Nova categoria
btnNovaCategoria.addEventListener('click', () => {
  formNovaCategoria.classList.toggle('hidden');
});

btnSalvarCategoria.addEventListener('click', () => {
  const novaCategoria = inputNovaCategoria.value.trim();
  if (novaCategoria === '') return;

  let categorias = JSON.parse(localStorage.getItem('categoria')) || [];
  if (!categorias.includes(novaCategoria)) {
    categorias.push(novaCategoria);
    categorias.sort();
    localStorage.setItem('categoria', JSON.stringify(categorias));
    atualizarSelectCategorias();
    selectCategoria.value = novaCategoria;
  }

  inputNovaCategoria.value = '';
  formNovaCategoria.classList.add('hidden');
});

function adicionarCategoriaAoSelect(categoria) {
  const option = document.createElement('option');
  option.value = categoria;
  option.textContent = categoria;
  selectCategoria.appendChild(option);
}

function atualizarSelectCategorias() {
  selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';
  const categorias = JSON.parse(localStorage.getItem('categoria')) || [];
  categorias.sort();
  categorias.forEach(cat => adicionarCategoriaAoSelect(cat));
}

// Salvar produto no localStorage
function salvarProduto(produto) {
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  produtos.push(produto);
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Renderizar produtos na lista
function renderizarProdutos() {
  const lista = document.querySelector('.card-itens');
  lista.innerHTML = ''; // limpa antes de adicionar

  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

  produtos.forEach(produto => {
    const li = document.createElement('li');
    li.classList.add('card-item');


    li.innerHTML = `
      <img class="imagem-item" src="${produto.imagem}" alt="${produto.nome}">
      <div class="text">
        <h2 class="nome-produto">${produto.nome}</h2>
        <p><strong>Código:</strong> ${produto.codigo}</p>
        <p><strong>Categoria:</strong> ${produto.categoria}</p>
        <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
        <p class="preco-produto">R$ ${parseFloat(produto.valor).toFixed(2)}</p>
        <div class="card-actions">
          <button class="btn-editar" data-codigo="${produto.codigo}" title="Editar produto">✏️</button>
          <button class="btn-excluir" data-codigo="${produto.codigo}" title="Excluir produto">🗑️</button>
        </div>
      </div>
    `;

    // Evento para mostrar/ocultar ações ao clicar no card (exceto nos botões)
    li.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn-editar') && !e.target.classList.contains('btn-excluir')) {
        li.classList.toggle('show-actions');
      }
    });

    // Evento para excluir produto
    li.querySelector('.btn-excluir').addEventListener('click', (e) => {
      const codigo = e.target.getAttribute('data-codigo');
      excluirProduto(codigo);
    });

    // Evento para editar produto
    li.querySelector('.btn-editar').addEventListener('click', (e) => {
      const codigo = e.target.getAttribute('data-codigo');
      editarProduto(codigo);
    });

    lista.appendChild(li);
  });
}

function excluirProduto(codigo) {
  let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  produtos = produtos.filter(p => p.codigo !== codigo);
  localStorage.setItem('produtos', JSON.stringify(produtos));
  renderizarProdutos();
}


// Submit do formulário de cadastro
formCadastroProduto.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = nomeProduto.value.trim();
  const codigo = codigoProduto.value.trim();
  const quantidade = quantproduto.value.trim();
  const valor = parseFloat(precoProduto.value.trim()).toFixed(2);
  const categoria = selectCategoria.value;
  const imagem = previewImagem.src;

  if (!nome || !codigo || !quantidade || !valor || !categoria) {
    alert('Preencha todos os campos!');
    return;
  }

  let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

  const editando = e.submitter.dataset.editando;

  if (editando) {
    // Atualiza produto existente
    produtos = produtos.map(p => {
      if (p.codigo === editando) {
        return { nome, codigo, quantidade, valor, categoria, imagem };
      }
      return p;
    });
    e.submitter.textContent = 'Salvar Produto';
    delete e.submitter.dataset.editando;
    alert('Produto atualizado com sucesso!');
  } else {
    // Salva novo produto
    const produto = { nome, codigo, quantidade, valor, categoria, imagem };
    produtos.push(produto);
    alert('Produto salvo com sucesso!');
  }

  localStorage.setItem('produtos', JSON.stringify(produtos));
  renderizarProdutos();

  formCadastroProduto.reset();
  previewImagem.src = 'produto.png';
  nomeImagem.textContent = 'Nenhuma imagem selecionada';
  selectCategoria.value = '';
});



// Carregar categorias ao iniciar página
window.addEventListener('DOMContentLoaded', () => {
  atualizarSelectCategorias();
});


// Editar Produto

function editarProduto(codigo) {
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  const produto = produtos.find(p => p.codigo === codigo);

  if (!produto) return;

  // Preenche o formulário com os dados do produto
  nomeProduto.value = produto.nome;
  codigoProduto.value = produto.codigo;
  quantproduto.value = produto.quantidade;
  precoProduto.value = produto.valor;
  selectCategoria.value = produto.categoria;
  previewImagem.src = produto.imagem;
  nomeImagem.textContent = 'Imagem carregada';

  // Mostra a tela de cadastro e esconde a lista
  formCadastroProduto.classList.remove('hidden');
  telaListaProdutos.classList.add('hidden');

  // Troca o botão para "Atualizar"
  const btnSalvar = document.getElementById('btn-salvar-produtos');
  btnSalvar.textContent = 'Atualizar Produto';
  btnSalvar.dataset.editando = codigo;
  btnCancelarEdicao.classList.remove('hidden');
}

const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');

btnCancelarEdicao.addEventListener('click', () => {
  formCadastroProduto.reset();
  previewImagem.src = 'produto.png';
  nomeImagem.textContent = 'Nenhuma imagem selecionada';
  selectCategoria.value = '';

  const btnSalvar = document.getElementById('btn-salvar-produtos');
  btnSalvar.textContent = 'Salvar Produto';
  delete btnSalvar.dataset.editando;

  btnCancelarEdicao.classList.add('hidden');
});

btnCancelarEdicao.classList.add('hidden');