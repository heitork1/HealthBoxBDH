const botaoremover =document.getElementsByClassName("botao-remover")
console.log(botaoremover)
for (var i=0; i < botaoremover.length; i++){
    botaoremover[i].addEventListener("click", function(event){
        event.target.parentElement.parentElement.remove()
        updateTotal()
    })
}

function updateTotal(){
let precoTotal = 0
const itensSacola = document.getElementsByClassName("item")
for (var i=0; i < itensSacola.length; i++){
    console.log(itensSacola[i])
    const itempreco = itensSacola[i].getElementsByClassName("val")[0].innerText.replace("R$", "").replace(",",".")
    const itemQuantidade = itensSacola[i].getElementsByClassName("qtd")[0].innerText
    
    precoTotal +=  itempreco * itemQuantidade

}
precoTotal = precoTotal.toFixed(2)
precoTotal = precoTotal.replace(".", ",")
 document.querySelector("#precoTotal").innerText = "R$" + precoTotal
}