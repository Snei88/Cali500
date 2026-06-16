# Admin local con PostgreSQL

## Levantar la base local

```bash
npm run db:up
```

Esto crea un PostgreSQL local en Docker:

- Host: `localhost`
- Puerto: `15432`
- Base: `cali500`
- Usuario: `cali500`
- Contrasena: `cali500_dev`

## Levantar backend y frontend

En una terminal:

```bash
npm run server
```

En otra terminal:

```bash
npm run dev
```

O juntos:

```bash
npm run dev:full
```

Frontend:

`http://localhost:3000`

Admin:

`http://localhost:3000/admin`

Backend:

`http://localhost:8080/api/health`

## Usuarios admin

Usuario inicial creado automaticamente:

- Correo: `admin@cali500.com.co`
- Contrasena: `Cali500.Admin.2026`

Crear o actualizar otro usuario:

```bash
npm run user:create -- editor@cali500.com.co "Editor.Cali500.2026" "Editor Cali 500"
```

## Guardado

El admin guarda en la tabla local:

`instrumentos_planeacion`

Los archivos subidos desde el admin se guardan en:

`uploads/`

El dashboard publico lee solo registros `visible = true` y sin errores de validacion.
