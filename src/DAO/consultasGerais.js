import { conexao } from "./conexao.js"

const bancoDeDados = await conexao()

//Criei essa função para padronizar, assim evita de fazer consultas no dao ou em partes meio aleatorias do codigo
export async function consultasGerais(query, parametros = [], console = false) {

    //coloca console no true se precisar testar as querys e parametros
    if(console){
        console.log("Query utilizada:", query)
        console.log("Parametros passados:", parametros)
    }

    const resultado = bancoDeDados.execute(query, parametros)

    //se for select ele devolve o resultado e no resto ele devolve as linhas
    if (query.trim().toUpperCase().startsWith("SELECT")) {
        return resultado;
      } else {
        return {
          sucesso: true,
          linhasAfetadas: resultado.affectedRows,
          insertId: resultado.insertId || null,
        }
      }

}