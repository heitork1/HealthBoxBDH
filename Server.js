const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const session = require('express-session');
const path = require('path')

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'healthbox',
});

const app = express()

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/assets', express.static('assets'))
app.use('/img', express.static('img'))
app.use('/pages', express.static('pages'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

connection.connect(function (err) {
  if (!err) {
    console.log("Conexão como o Banco realizada com sucesso!!!");
  } else {
    console.log("Erro: Conexão NÃO realizada", err);
  }
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/pages/login.html')
})

app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query("SELECT * FROM usuarios WHERE email = '" + username + "'", function (error, results, fields) {
      // If there is an issue with the query, output the error
      if (error) throw error;
      // If the account exists
      if (results.length > 0) {
        if (results[0].senha === password) {
          // Authenticate the user
          req.session.loggedin = true;
          req.session.username = username;
          // Redirect to home page
          res.redirect('/pages/produtos.html');
        } else {
          res.send("Senha incorreta")
        }
      } else {
        res.send('Login Falhou - Email não cadastrado');
      }
    });
  } else {
    res.send('Por favor preencha todos os campos');
    res.end();
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