function validarFormulario(){
    var username = document.querySelector("#username").value
    var email = document.querySelector("#email").value
    var password = document.querySelector("#password").value
    var date = document.querySelector("#date").value
    var tel = document.querySelector("#tel").value

    if(username.trim() === "" || email.trim() === "" || password.trim() === "" || date.trim() === "" || tel.trim() === ""){
        exibirAlerta('Por favor, preencha todos os campos')
        return false;
    }
}

function exibirAlerta(mensagem) {
    console.log("ta aqui")
    alert(mensagem);
  }