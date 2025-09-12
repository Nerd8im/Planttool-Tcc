import { GoogleGenerativeAI } from "@google/generative-ai";
import { criarErro } from "../utils/erros.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function geminiAPI(imageBuffer) {
    const prompt =  "Analise a planta mostrada na foto de forma natural, em um texto não excessivamente técnico. Identifique o nome da planta (apenas se tiver certeza; se não for possível identificar, não faça análise e não tente adivinhar). Caso a imagem não seja de uma planta, apenas informe isso e pare a resposta. Se identificar a planta, descreva brevemente suas características de forma leve e natural. Indique possíveis sinais de problemas visíveis (pragas, folhas amareladas, ressecamento etc.). Dê dicas simples de cuidados para mantê-la saudável.";

    try {
        const image = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: "image/png",
            },
        };
        const res = await model.generateContent([prompt, image]);
        return res.response.text() || "Alt-text não disponível.";
    } catch (erro) {
        console.error("Erro ao obter alt-text:", erro.message, erro);
        throw criarErro("Erro ao obter alt-text", 500);
    }
}