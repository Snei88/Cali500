import fs from 'node:fs/promises';
import path from 'node:path';
import xlsx from 'xlsx';

const workbookPath = process.argv[2] || 'Base de datos Instrumentos Planeacion.xlsx';
const outputSql = process.argv[3] || 'supabase-instrumentos-seed.sql';
const outputJson = outputSql.replace(/\.sql$/i, '.json');

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

const escapeSql = (value) => {
  if (value === null || value === undefined || value === '') return 'null';
  return `'${String(value).replace(/'/g, "''")}'`;
};

const escapeJsonSql = (value) => `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;

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

const workbook = xlsx.readFile(workbookPath);
const sheetName = workbook.SheetNames[0];
const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

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
    origen: 'excel',
    source_row: index + 2
  };
  const validacion_errores = validationErrorsFor(item);
  return {
    ...item,
    visible: validacion_errores.length === 0,
    validacion_errores
  };
});

const values = records.map((item) => `(
  ${escapeSql(item.nombre)},
  ${escapeSql(item.tipo)},
  ${escapeSql(item.eje)},
  ${escapeSql(item.fecha_inicio)},
  ${escapeSql(item.fecha_fin)},
  ${escapeSql(item.estado)},
  ${escapeSql(item.link)},
  ${escapeSql(item.enlace_web)},
  ${escapeSql(item.documento_url)},
  ${escapeSql(item.observatorio)},
  ${item.visible ? 'true' : 'false'},
  ${escapeJsonSql(item.validacion_errores)},
  ${escapeSql(item.origen)},
  ${Number(item.source_row)}
)`).join(',\n');

const sql = `-- Seed generated from ${path.basename(workbookPath)}
-- Records: ${records.length}

insert into public.instrumentos_planeacion (
  nombre,
  tipo,
  eje,
  fecha_inicio,
  fecha_fin,
  estado,
  link,
  enlace_web,
  documento_url,
  observatorio,
  visible,
  validacion_errores,
  origen,
  source_row
) values
${values}
on conflict do nothing;
`;

await fs.writeFile(outputSql, sql, 'utf8');
await fs.writeFile(outputJson, JSON.stringify(records, null, 2), 'utf8');

console.log(`Generated ${records.length} records`);
console.log(`SQL: ${outputSql}`);
console.log(`JSON: ${outputJson}`);
