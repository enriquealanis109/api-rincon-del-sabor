import pkg from "pg";

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// FUNCION AUXILIAR PARA NUESTRAS QUERIES
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log(
    `sql ejecutado: ${text} duracion:${duration} filas:${res.rowCount}`,
  );
  return res;
};
export default pool;
