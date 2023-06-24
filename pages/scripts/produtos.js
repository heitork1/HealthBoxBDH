window.addEventListener('DOMContentLoaded', function() {
  var urlParams = new URLSearchParams(window.location.search);
  var username = urlParams.get('username');
  var nomeUsuarioElement = document.getElementById('nomeUsuario');
  if (username && nomeUsuarioElement) {
    nomeUsuarioElement.innerText = username;
  }
});

