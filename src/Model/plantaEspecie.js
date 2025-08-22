import { conexao } from "../DAO/conexao.js"
import { criarErro } from "../utils/erros.js"

const pool = await conexao()

class EspeciePlanta {
    constructor(id, nome, descricao, cuidados, classificacao, rega, caminhoFoto) {

        this.id = id
        this.nome = nome
        this.descricao = descricao
        this.cuidados = cuidados
        this.classificacao = classificacao
        this.rega = rega
        this.caminhoFoto = caminhoFoto
    }

    static async registrar(nome, descricao, cuidados, rega, classificacao, caminhoFoto) {

        const queryRegistro = "INSERT INTO tb_plantaEspecie (plantaEspecie_nome, plantaEspecie_descricao, plantaEspecie_cuidados, plantaEspecie_foto, plantaEspecie_intervalo_rega_horas, classificacao_id) VALUES (?, ?, ?, ?, ?, ?)"

        if (!caminhoFoto) {
            caminhoFoto = "publico\\imagem_plantas\\placeholder.jpg"
        }

        try {
            await pool.execute(queryRegistro, [nome, descricao, cuidados, caminhoFoto, rega, classificacao])
            return "Espécie registrada com sucesso"
        } catch (error) {
            throw criarErro("Erro ao inserir espécie", 200)
        }

    }
    static async buscarEspecies() {
        const queryBusca = "SELECT * FROM tb_plantaEspecie"

        try {

            let [resultado] = await pool.execute(queryBusca)

            console.log(resultado)

            return resultado

        } catch (error) {
            throw criarErro("erro ao contatar o banco de dados", 500)
        }

    }
}

export default EspeciePlanta