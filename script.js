// Captura de elemtentos da página

const $listaDeTransações = document.querySelector(".transactions");
const $balanço = document.querySelector("#balance");
const $receitas = document.querySelector("#money-plus");
const $despesas = document.querySelector("#money-minus");

// Armazenamento de dados

const transaçõesDoLocalStorage = JSON.parse(localStorage.getItem("transações"));
const transações = localStorage.getItem("transações") != null ? transaçõesDoLocalStorage : [];

const atualizarLocalStorage = () => {
  localStorage.setItem("transações", JSON.stringify(transações));
}

// Processamento de dados

const $adicionarTransação = document.querySelector(".btn").addEventListener("click", processarTransação => {
  const $nomeTransação = document.querySelector("#text");
  const $valorTransação = document.querySelector("#amount");

  if ($nomeTransação.value.length === 0 || $valorTransação.value.length === 0) {
    alert("Preencha ambos os campos para adicionar alguma receita ou despesa");
    return;
  }
  
  const novaTransação = {};
  novaTransação.id = Math.round(Math.random() * 1000);
  novaTransação.nome = $nomeTransação.value;
  novaTransação.valor = Number($valorTransação.value);
  
  $nomeTransação.value = "";
  $valorTransação.value = "";

  inserirTransaçõesNoDOM(novaTransação);
  transações.push(novaTransação);
  
  atualizarLocalStorage();
  inicializar();

}); 

  // Inserção e remoção de transações

const inserirTransaçõesNoDOM = ({ id, nome, valor }) => {
  const operador = valor < 0 ? "-" : "+";
  const classeCSS = valor < 0 ? "minus" : "plus";
  const li = document.createElement("li");
  li.classList.add(classeCSS);

  li.innerHTML = `
    ${nome} <span>${operador} R$ ${Math.abs(valor)} </span>
    <button class="delete-btn" onClick="removerTransação(${id})">x</button>
  `;

  $listaDeTransações.prepend(li);
}

const removerTransação = id => {
  const transaçãoADeletar = transações.find(transação => transação.id === id);
  const índice = transações.findIndex(item => item === transaçãoADeletar);
  transações.splice(índice, 1);

  atualizarLocalStorage();
  inicializar();
}

// Funções de gerenciamento


const inicializar = () => {
  $listaDeTransações.innerHTML = "";
  transações.forEach(transação => {
    inserirTransaçõesNoDOM(transação);
  });
  
  atualizarBalançoDeValores();
}


const atualizarBalançoDeValores = () => {
  const valores = transações.map(transação => transação.valor);
  const total = (valores.reduce((acc, valor) => acc + valor, 0)).toFixed(2);
  const receitas = valores.filter(valor => valor >= 0)
  .reduce((acc, item) => acc + item, 0)
  .toFixed(2);
  const despesas = Math.abs(valores.filter(valor => valor < 0)
  .reduce((acc, item) => acc + item, 0))
  .toFixed(2);
  
  $balanço.textContent = `R$ ${total}`
  $receitas.textContent = `R$ ${receitas}`
  $despesas.textContent = `R$ ${despesas}` 
}

inicializar();