import mysql from "mysql2/promise"
import "dotenv/config"

conexao()

export async function conexao() {
    const pool = mysql.createPool({
        host: process.env.HOST_DATABASE,
        port: process.env.PORTA_DB,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    })

    return pool
}