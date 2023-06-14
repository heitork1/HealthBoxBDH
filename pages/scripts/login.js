function validarFormulario() {
    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;
    
    if (email === "" || senha === "") {
        alert("Por favor, preencha todos os campos (email e senha).");
        return false; // Impede o envio do formulário
    }
    // Se todos os campos estiverem preenchidos, o formulário será enviado normalmente
    return true;
}