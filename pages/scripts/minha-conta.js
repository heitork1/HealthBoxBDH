var username = document.getElementById('nomeUsuario').textContent;
// Remove espaços em branco extras
username = username.trim();
if (username === '') {
  // Se estiver vazio, redireciona para a página de login
  window.location.href = '/pages/login.html';
}