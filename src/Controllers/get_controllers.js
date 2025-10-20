import Usuario from "../Model/usuario.js";
import path from "path";
import fs from "fs";
import { criarErro } from "../utils/erros.js";
import EspeciePlanta from "../Model/plantaEspecie.js";


export async function pegarImagem(req, res) {
    const { image } = req.params;

    const caminho = path.resolve('uploads_publicos', 'usuarios', image);

    console.log(caminho);

    if (!fs.existsSync(caminho)) {
        throw criarErro("Imagem não encontrada", 404);
    }

    try {
        return res.status(200).sendFile(caminho);
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({ erro: error.message });
    }

}

export async function pegarImagemUsuario(req, res) {
    const id = req.params.id

    const formatos = [".jpg", ".png"]

    let caminhoFinal = null

      // Se não tem extensão busca por todas as possíveis
    for (const ext of formatos) {
        const caminho = path.resolve('uploads_privados', id, 'foto_perfil', `${id}${ext}`)
        if (fs.existsSync(caminho)) {
            caminhoFinal = caminho
            break
        }
    }

    if (!caminhoFinal) {
        res.status(404).json("imagem não encontrada")
        throw criarErro("Imagem não encontrada", 404)
    }

    try {
        return res.status(200).sendFile(caminhoFinal)
    } catch (error) {
        console.error(error)
        res.status(error.statusCode || 500).json({ erro: error.message })
    }
}

export async function buscarPlantasUsuario(req, res) {
    const usuario = new Usuario(req.usuario.user_id, req.usuario.user_nome, req.usuario.user_email, req.usuario.user_senha)

    try {
        let plantasUsuario = await usuario.buscarPlantasUsuario()

        if (plantasUsuario.length === 0) {
            return res.status(200).json({ mensagem: "Nenhuma planta cadastrada" })
        }

        res.status(200).json(plantasUsuario)
    }
    catch (error) {
        throw criarErro("Erro ao buscar", 500)
    }
}

//Especies de Plantas

export async function buscarEspecies(req, res) {

    try {
        let ListaEspecies = await EspeciePlanta.buscarEspecies()

        if (ListaEspecies.length === 0) {
            return res.status(200).json({ mensagem: "Nenhuma espécie cadastrada" })
        }

        res.status(200).json(ListaEspecies)
    } catch (error) {
        console.log(error)
        throw criarErro("Erro ao buscar", 500)
    }



}
