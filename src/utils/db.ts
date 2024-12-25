import { Pool, QueryResult } from '@neondatabase/serverless'
// import { after } from 'next/server'

function createPool() : Pool {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log('db connected');
  pool.on('error', (err) => {
    console.error('Unexpected server error', err.stack);
  });

  return pool;
}

export const pool = createPool();