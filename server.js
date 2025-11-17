import express from "express"
import 'dotenv/config.js'
import cors from "cors"
// import "./src/services/tarefasAutomaticas.js" // Manter se for necessário
import autenticarToken from "./src/middlewares/autenticarToken.js"
import { login, postarImagem, registrarUsuario, registrarEspecie, registrarPlanta, analiseGemni } from "./src/Controllers/post_controllers.js"
import { trocarFotoPerfil, alterarImagemPlanta} from "./src/Controllers/put_controllers.js"
import { deletarUsuario, deletarPlantaUsuario } from "./src/Controllers/delete_controllers.js"
import { uploadImagem } from "./src/middlewares/uploadImagem.js"
import { pegarImagemPlanta, buscarEspeciePorclassificao, buscarPlantaId, pegarImagemUsuario, buscarEspecies, buscarPlantasUsuario, buscarImagemEspecie, climaAtual} from "./src/Controllers/get_controllers.js"

// --- Importação da Configuração do Swagger ---
import { setupSwagger } from './src/documentacao/swaggerConfig.js'

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

// =================================================================
// === CONFIGURAÇÃO DO SWAGGER/OPENAPI ===============================
// =================================================================
setupSwagger(app)
// =================================================================
// === DEFINIÇÃO DE ROTAS ============================================
// =================================================================

// Rota base para verificar o status do serviço
app.get(`${rota}/`, (req, res)=>{
    res.status(200).send("Serviços online")
})

// -------------------------
// --- Rotas do usuário ---
// -------------------------
app.post(`${rota}/registrarUsuario`, registrarUsuario)
app.post(`${rota}/login`, login)
app.delete(`${rota}/deletarUsuario`, autenticarToken, deletarUsuario)
app.post(`${rota}/uploadImagem`, autenticarToken, uploadImagemPublica, postarImagem)
app.put(`${rota}/trocarFotoPerfil`, autenticarToken, uploadFotoPerfil, trocarFotoPerfil)
app.get(`${rota}/imagem/usuario/fotoperfil`, autenticarToken, pegarImagemUsuario)

// -------------------------
// --- Rotas de Espécies ---
// -------------------------
app.post(`${rota}/registrarEspecie`, registrarEspecie)
app.get(`${rota}/especies`, buscarEspecies)
app.get(`${rota}/especies/imagem/:id`, buscarImagemEspecie)
app.get(`${rota}/especies/:classificaoId`, buscarEspeciePorclassificao )

// ------------------------------
// --- Rotas de Planta Usuário ---
// ------------------------------
app.post(`${rota}/registrarPlanta`, autenticarToken, uploadFotoPlanta, registrarPlanta)
app.get(`${rota}/PlantasUsuario`, autenticarToken, buscarPlantasUsuario)
app.get(`${rota}/plantaUsuario/:id`, autenticarToken, buscarPlantaId)
app.get(`${rota}/plantaUsuario/imagem/:id`, autenticarToken, pegarImagemPlanta)
app.put(`${rota}/plantaUsuario/alterarImagem/:id`, autenticarToken, uploadFotoPlanta, alterarImagemPlanta)
app.post(`${rota}/plantaUsuario/regar/:id`, autenticarToken,)
app.delete(`${rota}/plantaUsuario/deletar/:id`, autenticarToken, deletarPlantaUsuario)

// -------------------------
// --- Rotas de IA e Clima ---
// -------------------------
app.post(`${rota}/gemini`, autenticarToken, uploadImagemPrivada, analiseGemni)
app.get(`${rota}/clima`, climaAtual)

// =================================================================
// === INICIALIZAÇÃO DO SERVIDOR =====================================
// =================================================================

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}${rota}`)
    console.log(`Documentação disponível em: http://localhost:${porta}/api-docs`)
})