import multer from "multer";
import path from "path";
import fs from "fs";
import { criarErro } from "../utils/erros.js";

/**
 * Middleware de upload de imagens que organiza os arquivos em pastas por usuário.
 * Cada usuário terá uma pasta baseada no ID, e dentro dela, subpastas para
 * cada tipo de upload (ex: 'foto_perfil', 'plantas').
 * * IMPORTANTE: O middleware de autenticação (autenticarToken) deve ser executado ANTES desse.
 * @param {string} subpasta - O nome da subpasta onde a imagem será salva (ex: 'foto_perfil').
 * @param {boolean} publico - Define se o upload será na pasta publica ou privada.
 */
export function uploadImagem( subpasta, publico) {

    const armazenamentoLocal = multer.diskStorage({
        destination: (req, file, cb) => {
            // Corrigido para usar req.usuario conforme autenticarToken.js
            if (!req.usuario || !(req.usuario.id || req.usuario.user_id)) {
                return cb(criarErro("Usuário não autenticado para fazer upload.", 401))
            }

            const userId = req.usuario.id || req.usuario.user_id;
            const tipoPasta = publico ? "uploads_publicos" : "uploads_privados";
            const destinoFinal = path.join(tipoPasta, userId, subpasta);
            fs.mkdirSync(destinoFinal, { recursive: true });
            cb(null, destinoFinal);
        },
        filename: (req, file, cb) => {
            // Cria um nome de arquivo único para evitar conflitos
            const nomeUnico = Date.now() + "-" + Math.round(Math.random() * 1e9)
            cb(null, nomeUnico + path.extname(file.originalname))
        }
    });

    return multer({
        storage: armazenamentoLocal,
        limits: { fileSize: 2 * 1024 * 1024 }, // Limite de 2MB
        fileFilter: (req, file, cb) => {
            const formatos = ["image/jpeg", "image/png"];
            if (!formatos.includes(file.mimetype)) {
                return cb(criarErro("Apenas imagens JPEG e PNG são permitidas", 415))
            }
            cb(null, true);
        }
    });
}
