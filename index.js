const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser')
const path = require('path')
const db = require('./src/database/db.json')
const fs = require("fs");

app.use(express.static('src'));


app.use('/src', express.static(path.join(__dirname, 'src')));

app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));


app.get("/", (req, res) => {
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/cardapio", (req, res) => {
    const dbPath = path.join(__dirname, 'src', 'database', 'db.json');

    let dados = { produtos: [], pedidos: [] };

    if (fs.existsSync(dbPath)) {
        const conteudo = fs.readFileSync(dbPath, "utf8");
        try {
            dados = JSON.parse(conteudo);
        } catch (err) {
            console.error("Erro ao ler o JSON:", err);
        }
    }

    res.render("cardapio", { produtos: dados.produtos });
});

app.get("/pedidos", (req, res) => {
    res.render("pedidos")
})

app.get("/cadastroProdutos", (req, res) => {
    res.render("cadastroProduto")
})

app.post("/login", (req, res) => {
    var {email, senha} = req.body

    if (email == "belladolce@gmail.com" && senha == "123") {
        res.status(200)
        res.redirect('pedidos')
    } else {
        res.status(404, {err: "senha errada"})
    }
});

app.post("/salvarProduto", (req, res) => {
    const { nome, descricao, valor, recheio } = req.body;

    if (!nome || !descricao || !valor || !recheio) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }

    const id = Date.now(); // ID simples baseado no timestamp
    const imagem = `../src/img/Produtos/${recheio}.jpg`;

    const novoProduto = {
        id,
        nome,
        descricao,
        valor,
        recheio,
        imagem
    };

    const dbPath = path.join(__dirname, 'src', 'database', 'db.json');

    let dados = { produtos: [], pedidos: [] };

    // Verifica se o arquivo existe e tenta carregar
    if (fs.existsSync(dbPath)) {
        const conteudo = fs.readFileSync(dbPath, "utf8");
        try {
            dados = JSON.parse(conteudo);
        } catch (err) {
            console.error("Erro ao ler o JSON:", err);
            return res.status(500).json({ erro: "Erro ao ler o banco de dados." });
        }
    }

    // Garante que dados.produtos seja um array
    if (!Array.isArray(dados.produtos)) {
        dados.produtos = [];
    }

    // Adiciona o novo produto
    dados.produtos.push(novoProduto);

    // Salva de volta no arquivo
    try {
        fs.writeFileSync(dbPath, JSON.stringify(dados, null, 2), 'utf8');
        res.status(201)
        res.render('pedidos')
    } catch (err) {
        console.error("Erro ao salvar no JSON:", err);
        res.status(500).json({ erro: "Erro ao salvar o produto." });
    }
});




app.listen(8080, () => {
    console.log("Servidor rodando")
})