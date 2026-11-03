import pool from "../config/db.js";

export async function getAllProducts() {
  const result = await pool.query("SELECT * FROM producto ORDER BY id");
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
