# Clipy

Mini editor colaborativo en tiempo real (WebSockets + Node.js).

Incluye:
- Acceso por contraseña
- Pestañas persistentes con nombre editable
- Modo claro / oscuro
- Guardado automático del contenido


### Prueba de concepto

La siguiente prueba de concepto muestra el funcionamiento básico de la aplicación.

Primero se presenta la pantalla de login, donde se solicita la contraseña para acceder al sistema.

<img width="1072" height="548" alt="Demo-Login" src="https://github.com/user-attachments/assets/0220ed18-f2cc-48e5-90ce-f9ebb4864b94" />

A continuación se muestra el dashboard principal, donde se visualiza el editor colaborativo con pestañas persistentes, permitiendo crear, renombrar y editar contenido en tiempo real.

<img width="1901" height="803" alt="Demo-Dashboard" src="https://github.com/user-attachments/assets/962b86b0-c0da-4abd-b60b-05db2397a0a2" />

## Ejecutar

Desde la carpeta del proyecto:

```bash
docker build -t clipy .
mkdir data

docker run \
-p 8000:3000 \
-e PASSWORD=pass123 \
-v $(pwd)/data:/data \
--name clipy \
clipy
````


Abrir:

```
http://localhost:8000
```

---

## Importante

Usa siempre:

```
-v $(pwd)/data:/data
```

Nunca montes sobre `/app`.
