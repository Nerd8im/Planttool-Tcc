import { GoogleGenerativeAI } from "@google/generative-ai";
import { criarErro } from "../utils/erros.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function geminiAPI(imageBuffer) {
    const prompt =
        "Faça uma análise, não tão objetiva e não muito longa, sendo mais natural, dessa planta e me de o nome dela (caso não consiga encontar o nome, NÃO FAÇA a análise e NEM TENTE chutar um nome). Caso nem seja uma planta, avise e pare análise. Veja  também se ela apresenta algum problema e dicas de como cuidar";

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