if(document.readystate == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
}else{
    ready()

}


function ready(){
    const botaoremover =document.getElementsByClassName("botao-remover")
    // console.log(botaoremover)
    for (var i=0; i < botaoremover.length; i++){
        botaoremover[i].addEventListener("click", removeProduct)
    }    

    const quantitySpan = document.getElementsByClassName("qtd").innerText
    for (var i = 0; quantitySpan.length; i++){
        quantitySpan[i].addEventListener("change", updateTotal)
    }



}

function aumentarQuantidade(element) {
    var quantidadeElement = element.parentNode.querySelector('.qtd');
    var quantidade = parseInt(quantidadeElement.textContent);
    quantidadeElement.textContent = quantidade + 1;
    calcularPrecoTotal();
    updateTotal()
  }
  
  function diminuirQuantidade(element) {
    var quantidadeElement = element.parentNode.querySelector('.qtd');
    var quantidade = parseInt(quantidadeElement.textContent);
    if (quantidade > 0) {
      quantidadeElement.textContent = quantidade - 1;
      calcularPrecoTotal();
      updateTotal()
    }
  }

function removeProduct(event){
    event.target.parentElement.parentElement.remove()
    updateTotal()
}


function updateTotal(){
    let precoTotal = 0
    const itensSacola = document.getElementsByClassName("item")
    for (var i=0; i < itensSacola.length; i++){
    // console.log(itensSacola[i])
        const itempreco = itensSacola[i].getElementsByClassName("val")[0].innerText.replace("R$", "").replace(",",".")
        const itemQuantidade = itensSacola[i].getElementsByClassName("qtd")[0].innerText
    
        precoTotal +=  itempreco * itemQuantidade

    }   

    precoTotal = precoTotal.toFixed(2)
    precoTotal = precoTotal.replace(".", ",")
    document.querySelector("#precoTotal").innerText = "R$" + precoTotal
}

function calcularPrecoTotal() {
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
    if (!button.dataset.alterado) {
      button.style.transform = "scale(1)";
      button.innerHTML = "CONFIRMADO";
      button.dataset.alterado = true;
      document.getElementById("minhaDiv").style.display = "inline-block";
    }
  }
