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


    static async registrarPlanta(userId, especieId, nome, foto, plantio) {

        const userPlantaId = uuidv4() // Gera um UUID para o campo userPlanta_id
        const queryRegistro = `
            INSERT INTO tb_userPlanta 
            (userPlanta_id, user_id, plantaEspecie_id, userPlanta_nome, userPlanta_foto, data_plantio) 
            VALUES (?, ?, ?, ?, ?, ?)
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
        const queryBusca = "SELECT up.userPlanta_id, up.userPlanta_nome, up.userPlanta_foto, up.data_plantio, up.ultimaRega, pe.plantaEspecie_nome, pe.plantaEspecie_descricao, gc.titulo, gc.conteudo FROM tb_userPlanta up INNER JOIN tb_plantaEspecie pe ON up.plantaEspecie_id = pe.plantaEspecie_id LEFT JOIN tb_guiaCuidado gc ON pe.plantaEspecie_id = gc.plantaEspecie_id;"
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
    async rega(req, res) {
        
    }
}

export default PlantaUsuario