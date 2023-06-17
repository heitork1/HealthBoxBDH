const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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
          connection.query("SELECT nome from usuarios where senha='" + senhaBanco + "'", function (err, rows) {
            if (!err) {
              res.send('Sucesso');
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

// app.get('/pages/produtos.html/:nome', function(req, res){
//   res.redirect('/pages/produtos.html')

// })


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