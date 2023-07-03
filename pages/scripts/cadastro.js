function validarFormulario() {
    // Obtém os valores dos campos do formulário
    var username = document.querySelector("#username").value; // Obtém o valor do campo de nome de usuário
    var email = document.querySelector("#email").value; // Obtém o valor do campo de e-mail
    var password = document.querySelector("#password").value; // Obtém o valor do campo de senha
    var date = document.querySelector("#date").value; // Obtém o valor do campo de data
    var tel = document.querySelector("#tel").value; // Obtém o valor do campo de telefone

    // Verifica se algum campo está vazio
    if (username.trim() === "" || email.trim() === "" || password.trim() === "" || date.trim() === "" || tel.trim() === "") {
        exibirAlerta('Por favor, preencha todos os campos'); // Exibe uma mensagem de alerta solicitando o preenchimento de todos os campos
        return false; // Retorna false para evitar o envio do formulário
    }
}

function exibirAlerta(mensagem) {  
    alert(mensagem); // Exibe um alerta com a mensagem fornecida
}
