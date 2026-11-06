import pool from "../config/db.js";

const SELECT_SALES = `
  SELECT p.id, p.fecha, p.id_cliente AS customer_id, c.nombre AS customer_name
  FROM pedido p
  INNER JOIN cliente c ON c.id = p.id_cliente`;

export async function getAllSales() {
  const result = await pool.query(`${SELECT_SALES} ORDER BY p.id`);
  return result.rows;
}

export async function getSaleById(id: number) {
  const result = await pool.query(`${SELECT_SALES} WHERE p.id = $1`, [id]);
  return result.rows[0] ?? null;
}

export async function insertSale(customerId: number) {
  const result = await pool.query(
    "INSERT INTO pedido (fecha, id_cliente) VALUES (CURRENT_DATE, $1) RETURNING *",
    [customerId],
  );
  return result.rows[0];
}
