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
    const id = req.usuario.user_id;
    const { image } = req.params;



    const caminho = path.resolve('uploads_privados', 'usuarios', image);

    console.log(caminho);
    
    if (image !== id.concat('.jpg')) {
        throw criarErro("Imagem não corresponde ao usuário autenticado", 403);
    } else if (!fs.existsSync(caminho)) {
        throw criarErro("Imagem não encontrada", 404);
    }

    try {
        return res.status(200).sendFile(caminho);
    }
    catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({ erro: error.message });
    }
}

//Especies de Plantas

export async function buscarEspecies(req, res){

    try {
        let ListaeEspecies = await EspeciePlanta.buscarEspecies()

        res.status(200).json(ListaeEspecies)
    } catch (error) {
        criarErro("Erro ao buscar", 500)
    }
    

}