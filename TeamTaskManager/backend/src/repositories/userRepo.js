function createUserRepository(db) {
  return {
    async findByEmail(email) {
      const result = await db.query('SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    },

    async findById(id) {
      const result = await db.query('SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    },

    async findManyByIds(ids) {
      if (!ids.length) {
        return [];
      }

      const result = await db.query(
        'SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE id = ANY($1::bigint[])',
        [ids]
      );

      return result.rows;
    },

    async createUser({ name, email, passwordHash, role }) {
      const result = await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at',
        [name, email, passwordHash, role]
      );

      return result.rows[0];
    }
  };
}

module.exports = { createUserRepository };
