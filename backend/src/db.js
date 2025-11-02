// Conexão com PostgreSQL usando 'pg' com fallback para 'pg-mem' (memória)
// Comentários simples para alguém do ensino médio entender

require('dotenv').config();
const fs = require('fs');
const path = require('path');

let PoolImpl;
let pool;

const usarMemoria = (process.env.DB_MODO || '').toLowerCase() === 'mem' || !process.env.DATABASE_URL;

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

  console.log('[db] Usando banco em memória (pg-mem)');
} else {
  // Usa Postgres real
  const { Pool } = require('pg');
  PoolImpl = Pool;
  pool = new PoolImpl({ connectionString: process.env.DATABASE_URL });
  console.log('[db] Conectando ao Postgres');
}

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
