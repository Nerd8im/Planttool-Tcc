
import { operacoesGerais } from "../DAO/operacoesDB.js"
import { criarErro } from "../utils/erros.js"
import bcrypt, { compare, hash } from "bcrypt"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"

const chaveSecreta = process.env.CHAVE_SECRETA

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

        if (!nome || !sobrenome || !email || !senha) {
            throw criarErro("Todos os campos são obrigatórios", 400);
        }

        let emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        emailValido.test(email)

        if (!emailValido.test(email)) {
            console.log(email)
            throw criarErro("Formato do Email inválido")
        }
        
        const queryVerifica = "SELECT user_id FROM tb_user WHERE user_email = ?"
        const resultadoVerificacao = await operacoesGerais(queryVerifica, [email])

        if (resultadoVerificacao[0] && resultadoVerificacao[0].length > 0) {
            throw criarErro("Já existe um usuário cadastrado com esse e-mail", 409)
        }

        const id = uuidv4()
        const queryRegistro = "INSERT INTO tb_user(user_id, user_nome, user_sobrenome, user_email, user_senha) VALUES (?, ?, ?, ?, ?)"

        try {
            const senhaHash = await bcrypt.hash(senha, salt)
            await operacoesGerais(queryRegistro, [id, nome, sobrenome, email, senhaHash])
            return {
                mensagem: "Usuário registrado com sucesso",
                usuario: { nome, sobrenome }
            }
        } catch (error) {
            throw error
        }

    }

    static async autenticar(email, senha) {

        if (!email || !senha) {
            throw criarErro("Email e senha são obrigatorios", 400)
        }

        const querySenha = 'SELECT user_senha FROM tb_user WHERE user_email = ?'
        const queryBuscarUser = 'SELECT user_id, user_nome, user_sobrenome, user_email, user_foto FROM tb_user WHERE user_email = ?'

        try {
            const senhaReal = await operacoesGerais(querySenha, [email])
            if (!senhaReal[0] || senhaReal[0].length === 0) {
                throw criarErro("Úsuario não encontrado", 404)
            }

            if (await bcrypt.compare(senha, senhaReal[0][0].user_senha) == true) {
                const dadosUsuarioDb = await operacoesGerais(queryBuscarUser, [email])
                const tokenUsuario = jwt.sign(dadosUsuarioDb[0][0], chaveSecreta, { expiresIn: "3h" })
                const dadosUsuario = dadosUsuarioDb[0][0]
                console.log("Um usuário foi autenticado com sucesso")
                return { tokenUsuario, dadosUsuario }
            } else {
                throw criarErro("senha incorreta", 401)
            }

        } catch (error) {
            if (error.statusCode) {
                throw error
            }
            console.log(error)
            throw criarErro("erro ao autenticar", 500)
        }
    }

    async buscarFotoPerfil() {
        
        const query = `SELECT user_foto FROM tb_user WHERE user_id = ?`

        try {
            const respostaDb = await operacoesGerais(query, [this.id])
            return respostaDb[0][0]?.user_foto
        } catch (error) {
            console.log(error)
            throw criarErro("Erro ao buscar foto de perfil", 500)
        }

    }

    async atualizarFoto(caminhoImagem) {

        const query = `UPDATE tb_user SET user_foto = ? WHERE user_id = ?`

        try {
            await operacoesGerais(query, [caminhoImagem, this.id])
        } catch (error) {
            console.log(error)
            throw criarErro("Erro ao atualizar foto de perfil", 500)
        }
    }

    async alterarDadosUsuario(novoNome, novoSobrenome, novoEmail) {
        const query = `UPDATE tb_user SET user_nome = ?, user_sobrenome = ?, user_email = ? WHERE user_id = ?`

        try {
            await operacoesGerais(query, [novoNome, novoSobrenome, novoEmail, this.id])
        } catch (error) {
            console.log(error)
            throw criarErro("Erro ao atualizar foto de perfil", 500)
        }
        
    }

    async buscarPlantasUsuario() {

        const query = `SELECT * FROM tb_userPlanta WHERE user_id = ?`

        try {
            const respostaDb = await operacoesGerais(query, [this.id])
            return respostaDb[0]
        } catch (error) {
            console.log(error)
            throw criarErro("Erro ao buscar plantas do usuário", 500)
        }
    }

    async deletarUsuario() {

        const query = `DELETE FROM tb_user WHERE user_id = ?`

        try {
            await operacoesGerais(query, [this.id])
        } catch (error) {
            console.log(error)
            throw criarErro("Erro ao deletar usuário", 500)
        }
    }

}

export default Usuario
