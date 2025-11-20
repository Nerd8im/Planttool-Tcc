import Usuario from "../Model/usuario.js";
import PlantaUsuario from "../Model/plantaUsuario.js";
import GuiaCuidados from "../Model/guiasCuidado.js";
import path from "path";
import fs from "fs";
import { criarErro } from "../utils/erros.js";
import EspeciePlanta from "../Model/plantaEspecie.js";

//Usuário
export async function deletarUsuario(req, res) {
    const id = req.usuario.user_id;

    try {
        const resposta = await Usuario.deletar(id)

        res.status(200).json(resposta)

    } catch (error) {
        console.error(error)
        res.status(error.statusCode || 500).json({ erro: error.message })
    }
}

//Planta do usuário
export async function deletarPlantaUsuario(req, res) {
    const idPlanta = req.params.id
    try {
        const resposta = await PlantaUsuario.deletarPlanta(idPlanta)
        res.status(200).json(resposta)
    } catch (error) {
        console.error(error)
        res.status(error.statusCode || 500).json({ erro: error.message })
    }
}

export async function deletarGuiaCuidado(req, res) {
    const idGuia = req.params.id
    if (!idGuia) {
        return res.status(400).json({ erro: "ID do guia não fornecido" })
    }
    try {
        const resposta = await GuiaCuidados.deletarGuia(idGuia)
        res.status(200).json(resposta)
    } catch (error) {
        console.error(error)
        res.status(error.statusCode || 500).json({ erro: error.message })
    }
}