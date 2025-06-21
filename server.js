import express from "express"
import 'dotenv/config.js'
import cors from "cors"
import { login, registrarUsuario } from "./src/Controllers/post_controllers.js"

const app = express()
const porta = 3000
const rota = '/planttool/v1'

app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use(cors({
    
// }))

app.post(`${rota}/registrarUsuario`, registrarUsuario)

app.post(`${rota}/login`, login)

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`)
})