import Usuario from "../Model/usuario.js"
import { criarErro } from "../utils/erros.js"
import sharp from "sharp"
import multer from "multer"

const armazenamentoImagem = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const formatos = ['image/jpeg', 'image/png']
        if (!formatos.includes(file.mimetype)) {
            return cb(criarErro('Apenas imagens no formato jpeg e png são permitidas', 415))
        }

        cb(null, true)
    }

})

export const uploadFoto = armazenamentoImagem.single("foto")

export async function trocarFotoPerfil(req, res) {

    let imagemBuffer = req.file?.buffer

    if (!imagemBuffer) {
        throw criarErro("Imagem não enviada", 400)
    }

    const metadata = await sharp(imagemBuffer).metadata()

    if (metadata.width > 1024 || metadata.height > 1024) {
        imagemBuffer = await sharp(imagemBuffer)
            .resize({ width: 1024, height: 1024, fit: 'inside' })
            .jpeg({ quality: 80 })
            .toBuffer()
    }

    const usuario = new Usuario(
        req.usuario.user_id,
        req.usuario.user_nome,
        req.usuario.user_email,
        req.usuario.user_email
    )

    try {
        await usuario.atualizarFoto(imagemBuffer)

        res.status(200).json("Foto atualizada com sucesso!")
    } catch (error) {
        console.error(error)
        res.status(error.statusCode || 500).json({ erro: error.message })
    }

}