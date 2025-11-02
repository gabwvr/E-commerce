// Conexão com PostgreSQL usando 'pg' com fallback para 'pg-mem' (memória)
// Comentários simples para alguém do ensino médio entender

require('dotenv').config();
const fs = require('fs');
const path = require('path');

let PoolImpl;
let pool;

// Estratégia unificada de seleção de banco:
// - DB_MODO = 'pg' força Postgres
// - DB_MODO = 'mem' força memória
// - Sem DB_MODO: usa Postgres se houver DATABASE_URL; senão memória
const dbModoEnv = (process.env.DB_MODO || '').toLowerCase();
const usarMemoria = dbModoEnv === 'mem' || (!dbModoEnv && !process.env.DATABASE_URL);

if (usarMemoria) {
  // Usa banco em memória para desenvolvimento/testes
  const { newDb } = require('pg-mem');
  const mem = newDb({ autoCreateForeignKeyIndices: true });
  const adapter = mem.adapters.createPg();
  PoolImpl = adapter.Pool;
  pool = new PoolImpl();

  // Carrega schema e dados de exemplo
  const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql');
  const sqlSchema = fs.readFileSync(schemaPath, 'utf8');
  mem.public.none(sqlSchema);

  console.log('[db] Modo: memória (pg-mem)');
} else {
  // Usa Postgres real
  const { Pool } = require('pg');
  PoolImpl = Pool;
  pool = new PoolImpl({ connectionString: process.env.DATABASE_URL });
  console.log('[db] Modo: Postgres real');

  // Opcional: garante que o schema esteja carregado no banco real
  // Estratégia: se a tabela produtos não existir ou estiver vazia, carregamos schema.sql
  (async () => {
    try {
      // Verifica existência e contagem
      const res = await pool.query('SELECT COUNT(*)::int AS total FROM produtos');
      const total = res.rows?.[0]?.total ?? 0;
      if (total > 0) {
        console.log('[db] Schema já presente (produtos > 0), não recarregado');
        return;
      }
    } catch (e) {
      // Se a tabela não existir, vamos carregar o schema
    }
    try {
      const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql');
      const sqlSchema = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sqlSchema);
      console.log('[db] Schema.sql carregado no Postgres');
    } catch (e2) {
      console.warn('[db] Falha ao carregar schema.sql (pode já existir):', e2.message);
    }
  })();

  // Postgres selecionado; nenhuma outra instância é iniciada.
}

// Ajuste único pós-inicialização (independente do modo):
// Garante imagem do produto Smartphone
(async () => {
  try {
    const url = 'https://http2.mlstatic.com/D_NQ_NP_2X_673090-MLA96148660299_102025-F.webp';
    await pool.query(
      "UPDATE produtos SET imagem_url = $1 WHERE LOWER(nome) LIKE '%smartphone%' AND (imagem_url IS NULL OR imagem_url <> $1)",
      [url]
    );
    console.log('[db] Imagem do Smartphone ajustada');
  } catch (e) {
    console.warn('[db] Não foi possível ajustar imagem do Smartphone:', e.message);
  }
})();

// Função para consultar o banco
async function consultar(sql, params = []) {
  const resultado = await pool.query(sql, params);
  return resultado.rows;
}

// Função para pegar um cliente e fazer transação
async function comTransacao(callback) {
  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');
    const retorno = await callback(cliente);
    await cliente.query('COMMIT');
    return retorno;
  } catch (erro) {
    await cliente.query('ROLLBACK');
    throw erro;
  } finally {
    cliente.release();
  }
}

module.exports = {
  pool,
  consultar,
  comTransacao,
};
// Inicializa e unifica o acesso ao banco (memória via pg-mem ou PostgreSQL),
// carrega o schema SQL e expõe clientes para uso nas rotas da API.
