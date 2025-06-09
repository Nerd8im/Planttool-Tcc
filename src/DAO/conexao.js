import { mysql } from "mysql2/promise.js"
import "dotenv/config"

conexao()

export async function conexao() {
    const pool = mysql.createPool({
        host: process.env.HOST_DATABASE,
        port: process.env.PORT_DB,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env_DATABASE
    })

    return pool
}