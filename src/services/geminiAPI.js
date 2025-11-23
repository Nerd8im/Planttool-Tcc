import { GoogleGenerativeAI } from "@google/generative-ai";
import { criarErro } from "../utils/erros.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generationConfig = {
  responseMimeType: "application/json",
};

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig
 });

export default async function geminiAPI(texto, imageBuffer) {
    const prompt = `
    Você é um assistente de jardinagem especialista.
    Analise a imagem fornecida e a pergunta do usuário: "${texto}".
    
    Retorne a resposta APENAS utilizando este esquema JSON:
    {
      "is_plant": boolean, 
      "identified": boolean,
      "message": string, 
      "plant_info": {
        "name": string, 
        "scientific_name": string, 
        "description": string, 
        "health_status": string, 
        "care_tips": ["Dica 1", "Dica 2", "Dica 3"]
      }
    }

    Regras de preenchimento:
    1. Se a imagem NÃO for de uma planta: defina "is_plant": false, "plant_info": null e explique em "message".
    2. Se for planta mas NÃO conseguir identificar: defina "identified": false e peça uma foto melhor em "message".
    3. Se identificar: preencha "plant_info" com dados reais, tom leve e natural.
    4. Em "health_status", descreva problemas visíveis ou diga que parece saudável.
    5. Responda a pergunta do usuário dentro do campo "message".
    `;
    console.log("Aguardando resposta do Gemini-API...");
    try {
        const image = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: "image/png",
            },
        };
        const res = await model.generateContent([prompt, image]);
        console.log("Resposta recebida do Gemini-API.");
        return res.response.text() || "Alt-text não disponível.";
    } catch (erro) {
        console.error("Erro ao obter analise do Gemini", erro.message, erro);
        throw criarErro("Erro ao obter alt-text (analise Gemini)", 500);
    }
}