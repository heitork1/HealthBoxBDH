document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário está logado
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/pages/produtos.html', true);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var nomeUsuario = xhr.responseText;
  
        if (nomeUsuario && nomeUsuario.length > 1) {
          // Obtém o elemento de exibição do nome do usuário
          var nomeUsuarioElement = document.getElementById('nomeUsuario');
          // Exibe o nome do usuário na página
          nomeUsuarioElement.textContent = nomeUsuario;
        }
      } else {
        // Redireciona para a página de login
        window.location.href = '/login';
      }
    };
  });