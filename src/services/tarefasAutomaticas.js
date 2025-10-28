import cron from "node-cron"
import { operacoesGerais } from "../DAO/operacoesDB.js"

// Função para verificar plantas que precisam ser regadas
async function verificarPlantasParaRegar() {
    const query = `
        SELECT up.userPlanta_id, up.userPlanta_nome, up.ultima_rega, pe.plantaEspecie_intervalo_rega_horas
        FROM tb_userPlanta up
        INNER JOIN tb_plantaEspecie pe ON up.plantaEspecie_id = pe.plantaEspecie_id
    `
    try {
        const resultado = await operacoesGerais(query)
        const agora = new Date()
        const plantasParaRegar = []

        for (const planta of resultado[0]) {
            if (!planta.ultimaRega) {
                plantasParaRegar.push(planta)
                continue
            }
            const ultimaRega = new Date(planta.ultimaRega)
            const diffHoras = (agora - ultimaRega) / (1000 * 60 * 60)
            if (diffHoras >= planta.plantaEspecie_intervalo_rega_horas) {
                plantasParaRegar.push(planta)
            }
        }

        if (plantasParaRegar.length > 0) {
            console.log("Plantas que precisam ser regadas:", plantasParaRegar)
        } else {
            console.log("Nenhuma planta precisa ser regada agora.")
        }
        return plantasParaRegar
    } catch (error) {
        console.error("Erro ao verificar plantas para regar:", error)
    }
}

// Agendado para rodar a cada 1 minuto
cron.schedule("* * * * *", verificarPlantasParaRegar)