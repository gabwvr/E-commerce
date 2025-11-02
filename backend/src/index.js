// API RESTful para Ecommerce Online
// Feito com Express + PostgreSQL
// Comentários simples em português para fácil entendimento

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const produtosRoutes = require('./routes/produtos');
const carrinhoRoutes = require('./routes/carrinho');
const pedidosRoutes = require('./routes/pedidos');
const enderecosRoutes = require('./routes/enderecos');

const app = express();

// Permite JSON no body
app.use(express.json());

// Configuração de CORS para permitir web e mobile consumirem a mesma API
const origensPermitidas = [process.env.ORIGEM_WEB, process.env.ORIGEM_MOBILE].filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origensPermitidas.length === 0) return callback(null, true);
      if (origensPermitidas.includes(origin)) return callback(null, true);
      return callback(new Error('Origem não permitida pelo CORS'));
    },
    credentials: true,
  })
);

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', produtosRoutes);
app.use('/api', carrinhoRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', enderecosRoutes);

// Rota simples para teste
app.get('/api/saude', (req, res) => {
  res.json({ status: 'ok', mensagem: 'API funcionando' });
});

const porta = process.env.PORTA || 3000;
app.listen(porta, () => {
  console.log(`API ouvindo na porta ${porta}`);
});
