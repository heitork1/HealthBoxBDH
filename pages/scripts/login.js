function validarFormulario() {
  // Obtém os valores do formulário
  var username = document.getElementById('email').value; // Obtém o valor do campo de email
  var password = document.getElementById('senha').value; // Obtém o valor do campo de senha

  if (username.trim() === '' || password.trim() === '') {
    exibirAlerta('Por favor, preencha todos os campos.'); // Exibe um alerta se algum campo estiver vazio
    return false; // Impede o envio do formulário
  }
  
  // Envia uma requisição assíncrona para o servidor
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/login', true); // Abre uma conexão POST com a rota /login
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); // Define o cabeçalho da requisição
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) { // Verifica se a requisição foi concluída e a resposta do servidor é bem-sucedida
      var resposta = xhr.responseText; // Obtém a resposta do servidor
      if (resposta === 'Senha incorreta') {
        exibirAlerta('Senha incorreta. Tente novamente.'); // Exibe um alerta se a senha estiver incorreta
      } else if (resposta === 'Login Falhou - Email não cadastrado') {
        exibirAlerta('Email não cadastrado. Tente novamente.'); // Exibe um alerta se o email não estiver cadastrado
      } else {
        // Redirecionar para a página de produtos
        window.location.href = '/pages/produtos'; // Redireciona para a página de produtos se o login for bem-sucedido
      }
    }
  };
  xhr.send('username=' + username + '&password=' + password); // Envia os dados do formulário para o servidor

  // Evita o envio do formulário tradicional
  return false;
}

function exibirAlerta(mensagem) {
  alert(mensagem); // Exibe um alerta com a mensagem fornecida
}