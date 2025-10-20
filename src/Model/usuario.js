static async registrar(nome, sobrenome, email, senha) {
    const salt = 12;

    if (!nome || !sobrenome || !email || !senha) {
        throw criarErro("Todos os campos são obrigatórios", 400);
    }

    const queryVerifica = "SELECT user_id FROM tb_user WHERE user_email = ?";
    const [resultadoVerificacao] = await pool.execute(queryVerifica, [email]);

    if (resultadoVerificacao.length > 0) {
        throw criarErro("Já existe um usuário cadastrado com esse e-mail", 409);
    }

    const id = uuidv4();
    const queryRegistro = `
        INSERT INTO tb_user (user_id, user_nome, user_sobrenome, user_email, user_senha)
        VALUES (?, ?, ?, ?, ?)
    `;

    try {
        const senhaHash = await bcrypt.hash(senha, salt);

        await pool.execute(queryRegistro, [
            id,
            nome,
            sobrenome,
            email,
            senhaHash
        ]);

        return {
            mensagem: "Usuário registrado com sucesso",
            usuario: { nome, sobrenome }
        };
    } catch (error) {
        throw criarErro("Erro ao registrar usuário", 500);
    }
}
