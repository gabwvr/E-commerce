// Middleware de autenticação simples usando JWT
// Ele verifica se o token é válido antes de acessar rotas privadas

const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  // Pega token do header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  try {
    const dados = jwt.verify(token, process.env.JWT_SEGREDO);
    // Coloca o id do usuário no request
    req.usuarioId = dados.id;
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido' });
  }
}

module.exports = autenticar;
