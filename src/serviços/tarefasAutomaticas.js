import cron from "node-cron";

//calendarios de execução

//esse executa a cada 5 minutos e roda todas as funções nele
cron.schedule("*/5 * * * *", teste1 )

//Verificação de plantas para regar
function teste1() {
    console.log("funcionou!")
}