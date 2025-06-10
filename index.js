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

app.use(express.json());



app.get("/", (req, res) => {
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/produtos", (req, res) => {
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

    res.render("produtos", { produtos: dados.produtos });
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
  const dbPath = path.join(__dirname, 'src', 'database', 'db.json');
  let dados = { produtos: [], pedidos: [] };

  if (fs.existsSync(dbPath)) {
    try {
      const conteudo = fs.readFileSync(dbPath, 'utf8');
      dados = JSON.parse(conteudo);
    } catch (err) {
      console.error("Erro ao ler o JSON:", err);
      return res.status(500).send("Erro interno");
    }
  }

  res.render("pedidos", { pedidos: dados.pedidos });
});

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


app.post("/salvarPedidos", (req, res) => {
  const pedidoItens = req.body;

  if (!Array.isArray(pedidoItens) || pedidoItens.length === 0) {
    return res.status(400).json({ erro: "Pedido inválido ou vazio." });
  }

  // Agrupar por nome e somar quantidades
  const agrupado = {};
  pedidoItens.forEach(item => {
    if (!item.nome || !item.descricao || !item.valor) {
      return res.status(400).json({ erro: "Cada item precisa ter nome, descricao e valor." });
    }

    if (!agrupado[item.nome]) {
      agrupado[item.nome] = { ...item, quantidade: 1 };
    } else {
      agrupado[item.nome].quantidade++;
    }
  });

  function extrairNumero(valorStr) {
  // Remove tudo que não seja dígito ou vírgula/ponto decimal
  // Exemplo: "R$ 150" vira "150"
  const numeroLimpo = valorStr.replace(/[^\d,.]/g, '').replace(',', '.');
  return parseFloat(numeroLimpo);
}


  const itensComQuantidade = Object.values(agrupado).map(item => {
  const valorNum = extrairNumero(item.valor);
  return {
    nome: item.nome,
    descricao: item.descricao,
    valor: valorNum,
    quantidade: item.quantidade,
    total: valorNum * item.quantidade
  };
});

  // Calcular total geral do pedido
  const totalPedido = itensComQuantidade.reduce((acc, item) => acc + item.total, 0);

  const dbPath = path.join(__dirname, 'src', 'database', 'db.json');
  let dados = { produtos: [], pedidos: [] };

  if (fs.existsSync(dbPath)) {
    try {
      dados = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (err) {
      console.error("Erro ao ler o JSON:", err);
      return res.status(500).json({ erro: "Erro ao ler o banco de dados." });
    }
  }

  // Cria objeto pedido com id e data
  const novoPedido = {
    id: Date.now(),
    itens: itensComQuantidade,
    total: totalPedido,
    data: new Date().toISOString()
  };

  if (!Array.isArray(dados.pedidos)) {
    dados.pedidos = [];
  }

  dados.pedidos.push(novoPedido);

  try {
    fs.writeFileSync(dbPath, JSON.stringify(dados, null, 2), 'utf8');
    return res.status(201).json({ mensagem: "Pedido salvo com sucesso!", pedido: novoPedido });
  } catch (err) {
    console.error("Erro ao salvar o pedido:", err);
    return res.status(500).json({ erro: "Erro ao salvar o pedido." });
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


app.delete('/deletarPedido/:id', (req, res) => {
  const id = Number(req.params.id);
  const dbPath = path.join(__dirname, 'src', 'database', 'db.json');

  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({ erro: "Banco de dados não encontrado." });
  }

  let dados;
  try {
    const conteudo = fs.readFileSync(dbPath, 'utf8');
    dados = JSON.parse(conteudo);
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao ler o banco de dados." });
  }

  if (!Array.isArray(dados.pedidos)) {
    return res.status(400).json({ erro: "Nenhum pedido para deletar." });
  }

  const indice = dados.pedidos.findIndex(pedido => pedido.id === id);
  if (indice === -1) {
    return res.status(404).json({ erro: "Pedido não encontrado." });
  }

  dados.pedidos.splice(indice, 1);

  try {
    fs.writeFileSync(dbPath, JSON.stringify(dados, null, 2), 'utf8');
    return res.status(200).json({ mensagem: "Pedido deletado com sucesso." });
  } catch (err) {
    return res.status(500).json({ erro: "Erro ao salvar o banco de dados." });
  }
});



app.listen(8080, () => {
    console.log("Servidor rodando")
})