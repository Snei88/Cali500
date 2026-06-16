import crypto from 'node:crypto';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env.local' });
dotenv.config();

const { Pool } = pg;
const [, , emailArg, passwordArg, nameArg] = process.argv;

if (!emailArg || !passwordArg) {
  console.error('Uso: npm run user:create -- correo@dominio.com "ContrasenaSegura" "Nombre opcional"');
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL || 'postgres://cali500:cali500_dev@localhost:15432/cali500';
const pool = new Pool({ connectionString: databaseUrl });

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
};

try {
  const email = String(emailArg).trim().toLowerCase();
  const passwordHash = hashPassword(String(passwordArg));
  const nombre = String(nameArg || 'Administrador').trim();

  await pool.query(`
    insert into admin_users (email, password_hash, nombre)
    values ($1, $2, $3)
    on conflict (email)
    do update set password_hash = excluded.password_hash,
                  nombre = excluded.nombre,
                  activo = true
  `, [email, passwordHash, nombre]);

  console.log(`Usuario admin listo: ${email}`);
} finally {
  await pool.end();
}
