import { conexao } from "../DAO/conexao.js"
import { criarErro } from "../utils/erros.js"
import bcrypt, { compare, hash } from "bcrypt"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"

const chaveSecreta = process.env.CHAVE_SECRETA
const pool = await conexao()

class Usuario {
    constructor(id, nome, sobrenome, email, senha, fotoPerfil) {
        this.id = id
        this.nome = nome
        this.sobrenome = sobrenome
        this.email = email
        this.senha = senha
        this.fotoPerfil = fotoPerfil
    }

    static async registrar(nome, sobrenome, email, senha) {

        const salt = 12

        if (!nome, !sobrenome, !email, !senha) {
            throw criarErro("Todos os campos são obrigatórios", 400)
        }

        const queryVerifica = "SELECT user_id FROM tb_user WHERE user_email = ?"
        const [resultadoVerificacao] = await pool.execute(queryVerifica, [email])

        if (resultadoVerificacao.length > 0) {
            throw criarErro("Já existe um usuário cadastrado com esse e-mail", 409)
        }

        const id = uuidv4()
        const queryRegistro = "INSERT INTO tb_user(user_id, user_nome, user_sobrenome, user_email, user_senha) VALUES (?, ?, ?, ?, ?)"

        try {
            const senhaHash = await bcrypt.hash(senha, salt)

            await pool.execute(queryRegistro, [
                id,
                nome,
                sobrenome,
                email,
                senhaHash,
            ])

            return {
                mensagem: "Usuário registrado com sucesso",
                usuario: { nome, sobrenome }
            }
                

        } catch(error) {
        throw criarErro("Erro ao registrar usuário", 500)
    }

}

    static async autenticar(email, senha) {

    if (!email || !senha) {
        throw criarErro("Email e senha são obrigatorios", 400)
    }

    const querySenha = 'SELECT user_senha FROM tb_user WHERE user_email = ?'
    const queryBuscarUser = 'SELECT user_id, user_nome, user_sobrenome, user_email, user_foto FROM tb_user WHERE user_email = ?'

    try {

        const [senhaReal] = await pool.execute(querySenha, [email])

        console.log(senhaReal)

        if (senhaReal.length === 0) {
            throw criarErro("Úsuario não encontrado", 404)
        }

        if (await bcrypt.compare(senha, senhaReal[0].user_senha) == true) {

            const [dadosUsuarioDb] = await pool.execute(queryBuscarUser, [email])
            const tokenUsuario = jwt.sign(dadosUsuarioDb[0], chaveSecreta, { expiresIn: "3h" })
            const dadosUsuario = dadosUsuarioDb[0]

            return { tokenUsuario, dadosUsuario }

        } else {
            throw criarErro("senha incorreta", 401)
        }

    } catch (error) {

        if (error.statusCode) {
            throw error
        }

        throw criarErro("erro ao autenticar", 500)
    }

}

    async atualizarFoto(caminhoImagem) {
    const query = `UPDATE tb_user SET user_foto = ? WHERE user_id = ?`

    try {
        const [respostaDb] = await pool.execute(query, [caminhoImagem, this.id])

        console.log(respostaDb)
    } catch (error) {
        console.log(error)
        throw criarErro("Erro ao atualizar foto de perfil", 500)
    }

}

}

export default Usuario
