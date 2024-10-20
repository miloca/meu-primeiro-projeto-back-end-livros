const express = require("express") //iniciando o express
const router = express.Router() //configurando a primeira parte da rota
const cors = require('cors') //trazendo o pacote cors, que permite consumir essa API no frontend
const conectaBancoDeDados = require('./bancoDeDados') //ligando ao arquivo banco de dados
conectaBancoDeDados() //chamando a função que conecta o banco de dados

const Livro = require('./livroModel')

const app = express() //iniciando o app
app.use(express.json())
app.use(cors())

const porta = 3333 //crinado a porta

//GET
async function mostraLivros(request, response) {
    try {
        const livrosVindosDoBancoDeDados = await Livro.find()
        
        response.json(livrosVindosDoBancoDeDados)
    } catch(erro) {
        console.log(erro)
    }
    
}

//POST
async function criaLivro(request, response) {
    const novoLivro = new Livro({
        nome: request.body.nome,
        autora: request.body.autora,
        categoria: request.body.categoria,
        imagem: request.body.imagem
    })

    try {
        const livroCriado = await novoLivro.save()
        response.status(201).json(livroCriado)
    } catch (erro){
        console.log(erro)
    }
}

//PATCH
async function corrigeLivro(request, response) {
    try {
        const livroEncontrado = await Livro.findById(request.params.id)
       
        if (request.body.nome) {
            livroEncontrado.nome = request.body.nome
        }
    
        if (request.body.autora) {
            livroEncontrado.autora = request.body.autora
        }
    
        if (request.body.categoria) {
            livroEncontrado.categoria = request.body.categoria
        }

        if (request.body.imagem) {
            livroEncontrado.imagem = request.body.imagem
        }

        const livrroAtualizadoNoBancoDeDados = await livroEncontrado.save()
        
        response.json(livrroAtualizadoNoBancoDeDados)
    } catch (erro) {
        console.log(erro)
    } 
}

//DELETE
async function deletaLivro(request, response) {
    try {
         await Livro.findByIdAndDelete(request.params.id)
         response.json({mensagem: 'Livro deletado com sucesso'})
    } catch (erro) {
         console.log(erro)
    }
 }

//ROTAS
app.use(router.get('/livros', mostraLivros)) //configurei rota GET /livros
app.use(router.post('/livros', criaLivro)) //configurei rota POST /livros
app.use(router.patch('/livros/:id', corrigeLivro)) //configurei rota PATCH /livros/:id
app.use(router.delete('/livros/:id', deletaLivro)) //configurei rota DELETE /livros


//PORTA
function mostraPorta () {
    console.log("Servidor criado e rodando na porta ", porta)
}

app.listen(porta, mostraPorta) //servidor ouvindo a porta