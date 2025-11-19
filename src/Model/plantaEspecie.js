import { conexao } from "../DAO/conexao.js"
import { operacoesGerais } from "../DAO/operacoesDB.js"
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
            await operacoesGerais(queryRegistro, [nome, descricao, cuidados, caminhoFoto, rega, classificacao ])
            return "Espécie registrada com sucesso"
        } catch (error) {
            throw criarErro("Erro ao inserir espécie", 200)
        }

    }
    static async buscarEspecies() {
        const queryBusca = "SELECT * FROM tb_plantaEspecie"

        try {

            let [resultado] = await operacoesGerais(queryBusca)

            return resultado

        } catch (error) {
            console.log(error)
            throw criarErro("erro ao contatar o banco de dados", 500)
        }

    }

    static async buscarEspeciesPorClassificacao(classificacaoID){

        const query = "SELECT * FROM tb_plantaEspecie WHERE plantaEspecie_id = ?"

        try {
            let [resultado] = await operacoesGerais(query, [classificacaoID])

            return resultado
        } catch (error) {
            throw error
        }

    }

    static async buscarImagem(id){

        if (!id) {
            throw criarErro("ID da espécie não fornecido", 400)
        }
        console.log("id selecionado: ", id)
        const query = 'SELECT plantaEspecie_foto FROM tb_plantaEspecie WHERE plantaEspecie_id = ?'

        try {
            const resultadoDb = await operacoesGerais(query, [id])
            return resultadoDb[0][0]?.plantaEspecie_foto
        } catch (error) {
            console.log(error)
            throw criarErro("Erro ao buscar imagem da espécie", 500)
        }
       
    }   
}

export default EspeciePlanta