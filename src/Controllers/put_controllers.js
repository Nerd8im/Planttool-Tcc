import Usuario from "../Model/usuario.js"
import PlantaUsuario from "../Model/plantaUsuario.js"
import { criarErro } from "../utils/erros.js"
import sharp from "sharp"
import fs from "fs"
import path from "path"


// Usuário
export async function trocarFotoPerfil(req, res) {

    const id = req.usuario.user_id

    if (!req.file) {
        throw criarErro("Imagem não enviada", 400);
    }

    const caminhoOriginal = req.file.path
    /* mudei aqui pra foto ser apenas o id do usuário. Obs: esse path é bizonho de útil */
    const caminhoFinal = path.join(path.dirname(caminhoOriginal), id.concat(path.extname(req.file.originalname)))
    try {
        const metadata = await sharp(caminhoOriginal).metadata()

        if (metadata.width > 1024 || metadata.height > 1024) {
            await sharp(caminhoOriginal)
                .resize({ width: 1024, height: 1024, fit: "inside" })
                .jpeg({ quality: 80 })
                .toFile(caminhoFinal)
                await fs.promises.unlink(caminhoOriginal)
        } else {
            fs.renameSync(caminhoOriginal, caminhoFinal)
        }
        
        // remove outras fotos antigas
        fs.readdir(path.dirname(caminhoFinal), (err, files) => {

            if (err) throw err
            files.forEach(file => {
                if (file.startsWith(id) && file !== path.basename(caminhoFinal)) {
                    fs.unlink(path.join(path.dirname(caminhoFinal), file), err => {
                        if (err) throw err
                    })
                }
            })
        })

        const usuario = new Usuario(
            req.usuario.user_id,
            req.usuario.user_nome,
            req.usuario.user_email,
            req.usuario.user_email
        )

        console.log(caminhoFinal)
        console.log(usuario)

        await usuario.atualizarFoto(caminhoFinal)

        res.status(200).json(caminhoFinal)
    } catch (error) {
        console.error(error)
        res.status(error.statusCode || 500).json({ erro: error.message })
    }
}

//planta do usuário
export async function alterarImagemPlanta(req, res) {
    const idPlanta = req.params.id

    if (!idPlanta) {
        throw criarErro("ID da planta não informado", 400)
    }

    if (!req.file) {
        throw criarErro("Imagem não enviada", 400)
    }

    const caminhoOriginal = req.file.path
    const caminhoFinal = path.join(
        path.dirname(caminhoOriginal),
        idPlanta.concat(path.extname(req.file.originalname))
    )

    try {
        const metadata = await sharp(caminhoOriginal).metadata()

        if (metadata.width > 1024 || metadata.height > 1024) {
            await sharp(caminhoOriginal)
                .resize({ width: 1024, height: 1024, fit: "inside" })
                .jpeg({ quality: 80 })
                .toFile(caminhoFinal)
            fs.unlinkSync(caminhoOriginal)
        } else {
            fs.renameSync(caminhoOriginal, caminhoFinal)
        }

        fs.readdir(path.dirname(caminhoFinal), (err, files) => {
            if (err) throw err
            files.forEach(file => {
                if (file.startsWith(idPlanta) && file !== path.basename(caminhoFinal)) {
                    fs.unlink(path.join(path.dirname(caminhoFinal), file), err => {
                        if (err) throw err
                    })
                }
            })
        })
        
        await PlantaUsuario.alterarFoto(idPlanta, caminhoFinal)
        

        res.status(200).json({ mensagem: "Imagem da planta atualizada com sucesso!", caminho: caminhoFinal })
    } catch (error) {
        console.error(error)
        res.status(error.statusCode || 500).json({ erro: error.message })
    }
}
  