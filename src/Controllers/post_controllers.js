import Usuario from "../Model/usuario.js"
import EspeciePlanta from "../Model/plantaEspecie.js"
import PlantaUsuario from "../Model/plantaUsuario.js"
import { criarErro } from "../utils/erros.js"
import sharp from "sharp"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from 'uuid'
import geminiAPI from "../services/geminiAPI.js"
import { trocarFotoPerfil } from "./put_controllers.js"

export async function registrarUsuario(req, res) {

    const { nome, sobrenome, email, senha } = req.body

    console.log("Tentanto registrar usuário...")
    try {
        const resposta = await Usuario.registrar(nome, sobrenome, email, senha)
        console.log("Usuário registrado com sucesso.")
        res.status(200).json(resposta)

    } catch (error) {
        console.error("Erro ao registrar usuário:", error)
        res.status(error.statusCode || 500).json({ erro: error.message})
    }

}

export async function login(req, res) {

    const { email, senha } = req.body

    if (!email || !senha) {
        res.status(400).json("Todos os campos são obrigatorios")
    }

    console.log("Tentanto logar usuário...")
    try {
        const respostaLogin = await Usuario.autenticar(email, senha)
        console.log("Usuário logado com sucesso.")
        res.status(200).json(respostaLogin)

    } catch (error) {
        console.error("erro ao logar usuário:", error)
        res.status(error.statusCode || 500).json({ erro: error.message })
    }

}

export async function postarImagem(req, res) {

    const userId = req.user.id

    if (!req.file) {
        throw criarErro("Imagem não enviada", 400);
    }

    const caminhoOriginal = req.file.path;
    const caminhoFinal = path.join(path.dirname(caminhoOriginal), "foto-" + req.file.filename)

    console.log("Processando imagem enviada...");
    try {
        const metadata = await sharp(caminhoOriginal).metadata();

        if (metadata.width > 1024 || metadata.height > 1024) {
            await sharp(caminhoOriginal)
                .resize({ width: 1024, height: 1024, fit: "inside" })
                .jpeg({ quality: 80 })
                .toFile(caminhoFinal);
            fs.unlinkSync(caminhoOriginal);
        } else {
            fs.renameSync(caminhoOriginal, caminhoFinal)
        }
        
        console.log("Imagem redimensionada e salva");
        return res.status(200).json({ mensagem: "Imagem enviada com sucesso", caminho: caminhoFinal })

    } catch (error) {
        console.error("Erro ao processar imagem:", error);
        res.status(error.statusCode || 500).json({ erro: error.message });
    }
}

//EspeciePlanta
export async function registrarEspecie(req, res) {

    const { nome, descricao, cuidados, classificacao, rega } = req.body

    if (!nome || !descricao || !cuidados || !classificacao || !rega) {
        throw criarErro("Todos os campos são obrigatórios")
    }
    console.log("Tentanto registrar a especie...")
    try {

        const respostaRegistro = await EspeciePlanta.registrar(nome, descricao, cuidados, rega, classificacao)

        res.status(200).json(respostaRegistro)

    } catch (error) {
        console.error("Erro ao registrar a especie:", error)
        throw criarErro("Erro ao tentar registrar a especie", 500)
    }

}

//PlantaUsuario
export async function registrarPlanta(req, res) {
    const userId = req.usuario.user_id
    const { especieId, nome } = req.body

    const plantio = new Date()
    const rega = plantio

    if (!especieId || !nome) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios" })
    }

    console.log("Tentanto registrar a planta do usuário...")
    try {
        const plantaId = uuidv4()
        req.plantaId = plantaId

        const caminhoFoto = req.file ? path.relative(process.cwd(), req.file.path) : null

        // if (!req.file) {
        //     return res.status(400).json({ erro: "Imagem não enviada" })
        // }

        const respostaRegistro = await PlantaUsuario.registrarPlanta(
            userId,
            especieId,
            nome,
            caminhoFoto,
            plantio,
            rega,
            plantaId
        )

        console.log("Planta do usuário registrada com sucesso.")
        return res.status(200).json({
            mensagem: "Planta registrada com sucesso",
            planta: respostaRegistro,
        })
    } catch (error) {
        console.error("Erro ao registrar planta:", error)
        return res.status(500).json({ erro: "Erro ao registrar planta" })
    }
}


export async function analiseGemni(req, res) {
    const texto = req.body.text || ""
    if (!req.file) {
        throw criarErro("Imagem não enviada", 400)
    }

   try {
        const imageBuffer = fs.readFileSync(req.file.path);

        console.log("Imagem lida para análise com Gemini.");

        const descricao = await geminiAPI(texto, imageBuffer);

        console.log("Descrição gerada com sucesso.");

        return res.status(200).json({ descricao });
    } catch (error) {
        console.error("Erro ao gerar descrição com Gemini:", error);
        return res.status(500).json({ erro: "Erro ao analisar imagem" });
    }
}

export async function registrarGuiaCuidado(req, res) {
    const { id } = req.params
    const { titulo, conteudo } = req.body
    if (!id || !titulo || !conteudo) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios" })
    }
    try {
        let resposta = await GuiaCuidados.registrarGuia(id, titulo, conteudo)
        return res.status(200).json({ mensagem: resposta })
    } catch (error) {
        console.error("Erro ao registrar guia de cuidado:", error)
        return res.status(500).json({ erro: "Erro ao registrar guia de cuidado" })
    }
}

export async function registrarGuiaCuidado(req, res) {
    const { id } = req.params
    const { titulo, conteudo } = req.body
    if (!id || !titulo || !conteudo) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios" })
    }
    try {
        let resposta = await GuiaCuidados.registrarGuia(id, titulo, conteudo)
        return res.status(200).json({ mensagem: resposta })
    } catch (error) {
        console.error("Erro ao registrar guia de cuidado:", error)
        return res.status(500).json({ erro: "Erro ao registrar guia de cuidado" })
    }
}