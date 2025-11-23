import { operacoesGerais } from "../DAO/operacoesDB.js"

class GuiaCuidados {
    constructor(id, idEspeciePlanta, titulo, conteudo) {
        this.id = id
        this.idEspeciePlanta = idEspeciePlanta
        this.titulo = titulo
        this.conteudo = conteudo
    }
    static async buscarGuiasPorEspecie(idEspeciePlanta) {
        const query = "SELECT * FROM tb_guia_cuidados WHERE plantaEspecie_id = ?"
        try {
            let [resultado] = await operacoesGerais(query, [idEspeciePlanta])
            return resultado
        } catch (error) {
            throw error
        }
    }

    static async registrarGuia(idEspeciePlanta, titulo, conteudo) {
        const query = "INSERT INTO tb_guia_cuidados (plantaEspecie_id, guia_titulo, guia_conteudo) VALUES (?, ?, ?)"
        try {
            await operacoesGerais(query, [idEspeciePlanta, titulo, conteudo])
            return "Guia registrado com sucesso"
        } catch (error) {
            throw error
        }
    }

    static async deletarGuia(idGuia) {
        const query = "DELETE FROM tb_guia_cuidados WHERE guia_id = ?"
        try {
            await operacoesGerais(query, [idGuia])
            return "Guia deletado com sucesso"
        } catch (error) {
            throw error
        }
    }

}

export default {GuiaCuidados}
