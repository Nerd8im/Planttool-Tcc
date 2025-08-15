import multer from "multer";
import path from "path";
import fs from "fs";
import { criarErro } from "../utils/erros.js";

/*Seguinte, crie mais um middleware pra facilitar upar as imagens, é simples (de ver pq criar foi foda), basta passar como parametro o nome
a pasta que você quer usar (string), e caso não exista ele cria uma com esse nome, e se ela é publica (booleano)*/

export function uploadImagem(pastaBase, publico) {

    let destinoFinal = ""

    //aqui ela verifica se é publico ou privado e altera o destino para as pastas certas
    if (publico === true) {
        destinoFinal = path.join("uploads_publicos", pastaBase)
    } else {
        destinoFinal = path.join("uploads_privados", pastaBase)
    }

    //e aqui usei o fs pra verificar se ela existe, caso não exista ele cria uma para evitar erros (e poupar minha sanidade)
    if (!fs.existsSync(destinoFinal)) {
        fs.mkdirSync(destinoFinal, { recursive: true })
    }

    //configurei o multer para salvar os arquivos no servidor inves do db, tu tinha razão, é bem melhor
    const armazenamentoLocal = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinoFinal);
        },
        filename: (req, file, cb) => {
            const nomeUnico = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, nomeUnico + path.extname(file.originalname));
        }
    })

    //e ele devolve as configurações finais com o armazenamento pronto
    return multer({
        storage: armazenamentoLocal,
        limits: { fileSize: 2 * 1024 * 1024 }, // 2mb <- eram 2 ou 5? qualquer coisa muda aí
        fileFilter: (req, file, cb) => {
            const formatos = ["image/jpeg", "image/png"];
            if (!formatos.includes(file.mimetype)) {
                return cb(criarErro("Apenas imagens JPEG e PNG são permitidas", 415));
            }
            cb(null, true)
        }
    })
}