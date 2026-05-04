const { getPool } = require('../src/db/pool');
const { loadEnv } = require('../src/config/env');
const { hashPassword } = require('../src/utils/password');
const fs = require('fs');
const path = require('path');

async function run() {
  const env = loadEnv();
  const pool = getPool();
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  await pool.query(schema);

  const adminPasswordHash = await hashPassword(env.ADMIN_SEED_PASSWORD);
  const memberPasswordHash = await hashPassword(env.MEMBER_SEED_PASSWORD);

  const adminResult = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email)
     DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, updated_at = NOW()
     RETURNING id`,
    ['Team Admin', env.ADMIN_SEED_EMAIL.toLowerCase(), adminPasswordHash]
  );

  const memberResult = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'member')
     ON CONFLICT (email)
     DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, updated_at = NOW()
     RETURNING id`,
    ['Team Member', env.MEMBER_SEED_EMAIL.toLowerCase(), memberPasswordHash]
  );

  const adminId = adminResult.rows[0].id;
  const memberId = memberResult.rows[0].id;

  const projectResult = await pool.query(
    `INSERT INTO projects (name, created_by)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING id`,
    ['Launch Website', adminId]
  );

  let projectId = projectResult.rows[0]?.id;
  if (!projectId) {
    const existingProject = await pool.query('SELECT id FROM projects WHERE name = $1 ORDER BY id ASC LIMIT 1', ['Launch Website']);
    projectId = existingProject.rows[0].id;
  }

  await pool.query(
    'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [projectId, adminId]
  );
  await pool.query(
    'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [projectId, memberId]
  );

  await pool.query(
    `INSERT INTO tasks (title, description, status, assigned_to, project_id, created_by, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT DO NOTHING`,
    ['Prepare release checklist', 'Confirm deployment, QA, and go-live tasks.', 'IN_PROGRESS', memberId, projectId, adminId, '2026-06-01']
  );

  await pool.query(
    `INSERT INTO tasks (title, description, status, assigned_to, project_id, created_by, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT DO NOTHING`,
    ['Review access model', 'Verify admin/member permissions on the dashboard.', 'TODO', memberId, projectId, adminId, '2026-05-15']
  );

  await pool.end();
  console.log('Seed data applied');
  console.log(`Admin: ${env.ADMIN_SEED_EMAIL} / ${env.ADMIN_SEED_PASSWORD}`);
  console.log(`Member: ${env.MEMBER_SEED_EMAIL} / ${env.MEMBER_SEED_PASSWORD}`);
}

run().catch((error) => {
  console.error('Seeding failed');
  console.error(error);
  process.exit(1);
});
