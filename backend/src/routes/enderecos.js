// Rotas de endereços do usuário

const express = require('express');
const { consultar } = require('../db');
const autenticar = require('../middleware/autenticacao');

const router = express.Router();

// Lista endereços do usuário autenticado
router.get('/enderecos', autenticar, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const enderecos = await consultar(
      'SELECT id, rua, numero, complemento, bairro, cidade, estado, cep FROM enderecos WHERE usuario_id=$1 ORDER BY id DESC',
      [usuarioId]
    );
    res.json(enderecos);
  } catch (erro) {
    console.error('Erro ao listar endereços:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

module.exports = router;

