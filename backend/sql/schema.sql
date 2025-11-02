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
INSERT INTO categorias (nome) VALUES ('Casa+e+Decoracao') ON CONFLICT (nome) DO NOTHING;
INSERT INTO categorias (nome) VALUES ('Esportes+e+Fitness') ON CONFLICT (nome) DO NOTHING;
INSERT INTO categorias (nome) VALUES ('Beleza+e+Cuidado+Pessoal') ON CONFLICT (nome) DO NOTHING;
INSERT INTO categorias (nome) VALUES ('Celulares+e+Telefones') ON CONFLICT (nome) DO NOTHING;


-- 1. Fone de Ouvido Bluetooth TWS PowerBass (Eletrônicos)
INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
  VALUES ('Fone Bluetooth TWS Estéreo Super Bass', 'Fone sem fio, som de alta fidelidade e bateria de longa duração.', 129.90, 'https://http2.mlstatic.com/D_NQ_NP_2X_970545-MLA95687200698_102025-F.webp', (SELECT id FROM categorias WHERE nome='Eletronicos'));

-- 2. Liquidificador Turbo 12 Velocidades (Casa e Decoração)
INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
  VALUES ('Liquidificador Britânia Turbo 12 Velocidades 1400W', 'Motor potente de 1400W, jarra de 3 Litros, ideal para o dia a dia.', 189.99, 'https://http2.mlstatic.com/D_NQ_NP_2X_833308-MLA95669940458_102025-F.webp', (SELECT id FROM categorias WHERE nome='Casa+e+Decoracao'));

-- 3. Creatina Monohidratada (Esportes e Fitness)
INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
  VALUES ('Creatina Pura Monohidratada Dark Lab 300g', 'Suplemento para ganho de força e massa muscular, 100% pura.', 84.50, 'https://http2.mlstatic.com/D_NQ_NP_2X_801659-MLA96149847803_102025-F.webp', (SELECT id FROM categorias WHERE nome='Esportes+e+Fitness'));

-- 4. Smartphone Intermediário (Celulares e Telefones)
INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
  VALUES ('Smartphone Samsung Galaxy A15 5G 128GB Tela 6.5', 'Aparelho Dual SIM, câmera tripla de 50MP e bateria de 5000mAh.', 999.00, 'https://http2.mlstatic.com/D_NQ_NP_2X_673090-MLA96148660299_102025-F.webp', (SELECT id FROM categorias WHERE nome='Celulares+e+Telefones'));

-- 5. Kit de Ferramentas (Casa e Decoração)
INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
  VALUES ('Kit de Ferramentas Completo TBT129 129 Peças', 'Maleta de ferramentas para uso doméstico e profissional, com chaves, alicates, etc.', 159.90, 'https://http2.mlstatic.com/D_NQ_NP_2X_729549-MLB81968961626_022025-F-kit-de-ferramentas-com-129-pecas-com-alicate-sparta.webp', (SELECT id FROM categorias WHERE nome='Casa+e+Decoracao'));

-- 6. Smartwatch (Eletrônicos)
INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
  VALUES ('Smartwatch X Pro Série 10 ChatGPT GPS NFC', 'Relógio inteligente com monitor de saúde, GPS e conexão NFC.', 299.90, 'https://http2.mlstatic.com/D_NQ_NP_2X_755216-MLA95968394955_102025-F.webp', (SELECT id FROM categorias WHERE nome='Eletronicos'));

-- 7. Barbeador Elétrico (Beleza e Cuidado Pessoal)
INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
  VALUES ('Barbeador Elétrico Tomate Multifuncional Recarregável', 'Aparador e barbeador com lâminas de precisão, à prova d''água e uso sem fio.', 79.99, 'https://http2.mlstatic.com/D_NQ_NP_2X_657564-MLA96150883249_102025-F.webp', (SELECT id FROM categorias WHERE nome='Beleza+e+Cuidado+Pessoal'));

-- 8. Tênis de Corrida (Esportes e Fitness)
INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
  VALUES ('Tênis de Corrida Olympikus Leve Flow Masculino', 'Calçado esportivo com amortecimento responsivo e design leve, ideal para treinos.', 199.90, 'https://http2.mlstatic.com/D_NQ_NP_2X_748077-MLB90174417508_082025-F-tnis-major-olimp-masculino-espotivo-academia-promoco.webp', (SELECT id FROM categorias WHERE nome='Esportes+e+Fitness'));

-- 9. Luminária LED (Casa e Decoração)
INSERT INTO produtos (nome, descricao, preco, imagem_url, categoria_id)
  VALUES ('Luminária de Mesa Flexível LED Touch Recarregável', 'Luminária com 3 tons de luz, touch e haste flexível, com carregamento USB.', 49.90, 'https://http2.mlstatic.com/D_NQ_NP_2X_679554-MLA95521656042_102025-F.webp', (SELECT id FROM categorias WHERE nome='Casa+e+Decoracao'))
-- Define a estrutura do banco: tabelas de categorias, produtos, carrinho, pedidos
-- e relacionamentos necessários para o e-commerce.
