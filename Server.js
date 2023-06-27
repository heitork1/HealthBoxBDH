const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const session = require('express-session');
var expressLayouts = require('express-ejs-layouts')
const fs = require('fs');
const ejs = require('ejs');

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');



const path = require('path');
const { error } = require('console');
app.use('/assets', express.static('assets'))
app.use('/img', express.static('img'))
app.use('/pages', express.static('pages'))
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'));

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'healthbox',
});

app.use(session({
  secret: 'nielkrotieh1',
  resave: true,
  saveUninitialized: true
}));

connection.connect(function (err) {
  if (!err){
    console.log("Conexão como o Banco realizada com sucesso!!!");
  } else{
    console.log("Erro: Conexão NÃO realizada", err);
  }
});

function insertUsernameIntoHTML(filePath, username) {
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace('<p id="nomeUsuario">Entrar</p>', `<p id="nomeUsuario">${username}</p>`);
  return html;
}

function checkLogin(req, res, next) {
  if (req.session.username) {
    next(); // Continua para a próxima rota/middleware
  } else {
    res.redirect('/pages/login.html'); // Redireciona para a página de login
  }
}
app.get('/', (req, res) => {
  if (req.session.username) {
    // Usuário está logado
    const filePath = path.join(__dirname, 'views', 'index.ejs');
    const html = fs.readFileSync(filePath, 'utf8');
    const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
    res.send(renderedHtml);
  } else {
    // Usuário não está logado
    res.render('index');
  }
});

app.get('/pages/produtos', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'produtos.ejs');
  const html = fs.readFileSync(filePath, 'utf8');
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

app.get('/pages/sobre-nos', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'sobre-nos.ejs');
  const html = fs.readFileSync(filePath, 'utf8');
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

app.get('/pages/politica', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'politica.ejs');
  const html = fs.readFileSync(filePath, 'utf8');
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  connection.query("SELECT * FROM usuarios WHERE email = '" + username + "'", function (err, rows) {
    if (!err) {
      if (rows.length > 0) {
        let senhaBanco = rows[0].senha;

        if (password === senhaBanco) {
          console.log('Senha correta! Acesso permitido.');
          req.session.username = rows[0].nome;
          req.session.userID = rows[0].id
          res.send(rows[0].nome);
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

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/pages/login.html');
});

app.get('/pages/minha-conta', checkLogin, (req, res) => {
  

  connection.query("SELECT * FROM usuarios WHERE id = '" + req.session.userID + "'", function (err, rows) {
    if (!err) {
      req.session.email = rows[0].email;
      req.session.date = rows[0].data_nascimento
      req.session.senha = rows[0].senha
      req.session.tel = rows[0].telefone
      console.log(req.session.date)
      const filePath = path.join(__dirname, 'pages', 'minha-conta.ejs');
      const html = fs.readFileSync(filePath, 'utf8');
      const renderedHtml = ejs.render(html, 
        { nomeUsuario: req.session.username,
          emailUsuario: req.session.email,
          nascimentoUsuario: req.session.date,
          senhaUsuario: req.session.senha,
          telefoneUsuario: req.session.tel
        });
      res.send(renderedHtml);
    } else {
      res.send(err)
    }
  })

});

app.get('/pages/sacola', checkLogin, (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'sacola.ejs');
  const html = fs.readFileSync(filePath, 'utf8');
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username});
  res.send(renderedHtml);
});

app.get('/pages/tela-produto', checkLogin, (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'tela-produto.ejs');
  const html = fs.readFileSync(filePath, 'utf8');
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username});
  res.send(renderedHtml);
});

app.get('/pages/finalizar', checkLogin, (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'finalizar.ejs');
  const html = fs.readFileSync(filePath, 'utf8');
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username});
  res.send(renderedHtml);
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