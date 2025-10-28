import express from "express"
import 'dotenv/config.js'
import cors from "cors"
import "./src/services/tarefasAutomaticas.js"
import autenticarToken from "./src/middlewares/autenticarToken.js"
import { login, postarImagem, registrarUsuario, registrarEspecie, registrarPlanta, analiseGemni } from "./src/Controllers/post_controllers.js"
import { trocarFotoPerfil} from "./src/Controllers/put_controllers.js"
import { uploadImagem } from "./src/middlewares/uploadImagem.js"
import { pegarImagemPlanta, buscarPlantaId, pegarImagemUsuario, buscarEspecies, buscarPlantasUsuario, buscarImagemEspecie} from "./src/Controllers/get_controllers.js"

const app = express()
const porta = 3000
const rota = '/planttool/v1'

// --- Middlewares de Upload específicos para cada rota ---

const uploadFotoPerfil = uploadImagem("foto_perfil", false).single("foto")
const uploadFotoPlanta = uploadImagem("plantas", false).single("foto")
const uploadImagemPublica = uploadImagem("imagens_publicas", true).single("foto")
const uploadImagemPrivada = uploadImagem("imagens_privadas", false).single("foto")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: '*' }))

app.get(`${rota}/`, (req, res)=>{
    res.status(200).send("Serviços online")
})

// --- Rotas do usuário ---
app.post(`${rota}/registrarUsuario`, registrarUsuario)

app.post(`${rota}/login`, login)

// Rota para upload de uma imagem pública genérica do usuário
app.post(`${rota}/uploadImagem`, autenticarToken, uploadImagemPublica, postarImagem)

// Rota para trocar a foto de perfil (privada)
app.put(`${rota}/trocarFotoPerfil`, autenticarToken, uploadFotoPerfil, trocarFotoPerfil)

app.get(`${rota}/imagem/usuario/fotoperfil`, autenticarToken, pegarImagemUsuario)

// --- Rotas para especie de plantas ---
app.post(`${rota}/registrarEspecie`, registrarEspecie)

app.get(`${rota}/especies`, buscarEspecies)

app.get(`${rota}/especies/imagem:id`, buscarImagemEspecie)

// --- Rotas de plantas do usuário ---

app.post(`${rota}/registrarPlanta`, autenticarToken, uploadFotoPlanta, registrarPlanta)

app.get(`${rota}/PlantasUsuario`, autenticarToken, buscarPlantasUsuario)

app.get(`${rota}/plantaUsuario/:id`, autenticarToken, buscarPlantaId)

app.get(`${rota}/plantaUsuario/imagem/:id`, autenticarToken, pegarImagemPlanta)

//vou implementar depois
app.get(`${rota}/plantaUsuario/regar`, autenticarToken)

// rota gemini
app.post(`${rota}/gemini`, autenticarToken, uploadImagemPrivada, analiseGemni)

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}/planttool/v1`)
})
