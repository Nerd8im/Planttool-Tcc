import Usuario from "../Model/usuario.js"
import EspeciePlanta from "../Model/plantaEspecie.js"
import { criarErro } from "../utils/erros.js"
import sharp from "sharp"
import fs from "fs"
import path from "path"

export async function registrarUsuario(req, res) {

    const { nome, sobrenome, email, senha } = req.body

    try {
        const resposta = await Usuario.registrar(nome, sobrenome, email, senha)

        res.status(200).json(resposta)

    } catch (error) {
        console.error(error)
        res.status(error.statusCode || 500).json({ erro: error.message })
    }

}

export async function login(req, res) {

    const { email, senha } = req.body

    if (!email || !senha) {
        res.status(400).json("Todos os campos são obrigatorios")
    }

    try {
        const respostaLogin = await Usuario.autenticar(email, senha)

        res.status(200).json(respostaLogin)

    } catch (error) {
        console.error(error)
        res.status(error.statusCode || 500).json({ erro: error.message })
    }

}

export async function postarImagem(req, res) {
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

        return res.status(200).json({ mensagem: "Imagem enviada com sucesso", caminho: caminhoFinal });

    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({ erro: error.message });
    }
}

//EspeciePlanta
export async function registrarEspecie(req, res) {

    const {id, nome, descricao, cuidados, classificacao} = req.body

    let especieNova = new EspeciePlanta(id, nome, descricao, cuidados, classificacao)
    console.log(especieNova)

    especieNova.registrar()
}