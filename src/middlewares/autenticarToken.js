import jwt from "jsonwebtoken"
let chaveSecreta = process.env.CHAVE_SECRETA

export default async function autenticarToken(req, res, next) {
  const headerAut = req.headers['authorization'];

  const token = headerAut && headerAut.split(' ')[1];

  if (!token) return res.status(403).json({ erro: 'Token não fornecido' });

  jwt.verify(token, chaveSecreta, (err, decoded) => {
    if (err) return res.status(401).json({ erro: 'Token inválido' });
  
    req.usuario = decoded;
    next()
  })
}