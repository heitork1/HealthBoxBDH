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
        // senha do banco de dados
        let senhaBanco = rows[0].senha;

        // Verifica se a senha digitada pelo usuário é igual à senha cadastrada no banco de dados
        if (password === senhaBanco) {
          console.log('Senha correta! Acesso permitido.');
          connection.query("SELECT nome from usuarios where senha='"+ senhaBanco +"'", function(err, rows){
            if(!err){
              res.redirect('/pages/produtos.html')
            } else {
              console.log("Não foi possível encontrar", err)
            }
          })
        } else {
          res.send('Senha incorreta');
        }
      } else {
        console.log('Usuário não encontrado.');
        res.send('Login Falhou - Email não cadastrado');
      }
    } else {
      console.log('Erro: Consulta não realizada', err);
    }
  });
})


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

    res.send('Mandou para o Servidor');
})

app.listen(3002, () => {
  console.log('Servidor rodando na porta 3002!')
})