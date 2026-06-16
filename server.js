import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import pg from 'pg';

dotenv.config({ path: '.env.local' });
dotenv.config();

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8080);
const databaseUrl = process.env.DATABASE_URL || 'postgres://cali500:cali500_dev@localhost:15432/cali500';
const jwtSecret = process.env.JWT_SECRET || 'cali500-local-dev-secret';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@cali500.com.co';
const adminPassword = process.env.ADMIN_PASSWORD || 'Cali500.Admin.2026';
const uploadDir = path.join(__dirname, 'uploads');

const app = express();
const pool = new Pool({ connectionString: databaseUrl });
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(uploadDir));

const normalizeText = (value) => String(value ?? '').trim();

const requiredPlanningFields = [
  'nombre',
  'tipo',
  'eje',
  'fecha_inicio',
  'fecha_fin',
  'estado',
  'link',
  'enlace_web'
];

const getPlanningValidationErrors = (instrumento) => {
  const errors = [];
  requiredPlanningFields.forEach((field) => {
    if (!normalizeText(instrumento[field])) errors.push(`El campo ${field.replace('_', ' ')} es obligatorio.`);
  });

  const hiddenStates = ['borrador', 'oculto', 'inactivo', 'archivado', 'vencido'];
  if (hiddenStates.includes(normalizeText(instrumento.estado).toLowerCase())) {
    errors.push('El estado actual no es valido para publicacion.');
  }

  return errors;
};

const serializePlanningInstrument = (instrumento) => {
  const validationErrors = getPlanningValidationErrors(instrumento);
  return {
    nombre: normalizeText(instrumento.nombre),
    tipo: normalizeText(instrumento.tipo),
    eje: normalizeText(instrumento.eje),
    fecha_inicio: normalizeText(instrumento.fecha_inicio),
    fecha_fin: normalizeText(instrumento.fecha_fin),
    estado: normalizeText(instrumento.estado),
    link: normalizeText(instrumento.link),
    enlace_web: normalizeText(instrumento.enlace_web),
    documento_url: normalizeText(instrumento.documento_url),
    observatorio: normalizeText(instrumento.observatorio),
    visible: Boolean(instrumento.visible) && validationErrors.length === 0,
    validacion_errores: validationErrors,
    origen: normalizeText(instrumento.origen || 'admin'),
    source_row: instrumento.source_row ? Number(instrumento.source_row) : null
  };
};

const normalizePlanningInstrument = (row) => ({
  id: row.id,
  nombre: row.nombre ?? '',
  tipo: row.tipo ?? '',
  eje: row.eje ?? '',
  fecha_inicio: row.fecha_inicio ?? '',
  fecha_fin: row.fecha_fin ?? '',
  estado: row.estado ?? '',
  link: row.link ?? '',
  enlace_web: row.enlace_web ?? '',
  documento_url: row.documento_url ?? '',
  observatorio: row.observatorio ?? '',
  visible: Boolean(row.visible),
  validacion_errores: Array.isArray(row.validacion_errores) ? row.validacion_errores : [],
  origen: row.origen ?? '',
  source_row: row.source_row ?? undefined,
  fecha_creacion: row.fecha_creacion instanceof Date ? row.fecha_creacion.toISOString() : row.fecha_creacion,
  fecha_actualizacion: row.fecha_actualizacion instanceof Date ? row.fecha_actualizacion.toISOString() : row.fecha_actualizacion
});

const mapPlanningInstrumentToDocument = (item) => ({
  id: item.id ?? item.nombre,
  nombre: item.nombre,
  vigencia: `${item.fecha_inicio} - ${item.fecha_fin}`,
  categoria: item.tipo || 'Otro',
  fecha: item.fecha_actualizacion?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  estado: item.estado || 'Publicado',
  entidad: item.eje || 'Planeacion Distrital',
  descripcion: item.observatorio ? `Observatorio: ${item.observatorio}` : `Eje: ${item.eje}`,
  archivo_url: item.documento_url || item.link,
  archivo_nombre: item.link || item.documento_url ? item.nombre : undefined,
  metadatos: {
    eje: item.eje,
    tipo: item.tipo,
    enlace_web: item.enlace_web,
    link: item.link,
    observatorio: item.observatorio
  },
  publico: item.visible,
  created_at: item.fecha_creacion,
  updated_at: item.fecha_actualizacion
});

const base64UrlEncode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

const signToken = (payload) => {
  const header = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });
  const body = base64UrlEncode({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 });
  const signature = crypto.createHmac('sha256', jwtSecret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
};

const verifyToken = (token) => {
  const [header, body, signature] = String(token ?? '').split('.');
  if (!header || !body || !signature) return null;

  const expected = crypto.createHmac('sha256', jwtSecret).update(`${header}.${body}`).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
};

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  const [scheme, salt, hash] = String(storedHash ?? '').split(':');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const candidate = hashPassword(password, salt).split(':')[2];
  return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex'));
};

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const session = verifyToken(token);
  if (!session) return res.status(401).json({ error: 'Sesion invalida o vencida.' });
  req.session = session;
  return next();
};

const migrate = async () => {
  await fs.mkdir(uploadDir, { recursive: true });
  await pool.query(`
    create table if not exists admin_users (
      id serial primary key,
      email text not null unique,
      password_hash text not null,
      nombre text not null default 'Administrador',
      activo boolean not null default true,
      fecha_creacion timestamptz not null default now()
    );

    create table if not exists instrumentos_planeacion (
      id serial primary key,
      nombre text not null default '',
      tipo text not null default '',
      eje text not null default '',
      fecha_inicio text not null default '',
      fecha_fin text not null default '',
      estado text not null default '',
      link text not null default '',
      enlace_web text not null default '',
      documento_url text not null default '',
      observatorio text not null default '',
      visible boolean not null default false,
      validacion_errores jsonb not null default '[]'::jsonb,
      origen text not null default 'admin',
      source_row integer,
      fecha_creacion timestamptz not null default now(),
      fecha_actualizacion timestamptz not null default now()
    );

    create index if not exists instrumentos_visible_idx on instrumentos_planeacion(visible);
    create index if not exists instrumentos_fecha_actualizacion_idx on instrumentos_planeacion(fecha_actualizacion desc);
  `);

  const { rows } = await pool.query('select id from admin_users where email = $1', [adminEmail]);
  if (rows.length === 0) {
    await pool.query(
      'insert into admin_users (email, password_hash, nombre) values ($1, $2, $3)',
      [adminEmail, hashPassword(adminPassword), 'Administrador Cali 500']
    );
    console.log(`[seed] Usuario admin creado: ${adminEmail}`);
  }
};

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('select 1');
    res.json({ status: 'online', db: 1, mode: 'postgres' });
  } catch (error) {
    res.status(503).json({ status: 'offline', db: 0, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const email = normalizeText(req.body.email).toLowerCase();
  const password = String(req.body.password ?? '');

  const { rows } = await pool.query('select * from admin_users where lower(email) = $1 and activo = true', [email]);
  const user = rows[0];
  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'Correo o contrasena incorrectos.' });
  }

  const token = signToken({ userId: user.id, email: user.email, nombre: user.nombre });
  return res.json({ token, user: { id: user.id, email: user.email, nombre: user.nombre } });
});

app.get('/api/auth/session', requireAuth, (req, res) => {
  res.json({ user: req.session });
});

app.get('/api/documents', async (_req, res) => {
  const { rows } = await pool.query(`
    select * from instrumentos_planeacion
    where visible = true
    order by fecha_actualizacion desc
  `);

  const documents = rows
    .map(normalizePlanningInstrument)
    .filter((item) => (item.validacion_errores ?? []).length === 0)
    .map(mapPlanningInstrumentToDocument);

  res.json({ data: documents });
});

app.get('/api/planning-instruments', requireAuth, async (_req, res) => {
  const { rows } = await pool.query('select * from instrumentos_planeacion order by fecha_actualizacion desc');
  res.json({ data: rows.map(normalizePlanningInstrument) });
});

app.post('/api/planning-instruments', requireAuth, async (req, res) => {
  const payload = serializePlanningInstrument(req.body);
  const { rows } = await pool.query(`
    insert into instrumentos_planeacion (
      nombre, tipo, eje, fecha_inicio, fecha_fin, estado, link, enlace_web,
      documento_url, observatorio, visible, validacion_errores, origen, source_row
    )
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14)
    returning *
  `, [
    payload.nombre,
    payload.tipo,
    payload.eje,
    payload.fecha_inicio,
    payload.fecha_fin,
    payload.estado,
    payload.link,
    payload.enlace_web,
    payload.documento_url,
    payload.observatorio,
    payload.visible,
    JSON.stringify(payload.validacion_errores),
    payload.origen,
    payload.source_row
  ]);
  res.status(201).json({ data: normalizePlanningInstrument(rows[0]) });
});

app.put('/api/planning-instruments/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID invalido.' });

  const payload = serializePlanningInstrument(req.body);
  const { rows } = await pool.query(`
    update instrumentos_planeacion
    set nombre = $1,
        tipo = $2,
        eje = $3,
        fecha_inicio = $4,
        fecha_fin = $5,
        estado = $6,
        link = $7,
        enlace_web = $8,
        documento_url = $9,
        observatorio = $10,
        visible = $11,
        validacion_errores = $12::jsonb,
        origen = $13,
        source_row = $14,
        fecha_actualizacion = now()
    where id = $15
    returning *
  `, [
    payload.nombre,
    payload.tipo,
    payload.eje,
    payload.fecha_inicio,
    payload.fecha_fin,
    payload.estado,
    payload.link,
    payload.enlace_web,
    payload.documento_url,
    payload.observatorio,
    payload.visible,
    JSON.stringify(payload.validacion_errores),
    payload.origen,
    payload.source_row,
    id
  ]);

  if (rows.length === 0) return res.status(404).json({ error: 'Instrumento no encontrado.' });
  res.json({ data: normalizePlanningInstrument(rows[0]) });
});

app.delete('/api/planning-instruments/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID invalido.' });

  const result = await pool.query('delete from instrumentos_planeacion where id = $1', [id]);
  if (result.rowCount === 0) return res.status(404).json({ error: 'Instrumento no encontrado.' });
  res.json({ success: true });
});

app.post('/api/uploads', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibio archivo.' });

  const extension = path.extname(req.file.originalname);
  const safeName = path.basename(req.file.originalname, extension)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'documento';
  const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeName}${extension}`;
  await fs.writeFile(path.join(uploadDir, fileName), req.file.buffer);

  const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;
  res.json({ path: fileName, publicUrl, fileName: req.file.originalname });
});

const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir));
app.get(/^\/(?!api\/|uploads\/).*/, async (_req, res, next) => {
  try {
    res.sendFile(path.join(distDir, 'index.html'));
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Error interno del servidor.' });
});

migrate()
  .then(() => {
    app.listen(port, () => {
      console.log(`Cali 500 backend PostgreSQL activo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('[startup] No se pudo iniciar el backend:', error.message);
    process.exit(1);
  });
