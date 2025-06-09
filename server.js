import express from "express"
import 'dotenv/config.js'
import cors from "cors"

const app = express()
const porta = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use(cors({
    
// }))


app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`)
})