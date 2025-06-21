//to sofrendo pra tratar erros, então criei essa função pra poupar a fadiga
export function criarErro(mensagem, codigo) {
    
    const erro = new Error(mensagem)

    erro.statusCode = codigo

    return erro
}