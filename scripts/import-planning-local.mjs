import xlsx from 'xlsx';
import dotenv from 'dotenv';
import pg from 'pg';
import { spawnSync } from 'node:child_process';

dotenv.config({ path: '.env.local' });
dotenv.config();

const { Pool } = pg;
const workbookPath = process.argv[2] || 'Base de datos Instrumentos Planeacion.xlsx';
const sheetNameArg = process.argv[3];
const databaseUrl = process.env.DATABASE_URL || 'postgres://cali500:cali500_dev@localhost:15432/cali500';
const origin = 'excel:hoja-1';

const REQUIRED_FIELDS = [
  'nombre',
  'tipo',
  'eje',
  'fecha_inicio',
  'fecha_fin',
  'estado',
  'link',
  'enlace_web'
];

const hiddenStates = new Set(['borrador', 'oculto', 'inactivo', 'archivado', 'vencido']);
const normalize = (value) => String(value ?? '').trim();

const validationErrorsFor = (item) => {
  const errors = [];
  for (const field of REQUIRED_FIELDS) {
    if (!normalize(item[field])) errors.push(`El campo ${field.replace('_', ' ')} es obligatorio.`);
  }
  if (hiddenStates.has(normalize(item.estado).toLowerCase())) {
    errors.push('El estado actual no es valido para publicacion.');
  }
  return errors;
};

const ensurePostgres = async () => {
  const pool = new Pool({ connectionString: databaseUrl, connectionTimeoutMillis: 1500 });
  try {
    await pool.query('select 1');
    return;
  } catch {
    spawnSync('docker', ['compose', 'up', '-d', 'postgres'], { stdio: 'inherit' });
  } finally {
    await pool.end().catch(() => {});
  }
};

await ensurePostgres();

const workbook = xlsx.readFile(workbookPath);
const sheetName = sheetNameArg || workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
if (!sheet) throw new Error(`No existe la hoja "${sheetName}". Hojas disponibles: ${workbook.SheetNames.join(', ')}`);

const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
const records = rows.map((row, index) => {
  const item = {
    nombre: normalize(row.Nombre),
    tipo: normalize(row.Tipo),
    eje: normalize(row.Eje),
    fecha_inicio: normalize(row.Inicio),
    fecha_fin: normalize(row.Fin),
    estado: normalize(row.Estado),
    link: normalize(row.Link),
    enlace_web: normalize(row['Enlace Web']),
    documento_url: '',
    observatorio: normalize(row.Observatorio),
    origen: origin,
    source_row: index + 2
  };
  const validacion_errores = validationErrorsFor(item);
  return {
    ...item,
    visible: validacion_errores.length === 0,
    validacion_errores
  };
});

const pool = new Pool({ connectionString: databaseUrl });

try {
  await pool.query('begin');
  await pool.query('delete from instrumentos_planeacion where origen = $1', [origin]);
  await pool.query('delete from instrumentos_planeacion where origen = $1', ['admin-test']);

  for (const item of records) {
    await pool.query(`
      insert into instrumentos_planeacion (
        nombre, tipo, eje, fecha_inicio, fecha_fin, estado, link, enlace_web,
        documento_url, observatorio, visible, validacion_errores, origen, source_row
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14)
    `, [
      item.nombre,
      item.tipo,
      item.eje,
      item.fecha_inicio,
      item.fecha_fin,
      item.estado,
      item.link,
      item.enlace_web,
      item.documento_url,
      item.observatorio,
      item.visible,
      JSON.stringify(item.validacion_errores),
      item.origen,
      item.source_row
    ]);
  }

  await pool.query('commit');

  const visible = records.filter((item) => item.visible).length;
  const invalid = records.length - visible;
  const tipos = [...new Set(records.map((item) => item.tipo))].filter(Boolean).sort();
  const ejes = [...new Set(records.map((item) => item.eje))].filter(Boolean).sort();

  console.log(JSON.stringify({
    sheetName,
    total: records.length,
    visible,
    hiddenOrPending: invalid,
    tipos,
    ejes
  }, null, 2));
} catch (error) {
  await pool.query('rollback');
  throw error;
} finally {
  await pool.end();
}
