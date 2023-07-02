// Importando os módulos e bibliotecas necessárias
const express = require("express"); // Framework para criação de aplicações web em Node.js
const bodyParser = require("body-parser"); // Middleware para processar corpos de requisições
const mysql = require("mysql2"); // Módulo para conexão com o banco de dados MySQL
const session = require("express-session"); // Middleware para gerenciar sessões de usuário
const expressLayouts = require("express-ejs-layouts"); // Middleware para uso de layouts EJS
const fs = require("fs"); // Módulo para leitura de arquivos
const ejs = require("ejs"); // Mecanismo de renderização de templates EJS
const moment = require('moment'); // Biblioteca para manipulação de datas e horários

const app = express(); // Criação da instância do aplicativo Express
app.use(bodyParser.json()); // Configuração do middleware para processar corpos de requisições JSON
app.use(bodyParser.urlencoded({ extended: false })); // Configuração do middleware para processar corpos de requisições URL-encoded
app.set("view engine", "ejs"); // Configuração do mecanismo de visualização EJS

const path = require("path"); // Módulo para lidar com caminhos de diretórios
app.use("/assets", express.static("assets")); // Configuração do middleware para servir arquivos estáticos da pasta "assets"
app.use("/img", express.static("img")); // Configuração do middleware para servir arquivos estáticos da pasta "img"
app.use("/pages", express.static("pages")); // Configuração do middleware para servir arquivos estáticos da pasta "pages"
app.use(expressLayouts); // Configuração do middleware para uso de layouts EJS
app.set("views", path.join(__dirname, "views")); // Configuração do diretório de visualizações

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "healthbox",
});

//configuração sessão de usuário
app.use(
  session({
    secret: "123", // Chave secreta utilizada para assinar as sessões
    resave: true,  //Salva a sessão mesmo que não tenha sido modificada durante a requisição
    saveUninitialized: true, // Salva a sessão mesmo que ela não tenha sido inicializada
  })
);

// Conexão com o banco de dados
connection.connect(function (err) {
  if (!err) {
    console.log("Conexão como o Banco realizada com sucesso!!!");
  } else {
    console.log("Erro: Conexão NÃO realizada", err);
  }
});

// Middleware para verificar se o usuário está logado
function checkLogin(req, res, next) {
  if (req.session.username) {
    next(); // Continua para a próxima rota/middleware
  } else {
    res.redirect("/pages/login.html"); // Redireciona para a página de login
  }
}

// Rota raiz ("/")
app.get("/", (req, res) => {
  if (req.session.username) {
    // Usuário está logado
    const filePath = path.join(__dirname, "views", "index.ejs"); // Caminho absoluto para o arquivo "index.ejs"
    const html = fs.readFileSync(filePath, "utf8"); // Lê o conteúdo do arquivo "index.ejs"
    const renderedHtml = ejs.render(html, {
      nomeUsuario: req.session.username, // Renderiza o arquivo "index.ejs" com o nome de usuário
    });
    res.send(renderedHtml);// Envia o HTML renderizado como resposta
  } else {
    // Usuário não está logado
    res.render("index"); //renderiza o arquivo "index.ejs" diretamente
  }
});

// Rota de login ("/login")
app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  // Lógica de autenticação do usuário e manipulação de sessão
  connection.query(
    "SELECT * FROM usuarios WHERE email = '" + username + "'",
    function (err, rows) {
      if (!err) {
        if (rows.length > 0) {
          let senhaBanco = rows[0].senha;
          if (password === senhaBanco) {
            req.session.username = rows[0].nome;
            req.session.userID = rows[0].id;
            res.send(rows[0].nome);
          } else {
            res.send("Senha incorreta");
          }
        } else {
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

// Rota de cadastro ("/cadastro")
app.post("/cadastro", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let telefone = req.body.telefone;
  let date = req.body.date;
  // Lógica para cadastrar um novo usuário no banco de dados
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
  res.redirect("/pages/produtos");
});

// Rota de logout ("/logout")
app.get("/logout", (req, res) => {
  // Destroi a sessão do usuário e redireciona para a página de login
 req.session.destroy();
 res.redirect("/pages/login.html");
});

// Rota da página "Minha Conta" ("/pages/minha-conta")
app.get("/pages/minha-conta", checkLogin, (req, res) => {
 // Lógica para obter informações do usuário e seus pedidos
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

// Rota para atualizar as informações de cadastro do usuário
app.post("/atualizar", (req, res) => {
  let username = req.body.username;  // Obtém o novo nome de usuário do corpo da requisição
  let email = req.body.email;  // Obtém o novo email do usuário do corpo da requisição
  let password = req.body.password;  // Obtém a nova senha do usuário do corpo da requisição
  let date = moment(req.body.date, 'DD/MM/YYYY').format('YYYY-MM-DD');  // Obtém a nova data de nascimento do usuário do corpo da requisição e formata no padrão esperado
  let tel = req.body.tel;  // Obtém o novo número de telefone do usuário do corpo da requisição

  connection.query(
    `UPDATE usuarios SET nome = ?, email = ?, senha = ?, data_nascimento = ?, telefone = ? WHERE id = ?`,
    [username, email, password, date, tel, req.session.userID],
    function (err) {
      if (!err) {
        // Redireciona de volta para a tela minha-conta após a atualização ser concluída com sucesso
        res.redirect("/pages/minha-conta");
      } else {
        console.log(err);
        res.send("Ocorreu um erro durante a atualização das informações de cadastro.");
      }
    }
  );
});

// Rota da página "Produtos"
app.get("/pages/produtos", (req, res) => {
  const filePath = path.join(__dirname, "pages", "produtos.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

// Rota da página "Sobre Nós"
app.get("/pages/sobre-nos", (req, res) => {
  const filePath = path.join(__dirname, "pages", "sobre-nos.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

// Rota da página "Política"
app.get("/pages/politica", (req, res) => {
  const filePath = path.join(__dirname, "pages", "politica.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

// Rota da página "Sacola"
app.get("/pages/sacola", checkLogin, (req, res) => {
  const filePath = path.join(__dirname, "pages", "sacola.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

//Rota da página "Tela-produto" 
app.get("/pages/tela-produto", checkLogin, (req, res) => {
  const filePath = path.join(__dirname, "pages", "tela-produto.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

// Rota da página "Finalizar"
app.get("/pages/finalizar", checkLogin, (req, res) => {
  const filePath = path.join(__dirname, "pages", "finalizar.ejs");
  const html = fs.readFileSync(filePath, "utf8");
  const renderedHtml = ejs.render(html, { nomeUsuario: req.session.username });
  res.send(renderedHtml);
});

// Inicia o servidor na porta 3002
app.listen(3002, () => {
  console.log("Servidor rodando na porta 3002!");
});
