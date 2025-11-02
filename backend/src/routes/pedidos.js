// Rotas de pedidos (finalizar compra e obter resumo)

const express = require('express');
const { consultar, comTransacao } = require('../db');
const autenticar = require('../middleware/autenticacao');

const router = express.Router();

// Finaliza compra: cria pedido a partir dos itens do carrinho
router.post('/pedidos/finalizar', autenticar, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { endereco_id } = req.body; // permite escolher endereço salvo

    // Busca itens do carrinho
    const itens = await consultar(
      `SELECT ci.id, ci.quantidade, p.id AS produto_id, p.nome, p.preco
       FROM carrinho_itens ci
       JOIN produtos p ON p.id = ci.produto_id
       WHERE ci.usuario_id = $1`,
      [usuarioId]
    );

    if (itens.length === 0) {
      return res.status(400).json({ mensagem: 'Carrinho vazio' });
    }

    const total = itens.reduce((acc, cur) => acc + Number(cur.preco) * cur.quantidade, 0);

    const pedidoCriado = await comTransacao(async (cliente) => {
      // Cria pedido
      const pedido = await cliente.query(
        'INSERT INTO pedidos (usuario_id, endereco_id, total) VALUES ($1, $2, $3) RETURNING id, total, criado_em',
        [usuarioId, endereco_id || null, total]
      );
      const pedidoId = pedido.rows[0].id;

      // Cria itens do pedido
      for (const it of itens) {
        const subtotal = Number(it.preco) * it.quantidade;
        await cliente.query(
          'INSERT INTO itens_pedido (pedido_id, produto_id, nome, preco, quantidade, subtotal) VALUES ($1,$2,$3,$4,$5,$6)',
          [pedidoId, it.produto_id, it.nome, it.preco, it.quantidade, subtotal]
        );
      }

      // Limpa carrinho
      await cliente.query('DELETE FROM carrinho_itens WHERE usuario_id=$1', [usuarioId]);

      return pedido.rows[0];
    });

    // Busca endereço e itens para resumo
    const endereco = endereco_id
      ? (await consultar('SELECT * FROM enderecos WHERE id=$1 AND usuario_id=$2', [endereco_id, usuarioId]))[0] || null
      : null;
    const itensPedido = await consultar(
      'SELECT produto_id, nome, preco, quantidade, subtotal FROM itens_pedido WHERE pedido_id=$1',
      [pedidoCriado.id]
    );

    res.status(201).json({
      mensagem: 'Compra finalizada',
      pedido: {
        numero: pedidoCriado.id,
        total: Number(pedidoCriado.total),
        criado_em: pedidoCriado.criado_em,
        endereco,
        itens: itensPedido.map((i) => ({
          produto_id: i.produto_id,
          nome: i.nome,
          preco: Number(i.preco),
          quantidade: i.quantidade,
          subtotal: Number(i.subtotal),
        })),
      },
    });
  } catch (erro) {
    console.error('Erro ao finalizar pedido:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

// Obter resumo do pedido por id
router.get('/pedidos/:id', autenticar, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { id } = req.params;

    const pedidos = await consultar('SELECT * FROM pedidos WHERE id=$1 AND usuario_id=$2', [id, usuarioId]);
    if (pedidos.length === 0) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }
    const pedido = pedidos[0];
    const itens = await consultar('SELECT produto_id, nome, preco, quantidade, subtotal FROM itens_pedido WHERE pedido_id=$1', [id]);
    const endereco = pedido.endereco_id
      ? (await consultar('SELECT * FROM enderecos WHERE id=$1', [pedido.endereco_id]))[0]
      : null;

    res.json({
      numero: pedido.id,
      total: Number(pedido.total),
      criado_em: pedido.criado_em,
      endereco,
      itens: itens.map((i) => ({
        produto_id: i.produto_id,
        nome: i.nome,
        preco: Number(i.preco),
        quantidade: i.quantidade,
        subtotal: Number(i.subtotal),
      })),
    });
  } catch (erro) {
    console.error('Erro ao obter pedido:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

module.exports = router;
