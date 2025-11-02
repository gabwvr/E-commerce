// Rotas de autenticação: cadastro e login
// Usamos bcrypt para guardar senhas com segurança e JWT para autenticar

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { consultar, comTransacao } = require('../db');

const router = express.Router();

// Cadastro de usuário com endereço
router.post('/cadastrar', async (req, res) => {
  try {
    const { nome, email, senha, telefone, endereco } = req.body;

    if (!nome || !email || !senha || !endereco) {
      return res.status(400).json({ mensagem: 'Dados obrigatórios faltando' });
    }

    // Verifica se já existe email
    const existente = await consultar('SELECT id FROM usuarios WHERE email=$1', [email]);
    if (existente.length > 0) {
      return res.status(409).json({ mensagem: 'E-mail já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    // Transação: cria usuário e endereço
    const resultado = await comTransacao(async (cliente) => {
      const usuario = await cliente.query(
        'INSERT INTO usuarios (nome, email, senha_hash, telefone) VALUES ($1, $2, $3, $4) RETURNING id, nome, email',
        [nome, email, senhaHash, telefone || null]
      );

      const usuarioId = usuario.rows[0].id;
      await cliente.query(
        'INSERT INTO enderecos (usuario_id, rua, numero, complemento, bairro, cidade, estado, cep) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [
          usuarioId,
          endereco.rua,
          endereco.numero,
          endereco.complemento || null,
          endereco.bairro,
          endereco.cidade,
          endereco.estado,
          endereco.cep,
        ]
      );

      return usuario.rows[0];
    });

    return res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario: resultado });
  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Informe e-mail e senha' });
    }

    const usuarios = await consultar('SELECT id, nome, email, senha_hash FROM usuarios WHERE email=$1', [email]);
    if (usuarios.length === 0) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const usuario = usuarios[0];
    const confere = await bcrypt.compare(senha, usuario.senha_hash);
    if (!confere) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SEGREDO, { expiresIn: '7d' });
    return res.json({ mensagem: 'Login ok', token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch (erro) {
    console.error('Erro no login:', erro);
    return res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

module.exports = router;
