# Administracion Cali 500+

## URL del modulo admin

El panel administrativo queda disponible en:

- Local: `http://localhost:3000/admin`
- Railway con dominio principal: `https://<tu-app>.up.railway.app/admin`
- Subdominio dedicado: `https://app.cali500.com`

El codigo tambien abre el admin automaticamente cuando el host empieza por `app.`.

## Supabase

1. Ejecutar `supabase-schema.sql` en el SQL Editor de Supabase.
2. Crear usuarios administradores desde Supabase Auth.
3. Verificar que existan:
   - Tabla `instrumentos_planeacion`
   - Bucket publico `documentos`
   - Politicas RLS de lectura publica solo para registros visibles
   - Politicas RLS de gestion para usuarios autenticados

## Carga inicial desde Excel

El archivo fuente inicial es:

`Base de datos Instrumentos Planeacion.xlsx`

Para regenerar la semilla:

```bash
npm run seed:instruments -- "Base de datos Instrumentos Planeacion.xlsx" "supabase-instrumentos-seed.sql"
```

Esto produce:

- `supabase-instrumentos-seed.sql`
- `supabase-instrumentos-seed.json`

Ejecutar `supabase-instrumentos-seed.sql` en Supabase despues de crear el esquema.

## Reglas de publicacion

Un instrumento solo se publica si:

- `nombre` esta completo.
- `tipo` esta completo.
- `eje` esta completo.
- `fecha_inicio` esta completo.
- `fecha_fin` esta completo.
- `estado` esta completo.
- `link` esta completo.
- `enlace_web` esta completo.
- El estado no es `borrador`, `oculto`, `inactivo`, `archivado` o `vencido`.

Si el administrador intenta marcar como visible un registro invalido, el sistema lo guarda como oculto.

## Railway

Configurar Railway asi:

- Build command: `npm run build`
- Start command: `npm run start`

Variables de entorno requeridas:

```env
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_BASE_PATH=/
```

El comando `start` usa el puerto que entrega Railway mediante `$PORT`.

## Namecheap

Para usar `app.cali500.com`:

1. En Railway, agregar el dominio custom `app.cali500.com`.
2. Railway entregara un target DNS.
3. En Namecheap, crear el registro DNS que indique Railway:
   - Normalmente `CNAME`
   - Host: `app`
   - Value: target entregado por Railway
4. Esperar propagacion DNS.
5. Railway emitira/renovara SSL automaticamente.

Para el dominio raiz `cali500.com`, usar la configuracion que Railway indique para apex/root domain. Namecheap puede requerir `ALIAS`, `ANAME` o redireccion del root hacia `www`.

## Google Sheets Sync

Flujo recomendado:

1. Migrar el Excel a Google Sheets.
2. Crear una Cloud Function en Google Cloud.
3. Programar Cloud Scheduler cada 5 o 10 minutos, o usar Apps Script para invocar webhook al editar.
4. La funcion lee la hoja con Google Sheets API.
5. La funcion hace upsert en `instrumentos_planeacion`.
6. El frontend solo consume registros `visible = true` y sin errores de validacion.

La sincronizacion debe usar una service role key de Supabase solo en Google Cloud, nunca en el frontend.
