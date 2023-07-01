function toggleDiv() {
    var div = document.getElementById("minhaDiv");
    var botao = document.getElementById("meuBotao");

    if (div.style.display === "none") {
        div.style.display = "block"; // Mostra a div
        botao.value = "ESCONDER DESCRICAO"; // Altera o texto do botão para "Esconder"
    } else {
        div.style.display = "none"; // Oculta a div
        botao.value = "VER DESCRICAO COMPLETA"; // Altera o texto do botão para "Mostrar"
    }
}

function selecionarImagem(caminhoImagem) {
    var imagemPrincipal = document.getElementById('imagem-principal');
    imagemPrincipal.src = caminhoImagem;
}