import express from "express"
import 'dotenv/config.js'
// import path from "path"
// import cors from "cors"
import autenticarToken from "./src/middlewares/autenticarToken.js"
import { login, postarImagem, registrarUsuario, registrarEspecie } from "./src/Controllers/post_controllers.js"
import { trocarFotoPerfil} from "./src/Controllers/put_controllers.js"
import { uploadImagem } from "./src/middlewares/uploadImagem.js"
import { pegarImagem, pegarImagemUsuario } from "./src/Controllers/get_controllers.js"

const app = express()
const porta = 3000
const rota = '/planttool/v1'
const uploadPrivado = uploadImagem("usuarios", false).single("foto")
const uploadPublico = uploadImagem("usuarios", true).single("foto") 

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(cors({

// }))

//Rotas do usuário
app.post(`${rota}/registrarUsuario`, registrarUsuario)

app.post(`${rota}/login`, login)

app.post(`${rota}/uploadImagem`, autenticarToken, uploadPublico, postarImagem)

app.put(`${rota}/trocarFotoPerfil`, autenticarToken, uploadPrivado, trocarFotoPerfil)

// Rotas de imagens
app.get(`${rota}/imagem/:image`, pegarImagem)

app.get(`${rota}/imagem/usuario/:image`, autenticarToken, pegarImagemUsuario)

//rotas para especie de plantas
app.post(`${rota}/registrarEspecies`, registrarEspecie)

app.get(`${rota}/especies`, autenticarToken, buscarEspecies)

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}/planttool/v1`)
})