function validarFormulario() {
    // Obtém os valores dos campos do formulário
    var username = document.querySelector("#username").value;
    var email = document.querySelector("#email").value;
    var password = document.querySelector("#password").value;
    var date = document.querySelector("#date").value;
    var tel = document.querySelector("#tel").value;

    // Verifica se algum campo está vazio
    if (username.trim() === "" || email.trim() === "" || password.trim() === "" || date.trim() === "" || tel.trim() === "") {
        exibirAlerta('Por favor, preencha todos os campos');
        return false; // Retorna false para evitar o envio do formulário
    }
}

function exibirAlerta(mensagem) {
    console.log("ta aqui");
    alert(mensagem);
}