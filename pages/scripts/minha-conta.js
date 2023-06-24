document.addEventListener('DOMContentLoaded', function() {
    axios.get('/pages/minha-conta/data')
      .then(function(response) {
        const user = response.data.user;
        const inputNome = document.getElementById('inputNome');
        const inputEmail = document.getElementById('inputEmail');
        const inputSenha = document.getElementById('inputSenha');
  
        if (user && inputNome && inputEmail && inputSenha) {
          inputNome.value = user.nome;
          inputEmail.value = user.email;
          inputSenha.value = user.senha;
        }
      })
      .catch(function(error) {
        console.log('Erro ao obter dados do usuário:', error);
      });
  });