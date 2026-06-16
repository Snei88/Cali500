import fs from 'node:fs/promises';
import pg from 'pg';

const { Pool } = pg;
const sourceUrl = process.env.DATABASE_URL || 'postgres://cali500:cali500_dev@localhost:15432/cali500';
const pool = new Pool({ connectionString: sourceUrl });

const sqlString = (value) => {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'number') return String(value);
  if (value instanceof Date) {
    return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
  }
  return `'${String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "''")
    .replace(/\r?\n/g, '\\n')}'`;
};

const jsonString = (value) => sqlString(JSON.stringify(value ?? []));

const admins = (await pool.query(`
  select id, email, password_hash, nombre, activo, fecha_creacion
  from admin_users
  order by id
`)).rows;

const instruments = (await pool.query(`
  select id, nombre, tipo, eje, fecha_inicio, fecha_fin, estado, link, enlace_web,
         documento_url, observatorio, visible, validacion_errores, origen, source_row,
         fecha_creacion, fecha_actualizacion
  from instrumentos_planeacion
  order by id
`)).rows;

let sql = `SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS = 0;\n\nDROP TABLE IF EXISTS instrumentos_planeacion;\nDROP TABLE IF EXISTS admin_users;\n\nCREATE TABLE admin_users (\n  id INT NOT NULL AUTO_INCREMENT,\n  email VARCHAR(255) NOT NULL,\n  password_hash TEXT NOT NULL,\n  nombre VARCHAR(255) NOT NULL DEFAULT 'Administrador',\n  activo TINYINT(1) NOT NULL DEFAULT 1,\n  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (id),\n  UNIQUE KEY admin_users_email_key (email)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\nCREATE TABLE instrumentos_planeacion (\n  id INT NOT NULL AUTO_INCREMENT,\n  nombre TEXT NOT NULL,\n  tipo VARCHAR(255) NOT NULL DEFAULT '',\n  eje VARCHAR(255) NOT NULL DEFAULT '',\n  fecha_inicio VARCHAR(50) NOT NULL DEFAULT '',\n  fecha_fin VARCHAR(50) NOT NULL DEFAULT '',\n  estado VARCHAR(255) NOT NULL DEFAULT '',\n  link TEXT NOT NULL,\n  enlace_web TEXT NOT NULL,\n  documento_url TEXT NOT NULL,\n  observatorio TEXT NOT NULL,\n  visible TINYINT(1) NOT NULL DEFAULT 0,\n  validacion_errores JSON NOT NULL,\n  origen VARCHAR(255) NOT NULL DEFAULT 'admin',\n  source_row INT NULL,\n  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (id),\n  KEY instrumentos_visible_idx (visible),\n  KEY instrumentos_fecha_actualizacion_idx (fecha_actualizacion)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

for (const user of admins) {
  sql += `INSERT INTO admin_users (id, email, password_hash, nombre, activo, fecha_creacion) VALUES (${sqlString(user.id)}, ${sqlString(user.email)}, ${sqlString(user.password_hash)}, ${sqlString(user.nombre)}, ${sqlString(user.activo)}, ${sqlString(user.fecha_creacion)});\n`;
}

sql += '\n';

for (const item of instruments) {
  sql += `INSERT INTO instrumentos_planeacion (id, nombre, tipo, eje, fecha_inicio, fecha_fin, estado, link, enlace_web, documento_url, observatorio, visible, validacion_errores, origen, source_row, fecha_creacion, fecha_actualizacion) VALUES (${sqlString(item.id)}, ${sqlString(item.nombre)}, ${sqlString(item.tipo)}, ${sqlString(item.eje)}, ${sqlString(item.fecha_inicio)}, ${sqlString(item.fecha_fin)}, ${sqlString(item.estado)}, ${sqlString(item.link)}, ${sqlString(item.enlace_web)}, ${sqlString(item.documento_url)}, ${sqlString(item.observatorio)}, ${sqlString(item.visible)}, ${jsonString(item.validacion_errores)}, ${sqlString(item.origen)}, ${sqlString(item.source_row)}, ${sqlString(item.fecha_creacion)}, ${sqlString(item.fecha_actualizacion)});\n`;
}

sql += '\nSET FOREIGN_KEY_CHECKS = 1;\n';

await fs.mkdir('deploy', { recursive: true });
await fs.writeFile('deploy/cali500-mariadb-phpmyadmin.sql', sql, 'utf8');
await pool.end();

console.log(JSON.stringify({
  file: 'deploy/cali500-mariadb-phpmyadmin.sql',
  adminUsers: admins.length,
  instruments: instruments.length
}, null, 2));
