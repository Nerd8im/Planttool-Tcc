import cron from "node-cron";

//Verificação de plantas para regar
function teste1() {
    console.log("funcionou!")
}

//calendarios de execução, deixa embaixo porque as funções tem que ser declaradas primeiro (meio obvio, mas cometi esse erro)

//esse executa a cada 5 minutos e roda todas as funções nele

// cada * representa uma parte do formato minuto, hora, dia do mes, mes e dia da semana

cron.schedule("*/5 * * * *", ()=>{
    teste1()
})