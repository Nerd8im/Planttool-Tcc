import { conexao } from "../DAO/conexao.js"
import { criarErro } from "../utils/erros.js"

const pool = await conexao()

class EspeciePlanta {
    constructor(id, nome, descricao, cuidados, classificacao, rega) {

        id = this.id
        nome = this.nome
        descricao = this.descricao
        cuidados = this.cuidados
        classificacao = this.classificacao
        rega = this.rega

    }

    static async registrar(nome, descricao, cuidados, rega, classificacao, foto) {

        const queryRegistro = "INSERT INTO tb_plantaEspecie (plantaEspecie_nome, plantaEspecie_descricao, plantaEspecie_cuidados, plantaEspecie_foto, plantaEspecie_intervalo_rega_horas, classificacao_id) VALUES (?, ?, ?, ?, ?, ?)"

        if (!foto) {
            foto = 'publico\imagem_plantas\placeholder.jpg'
        }

        try {
            await pool.execute(queryRegistro, [nome, descricao, cuidados, foto, rega, classificacao])
        } catch (error) {
            throw criarErro("Erro ao inserir espécie", 200)
        }

    }
    static async buscarEspecies() {
        const queryBusca = 'SELECT * FROM tb_plantaEspecies'

        try {

            const resultado = await pool.execute(queryBusca)

            console.log(resultado)

            return [resultado]
        } catch (error) {
            criarErro("erro ao contatar o banco de dados", 500)
        }

    }
}

export default EspeciePlanta