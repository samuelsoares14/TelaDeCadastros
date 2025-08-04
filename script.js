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
      </div>
    `;

    lista.appendChild(li);
  });
}

// Submit do formulário de cadastro
formCadastroProduto.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = nomeProduto.value.trim();
  const codigo = codigoProduto.value.trim();
  const quantidade = quantproduto.value.trim();
  const valor = precoProduto.value.trim();
  const categoria = selectCategoria.value;
  const imagem = previewImagem.src; // pega a URL da imagem exibida no preview

  if (!nome || !codigo || !quantidade || !valor || !categoria) {
    alert('Preencha todos os campos!');
    return;
  }

  const produto = {
    nome,
    codigo,
    quantidade,
    valor,
    categoria,
    imagem
  };

  salvarProduto(produto);
  renderizarProdutos();

  formCadastroProduto.reset();
  previewImagem.src = 'produto.png';
  nomeImagem.textContent = 'Nenhuma imagem selecionada';
  selectCategoria.value = '';

  alert('Produto salvo com sucesso!');
});


// Carregar categorias ao iniciar página
window.addEventListener('DOMContentLoaded', () => {
  atualizarSelectCategorias();
});
