import Usuario from "../Model/usuario.js"
import { criarErro } from "../utils/erros.js"
import sharp from "sharp"
import fs from "fs"
import path from "path"



export async function trocarFotoPerfil(req, res) {

       if (!req.file) {
        throw criarErro("Imagem não enviada", 400);
    }

    const caminhoOriginal = req.file.path;
    const caminhoFinal = path.join(path.dirname(caminhoOriginal), "foto-" + req.file.filename);

    try {
        const metadata = await sharp(caminhoOriginal).metadata();

        if (metadata.width > 1024 || metadata.height > 1024) {
            await sharp(caminhoOriginal)
                .resize({ width: 1024, height: 1024, fit: "inside" })
                .jpeg({ quality: 80 })
                .toFile(caminhoFinal);
            fs.unlinkSync(caminhoOriginal);
        } else {
            fs.renameSync(caminhoOriginal, caminhoFinal);
        }

        const usuario = new Usuario(
            req.usuario.user_id,
            req.usuario.user_nome,
            req.usuario.user_email,
            req.usuario.user_email
        )

        console.log(caminhoFinal)
        console.log(usuario)

        await usuario.atualizarFoto(caminhoFinal);

        res.status(200).json("Foto atualizada com sucesso!");
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({ erro: error.message });
    }
}