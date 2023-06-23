
  
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
  
  function calcularPrecoTotal() {
    var quantidadeElement = document.querySelector('.qtd');
    var quantidade = parseInt(quantidadeElement.textContent);
  
    var precoUnitario1Element = document.getElementById('produto1');
    var precoUnitario1 = parseFloat(precoUnitario1Element.textContent.replace('R$', '').replace(',', '.'));
  
    var precoUnitario2Element = document.getElementById('produto2');
    var precoUnitario2 = parseFloat(precoUnitario2Element.dataset.preco);
  
    var precoTotal = (quantidade * (precoUnitario1 + precoUnitario2)).toFixed(2);
  
    var precoTotalElement = document.getElementById('precoTotal');
    precoTotalElement.textContent = 'R$ ' + precoTotal.replace('.', ',');
  }
  
  calcularPrecoTotal();

  function alterarNome(button) {
    if (!button.dataset.alterado) {
      button.style.transform = "scale(1)";
      button.innerHTML = "CONFIRMADO";
      button.dataset.alterado = true;
      document.getElementById("minhaDiv").style.display = "inline-block";
    }
  }
