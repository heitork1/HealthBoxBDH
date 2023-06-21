




function validarFormulario() {
    // Obtém os valores do formulário
    var username = document.getElementById('email').value;
    var password = document.getElementById('senha').value;

    if (username.trim() === '' || password.trim() === '') {
        exibirAlerta('Por favor, preencha todos os campos.');
        return false; // Impede o envio do formulário
      }
    // Envia uma requisição assíncrona para o servidor
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var resposta = xhr.responseText;
        if (resposta === 'Senha incorreta') {
          exibirAlerta('Senha incorreta. Tente novamente.');
        } else if (resposta === 'Login Falhou - Email não cadastrado') {
          exibirAlerta('Email não cadastrado. Tente novamente.');
        } else {
          // Redirecionar para a página de produtos
          window.location.href = '/pages/produtos.html';
        }
      }
    };
    xhr.send('username=' + username + '&password=' + password);

    // Evita o envio do formulário tradicional
    return false;
  }

  function exibirAlerta(mensagem) {
    alert(mensagem);
  }