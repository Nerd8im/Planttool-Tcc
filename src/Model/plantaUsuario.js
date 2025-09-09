import { conexao } from "../DAO/conexao.js"
import { criarErro } from "../utils/erros.js"
import { v4 as uuidv4 } from 'uuid'

const pool = await conexao()

class PlantaUsuario {
    constructor(idPlanta, userId, especieId, nome, caminhoFoto, plantio) {
        this.idPlanta = idPlanta
        this.userId = userId
        this.especieId = especieId
        this.nome = nome
        this.caminhoFoto = caminhoFoto || "publico\\imagem_plantas\\placeholder.jpg"
        this.plantio = plantio
    }

    
    static async registrarPlanta(userId, especieId, nome, foto, plantio) {

        const queryRegistro = "INSERT INTO tb_userPlanta (user_id, plantaEspecie_id, userPlanta_nome, userPlanta_foto, data_plantio) VALUES (?, ?, ?, ?, ?)"

        try {

            await pool.execute(queryRegistro, [userId, especieId, nome, foto, plantio])

            return "Planta registrada com sucesso"

        } catch (error) {

            throw criarErro("Erro ao inserir planta", 200)
        }
    }

    static async buscarPlantasUsuario(userId) {
        const queryBusca = "SELECT * FROM tb_userPlanta WHERE user_id = ?"

        try {

            let [resultado] = await pool.execute(queryBusca, [userId])

            console.log(resultado)

            return resultado

        } catch (error) {
            throw criarErro("erro ao contatar o banco de dados", 500)
        }
    }
}

export default PlantaUsuario