
function toggleDiv() {
  var div = document.getElementById("minhaDiv");
  var botao = document.getElementById("meuBotao");

  if (div.style.display === "none") {
    div.style.display = "block"; // Mostra a div
    div.style.justifyContent = "spaceBeetwen";
    botao.value = "CARREGAR MENOS"; // Altera o texto do botão
  } else {
    div.style.display = "none"; // Oculta a div
    botao.value = "CARREGAR MAIS"; // Altera o texto do botão
  }
}

