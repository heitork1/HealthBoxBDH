if (document.readyState == "loading") {
  // Esperar até que o DOM esteja completamente carregado antes de chamar a função ready
  document.addEventListener("DOMContentLoaded", ready);
} else {
  // O DOM já está completamente carregado, então chama a função ready imediatamente
  ready();
}

function ready() {
  const botaoremover = document.getElementsByClassName("botao-remover");

  // Adicionar um listener de clique para cada botão de remoção
  for (var i = 0; i < botaoremover.length; i++) {
    botaoremover[i].addEventListener("click", removeProduct);
  }

  const quantitySpan = document.getElementsByClassName("qtd").innerText;

  // Adicionar um listener de mudança para cada elemento de quantidade
  for (var i = 0; quantitySpan.length; i++) {
    quantitySpan[i].addEventListener("change", updateTotal);
  }
}

function aumentarQuantidade(element) {
  // Aumentar a quantidade em 1
  var quantidadeElement = element.parentNode.querySelector('.qtd');
  var quantidade = parseInt(quantidadeElement.textContent);
  quantidadeElement.textContent = quantidade + 1;
  calcularPrecoTotal();
  updateTotal();
}

function diminuirQuantidade(element) {
  // Diminuir a quantidade em 1, se for maior que zero
  var quantidadeElement = element.parentNode.querySelector('.qtd');
  var quantidade = parseInt(quantidadeElement.textContent);
  if (quantidade > 0) {
    quantidadeElement.textContent = quantidade - 1;
    calcularPrecoTotal();
    updateTotal();
  }
}

function removeProduct(event) {
  // Remover o produto da sacola
  event.target.parentElement.parentElement.remove();
  updateTotal();
}

function updateTotal() {
  let precoTotal = 0;
  const itensSacola = document.getElementsByClassName("item");
  for (var i = 0; i < itensSacola.length; i++) {
    // Obter o preço e a quantidade de cada item na sacola
    const itempreco = itensSacola[i].getElementsByClassName("val")[0].innerText.replace("R$", "").replace(",", ".");
    const itemQuantidade = itensSacola[i].getElementsByClassName("qtd")[0].innerText;

    // Calcular o preço total somando o preço de cada item multiplicado pela quantidade
    precoTotal += itempreco * itemQuantidade;
  }

  precoTotal = precoTotal.toFixed(2);
  precoTotal = precoTotal.replace(".", ",");
  document.querySelector("#precoTotal").innerText = "R$" + precoTotal;
}

function calcularPrecoTotal() {
  // Calcular o preço total com base na quantidade e nos preços unitários
  var quantidadeElement = document.querySelector('.qtd');
  var quantidade = parseInt(quantidadeElement.textContent);

  var precoUnitario1Element = document.getElementById('produto1');
  var precoUnitario1 = parseFloat(precoUnitario1Element.textContent.replace('R$', '').replace(',', '.'));

  var precoUnitario2Element = document.getElementById('produto2');
  var precoUnitario2 = parseFloat(precoUnitario2Element.textContent.replace('R$', '').replace(',', '.'));

  var precoTotal = (quantidade * (precoUnitario1 + precoUnitario2)).toFixed(2);

  var precoTotalElement = document.getElementById('precoTotal');
  precoTotalElement.textContent = 'R$ ' + precoTotal.replace('.', ',');
}

calcularPrecoTotal();

function alterarNome(button) {
  // Alterar o nome e o estilo do botão quando clicado
  if (!button.dataset.alterado) {
    button.style.transform = "scale(1)";
    button.innerHTML = "CONFIRMADO";
    button.dataset.alterado = true;
    document.getElementById("minhaDiv").style.display = "inline-block";
  }
}

function mostrarQuantidadeItensNaSacola() {
  // Mostrar a quantidade de itens na sacola
  const itensSacola = document.getElementsByClassName("item");
  const quantidadeItens = itensSacola.length;
  console.log("Quantidade de itens na sacola:", quantidadeItens);
}

if (document.readyState === "loading") {
  // Esperar até que o DOM esteja completamente carregado antes de chamar a função mostrarQuantidadeItensNaSacola
  document.addEventListener("DOMContentLoaded", mostrarQuantidadeItensNaSacola);
} else {
  // O DOM já está completamente carregado, então chama a função mostrarQuantidadeItensNaSacola imediatamente
  mostrarQuantidadeItensNaSacola();
}