const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser')
const path = require('path')

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

app.get("/cart", (req, res) => {
    res.render("cart")
})


app.listen(8080, () => {
    console.log("Servidor rodando")
})