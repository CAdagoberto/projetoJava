const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser')
const path = require('path')

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
    res.render("cardapio")
})

app.get("/pedidos", (req, res) => {
    res.render("pedidos")
})

app.post("/login", (req, res) => {
    var {email, senha} = req.body

    if (email == "belladolce@gmail.com" && senha == "123") {
        res.status(200)
        res.redirect('pedidos')
    } else {
        res.status(404, {err: "senha errada"})
    }
})



app.listen(8080, () => {
    console.log("Servidor rodando")
})