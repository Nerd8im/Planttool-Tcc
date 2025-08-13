import express from "express"
import 'dotenv/config.js'
import path from "path"
import cors from "cors"
import autenticarToken from "./src/middlewares/autenticarToken.js"
import { login, registrarUsuario } from "./src/Controllers/post_controllers.js"
import { trocarFotoPerfil} from "./src/Controllers/put_controllers.js"
import { uploadImagem } from "./src/middlewares/uploadImagem.js"

const app = express()
const porta = 3000
const rota = '/planttool/v1'
const uploadPrivado = uploadImagem("usuarios", false).single("foto")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(cors({

// }))

//Rotas do úsuario
app.post(`${rota}/registrarUsuario`, registrarUsuario)

app.post(`${rota}/login`, login)

app.put(`${rota}/trocarFotoPerfil`, autenticarToken, uploadPrivado, trocarFotoPerfil)

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`)
})