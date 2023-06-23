function aumentarQuantidade(element) {
    var quantidadeElement = element.parentNode.querySelector('.qtd');
    var quantidade = parseInt(quantidadeElement.textContent);
    quantidadeElement.textContent = quantidade + 1;
}

function diminuirQuantidade(element) {
    var quantidadeElement = element.parentNode.querySelector('.qtd');
    var quantidade = parseInt(quantidadeElement.textContent);
    if (quantidade > 0) {
        quantidadeElement.textContent = quantidade - 1;
    }
}