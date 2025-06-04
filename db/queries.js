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

export async function getAllPosts() {
  const query = `SELECT p.id, p.title, p.content, p.created_at AS "createdAt",
    json_build_object('firstName', u.first_name, 'lastName', u.last_name)
    AS creator FROM posts p JOIN users u ON p.creator_id = u.id
    ORDER BY p.created_at DESC`;

  const { rows } = await pool.query(query);
  return rows;
}

export async function insertPost(creatorId, title, content) {
  const query = `INSERT INTO posts (creator_id, title, content)
    VALUES ($1, $2, $3)`;

  await pool.query(query, [creatorId, title, content]);
}

export async function deletePost(postId) {
  const query = `DELETE FROM posts WHERE id = $1`;

  await pool.query(query, [postId]);
}
