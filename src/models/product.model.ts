import pool from "../config/db.js";

export async function getAllProducts(maxPrice?: number, page = 1, limit = 10) {
  let sql = "SELECT * FROM producto WHERE 1=1";
  const values: number[] = [];
  let paramIndex = 1;
  if (maxPrice !== undefined) {
    sql += ` AND precio <= $${paramIndex}`;
    values.push(maxPrice);
    paramIndex++;
  }
  sql += " ORDER BY id";
  const offset = (page - 1) * limit;
  sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  values.push(limit, offset);

  const result = await pool.query(sql, values);
  return result.rows;
}

export async function getProductById(id: number) {
  const result = await pool.query("SELECT * FROM producto WHERE id = $1", [id]);
  return result.rows[0] ?? null;
}
export async function insertProduct(
  name: string,
  description: string,
  price: number,
) {
  const result = await pool.query(
    "INSERT INTO producto (nombre, descripcion, precio) VALUES ($1, $2, $3) RETURNING *",
    [name, description, price],
  );
  return result.rows[0];
}

export async function updateProduct(
  id: number,
  name: string,
  description: string,
  price: number,
) {
  const result = await pool.query(
    "UPDATE producto SET nombre = $1, descripcion = $2, precio = $3 WHERE id = $4 RETURNING *",
    [name, description, price, id],
  );
  return result.rows[0] ?? null;
}
