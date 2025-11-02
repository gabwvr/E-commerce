// API RESTful para Ecommerce Online
// Feito com Express + PostgreSQL
// Comentários simples em português para fácil entendimento

const express = require('express');
const path = require('path');
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

// Servir SPA Angular do diretório dist pelo mesmo servidor
const staticDir = path.resolve(__dirname, '..', '..', 'web', 'dist', 'ecommerceonline-web');
app.use(express.static(staticDir));

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

// Fallback para SPA: qualquer rota não-API retorna index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ mensagem: 'Rota API não encontrada' });
  }
  return res.sendFile(path.join(staticDir, 'index.html'));
});

const porta = process.env.PORTA || 3000;
app.listen(porta, () => {
  console.log(`API ouvindo na porta ${porta}`);
});
// Configura o servidor Express, serve o build do frontend (SPA) e
// registra as rotas da API para categorias, produtos, carrinho e pedidos.
