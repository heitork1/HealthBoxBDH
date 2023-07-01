function mudarNomeBotao() {
    // Função para alterar o nome e o comportamento do botão
    var botao = document.getElementById("meuBotao");
    botao.value = "ENVIADO";
    botao.style.transform = "scale(1)";
    botao.onclick = null;
}
