import { conexao } from "../DAO/conexao.js"
import { criarErro } from "../utils/erros.js"

const pool = await conexao()

class EspeciePlanta {
    constructor(id, nome, descricao, cuidados, classificacao) {

        id = this.id
        nome = this.nome
        descricao = this.descricao
        cuidados = this.cuidados
        classificacao = this.classificacao

    }

    async registrar(){

        const queryRegistro = "INSERT INTO tb_plantaEspecie (plantaEspecie_id, plantaEspecie_nome, plantaEspecie_descricao, plantaEspecie_cuidados, classificacao_id) VALUES (?, ?, ?, ?, ?,)"

    }
}

export default EspeciePlanta