const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const session = require("express-session");
var expressLayouts = require("express-ejs-layouts");
const fs = require("fs");
const ejs = require("ejs");
const moment = require('moment');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const path = require("path");
app.use("/assets", express.static("assets"));
app.use("/img", express.static("img"));
app.use("/pages", express.static("pages"));
app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "healthbox",
});

app.use(
  session({
    secret: "nielkrotieh1",
    resave: true,
    saveUninitialized: true,
  })
);

connection.connect(function (err) {
  if (!err) {
    console.log("Conexão como o Banco realizada com sucesso!!!");
  } else {
    console.log("Erro: Conexão NÃO realizada", err);
  }
});


function checkLogin(req, res, next) {
  if (req.session.username) {
    next(); // Continua para a próxima rota/middleware
  } else {
    res.redirect("/pages/login.html"); // Redireciona para a página de login
  }
}
app.get("/", (req, res) => {
  if (req.session.username) {
    // Usuário está logado
    const filePath = path.join(__dirname, "views", "index.ejs");
    const html = fs.readFileSync(filePath, "utf8");
    const renderedHtml = ejs.render(html, {
      nomeUsuario: req.session.username,
    });
    res.send(renderedHtml);
  } else {
    // Usuário não está logado
    res.render("index");
  }
});

app.get("/pages/produtos", (req, res) => {
  const filePath = path.join(__dirname, "pages", "produtos.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

app.get("/pages/sobre-nos", (req, res) => {
  const filePath = path.join(__dirname, "pages", "sobre-nos.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

app.get("/pages/politica", (req, res) => {
  const filePath = path.join(__dirname, "pages", "politica.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  connection.query(
    "SELECT * FROM usuarios WHERE email = '" + username + "'",
    function (err, rows) {
      if (!err) {
        if (rows.length > 0) {
          let senhaBanco = rows[0].senha;

          if (password === senhaBanco) {
            console.log("Senha correta! Acesso permitido.");
            req.session.username = rows[0].nome;
            req.session.userID = rows[0].id;
            res.send(rows[0].nome);
          } else {
            res.send("Senha incorreta");
          }
        } else {
          console.log("Usuário não encontrado.");
          res.send("Login Falhou - Email não cadastrado");
        }
      } else {
        console.log("Erro: Consulta não realizada", err);
        res.send(
          "Ocorreu um erro durante o login. Tente novamente mais tarde."
        );
      }
    }
  );
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/pages/login.html");
});

app.get("/pages/minha-conta", checkLogin, (req, res) => {
  connection.query(
    "SELECT * FROM usuarios WHERE id = '" + req.session.userID + "'",
    function (err, rows) {
      if (!err) {
        req.session.email = rows[0].email;
        req.session.date = moment(rows[0].data_nascimento).format("DD/MM/YYYY");
        req.session.senha = rows[0].senha;
        req.session.tel = rows[0].telefone;

        // Buscar pedidos do usuário
        connection.query(
          `SELECT pedidos.*, produtos.nome_produto, produtos.preco_produto, produtos.url_imagem 
      FROM pedidos 
      INNER JOIN itenspedido ON pedidos.id = itenspedido.pedido_id 
      INNER JOIN produtos ON itenspedido.produto_id = produtos.id 
      WHERE pedidos.usuario_id = ${req.session.userID} AND pedidos.status = 'finalizado'`,
          function (err, pedidos) {
            if (!err) {
              // Formatar a data de cada pedido
              for (let i = 0; i < pedidos.length; i++) {
                const dataPedido = moment(pedidos[i].data_pedido).format(
                  "DD/MM/YYYY HH:mm:ss"
                );
                pedidos[i].data_pedido = dataPedido;
              }

              const filePath = path.join(__dirname, "pages", "minha-conta.ejs");
              const html = fs.readFileSync(filePath, "utf8");
              const renderedHtml = ejs.render(html, {
                nomeUsuario: req.session.username,
                emailUsuario: req.session.email,
                nascimentoUsuario: req.session.date,
                senhaUsuario: req.session.senha,
                telefoneUsuario: req.session.tel,
                pedidos: pedidos,
              });
              res.send(renderedHtml);
            } else {
              res.send(err);
            }
          }
        );
      } else {
        res.send(err);
      }
    }
  );
});

app.post("/atualizar", (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let date = moment(req.body.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
  let tel = req.body.tel;

  connection.query(
    `UPDATE usuarios SET nome = ?, email = ?, senha = ?, data_nascimento = ?, telefone = ? WHERE id = ?`,
    [username, email, password, date, tel, req.session.userID],
    function (err) {
      if (!err) {

        // Redirecionar de volta para a tela minha-conta
        res.redirect("/pages/minha-conta");
      } else {
        console.log(err);
        res.send("Ocorreu um erro durante a atualização das informações de cadastro.");
      }
    }
  );
});

app.get("/pages/sacola", checkLogin, (req, res) => {
  const filePath = path.join(__dirname, "pages", "sacola.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

app.get("/pages/tela-produto", checkLogin, (req, res) => {
  const filePath = path.join(__dirname, "pages", "tela-produto.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

app.get("/pages/finalizar", checkLogin, (req, res) => {
  const filePath = path.join(__dirname, "pages", "finalizar.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

app.post("/cadastro", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let telefone = req.body.telefone;
  let date = req.body.date;

  connection.query(
    "INSERT INTO usuarios (`nome`, `email`, `senha`,`telefone`, `data_nascimento`) VALUES ('" + username +
    "'," +
    "'" +
    email +
    "'," +
    "'" +
    password +
    "'," +
    "'" +
    telefone +
    "'," +
    "'" +
    date +
    "'" +
    ")",
    function (err, rows) {
      if (!err) {
        console.log("Usuario cadastrado com sucesso");
      } else {
        console.log("Não foi possível cadastrar", err);
      }
    }
  );
  res.redirect("/pages/produtos.html");
});

app.listen(3002, () => {
  console.log("Servidor rodando na porta 3002!");
});
