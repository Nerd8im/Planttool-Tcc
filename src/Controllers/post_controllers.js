import Usuario from "../Model/usuario.js"

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