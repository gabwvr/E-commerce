// Rotas do carrinho de compras
// Requer usuário autenticado (usa middleware)

const express = require('express');
const { consultar, comTransacao } = require('../db');
const autenticar = require('../middleware/autenticacao');

const router = express.Router();

// Lista itens do carrinho do usuário autenticado
router.get('/carrinho', autenticar, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const itens = await consultar(
      `SELECT ci.id, ci.quantidade, p.id AS produto_id, p.nome, p.preco, p.imagem_url
       FROM carrinho_itens ci
       JOIN produtos p ON p.id = ci.produto_id
       WHERE ci.usuario_id = $1`,
      [usuarioId]
    );

    // Calcula subtotal/total
    const itensComSubtotal = itens.map((i) => ({
      id: i.id,
      produto_id: i.produto_id,
      nome: i.nome,
      preco: Number(i.preco),
      imagem_url: i.imagem_url,
      quantidade: i.quantidade,
      subtotal: Number(i.preco) * i.quantidade,
    }));
    const total = itensComSubtotal.reduce((acc, cur) => acc + cur.subtotal, 0);

    res.json({ itens: itensComSubtotal, total });
  } catch (erro) {
    console.error('Erro ao listar carrinho:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

// Adiciona item ao carrinho
router.post('/carrinho/adicionar', autenticar, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { produto_id, quantidade } = req.body;
    if (!produto_id || !quantidade || quantidade <= 0) {
      return res.status(400).json({ mensagem: 'Dados inválidos' });
    }

    await comTransacao(async (cliente) => {
      // Se já existe item para esse produto, só atualiza a quantidade
      const existente = await cliente.query(
        'SELECT id, quantidade FROM carrinho_itens WHERE usuario_id=$1 AND produto_id=$2',
        [usuarioId, produto_id]
      );
      if (existente.rows.length > 0) {
        const novoQtd = existente.rows[0].quantidade + quantidade;
        await cliente.query('UPDATE carrinho_itens SET quantidade=$1 WHERE id=$2', [novoQtd, existente.rows[0].id]);
      } else {
        await cliente.query(
          'INSERT INTO carrinho_itens (usuario_id, produto_id, quantidade) VALUES ($1,$2,$3)',
          [usuarioId, produto_id, quantidade]
        );
      }
    });

    res.status(201).json({ mensagem: 'Item adicionado ao carrinho' });
  } catch (erro) {
    console.error('Erro ao adicionar no carrinho:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

// Atualiza quantidade de um item específico
router.put('/carrinho/item/:id', autenticar, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { id } = req.params;
    const { quantidade } = req.body;
    if (!quantidade || quantidade <= 0) {
      return res.status(400).json({ mensagem: 'Quantidade inválida' });
    }

    await comTransacao(async (cliente) => {
      await cliente.query(
        'UPDATE carrinho_itens SET quantidade=$1 WHERE id=$2 AND usuario_id=$3',
        [quantidade, id, usuarioId]
      );
    });

    res.json({ mensagem: 'Quantidade atualizada' });
  } catch (erro) {
    console.error('Erro ao atualizar item:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

// Remove item do carrinho
router.delete('/carrinho/item/:id', autenticar, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { id } = req.params;
    await comTransacao(async (cliente) => {
      await cliente.query('DELETE FROM carrinho_itens WHERE id=$1 AND usuario_id=$2', [id, usuarioId]);
    });
    res.json({ mensagem: 'Item removido' });
  } catch (erro) {
    console.error('Erro ao remover item:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

module.exports = router;
