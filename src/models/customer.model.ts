import pool from "../config/db.js";

export async function getAllCustomers() {
  const result = await pool.query("SELECT * FROM cliente ORDER BY id");
  return result.rows;
}

export async function getCustomerById(id: number) {
  const result = await pool.query("SELECT * FROM cliente WHERE id = $1", [id]);
  return result.rows[0] ?? null;
}

export async function insertCustomer(
  name: string,
  email: string,
  phone: string,
) {
  const result = await pool.query(
    "INSERT INTO cliente (nombre, correo, telefono) VALUES ($1, $2, $3) RETURNING *",
    [name, email, phone],
  );
  return result.rows[0];
}

export async function updateCustomer(
  id: number,
  name: string,
  email: string,
  phone: string,
) {
  const result = await pool.query(
    "UPDATE cliente SET nombre = $1, correo = $2, telefono = $3 WHERE id = $4 RETURNING *",
    [name, email, phone, id],
  );
  return result.rows[0] ?? null;
}
