import Usuario from "../Model/usuario.js";
import path from "path";
import fs from "fs";
import { criarErro } from "../utils/erros.js";
import EspeciePlanta from "../Model/plantaEspecie.js"
import PlantaUsuario from "../Model/plantaUsuario.js";
import { stringify } from "querystring";

export async function pegarImagemUsuario(req, res) {
    const usuario = new Usuario(req.usuario.user_id)

    let caminhoImagem = await usuario.buscarFotoPerfil(req.usuario.user_id)

    if (!caminhoImagem) {
        return res.status(404).json({ erro: "Imagem não encontrada" })
    }

    try {
        return res.status(200).sendFile(path.resolve(caminhoImagem))
    } catch (error) {
        console.error(error)
        res.status(error.statusCode || 500).json({ erro: error.message })
    }
}

// Plantas do Usuário

export async function buscarPlantasUsuario(req, res) {

    try {
        if (!req.usuario || !req.usuario.user_id) {
            return res.status(401).json({ erro: "Usuário não autenticado" })
        }

        const usuario = new Usuario(
            req.usuario.user_id,
            req.usuario.user_nome,
            req.usuario.user_sobrenome,
            req.usuario.user_email,
            req.usuario.user_senha
        )

        const plantasUsuario = await usuario.buscarPlantasUsuario()

        if (!plantasUsuario || plantasUsuario.length === 0) {
            return res.status(200).json({ erro: "Nenhuma planta cadastrada" })
        }

        return res.status(200).json(plantasUsuario);

    } catch (error) {
        console.error("Erro ao buscar plantas do usuário:", error)
        return res.status(500).json({ erro: "Erro ao buscar plantas do usuário" })
    }
}

// A principal diferença é que aqui vem a planta especifica do usuário com detalhes
export async function buscarPlantaId(req, res) {
    const idPlanta = req.params.id
    const userId = req.usuario?.user_id

    if (!idPlanta) {
        return res.status(400).json({ erro: "ID da planta não fornecido" })
    }

    try {
        const planta = await PlantaUsuario.buscarPlantaId(userId, idPlanta)
        console.log("Planta encontrada:", planta)

        if (!planta) {
            return res.status(404).json({ erro: "Planta não encontrada" })
        }

        let caminhoImagemParaRetorno = null

        if (planta.userPlanta_foto) {

            const caminhoAbsoluto = path.resolve(process.cwd(), planta.userPlanta_foto);

            if (fs.existsSync(caminhoAbsoluto)) {
                caminhoImagemParaRetorno = planta.userPlanta_foto;
            } else {
                console.warn(`Aviso: Arquivo de imagem não encontrado no disco, embora esteja referenciado no DB: ${caminhoAbsoluto}`);
                caminhoImagemParaRetorno = null
            }
        }

        const plantaComImagem = {
            ...planta,
            userPlanta_foto: caminhoImagemParaRetorno
        };

        return res.status(200).json(plantaComImagem)

    } catch (error) {
        console.error("Erro ao buscar planta:", error)
        return res.status(500).json({ erro: "Erro ao buscar planta" })
    }
}

export async function pegarImagemPlanta(req, res) {
    req.idPlanta = req.params.id
    req.idUsuario = req.usuario?.user_id

    if (!req.idPlanta) {
        return res.status(400).json({ erro: "ID da planta não fornecido" })
    }

    try {
        let planta = await PlantaUsuario.buscarPlantaId(req.idUsuario, req.idPlanta)
        console.log(planta)
        if (!planta) {
            return res.status(404).json({ erro: "Planta não encontrada" })
        }

        const caminhoAbsoluto = path.resolve(process.cwd(), planta.userPlanta_foto)

        if (!fs.existsSync(caminhoAbsoluto)) {
            return res.status(404).json({ erro: "Arquivo de imagem não encontrado no servidor" })
        }

        return res.status(200).sendFile(caminhoAbsoluto)

    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: "Erro ao buscar planta" })
    }


}

// Especies de Plantas
export async function buscarEspecies(req, res) {

    try {
        let ListaEspecies = await EspeciePlanta.buscarEspecies()

        if (ListaEspecies.length === 0) {
            return res.status(200).json({ mensagem: "Nenhuma espécie cadastrada" })
        }

        res.status(200).json(ListaEspecies)
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao buscar espécies de plantas" })
    }
}

export async function buscarImagemEspecie(req, res) {
    const idEspecie = req.params

    try {
        let caminhoImagem = await EspeciePlanta.buscarImagem(idEspecie)

        if (!caminhoImagem) {
            return res.status(404).json({ erro: "Imagem não encontrada" })
        }

        return res.status(200).sendFile(path.resolve(caminhoImagem))
    } catch (error) {
        console.log(error)
    }
}