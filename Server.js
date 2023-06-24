const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const session = require('express-session');

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

const path = require('path')
app.use('/assets', express.static('assets'))
app.use('/img', express.static('img'))
app.use('/pages', express.static('pages'))

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'healthbox',
});


app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false
}));

connection.connect(function (err) {
  if (!err){
    console.log("Conexão como o Banco realizada com sucesso!!!");
  } else{
    console.log("Erro: Conexão NÃO realizada", err);
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  connection.query("SELECT * FROM usuarios WHERE email = '" + username + "'", function (err, rows) {
    if (!err) {
      if (rows.length > 0) {
        let senhaBanco = rows[0].senha;

        if (password === senhaBanco) {
          console.log('Senha correta! Acesso permitido.');
          req.session.nomeUsuario = rows[0].nome;
          req.sessionID = rows[0].id
          
          connection.query("SELECT nome from usuarios where senha='" + senhaBanco + "'", function (err, rows) {
            if (!err) {
              res.send(rows[0].nome);
             
            } else {
              console.log("Não foi possível encontrar", err);
              res.send('Ocorreu um erro durante o login. Tente novamente mais tarde.');
            }
          });
        } else {
          res.send('Senha incorreta');
        }
      } else {
        console.log('Usuário não encontrado.');
        res.send('Login Falhou - Email não cadastrado');
      }
    } else {
      console.log('Erro: Consulta não realizada', err);
      res.send('Ocorreu um erro durante o login. Tente novamente mais tarde.');
    }
  });
});

app.get('/pages/minha-conta.html', function(req, res) {
  // Recupere o usuário logado a partir do token ou sessão
  // Suponha que o ID do usuário seja armazenado em req.session.userID
  // Execute a consulta SQL para obter os dados do usuário pelo ID
  if(req.session.userID){
  connection.query(
    "SELECT * FROM usuarios WHERE id = ?",
    [req.session.userID],
    function(error, results) {
      if (error) {
        console.log('Erro ao consultar o banco de dados:', error);
        res.status(500).send('Ocorreu um erro durante o processamento da solicitação.');
      } else {
        const user = results[0];
        res.render('minha-conta', { user });
      }
    }
  );
} else {
  res.redirect('/pages/login.html');
}
});


app.post('/pages/minha-conta', function (req, res) {
  if (req.session.userID) {
    var updatedUser = req.body;

    connection.query(
      "UPDATE usuarios SET ? WHERE id = ?",
      [updatedUser, req.session.userID],
      function(error) {
        if (error) {
          console.log('Erro ao atualizar o usuário:', error);
          res.status(500).send('Ocorreu um erro durante o processamento da solicitação.');
        } else {
          res.send('success');
        }
      }
    );
  } else {
    res.redirect('/pages/login.html');
  }
});


app.post('/cadastro', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let telefone = req.body.telefone;
  let date = req.body.date

connection.query("INSERT INTO usuarios (`nome`, `email`, `senha`,`telefone`, `data_nascimento`) VALUES ('" + username + "'," + "'" + email + "'," + "'" + password + "'," + "'" + telefone + "'," + "'" + date + "'" + ")"
, function (err, rows) {
    if (!err) {
      console.log("Usuario cadastrado com sucesso")
    } else {
      console.log('Não foi possível cadastrar', err);
    }
  });

    res.redirect('/pages/produtos.html');
})

app.listen(3002, () => {
  console.log('Servidor rodando na porta 3002!')
})