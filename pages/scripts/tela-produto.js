// função que mostra a descrição escondida
function toggleDiv() {
    var div = document.getElementById("minhaDiv");
    var botao = document.getElementById("meuBotao");

    if (div.style.display === "none") {
        div.style.display = "block"; // Mostra a div
        botao.value = "ESCONDER DESCRIÇÃO"; // Altera o texto do botão para "Esconder"
    } else {
        div.style.display = "none"; // Oculta a div
        botao.value = "VER DESCRIÇÃO COMPLETA"; // Altera o texto do botão para "Mostrar"
    }
}
// função para trocar as imagens
function selecionarImagem(caminhoImagem) {
    var imagemPrincipal = document.getElementById('imagem-principal');
    imagemPrincipal.src = caminhoImagem;
}