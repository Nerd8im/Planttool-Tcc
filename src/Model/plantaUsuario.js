import { operacoesGerais } from "../DAO/operacoesDB.js"
import { criarErro } from "../utils/erros.js"
import { v4 as uuidv4 } from 'uuid'

class PlantaUsuario {
    constructor(idPlanta, userId, especieId, nome, caminhoFoto, plantio) {
        this.idPlanta = idPlanta
        this.userId = userId
        this.especieId = especieId
        this.nome = nome
        this.caminhoFoto = caminhoFoto
        this.plantio = plantio
        this.rega = null
    }


    static async registrarPlanta(userId, especieId, nome, foto, plantio,rega) {

        const userPlantaId = uuidv4() // Gera um UUID para o campo userPlanta_id
        const queryRegistro = `
            INSERT INTO tb_userPlanta 
            (userPlanta_id, user_id, plantaEspecie_id, userPlanta_nome, userPlanta_foto, data_plantio, ultima_rega) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `

        try {
            const result = await operacoesGerais(queryRegistro, [userPlantaId, userId, especieId, nome, foto, plantio])
            if (!result || result.linhasAfetadas === 0) {
                throw criarErro("Erro ao inserir planta no banco de dados", 500)
            }
            return {
                mensagem: "Planta registrada com sucesso",
                plantaId: userPlantaId,
            }
        } catch (error) {
            console.error("Erro ao registrar planta no banco de dados:", error)
            throw criarErro("Erro ao inserir planta", 500)
        }
    }

    static async deletarPlanta(idPlanta) {
        const query = "DELETE FROM tb_userPlanta WHERE userPlanta_id = ?"
        try {
            const resultado = await operacoesGerais(query, [idPlanta])
            console.log("Planta deletada com sucesso:", resultado)
            return {
                mensagem: "Planta deletada com sucesso"
            }
        } catch (error) {
            console.error("Erro ao deletar planta no banco de dados:", error)
            throw criarErro("Erro ao deletar planta", 500)
        }
    }

    static async alterarFoto(idPlanta, caminhoFoto) {
        const queryAlteracao = "UPDATE tb_userPlanta SET userPlanta_foto = ? WHERE userPlanta_id = ?"
        try {
            const resultado = await operacoesGerais(queryAlteracao, [caminhoFoto, idPlanta])
            console.log("Foto da planta alterada com sucesso:", resultado)
            return {
                mensagem: "Foto da planta alterada com sucesso"
            }
        } catch (error) {
            console.error("Erro ao alterar foto da planta no banco de dados:", error)
            throw criarErro("Erro ao alterar foto da planta", 500)
        }
    }

    static async alterarNome(idPlanta, novoNome) {
        const query = "UPDATE tb_userPlanta SET userPlanta_nome = ? WHERE userPlanta_id = ?"
        try {
            const resultado = await operacoesGerais(query, [novoNome, idPlanta])
            console.log("Nome da planta alterado com sucesso:", resultado)
            return {
                mensagem: "Nome da planta alterado com sucesso"
            }
        } catch (error) {
            console.error("Erro ao alterar nome da planta no banco de dados:", error)
            throw criarErro("Erro ao alterar nome da planta", 500)
        }
    }

    static async buscarPlantasUsuario(userId) {
        const queryBusca = "SELECT * FROM tb_userPlanta WHERE user_id = ?"
        try {
            let resultado = await operacoesGerais(queryBusca, [userId])
            console.log(resultado[0])
            return resultado[0]
        } catch (error) {
            throw criarErro("erro ao contatar o banco de dados", 500)
        }
    }

    static async buscarPlantaId(userId, idPlanta) {
        const queryBusca = "SELECT up.userPlanta_id, up.userPlanta_nome, up.userPlanta_foto, up.data_plantio, up.ultima_rega, pe.plantaEspecie_nome, pe.plantaEspecie_descricao, gc.titulo, gc.conteudo FROM tb_userPlanta up INNER JOIN tb_plantaEspecie pe ON up.plantaEspecie_id = pe.plantaEspecie_id LEFT JOIN tb_guiaCuidado gc ON pe.plantaEspecie_id = gc.plantaEspecie_id;"
        try {
            let resultado = await operacoesGerais(queryBusca, [userId, idPlanta])
            if (!resultado[0] || resultado[0].length === 0) {
                throw criarErro("Planta não encontrada", 404)
            }
            return resultado[0][0]
        } catch (error) {
            console.log(error)
            throw criarErro("erro ao contatar o banco de dados", 500)
        }
    }

    async regar() {
        const query = "UPDATE tb_userPlanta SET ultima_rega = NOW() WHERE userPlanta_id = ?"
        const queryBusca = "SELECT ultima_rega FROM tb_userPlanta WHERE userPlanta_id = ?"
        try {
            const resultadoRega = await operacoesGerais(query, [this.idPlanta])
            console.log("Planta regada com sucesso:", resultadoRega)

            const resultadoBusca = await operacoesGerais(queryBusca, [this.idPlanta])
            this.rega = resultadoBusca[0][0]?.ultima_rega
            return this.rega

        } catch (error) {
            console.error("Erro ao regar planta no banco de dados:", error)
            throw criarErro("Erro ao regar planta", 500)
        }
    }
}

export default PlantaUsuario