-- Schema SQL para o ecommerce online
-- Comentários simples para que um estudante do 3º ano entenda

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  senha_hash VARCHAR(200) NOT NULL,
  telefone VARCHAR(20),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Endereço do usuário (um usuário pode ter 1 endereço principal)
CREATE TABLE IF NOT EXISTS enderecos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  rua VARCHAR(160) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  complemento VARCHAR(100),
  bairro VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(10) NOT NULL
);

-- Categorias de produtos (ex: Eletrônicos, Roupas)
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
);

-- Produtos
CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(160) NOT NULL,
  descricao TEXT,
  preco NUMERIC(12,2) NOT NULL,
  imagem_url TEXT,
  categoria_id INTEGER REFERENCES categorias(id),
  ativo BOOLEAN DEFAULT TRUE
);

-- Itens do carrinho, ligados ao usuário
CREATE TABLE IF NOT EXISTS carrinho_itens (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  produto_id INTEGER NOT NULL REFERENCES produtos(id),
  quantidade INTEGER NOT NULL CHECK (quantidade > 0)
);

-- Pedido (nota fiscal/resumo)
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  endereco_id INTEGER REFERENCES enderecos(id),
  total NUMERIC(12,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Itens do pedido (snapshot dos produtos na hora da compra)
CREATE TABLE IF NOT EXISTS itens_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id INTEGER NOT NULL REFERENCES produtos(id),
  nome VARCHAR(160) NOT NULL,
  preco NUMERIC(12,2) NOT NULL,
  quantidade INTEGER NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL
);

-- Dados de exemplo para iniciar
INSERT INTO categorias (nome) VALUES ('Eletronicos') ON CONFLICT (nome) DO NOTHING;
INSERT INTO categorias (nome) VALUES ('Roupas') ON CONFLICT (nome) DO NOTHING;
INSERT INTO categorias (nome) VALUES ('Livros') ON CONFLICT (nome) DO NOTHING;

INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
  VALUES ('Fone Bluetooth', 'Fone sem fio com boa qualidade', 199.90, 'https://via.placeholder.com/300x200?text=Fone', (SELECT id FROM categorias WHERE nome='Eletronicos'));

INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
  VALUES ('Camisa Polo', 'Camisa polo confortável', 89.90, 'https://via.placeholder.com/300x200?text=Camisa', (SELECT id FROM categorias WHERE nome='Roupas'));

INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
  VALUES ('Livro de Programacao', 'Aprenda a programar', 59.90, 'https://via.placeholder.com/300x200?text=Livro', (SELECT id FROM categorias WHERE nome='Livros'));
