import pool from "./pool.js";

export async function getUserByEmail(email) {
  const query = `SELECT first_name AS "firstName", last_name AS "lastName", email, password, role FROM users WHERE email = $1`;

  const { rows } = await pool.query(query, [email]);
  return rows[0];
}

export async function getUserById(id) {
  const query = `SELECT first_name AS "firstName", last_name AS "lastName", email, password, role FROM users WHERE id = $1`;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

export async function insertUser(fistName, lastName, email, password) {
  const query = `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)`;

  await pool.query(query, [fistName, lastName, email, password]);
}

export async function updateUserRole(userId, role) {
  const query = `UPDATE users SET role = $2 WHERE id = $1`;

  await pool.query(query, [userId, role]);
}
