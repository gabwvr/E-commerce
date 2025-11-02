// Rotas de catálogo de produtos e categorias

const express = require('express');
const { consultar } = require('../db');

const router = express.Router();

// Lista categorias (para filtro)
router.get('/categorias', async (req, res) => {
  try {
    const categorias = await consultar('SELECT id, nome FROM categorias ORDER BY nome');
    res.json(categorias);
  } catch (erro) {
    console.error('Erro ao listar categorias:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

// Lista produtos, com filtro opcional por categoria_id
router.get('/produtos', async (req, res) => {
  try {
    const { categoria_id } = req.query;
    let sql = 'SELECT id, nome, descricao, preco, imagem_url, categoria_id FROM produtos WHERE ativo = TRUE';
    const params = [];

    if (categoria_id) {
      sql += ' AND categoria_id = $1';
      params.push(categoria_id);
    }

    sql += ' ORDER BY id DESC';
    const produtos = await consultar(sql, params);
    res.json(produtos);
  } catch (erro) {
    console.error('Erro ao listar produtos:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

module.exports = router;
