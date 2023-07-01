//função que altera o nome do botão quando clicado
function mudarNomeBotao() {

    var botao = document.getElementById("meuBotao");
    botao.textContent = "CONFIRMADO";
    botao.style.transform = "scale(1)";
    botao.onclick = null;
}
