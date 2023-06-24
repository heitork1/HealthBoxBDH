function aumentarQuantidade(element) {
  var quantidadeElement = element.parentNode.querySelector('.qtd');
  var quantidade = parseInt(quantidadeElement.textContent);
  quantidadeElement.textContent = quantidade + 1;
  calcularPrecoTotal();
}

function diminuirQuantidade(element) {
  var quantidadeElement = element.parentNode.querySelector('.qtd');
  var quantidade = parseInt(quantidadeElement.textContent);
  if (quantidade > 0) {
    quantidadeElement.textContent = quantidade - 1;
    calcularPrecoTotal();
  }
}

function ready() {
  // Botão remover produto
  const removeCartProductButtons = document.getElementsByClassName("remove-product-button")
  for (var i = 0; i < removeCartProductButtons.length; i++) {
    removeCartProductButtons[i].addEventListener("click", removeProduct)
  }}
 

  function alterarNome(button) {
    if (!button.dataset.alterado) {
      button.style.transform = "scale(1)";
      button.innerHTML = "CONFIRMADO";
      button.dataset.alterado = true;
      document.getElementById("minhaDiv").style.display = "inline-block";
    }
  }
