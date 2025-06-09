import conexao from "../DAO/conexao.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"


const pool = await conexao()

class Usuario{
    constructor(id, nome, sobrenome, email, senha, fotoPerfil){
        this.id = id
        this.nome = nome
        this.sobrenome = sobrenome
        this.email = email
        this.senha = senha
        this.fotoPerfil = fotoPerfil
    }

    async registrarUsuario(nome, sobrenome, email, senha, fotoPerfil){

        const query = "INSERT INTO tb_user(user_id, user_nome, user_sobrenome, user_email, user_senha, user_foto) VALUES (?, ?, ?, ?, ?, ?)"

        const id = uuidv4

        const [respostaDB] = await pool.execute(query,[
            id,
            this.nome,
            this.sobrenome,
            this.email,
            this.senha,
            this.fotoPerfil
        ])

        console.log(respostaDB)

        return respostaDB

    }
}

export default Usuario
