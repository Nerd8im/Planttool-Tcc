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
        this.caminhoFoto = caminhoFoto
        this.plantio = plantio
    }


    static async registrarPlanta(userId, especieId, nome, foto, plantio) {
        const userPlantaId = uuidv4(); // Gera um UUID para o campo userPlanta_id
        const queryRegistro = `
            INSERT INTO tb_userPlanta 
            (userPlanta_id, user_id, plantaEspecie_id, userPlanta_nome, userPlanta_foto, data_plantio) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        try {
            const [result] = await pool.execute(queryRegistro, [userPlantaId, userId, especieId, nome, foto, plantio]);

            if (result.affectedRows === 0) {
                throw criarErro("Erro ao inserir planta no banco de dados", 500);
            }

            return {
                mensagem: "Planta registrada com sucesso",
                plantaId: userPlantaId,
            };
        } catch (error) {
            console.error("Erro ao registrar planta no banco de dados:", error);
            throw criarErro("Erro ao inserir planta", 500);
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

    static async buscarPlantaId(userId, idPlanta) {
        const queryBusca = "SELECT * FROM tb_userPlanta WHERE user_id = ? AND userPlanta_id = ?"

        try {

            let [resultado] = await pool.execute(queryBusca, [userId, idPlanta])

            if (resultado.length === 0) {
                throw criarErro("Planta não encontrada", 404)
            }

            return resultado[0]

        } catch (error) {
            console.log(error)
            throw criarErro("erro ao contatar o banco de dados", 500)
        }
    }
}

export default PlantaUsuario